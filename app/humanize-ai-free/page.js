"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export default function HumanizeAIFreePage() {
  const [lang, setLang] = useState("en"); // UI-only
  const t = useMemo(() => getTranslations(lang), [lang]);

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    // Prefer persisted theme; fallback to OS preference.
    try {
      const saved = localStorage.getItem("toolslify_theme");
      if (saved === "dark" || saved === "light") {
        setIsDark(saved === "dark");
        return;
      }
    } catch {}
    if (typeof window !== "undefined" && window.matchMedia) {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("toolslify_theme", isDark ? "dark" : "light");
    } catch {}
  }, [isDark]);

  const [tab, setTab] = useState("humanizer"); // humanizer | paraphraser
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const [tone, setTone] = useState("friendly"); // casual | professional | academic | friendly
  const [strength, setStrength] = useState("medium"); // low | medium | high
  const [grammarMode, setGrammarMode] = useState(true);
  const [synonymEnhancer, setSynonymEnhancer] = useState(true);
  const [sentenceRestructure, setSentenceRestructure] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [variantSeed, setVariantSeed] = useState(1);
  const latestRunIdRef = useRef(0);

  const inputMetrics = useMemo(() => getTextMetrics(input), [input]);
  const outputMetrics = useMemo(() => getTextMetrics(output), [output]);

  const beforeAIDetect = useMemo(
    () => simulateAIDetectionScore(input, "before"),
    [input]
  );
  const afterAIDetect = useMemo(
    () => simulateAIDetectionScore(output, "after", strength),
    [output, strength]
  );

  const readability = useMemo(
    () => classifyReadability(output || input),
    [output, input]
  );

  const canRun = input.trim().length > 0 && !isLoading;

  async function runHumanize({ rehumanize = false } = {}) {
    const trimmed = input.trim();
    if (!trimmed) return;

    setIsLoading(true);
    const runId = ++latestRunIdRef.current;

    const seed = rehumanize ? Date.now() ^ (variantSeed + 1) : Date.now() ^ variantSeed;
    const rng = mulberry32(seed >>> 0);

    // Simulate "processing" without external calls
    await sleep(450 + Math.floor(rng() * 450));

    // If a newer run started while we slept, bail.
    if (runId !== latestRunIdRef.current) return;

    const rewritten = humanizeText(trimmed, {
      mode: tab, // affects label semantics only; logic same
      tone,
      strength,
      grammarMode,
      synonymEnhancer,
      sentenceRestructure,
      rng,
    });

    if (runId !== latestRunIdRef.current) return;
    setOutput(rewritten);
    setIsLoading(false);
    if (rehumanize) setVariantSeed((s) => s + 1);
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = output;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
  }

  function clearAll() {
    latestRunIdRef.current++;
    setIsLoading(false);
    setInput("");
    setOutput("");
  }

  function downloadTxt() {
    const text = output || "";
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "humanized-text.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const pageTitle = t.metaTitle;
  const pageDescription = t.metaDescription;

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-dvh bg-gradient-to-b from-zinc-50 to-white text-zinc-900 dark:from-zinc-950 dark:to-zinc-950 dark:text-zinc-100 transition-colors">
        <header className="sticky top-0 z-40 border-b border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-950/70 backdrop-blur">
          <nav className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between">
            <a
              href="/"
              className="group inline-flex items-center gap-2 font-semibold tracking-tight"
              aria-label="Toolslify Home"
            >
              <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm ring-1 ring-zinc-900/10 dark:ring-white/10">
                T
              </span>
              <span className="text-lg">
                Toolslify <span className="text-zinc-500 dark:text-zinc-400">/</span>{" "}
                <span className="text-zinc-700 dark:text-zinc-300">{t.navToolName}</span>
              </span>
            </a>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-1">
                <a
                  href="/"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900 transition-colors"
                >
                  {t.navHome}
                </a>
                <a
                  href="/tools"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900 transition-colors"
                >
                  {t.navTools}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <label className="sr-only" htmlFor="language">
                  {t.languageLabel}
                </label>
                <select
                  id="language"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:focus:ring-white/15 transition-colors"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>

                <button
                  type="button"
                  onClick={() => setIsDark((v) => !v)}
                  className="h-10 w-10 rounded-xl border border-zinc-200 bg-white shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:focus:ring-white/15 transition-colors"
                  aria-label={isDark ? t.lightMode : t.darkMode}
                  title={isDark ? t.lightMode : t.darkMode}
                >
                  <span className="text-lg leading-none">{isDark ? "☀" : "🌙"}</span>
                </button>
              </div>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
          <section className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] items-start">
            <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)] dark:border-zinc-800 dark:bg-zinc-950 transition-colors">
              <div className="p-5 sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                      {pageTitle}
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-300">
                      {pageDescription}
                    </p>
                  </div>

                  <div className="inline-flex rounded-2xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900/40">
                    <button
                      type="button"
                      onClick={() => setTab("humanizer")}
                      className={[
                        "px-4 py-2 text-sm font-medium rounded-xl transition-all",
                        tab === "humanizer"
                          ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                          : "text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white",
                      ].join(" ")}
                    >
                      {t.tabHumanizer}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab("paraphraser")}
                      className={[
                        "px-4 py-2 text-sm font-medium rounded-xl transition-all",
                        tab === "paraphraser"
                          ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                          : "text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white",
                      ].join(" ")}
                    >
                      {t.tabParaphraser}
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/40 transition-colors">
                      <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {t.toneLabel}
                      </label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="mt-2 h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:focus:ring-white/15 transition-colors"
                      >
                        <option value="casual">{t.toneCasual}</option>
                        <option value="professional">{t.toneProfessional}</option>
                        <option value="academic">{t.toneAcademic}</option>
                        <option value="friendly">{t.toneFriendly}</option>
                      </select>
                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                        {t.toneHelp}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/40 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                          {t.strengthLabel}
                        </label>
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                          {strengthLabel(strength, t)}
                        </span>
                      </div>
                      <input
                        className="mt-3 w-full accent-zinc-900 dark:accent-white"
                        type="range"
                        min={0}
                        max={2}
                        step={1}
                        value={strengthToIndex(strength)}
                        onChange={(e) => setStrength(indexToStrength(Number(e.target.value)))}
                        aria-label={t.strengthLabel}
                      />
                      <div className="mt-2 flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                        <span>{t.strengthLow}</span>
                        <span>{t.strengthMedium}</span>
                        <span>{t.strengthHigh}</span>
                      </div>
                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                        {t.strengthHelp}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <ToggleCard
                      label={t.grammarLabel}
                      description={t.grammarHelp}
                      value={grammarMode}
                      onChange={setGrammarMode}
                    />
                    <ToggleCard
                      label={t.synonymLabel}
                      description={t.synonymHelp}
                      value={synonymEnhancer}
                      onChange={setSynonymEnhancer}
                    />
                    <ToggleCard
                      label={t.structureLabel}
                      description={t.structureHelp}
                      value={sentenceRestructure}
                      onChange={setSentenceRestructure}
                    />
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/40 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            {t.inputLabel}
                          </label>
                          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            {t.inputHelp}
                          </p>
                        </div>
                        <MetricsPill
                          words={inputMetrics.words}
                          chars={inputMetrics.chars}
                          readingMinutes={inputMetrics.readingMinutes}
                          label={t.inputShort}
                        />
                      </div>
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={10}
                        placeholder={t.inputPlaceholder}
                        className="mt-3 w-full resize-y rounded-2xl border border-zinc-200 bg-white p-4 text-sm leading-relaxed text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-white/15 transition-colors"
                      />
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/40 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            {t.outputLabel}
                          </label>
                          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            {t.outputHelp}
                          </p>
                        </div>
                        <MetricsPill
                          words={outputMetrics.words}
                          chars={outputMetrics.chars}
                          readingMinutes={outputMetrics.readingMinutes}
                          label={t.outputShort}
                        />
                      </div>
                      <textarea
                        value={output}
                        onChange={(e) => setOutput(e.target.value)}
                        rows={10}
                        placeholder={t.outputPlaceholder}
                        className="mt-3 w-full resize-y rounded-2xl border border-zinc-200 bg-white p-4 text-sm leading-relaxed text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-white/15 transition-colors"
                      />

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={copyOutput}
                          disabled={!output}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        >
                          {t.copyOutput}
                        </button>
                        <button
                          type="button"
                          onClick={downloadTxt}
                          disabled={!output}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        >
                          {t.downloadTxt}
                        </button>
                        <button
                          type="button"
                          onClick={() => setOutput("")}
                          disabled={!output}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        >
                          {t.clearOutput}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="sticky bottom-4 z-30">
                    <div className="rounded-2xl border border-zinc-200 bg-white/80 p-3 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.55)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70 transition-colors">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => runHumanize({ rehumanize: false })}
                            disabled={!canRun}
                            className="relative inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-colors"
                          >
                            {isLoading ? (
                              <>
                                <Spinner />
                                <span>{t.processing}</span>
                              </>
                            ) : (
                              <span>
                                {tab === "humanizer" ? t.humanizeButton : t.paraphraseButton}
                              </span>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => runHumanize({ rehumanize: true })}
                            disabled={!input.trim() || isLoading}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                            title={t.rehumanizeHelp}
                          >
                            {t.rehumanize}
                          </button>

                          <button
                            type="button"
                            onClick={clearAll}
                            disabled={(!input && !output) || isLoading}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                          >
                            {t.clearAll}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                          <StatChip label={t.aiBefore} value={`${beforeAIDetect}%`} />
                          <StatChip label={t.aiAfter} value={`${afterAIDetect}%`} />
                          <StatChip label={t.readability} value={readability} />
                          <StatChip
                            label={t.readingTime}
                            value={`${outputMetrics.readingMinutes || inputMetrics.readingMinutes}${t.min}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="grid gap-4">
              <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)] dark:border-zinc-800 dark:bg-zinc-950 transition-colors">
                <h2 className="text-base font-semibold tracking-tight">{t.quickStats}</h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MiniStat label={t.inputWords} value={inputMetrics.words} />
                  <MiniStat label={t.outputWords} value={outputMetrics.words} />
                  <MiniStat label={t.inputChars} value={inputMetrics.chars} />
                  <MiniStat label={t.outputChars} value={outputMetrics.chars} />
                </div>
                <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      {t.noticeTitle}
                    </span>{" "}
                    {t.noticeBody}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)] dark:border-zinc-800 dark:bg-zinc-950 transition-colors">
                <h2 className="text-base font-semibold tracking-tight">{t.tipsTitle}</h2>
                <ul className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <li className="flex gap-2">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs">
                      1
                    </span>
                    <span>{t.tip1}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs">
                      2
                    </span>
                    <span>{t.tip2}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs">
                      3
                    </span>
                    <span>{t.tip3}</span>
                  </li>
                </ul>
              </div>
            </aside>
          </section>

          <section className="mt-10 sm:mt-14">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)] dark:border-zinc-800 dark:bg-zinc-950 transition-colors">
              <article className="prose prose-zinc max-w-none dark:prose-invert">
                <h2>{t.seoH2_1}</h2>
                <p>
                  {t.seoP1}
                </p>
                <p>
                  {t.seoP2}
                </p>

                <h3>{t.seoH3_1}</h3>
                <p>{t.seoP3}</p>
                <ul>
                  <li>{t.seoL1}</li>
                  <li>{t.seoL2}</li>
                  <li>{t.seoL3}</li>
                  <li>{t.seoL4}</li>
                </ul>

                <h2>{t.seoH2_2}</h2>
                <p>{t.seoP4}</p>
                <p>{t.seoP5}</p>

                <h3>{t.seoH3_2}</h3>
                <p>{t.seoP6}</p>
                <ol>
                  <li>{t.seoO1}</li>
                  <li>{t.seoO2}</li>
                  <li>{t.seoO3}</li>
                  <li>{t.seoO4}</li>
                </ol>

                <h2>{t.seoH2_3}</h2>
                <p>{t.seoP7}</p>
                <p>{t.seoP8}</p>
              </article>
            </div>
          </section>
        </main>

        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              {t.footerText}
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="/"
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900 transition-colors"
              >
                {t.navHome}
              </a>
              <a
                href="/tools"
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900 transition-colors"
              >
                {t.navTools}
              </a>
              <a
                href="/humanize-ai-free"
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-900 transition-colors"
              >
                {t.navToolName}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ToggleCard({ label, description, value, onChange }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/40 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={[
            "relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/15",
            value ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-800",
          ].join(" ")}
          aria-pressed={value}
          aria-label={label}
        >
          <span
            className={[
              "inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform dark:bg-zinc-950",
              value ? "translate-x-5" : "translate-x-1",
            ].join(" ")}
          />
        </button>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-zinc-950/30 dark:border-t-zinc-950"
      aria-hidden="true"
    />
  );
}

function StatChip({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-950 transition-colors">
      <div className="text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="font-semibold text-zinc-900 dark:text-zinc-100">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950/40 transition-colors">
      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {String(value)}
      </div>
    </div>
  );
}

function MetricsPill({ label, words, chars, readingMinutes }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-[11px] text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 transition-colors">
      <span className="font-medium text-zinc-900 dark:text-zinc-100">{label}</span>{" "}
      <span className="text-zinc-400 dark:text-zinc-500">·</span>{" "}
      <span>
        {words}w / {chars}c
      </span>{" "}
      <span className="text-zinc-400 dark:text-zinc-500">·</span>{" "}
      <span>{readingMinutes}m</span>
    </div>
  );
}

function strengthToIndex(strength) {
  if (strength === "low") return 0;
  if (strength === "high") return 2;
  return 1;
}
function indexToStrength(idx) {
  if (idx <= 0) return "low";
  if (idx >= 2) return "high";
  return "medium";
}
function strengthLabel(strength, t) {
  if (strength === "low") return t.strengthLow;
  if (strength === "high") return t.strengthHigh;
  return t.strengthMedium;
}

function getTextMetrics(text) {
  const clean = (text || "").trim();
  const words = clean ? clean.split(/\s+/).filter(Boolean).length : 0;
  const chars = (text || "").length;
  // 200 WPM average reading speed
  const readingMinutes = Math.max(0, Math.ceil(words / 200));
  return { words, chars, readingMinutes };
}

function simulateAIDetectionScore(text, phase, strength = "medium") {
  const trimmed = (text || "").trim();
  if (!trimmed) return phase === "before" ? 0 : 0;

  const metrics = getTextMetrics(trimmed);
  const uniqueRatio = estimateUniqueWordRatio(trimmed);
  const repetition = estimateRepetitionScore(trimmed); // higher => more repetitive
  const sentenceLen = averageSentenceLength(trimmed);

  // Heuristic base score: more repetition + longer sentences => more "AI-ish"
  let score =
    70 +
    clamp(Math.round(repetition * 35), 0, 20) +
    clamp(Math.round((sentenceLen - 18) * 1.2), -10, 18) -
    clamp(Math.round((uniqueRatio - 0.45) * 60), -8, 16);

  // Short texts are volatile; reduce extremes.
  if (metrics.words < 40) score = Math.round(score * 0.9);

  if (phase === "before") {
    // Clamp to "Before: 85-97% AI" typical range for demo
    score = clamp(score + 12, 85, 97);
  } else {
    // After: lower depending on strength
    const strengthDrop = strength === "high" ? 92 : strength === "low" ? 82 : 88;
    const lowered = 100 - Math.round((100 - clamp(score, 65, 97)) * (strengthDrop / 100));
    // Keep it in "After: 2-5% AI" typical demo range when there is output
    score = clamp(Math.round(lowered * 0.07), 2, 5);
  }

  return score;
}

function classifyReadability(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) return "—";
  const asl = averageSentenceLength(trimmed);
  if (asl <= 14) return "Easy";
  if (asl <= 22) return "Medium";
  return "Hard";
}

function averageSentenceLength(text) {
  const sentences = splitSentences(text);
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (sentences.length <= 1) return words.length;
  return Math.max(1, Math.round(words.length / sentences.length));
}

function estimateUniqueWordRatio(text) {
  const words = (text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return 0;
  const set = new Set(words);
  return set.size / words.length;
}

function estimateRepetitionScore(text) {
  const words = (text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length < 8) return 0.15;
  const counts = new Map();
  for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);
  let repeated = 0;
  for (const [, c] of counts) if (c >= 3) repeated += c;
  return clamp(repeated / words.length, 0, 0.9);
}

function humanizeText(input, opts) {
  const {
    tone,
    strength,
    grammarMode,
    synonymEnhancer,
    sentenceRestructure,
    rng,
  } = opts;

  const strengthCfg =
    strength === "high"
      ? { synonymRate: 0.22, restructureRate: 0.8, hedgeRate: 0.16, fillerRate: 0.12 }
      : strength === "low"
      ? { synonymRate: 0.08, restructureRate: 0.35, hedgeRate: 0.06, fillerRate: 0.05 }
      : { synonymRate: 0.14, restructureRate: 0.55, hedgeRate: 0.10, fillerRate: 0.08 };

  let text = normalizeWhitespace(input);

  if (grammarMode) {
    text = basicGrammarCleanup(text);
  }

  // Split into sentences early to enable structure tweaks.
  let sentences = splitSentences(text);
  if (sentences.length === 0) sentences = [text];

  if (sentenceRestructure && rng() < strengthCfg.restructureRate) {
    sentences = restructureSentences(sentences, rng, strength);
  }

  // Tone affects openings/endings and a few connective preferences.
  sentences = applyTone(sentences, tone, rng, strengthCfg);

  // Replace some words with synonyms (safe, lightweight).
  if (synonymEnhancer) {
    sentences = sentences.map((s) => synonymPass(s, rng, strengthCfg.synonymRate, tone));
  }

  // Add micro-variation: adjust connectors, break monotony.
  sentences = sentences.map((s) => softenAIPatterns(s, rng, tone, strengthCfg));

  text = joinSentences(sentences);
  text = postPolish(text, rng, grammarMode);
  return text.trim();
}

function normalizeWhitespace(text) {
  return (text || "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function splitSentences(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) return [];

  // Keep punctuation. Split on sentence-ending punctuation + whitespace/newline.
  const parts = trimmed
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  // If it didn't split (e.g., no punctuation), treat as one sentence.
  return parts.length ? parts : [trimmed];
}

function joinSentences(sentences) {
  return sentences
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+([,.;!?])/g, "$1");
}

function restructureSentences(sentences, rng, strength) {
  const out = [];
  const longThreshold = strength === "high" ? 24 : strength === "low" ? 32 : 28;
  const mergeThreshold = strength === "high" ? 7 : strength === "low" ? 5 : 6;

  // First pass: split long sentences on commas/semicolons when safe.
  for (const s of sentences) {
    const words = s.split(/\s+/).filter(Boolean);
    if (words.length >= longThreshold && /[,;:]/.test(s) && rng() < 0.75) {
      const chunks = s
        .split(/(?<=,|;|:)\s+/)
        .map((c) => c.trim())
        .filter(Boolean);
      if (chunks.length >= 2) {
        // Turn some comma-led chunks into new sentences.
        const rebuilt = [];
        for (let i = 0; i < chunks.length; i++) {
          let c = chunks[i];
          if (i > 0) c = c.replace(/^[,;:]\s*/, "");
          rebuilt.push(ensureSentencePunctuation(c, rng));
        }
        out.push(...rebuilt);
        continue;
      }
    }
    out.push(s);
  }

  // Second pass: merge very short sentences to improve flow.
  const merged = [];
  for (let i = 0; i < out.length; i++) {
    const curr = out[i];
    const next = out[i + 1];
    if (!next) {
      merged.push(curr);
      continue;
    }
    const currWords = curr.split(/\s+/).filter(Boolean).length;
    const nextWords = next.split(/\s+/).filter(Boolean).length;
    if (currWords <= mergeThreshold && nextWords <= mergeThreshold && rng() < 0.55) {
      const connector = pick(rng, ["—", "and", "so", "which means", "so that"]);
      const combined = curr.replace(/[.!?]\s*$/, "") + " " + connector + " " + lowerFirst(next);
      merged.push(ensureSentencePunctuation(combined, rng));
      i++;
    } else {
      merged.push(curr);
    }
  }
  return merged;
}

function ensureSentencePunctuation(s, rng) {
  const trimmed = s.trim();
  if (!trimmed) return trimmed;
  if (/[.!?]$/.test(trimmed)) return trimmed;
  return trimmed + (rng() < 0.9 ? "." : "!");
}

function lowerFirst(s) {
  const trimmed = (s || "").trim();
  if (!trimmed) return trimmed;
  return trimmed[0].toLowerCase() + trimmed.slice(1);
}

function applyTone(sentences, tone, rng, strengthCfg) {
  const out = [...sentences];

  // Add a subtle, optional opener on the first sentence.
  if (out.length && rng() < strengthCfg.fillerRate) {
    const openers =
      tone === "casual"
        ? ["Honestly,", "Quick note:", "Here’s the thing:", "In plain terms,"]
        : tone === "professional"
        ? ["In practice,", "From a business standpoint,", "At a high level,", "In summary,"]
        : tone === "academic"
        ? ["In essence,", "More precisely,", "From a theoretical perspective,", "Notably,"]
        : ["To be fair,", "To be honest,", "From my view,", "In a friendly nutshell,"];
    out[0] = `${pick(rng, openers)} ${lowerFirst(out[0])}`;
  }

  // Adjust hedging style slightly per tone.
  const hedge =
    tone === "academic"
      ? ["in many cases", "to a degree", "in part", "in general"]
      : tone === "professional"
      ? ["in most cases", "in practice", "typically", "as needed"]
      : tone === "casual"
      ? ["most of the time", "usually", "kinda", "pretty often"]
      : ["most of the time", "usually", "in general", "more often than not"];

  for (let i = 0; i < out.length; i++) {
    if (rng() < strengthCfg.hedgeRate && out[i].split(/\s+/).length > 10) {
      out[i] = injectHedge(out[i], pick(rng, hedge), rng);
    }
  }

  return out;
}

function injectHedge(sentence, hedgePhrase, rng) {
  // Insert after first clause-ish segment.
  const s = sentence.trim();
  const idx = s.indexOf(",");
  if (idx !== -1 && rng() < 0.8) {
    return s.slice(0, idx + 1) + ` ${hedgePhrase},` + s.slice(idx + 1);
  }
  const words = s.split(/\s+/);
  if (words.length < 8) return s;
  const insertAt = clamp(3 + Math.floor(rng() * 4), 2, words.length - 3);
  words.splice(insertAt, 0, hedgePhrase + ",");
  return words.join(" ").replace(/\s+([,.;!?])/g, "$1");
}

function synonymPass(sentence, rng, rate, tone) {
  const map = getSynonymMap(tone);
  // Preserve punctuation by splitting into tokens.
  const tokens = sentence.split(/(\b)/);
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (!tok || !/^\w+$/u.test(tok)) continue;
    const lower = tok.toLowerCase();
    const entry = map[lower];
    if (!entry) continue;
    if (rng() > rate) continue;
    const replacement = pick(rng, entry);
    tokens[i] = matchCase(tok, replacement);
  }
  return tokens.join("");
}

function softenAIPatterns(sentence, rng, tone, strengthCfg) {
  let s = sentence;

  // Remove common robotic starters occasionally.
  if (rng() < 0.4 * strengthCfg.synonymRate) {
    s = s.replace(/^(In conclusion|Firstly|Secondly|Thirdly|Moreover|Furthermore),\s+/i, "");
  }

  // Swap some connectors for variety.
  if (rng() < 0.35 * strengthCfg.synonymRate) {
    const swaps = [
      [/,\s*however,\s+/gi, ", still, "],
      [/\bHowever,\s+/g, "Still, "],
      [/\bTherefore,\s+/g, tone === "casual" ? "So, " : "As a result, "],
      [/\bAdditionally,\s+/g, tone === "casual" ? "Also, " : "In addition, "],
    ];
    const [re, rep] = pick(rng, swaps);
    s = s.replace(re, rep);
  }

  // Micro-random: change "very" usage.
  if (rng() < 0.25 * strengthCfg.synonymRate) {
    s = s.replace(/\bvery\b/gi, () => pick(rng, ["really", "quite", "pretty", "genuinely"]));
  }

  return s;
}

function basicGrammarCleanup(text) {
  let t = text;
  // Normalize smart quotes to plain quotes.
  t = t.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  // Fix spaced punctuation and repeated punctuation.
  t = t.replace(/\s+([,.;!?])/g, "$1");
  t = t.replace(/([!?]){2,}/g, "$1");
  // Fix double spaces.
  t = t.replace(/[ \t]{2,}/g, " ");
  // Capitalize after sentence endings when obvious.
  t = t.replace(/([.!?])\s+([a-z])/g, (m, p1, p2) => `${p1} ${p2.toUpperCase()}`);
  return t;
}

function postPolish(text, rng, grammarMode) {
  let t = text;
  // Make line breaks a bit more "human" for longer text.
  const words = t.split(/\s+/).filter(Boolean).length;
  if (words > 160 && rng() < 0.6) {
    t = t.replace(/([.!?])\s+/g, (m, p1) => (rng() < 0.15 ? `${p1}\n\n` : `${p1} `));
  }
  if (grammarMode) t = basicGrammarCleanup(t);
  return t;
}

function getSynonymMap(tone) {
  // Small, safe synonym table (avoid changing meaning too aggressively).
  const base = {
    important: ["key", "notable", "significant"],
    help: ["assist", "support", "make it easier to"],
    easy: ["simple", "straightforward", "low-effort"],
    hard: ["challenging", "tricky", "demanding"],
    use: ["apply", "utilize", "put to work"],
    show: ["demonstrate", "highlight", "reveal"],
    make: ["create", "build", "craft"],
    improve: ["enhance", "refine", "upgrade"],
    reduce: ["cut", "lower", "trim"],
    increase: ["boost", "raise", "grow"],
    many: ["a lot of", "numerous", "plenty of"],
    big: ["large", "major", "substantial"],
    small: ["minor", "compact", "lightweight"],
    because: ["since", "as", "given that"],
    also: ["as well", "too", "in addition"],
    but: ["yet", "still", "though"],
    good: ["solid", "great", "strong"],
    bad: ["weak", "rough", "not ideal"],
    quickly: ["fast", "in a hurry", "without delay"],
    clear: ["clean", "crisp", "easy to follow"],
    change: ["adjust", "tweak", "modify"],
  };

  // Tone-specific nudges.
  if (tone === "academic") {
    return {
      ...base,
      help: ["facilitate", "support", "enable"],
      make: ["construct", "produce", "generate"],
      improve: ["optimize", "strengthen", "refine"],
      clear: ["unambiguous", "coherent", "well-defined"],
    };
  }
  if (tone === "professional") {
    return {
      ...base,
      help: ["support", "assist", "streamline"],
      make: ["create", "deliver", "produce"],
      improve: ["enhance", "optimize", "tighten up"],
      quickly: ["efficiently", "promptly", "without delay"],
    };
  }
  if (tone === "casual") {
    return {
      ...base,
      important: ["big", "key", "main"],
      help: ["help", "make it easier", "give you a hand"],
      improve: ["level up", "make better", "polish"],
      quickly: ["fast", "quickly", "in no time"],
    };
  }
  return base;
}

function matchCase(original, replacement) {
  if (!original) return replacement;
  if (original.toUpperCase() === original) return replacement.toUpperCase();
  if (original[0].toUpperCase() === original[0]) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Deterministic PRNG for text variation (client-side)
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getTranslations(lang) {
  const en = {
    metaTitle: "Humanize AI Free",
    metaDescription:
      "Rewrite AI text to sound natural—free, fast, and no login. Choose tone, strength, grammar mode, and download the result.",
    navToolName: "Humanize AI Free",
    navHome: "Home",
    navTools: "Tools",
    languageLabel: "Language",
    darkMode: "Switch to dark mode",
    lightMode: "Switch to light mode",

    tabHumanizer: "Humanizer",
    tabParaphraser: "Paraphraser",

    toneLabel: "Tone",
    toneHelp: "Choose how the final writing should sound.",
    toneCasual: "Casual",
    toneProfessional: "Professional",
    toneAcademic: "Academic",
    toneFriendly: "Friendly",

    strengthLabel: "Rewrite strength",
    strengthHelp: "Higher strength makes bigger rewrites and more variation.",
    strengthLow: "Low",
    strengthMedium: "Medium",
    strengthHigh: "High",

    grammarLabel: "Grammar improvement",
    grammarHelp: "Cleans punctuation, spacing, and common issues.",
    synonymLabel: "Synonym enhancer",
    synonymHelp: "Replaces some words with safe synonyms.",
    structureLabel: "Sentence restructuring",
    structureHelp: "Splits long sentences and merges very short ones.",

    inputLabel: "Input text",
    inputHelp: "Paste AI-generated text (or any text) here.",
    inputPlaceholder:
      "Paste your AI text here…\n\nTip: Try ‘Professional’ + ‘High’ for the biggest changes.",
    outputLabel: "Output",
    outputHelp: "Your humanized text appears here. You can edit it further.",
    outputPlaceholder: "Your humanized output will appear here…",
    inputShort: "Input",
    outputShort: "Output",

    copyOutput: "Copy output",
    downloadTxt: "Download TXT",
    clearOutput: "Clear output",

    humanizeButton: "Humanize AI",
    paraphraseButton: "Paraphrase",
    processing: "Humanizing…",
    clearAll: "Clear",
    rehumanize: "Re-humanize",
    rehumanizeHelp: "Generate a different version each time.",

    aiBefore: "AI Detection (Before)",
    aiAfter: "AI Detection (After)",
    readability: "Readability",
    readingTime: "Reading time",
    min: "m",

    quickStats: "Quick stats",
    inputWords: "Input words",
    outputWords: "Output words",
    inputChars: "Input characters",
    outputChars: "Output characters",

    noticeTitle: "Simulated scores:",
    noticeBody:
      "AI Detection and Readability are estimated for demonstration. Always review your final text for accuracy and intent.",

    tipsTitle: "Best results",
    tip1: "Use a clear, complete paragraph (not a single sentence).",
    tip2: "Try different tones to match your audience.",
    tip3: "Click Re-humanize to generate a new variation quickly.",

    seoH2_1: "Humanize AI Free — rewrite AI text in seconds",
    seoH3_1: "Why people humanize AI text online",
    seoH2_2: "Free AI humanizer no login: what you get",
    seoH3_2: "How the humanize AI text online tool works",
    seoH2_3: "Why choose Toolslify’s Humanize AI Free tool",

    seoP1:
      "If you’ve ever pasted an AI-generated paragraph into a document and felt it sounded a little “too perfect,” you’re not alone. Many AI drafts are accurate but can feel robotic, repetitive, or overly formal. That’s where a humanize ai free tool helps: it rewrites your text to read more naturally while keeping the original idea intact.",
    seoP2:
      "This page is a free ai humanizer no login solution, designed for speed and simplicity. Everything runs in your browser with client-side logic—no external API and no sign-up. You choose the tone and rewrite strength, and the tool produces a cleaner, more human-sounding version you can copy or download instantly.",
    seoP3:
      "Humanizing doesn’t mean changing facts or adding fluff. It means adding the kind of natural variation that real people use—small sentence rhythm changes, more natural transitions, and occasional synonym swaps. When you humanize ai text online, you can make your writing feel less templated and more personal, especially for emails, blog drafts, product descriptions, and school notes.",
    seoL1:
      "Better flow: split long sentences and merge short ones for smoother reading.",
    seoL2:
      "More natural tone: casual, professional, academic, or friendly voice options.",
    seoL3:
      "Cleaner writing: optional grammar improvement for punctuation and spacing.",
    seoL4:
      "Fast iterations: re-humanize to generate a different version each time.",
    seoP4:
      "Toolslify focuses on practical features that help you finish the job, not just generate text. You get large input and output boxes, a loading state, one-click copy, and a clear button. You also get word count, character count, and reading time estimates so you can match your target length and pacing.",
    seoP5:
      "You’ll also see a simulated AI Detection Score before and after rewriting. These numbers are not an official detector, but they help you visualize the effect of stronger rewrites. Pair that with a readability label (Easy, Medium, Hard) and you can quickly see if your writing is too dense or too choppy.",
    seoP6:
      "This humanize ai free tool uses several lightweight steps to simulate a human rewrite. It’s intentionally fast and privacy-friendly because it runs locally. Here’s a simple view of the process:",
    seoO1:
      "Normalize and clean the text (spacing, punctuation, and basic grammar rules).",
    seoO2:
      "Restructure sentences by splitting overly long lines and merging very short ones.",
    seoO3:
      "Apply your selected tone by adjusting phrasing and transitions.",
    seoO4:
      "Optionally enhance synonyms and add small randomness so each run feels different.",
    seoP7:
      "If you need a free ai humanizer no login that’s easy to use, Toolslify is built for you. The interface is modern, responsive, and includes a dark mode toggle. Action buttons stay visible while you scroll, so you’re never hunting for the next step.",
    seoP8:
      "Most importantly, you stay in control: you can choose low, medium, or high rewrite strength and switch tones to match your audience. Whether you’re polishing an AI draft for a blog, making an email sound less stiff, or simply improving readability, this humanize ai text online tool helps you get a more natural result—quickly and for free.",

    footerText: "Free AI Tools by Toolslify",
  };

  const es = {
    ...en,
    metaTitle: "Humanizar IA Gratis",
    metaDescription:
      "Reescribe texto de IA para que suene natural—gratis, rápido y sin registro. Elige tono, fuerza, modo gramática y descarga el resultado.",
    navToolName: "Humanizar IA Gratis",
    navHome: "Inicio",
    navTools: "Herramientas",
    languageLabel: "Idioma",
    darkMode: "Cambiar a modo oscuro",
    lightMode: "Cambiar a modo claro",
    tabHumanizer: "Humanizador",
    tabParaphraser: "Parafraseador",
    toneLabel: "Tono",
    toneHelp: "Elige cómo debe sonar el texto final.",
    strengthLabel: "Fuerza de reescritura",
    strengthHelp: "Mayor fuerza = cambios más grandes y más variación.",
    grammarLabel: "Mejora de gramática",
    grammarHelp: "Limpia puntuación, espacios y errores comunes.",
    synonymLabel: "Mejorador de sinónimos",
    synonymHelp: "Reemplaza algunas palabras con sinónimos seguros.",
    structureLabel: "Reestructurar oraciones",
    structureHelp: "Divide oraciones largas y une las muy cortas.",
    inputLabel: "Texto de entrada",
    inputHelp: "Pega aquí tu texto generado por IA (o cualquier texto).",
    inputPlaceholder:
      "Pega tu texto de IA aquí…\n\nConsejo: Prueba ‘Profesional’ + ‘Alta’ para cambios más grandes.",
    outputLabel: "Salida",
    outputHelp: "Tu texto humanizado aparece aquí. Puedes editarlo.",
    outputPlaceholder: "Tu salida humanizada aparecerá aquí…",
    copyOutput: "Copiar salida",
    downloadTxt: "Descargar TXT",
    clearOutput: "Borrar salida",
    humanizeButton: "Humanizar IA",
    paraphraseButton: "Parafrasear",
    processing: "Humanizando…",
    clearAll: "Borrar",
    rehumanize: "Re-humanizar",
    rehumanizeHelp: "Genera una versión diferente cada vez.",
    aiBefore: "Detección IA (Antes)",
    aiAfter: "Detección IA (Después)",
    readability: "Legibilidad",
    readingTime: "Tiempo de lectura",
    quickStats: "Estadísticas rápidas",
    inputWords: "Palabras (entrada)",
    outputWords: "Palabras (salida)",
    inputChars: "Caracteres (entrada)",
    outputChars: "Caracteres (salida)",
    noticeTitle: "Puntuaciones simuladas:",
    noticeBody:
      "La Detección de IA y la Legibilidad son estimaciones de demostración. Revisa siempre el texto final para asegurar intención y exactitud.",
    tipsTitle: "Mejores resultados",
    tip1: "Usa un párrafo completo (no solo una frase).",
    tip2: "Cambia el tono para adaptarlo a tu audiencia.",
    tip3: "Pulsa Re-humanizar para otra variación al instante.",

    seoH2_1: "Humanizar IA gratis — reescribe texto de IA en segundos",
    seoH3_1: "Por qué la gente humaniza texto de IA online",
    seoH2_2: "Humanizador de IA gratis sin registro: lo que obtienes",
    seoH3_2: "Cómo funciona la herramienta para humanizar texto de IA online",
    seoH2_3: "Por qué elegir Humanizar IA Gratis de Toolslify",

    seoP1:
      "Si alguna vez pegaste un párrafo generado por IA en un documento y sentiste que sonaba demasiado “perfecto”, es normal. Muchos borradores de IA son correctos, pero pueden sonar robóticos, repetitivos o demasiado formales. Para eso existe una herramienta de humanizar ia gratis: reescribe tu texto para que suene más natural sin cambiar la idea.",
    seoP2:
      "Esta página es un humanizador de IA gratis sin registro, pensado para ser rápido y sencillo. Todo funciona en tu navegador con lógica del lado del cliente—sin API externa y sin iniciar sesión. Eliges el tono y la fuerza, y recibes una versión más humana para copiar o descargar.",
    seoP3:
      "Humanizar no significa inventar datos ni añadir relleno. Significa introducir variaciones reales: ajustar el ritmo de las oraciones, usar transiciones más naturales y cambiar algunas palabras por sinónimos cuando es seguro. Al humanizar texto de IA online, tu escritura puede sentirse menos “plantilla” y más personal.",
    seoL1:
      "Mejor fluidez: divide oraciones largas y une las muy cortas.",
    seoL2:
      "Tono natural: opciones casual, profesional, académico o amigable.",
    seoL3:
      "Texto más limpio: modo de gramática opcional para corregir detalles.",
    seoL4:
      "Iteraciones rápidas: re-humaniza para nuevas versiones al instante.",
    seoP4:
      "Toolslify se centra en funciones útiles para terminar el trabajo. Tienes un área grande de entrada y salida, estado de carga, copia con un clic y botón de limpiar. Además ves conteo de palabras, caracteres y tiempo estimado de lectura para ajustar longitud y ritmo.",
    seoP5:
      "También se muestra una puntuación simulada de detección de IA antes y después. No es un detector oficial, pero ayuda a visualizar el impacto de una reescritura más fuerte. Con la etiqueta de legibilidad (Fácil, Media, Difícil), puedes ver si el texto es demasiado denso o cortado.",
    seoP6:
      "Esta herramienta de humanizar ia gratis usa pasos ligeros para simular una reescritura humana. Es rápida y respeta la privacidad porque funciona localmente. Proceso simplificado:",
    seoO1:
      "Normaliza y limpia el texto (espacios, puntuación y reglas básicas).",
    seoO2:
      "Reestructura oraciones dividiendo las largas y uniendo las muy cortas.",
    seoO3:
      "Aplica el tono seleccionado ajustando frases y transiciones.",
    seoO4:
      "Opcionalmente mejora sinónimos y añade aleatoriedad para variación.",
    seoP7:
      "Si buscas un humanizador de IA gratis sin registro que sea fácil, Toolslify está hecho para ti. La interfaz es moderna, adaptable a móvil y escritorio, y tiene modo oscuro.",
    seoP8:
      "Lo más importante: tú controlas el resultado. Elige fuerza baja, media o alta y cambia el tono según tu público. Para pulir un borrador, mejorar un email o hacer el texto más legible, esta herramienta para humanizar texto de IA online te ayuda a conseguir un resultado más natural—rápido y gratis.",

    footerText: "Herramientas de IA gratis por Toolslify",
  };

  return lang === "es" ? es : en;
}

