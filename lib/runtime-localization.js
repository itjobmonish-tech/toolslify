"use client";

import { useEffect, useMemo, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

const TRANSLATION_CACHE = new Map();
const PENDING_RESOLVERS = new Map();
const BATCH_QUEUES = new Map();
const BATCH_TIMERS = new Map();

export function useTranslatedValue(value) {
  const [translated] = useTranslatedValues([value]);
  return translated ?? String(value ?? "");
}

export function useTranslatedValues(values = []) {
  const { language } = usePreferences();
  const normalizedValues = useMemo(
    () => values.map((value) => String(value ?? "")),
    [JSON.stringify(values)],
  );
  const stableKey = useMemo(() => JSON.stringify([language, normalizedValues]), [language, normalizedValues]);
  const [translatedValues, setTranslatedValues] = useState(() =>
    normalizedValues.map((value) => getCachedValue(language, value) ?? value),
  );

  useEffect(() => {
    let active = true;

    const immediate = normalizedValues.map((value) => getCachedValue(language, value) ?? value);
    setTranslatedValues(immediate);

    requestTranslations(language, normalizedValues)
      .then((translatedMap) => {
        if (!active) return;
        setTranslatedValues(normalizedValues.map((value) => translatedMap.get(value) || value));
      })
      .catch(() => {
        if (!active) return;
        setTranslatedValues(normalizedValues);
      });

    return () => {
      active = false;
    };
  }, [language, stableKey, normalizedValues]);

  return translatedValues;
}

function requestTranslations(language, values) {
  const normalizedValues = Array.from(
    new Set(values.filter((value) => String(value || "").trim())),
  );

  if (!normalizedValues.length || language === "en") {
    return Promise.resolve(new Map(values.map((value) => [value, value])));
  }

  const translatedMap = new Map();
  const pendingPromises = [];

  normalizedValues.forEach((value) => {
    const cached = getCachedValue(language, value);
    if (cached) {
      translatedMap.set(value, cached);
      return;
    }

    pendingPromises.push(
      new Promise((resolve) => {
        const resolverSet = getPendingResolvers(language, value);
        resolverSet.add((translated) => {
          translatedMap.set(value, translated || value);
          resolve();
        });
      }),
    );

    getBatchQueue(language).add(value);
  });

  if (pendingPromises.length) {
    scheduleBatchFlush(language);
  }

  return Promise.all(pendingPromises).then(() => {
    values.forEach((value) => {
      translatedMap.set(value, getCachedValue(language, value) || value);
    });
    return translatedMap;
  });
}

function scheduleBatchFlush(language) {
  if (BATCH_TIMERS.has(language)) return;

  const timerId = window.setTimeout(() => {
    BATCH_TIMERS.delete(language);
    void flushBatch(language);
  }, 18);

  BATCH_TIMERS.set(language, timerId);
}

async function flushBatch(language) {
  const queue = getBatchQueue(language);
  const values = Array.from(queue);
  queue.clear();

  if (!values.length) return;

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        values,
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to translate.");
    }

    const payload = await response.json();
    const translatedValues = Array.isArray(payload?.values) ? payload.values : values;

    values.forEach((value, index) => {
      const translated = String(translatedValues[index] ?? value);
      setCachedValue(language, value, translated);
      resolvePending(language, value, translated);
    });
  } catch {
    values.forEach((value) => {
      setCachedValue(language, value, value);
      resolvePending(language, value, value);
    });
  }
}

function getLanguageCache(language) {
  if (!TRANSLATION_CACHE.has(language)) {
    TRANSLATION_CACHE.set(language, new Map());
  }

  return TRANSLATION_CACHE.get(language);
}

function getCachedValue(language, value) {
  if (!value || language === "en") return value;
  return getLanguageCache(language).get(value);
}

function setCachedValue(language, value, translated) {
  if (!value || language === "en") return;
  getLanguageCache(language).set(value, translated);
}

function getPendingMap(language) {
  if (!PENDING_RESOLVERS.has(language)) {
    PENDING_RESOLVERS.set(language, new Map());
  }

  return PENDING_RESOLVERS.get(language);
}

function getPendingResolvers(language, value) {
  const pendingMap = getPendingMap(language);
  if (!pendingMap.has(value)) {
    pendingMap.set(value, new Set());
  }

  return pendingMap.get(value);
}

function resolvePending(language, value, translated) {
  const pendingMap = getPendingMap(language);
  const resolverSet = pendingMap.get(value);
  if (!resolverSet) return;

  resolverSet.forEach((resolver) => resolver(translated));
  pendingMap.delete(value);
}

function getBatchQueue(language) {
  if (!BATCH_QUEUES.has(language)) {
    BATCH_QUEUES.set(language, new Set());
  }

  return BATCH_QUEUES.get(language);
}
