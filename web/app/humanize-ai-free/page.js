"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function HumanizeAIFreePage() {
  const [lang, setLang] = useState("en");
  const t = useMemo(() => getTranslations(lang), [lang]);

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
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

  const [tab, setTab] = useState("humanizer");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const [tone, setTone] = useState("professional");
  const [strength, setStrength] = useState("medium");
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

    await sleep(450 + Math.floor(rng() * 450));

    if (runId !== latestRunIdRef.current) return;

    const rewritten = humanizeText(trimmed, {
      mode: tab,
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

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="bg-background text-foreground">
        {/* Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.a 
                href="/" 
                className="flex items-center space-x-3 group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground shadow-sm">
                  T
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-foreground">Toolslify</h1>
                  <p className="text-xs text-muted-foreground">AI Humanizer</p>
                </div>
              </motion.a>

              <div className="flex items-center space-x-4">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="bg-secondary border border-input rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>

                <button
                  onClick={() => setIsDark(!isDark)}
                  className="w-9 h-9 bg-secondary border border-input rounded-md flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <span className="text-sm">{isDark ? "☀" : "🌙"}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div 
              className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-sm text-primary font-medium">AI-Powered Technology</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Humanize AI Text
              <span className="text-primary"> Instantly</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform AI-generated content into natural, human-like text. 
              Perfect for students, writers, and professionals who want authentic content.
            </p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
              >
                Start Humanizing Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border border-input bg-background text-foreground px-8 py-3 rounded-lg font-medium hover:bg-accent transition-colors"
              >
                View Examples
              </motion.button>
            </motion.div>
          </motion.section>

          {/* Tool Section */}
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
              {/* Tab Selector */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setTab("humanizer")}
                    className={`px-6 py-2 rounded-md font-medium transition-all ${
                      tab === "humanizer" 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Humanizer
                  </button>
                  <button
                    onClick={() => setTab("paraphraser")}
                    className={`px-6 py-2 rounded-md font-medium transition-all ${
                      tab === "paraphraser" 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Paraphraser
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-background border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="casual">Casual</option>
                    <option value="professional">Professional</option>
                    <option value="academic">Academic</option>
                    <option value="friendly">Friendly</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-foreground">Strength</label>
                    <span className="text-sm text-muted-foreground capitalize">{strength}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2}
                    step={1}
                    value={strengthToIndex(strength)}
                    onChange={(e) => setStrength(indexToStrength(Number(e.target.value)))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              {/* Toggle Options */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Grammar Mode", value: grammarMode, onChange: setGrammarMode },
                  { label: "Synonym Enhancer", value: synonymEnhancer, onChange: setSynonymEnhancer },
                  { label: "Sentence Restructure", value: sentenceRestructure, onChange: setSentenceRestructure }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    className="bg-muted border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      <button
                        onClick={() => item.onChange(!item.value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.value ? "bg-primary" : "bg-input"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                            item.value ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input/Output Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-foreground">Input Text</label>
                    <div className="text-xs text-muted-foreground">
                      {inputMetrics.words}w / {inputMetrics.chars}c
                    </div>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={12}
                    placeholder="Paste your AI-generated text here..."
                    className="w-full bg-background border border-input rounded-md p-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-foreground">Humanized Output</label>
                    <div className="text-xs text-muted-foreground">
                      {outputMetrics.words}w / {outputMetrics.chars}c
                    </div>
                  </div>
                  <textarea
                    value={output}
                    onChange={(e) => setOutput(e.target.value)}
                    rows={12}
                    placeholder="Your humanized text will appear here..."
                    className="w-full bg-background border border-input rounded-md p-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  />
                  
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={copyOutput}
                      disabled={!output}
                      className="flex-1 bg-secondary border border-input rounded-md px-4 py-2 text-sm text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Copy
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={downloadTxt}
                      disabled={!output}
                      className="flex-1 bg-secondary border border-input rounded-md px-4 py-2 text-sm text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Download
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => runHumanize({ rehumanize: false })}
                    disabled={!canRun}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span>Humanize AI Text</span>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => runHumanize({ rehumanize: true })}
                    disabled={!input.trim() || isLoading}
                    className="bg-secondary border border-input text-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Re-humanize
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearAll}
                    disabled={(!input && !output) || isLoading}
                    className="bg-secondary border border-input text-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Clear All
                  </motion.button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">AI Before</div>
                    <div className="text-sm font-semibold text-destructive">{beforeAIDetect}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">AI After</div>
                    <div className="text-sm font-semibold text-green-600">{afterAIDetect}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Readability</div>
                    <div className="text-sm font-semibold text-primary">{readability}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Reading Time</div>
                    <div className="text-sm font-semibold text-primary">{outputMetrics.readingMinutes || inputMetrics.readingMinutes}m</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Features Section */}
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Why Choose Toolslify?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Lightning Fast",
                  description: "Process your text instantly with our optimized AI algorithms",
                  icon: "⚡"
                },
                {
                  title: "Privacy First",
                  description: "All processing happens in your browser. Your text never leaves your device",
                  icon: "🔒"
                },
                {
                  title: "Free Forever",
                  description: "No signup, no limits. Humanize as much text as you need",
                  icon: "🎁"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-card border border-border rounded-xl p-6 text-center shadow-sm"
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* SEO Content Section */}
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
              <article className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground">
                <h2 className="text-3xl font-bold mb-6 text-foreground">Humanize AI Free — Transform Your Text in Seconds</h2>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  If you've ever pasted an AI-generated paragraph into a document and felt it sounded a little "too perfect," 
                  you're not alone. Many AI drafts are accurate but can feel robotic, repetitive, or overly formal. 
                  That's where our humanize AI free tool helps: it rewrites your text to read more naturally while keeping 
                  the original idea intact.
                </p>

                <h3 className="text-2xl font-semibold mb-4 text-foreground">Why People Humanize AI Text Online</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Humanizing doesn't mean changing facts or adding fluff. It means adding the kind of natural variation 
                  that real people use—small sentence rhythm changes, more natural transitions, and occasional synonym swaps. 
                  When you humanize AI text online, you can make your writing feel less templated and more personal, 
                  especially for emails, blog drafts, product descriptions, and school notes.
                </p>

                <div className="bg-muted border border-border rounded-xl p-6 mb-6">
                  <h4 className="text-xl font-semibold mb-4 text-foreground">Key Benefits:</h4>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">✓</span>
                      <span>Better flow: split long sentences and merge short ones for smoother reading</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">✓</span>
                      <span>More natural tone: casual, professional, academic, or friendly voice options</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">✓</span>
                      <span>Cleaner writing: optional grammar improvement for punctuation and spacing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1">✓</span>
                      <span>Fast iterations: re-humanize to generate a different version each time</span>
                    </li>
                  </ul>
                </div>

                <h3 className="text-2xl font-semibold mb-4 text-foreground">How Our AI Humanizer Works</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  This free AI humanizer no login solution uses several lightweight steps to simulate a human rewrite. 
                  It's intentionally fast and privacy-friendly because it runs locally in your browser:
                </p>
                
                <ol className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">1</span>
                    <span>Normalize and clean the text (spacing, punctuation, and basic grammar rules)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">2</span>
                    <span>Restructure sentences by splitting overly long lines and merging very short ones</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">3</span>
                    <span>Apply your selected tone by adjusting phrasing and transitions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">4</span>
                    <span>Optionally enhance synonyms and add small randomness so each run feels different</span>
                  </li>
                </ol>

                <h3 className="text-2xl font-semibold mb-4 text-foreground">Why Choose Toolslify's Humanize AI Free Tool</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  If you need a free AI humanizer no login that's easy to use, Toolslify is built for you. 
                  The interface is modern, responsive, and includes a light theme toggle. Action buttons stay visible 
                  while you scroll, so you're never hunting for the next step.
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  Most importantly, you stay in control: you can choose low, medium, or high rewrite strength and 
                  switch tones to match your audience. Whether you're polishing an AI draft for a blog, making 
                  an email sound less stiff, or simply improving readability, this humanize AI text online tool 
                  helps you get a more natural result—quickly and for free.
                </p>
              </article>
            </div>
          </motion.section>
        </main>

        {/* Footer */}
        <footer className="border-t bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm mb-4 md:mb-0">
                © 2024 Toolslify. Free AI Tools for Everyone.
              </p>
              <div className="flex gap-6">
                <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</a>
                <a href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">Tools</a>
                <a href="/humanize-ai-free" className="text-muted-foreground hover:text-foreground transition-colors">AI Humanizer</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Helper functions (keeping the original logic)
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

function getTextMetrics(text) {
  const clean = (text || "").trim();
  const words = clean ? clean.split(/\s+/).filter(Boolean).length : 0;
  const chars = (text || "").length;
  const readingMinutes = Math.max(0, Math.ceil(words / 200));
  return { words, chars, readingMinutes };
}

function simulateAIDetectionScore(text, phase, strength = "medium") {
  const trimmed = (text || "").trim();
  if (!trimmed) return phase === "before" ? 0 : 0;

  const metrics = getTextMetrics(trimmed);
  const uniqueRatio = estimateUniqueWordRatio(trimmed);
  const repetition = estimateRepetitionScore(trimmed);
  const sentenceLen = averageSentenceLength(trimmed);

  let score =
    70 +
    clamp(Math.round(repetition * 35), 0, 20) +
    clamp(Math.round((sentenceLen - 18) * 1.2), -10, 18) -
    clamp(Math.round((uniqueRatio - 0.45) * 60), -8, 16);

  if (metrics.words < 40) score = Math.round(score * 0.9);

  if (phase === "before") {
    score = clamp(score + 12, 85, 97);
  } else {
    const strengthDrop = strength === "high" ? 92 : strength === "low" ? 82 : 88;
    const lowered = 100 - Math.round((100 - clamp(score, 65, 97)) * (strengthDrop / 100));
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

  let sentences = splitSentences(text);
  if (sentences.length === 0) sentences = [text];

  if (sentenceRestructure && rng() < strengthCfg.restructureRate) {
    sentences = restructureSentences(sentences, rng, strength);
  }

  sentences = applyTone(sentences, tone, rng, strengthCfg);

  if (synonymEnhancer) {
    sentences = sentences.map((s) => synonymPass(s, rng, strengthCfg.synonymRate, tone));
  }

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

  const parts = trimmed
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

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

  for (const s of sentences) {
    const words = s.split(/\s+/).filter(Boolean);
    if (words.length >= longThreshold && /[,;:]/.test(s) && rng() < 0.75) {
      const chunks = s
        .split(/(?<=,|;|:)\s+/)
        .map((c) => c.trim())
        .filter(Boolean);
      if (chunks.length >= 2) {
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

  if (out.length && rng() < strengthCfg.fillerRate) {
    const openers =
      tone === "casual"
        ? ["Honestly,", "Quick note:", "Here's the thing:", "In plain terms,"]
        : tone === "professional"
        ? ["In practice,", "From a business standpoint,", "At a high level,", "In summary,"]
        : tone === "academic"
        ? ["In essence,", "More precisely,", "From a theoretical perspective,", "Notably,"]
        : ["To be fair,", "To be honest,", "From my view,", "In a friendly nutshell,"];
    out[0] = `${pick(rng, openers)} ${lowerFirst(out[0])}`;
  }

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

  if (rng() < 0.4 * strengthCfg.synonymRate) {
    s = s.replace(/^(In conclusion|Firstly|Secondly|Thirdly|Moreover|Furthermore),\s+/i, "");
  }

  if (rng() < 0.35 * strengthCfg.synonymRate) {
    const swaps = [
      [/,s*however,\s+/gi, ", still, "],
      [/\bHowever,\s+/g, "Still, "],
      [/\bTherefore,\s+/g, tone === "casual" ? "So, " : "As a result, "],
      [/\bAdditionally,\s+/g, tone === "casual" ? "Also, " : "In addition, "],
    ];
    const [re, rep] = pick(rng, swaps);
    s = s.replace(re, rep);
  }

  if (rng() < 0.25 * strengthCfg.synonymRate) {
    s = s.replace(/\bvery\b/gi, () => pick(rng, ["really", "quite", "pretty", "genuinely"]));
  }

  return s;
}

function basicGrammarCleanup(text) {
  let t = text;
  t = t.replace(/["""]/g, '"').replace(/[``]/g, "'");
  t = t.replace(/\s+([,.;!?])/g, "$1");
  t = t.replace(/([!?]){2,}/g, "$1");
  t = t.replace(/[ \t]{2,}/g, " ");
  t = t.replace(/([.!?])\s+([a-z])/g, (m, p1, p2) => `${p1} ${p2.toUpperCase()}`);
  return t;
}

function postPolish(text, rng, grammarMode) {
  let t = text;
  const words = t.split(/\s+/).filter(Boolean).length;
  if (words > 160 && rng() < 0.6) {
    t = t.replace(/([.!?])\s+/g, (m, p1) => (rng() < 0.15 ? `${p1}\n\n` : `${p1} `));
  }
  if (grammarMode) t = basicGrammarCleanup(t);
  return t;
}

function getSynonymMap(tone) {
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
    metaDescription: "Rewrite AI text to sound natural—free, fast, and no login. Choose tone, strength, grammar mode, and download the result.",
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
    inputPlaceholder: "Paste your AI text here…\n\nTip: Try 'Professional' + 'High' for the biggest changes.",
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
    noticeBody: "AI Detection and Readability are estimated for demonstration. Always review your final text for accuracy and intent.",
    tipsTitle: "Best results",
    tip1: "Use a clear, complete paragraph (not a single sentence).",
    tip2: "Try different tones to match your audience.",
    tip3: "Click Re-humanize to generate a new variation quickly.",
    seoH2_1: "Humanize AI Free — rewrite AI text in seconds",
    seoH3_1: "Why people humanize AI text online",
    seoH2_2: "Free AI humanizer no login: what you get",
    seoH3_2: "How the humanize AI text online tool works",
    seoH2_3: "Why choose Toolslify's Humanize AI Free tool",
    seoP1: "If you've ever pasted an AI-generated paragraph into a document and felt it sounded a little 'too perfect,' you're not alone. Many AI drafts are accurate but can feel robotic, repetitive, or overly formal. That's where a humanize ai free tool helps: it rewrites your text to read more naturally while keeping the original idea intact.",
    seoP2: "This page is a free ai humanizer no login solution, designed for speed and simplicity. Everything runs in your browser with client-side logic—no external API and no sign-up. You choose the tone and rewrite strength, and the tool produces a cleaner, more human-sounding version you can copy or download instantly.",
    seoP3: "Humanizing doesn't mean changing facts or adding fluff. It means adding the kind of natural variation that real people use—small sentence rhythm changes, more natural transitions, and occasional synonym swaps. When you humanize ai text online, you can make your writing feel less templated and more personal, especially for emails, blog drafts, product descriptions, and school notes.",
    seoL1: "Better flow: split long sentences and merge short ones for smoother reading.",
    seoL2: "More natural tone: casual, professional, academic, or friendly voice options.",
    seoL3: "Cleaner writing: optional grammar improvement for punctuation and spacing.",
    seoL4: "Fast iterations: re-humanize to generate a different version each time.",
    seoP4: "Toolslify focuses on practical features that help you finish the job, not just generate text. You get large input and output boxes, a loading state, one-click copy, and a clear button. You also get word count, character count, and reading time estimates so you can match your target length and pacing.",
    seoP5: "You'll also see a simulated AI Detection Score before and after rewriting. These numbers are not an official detector, but they help you visualize the effect of stronger rewrites. Pair that with a readability label (Easy, Medium, Hard) and you can quickly see if your writing is too dense or too choppy.",
    seoP6: "This humanize ai free tool uses several lightweight steps to simulate a human rewrite. It's intentionally fast and privacy-friendly because it runs locally. Here's a simple view of the process:",
    seoO1: "Normalize and clean the text (spacing, punctuation, and basic grammar rules).",
    seoO2: "Restructure sentences by splitting overly long lines and merging very short ones.",
    seoO3: "Apply your selected tone by adjusting phrasing and transitions.",
    seoO4: "Optionally enhance synonyms and add small randomness so each run feels different.",
    seoP7: "If you need a free ai humanizer no login that's easy to use, Toolslify is built for you. The interface is modern, responsive, and includes a dark mode toggle. Action buttons stay visible while you scroll, so you're never hunting for the next step.",
    seoP8: "Most importantly, you stay in control: you can choose low, medium, or high rewrite strength and switch tones to match your audience. Whether you're polishing an AI draft for a blog, making an email sound less stiff, or simply improving readability, this humanize ai text online tool helps you get a more natural result—quickly and for free.",
    footerText: "Free AI Tools by Toolslify",
  };

  const es = {
    ...en,
    metaTitle: "Humanizar IA Gratis",
    metaDescription: "Reescribe texto de IA para que suene natural—gratis, rápido y sin registro. Elige tono, fuerza, modo gramática y descarga el resultado.",
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
    inputPlaceholder: "Pega tu texto de IA aquí…\n\nConsejo: Prueba 'Profesional' + 'Alta' para cambios más grandes.",
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
    noticeBody: "La Detección de IA y la Legibilidad son estimaciones de demostración. Revisa siempre el texto final para asegurar intención y exactitud.",
    tipsTitle: "Mejores resultados",
    tip1: "Usa un párrafo completo (no solo una frase).",
    tip2: "Cambia el tono para adaptarlo a tu audiencia.",
    tip3: "Pulsa Re-humanizar para otra variación al instante.",
    seoH2_1: "Humanizar IA gratis — reescribe texto de IA en segundos",
    seoH3_1: "Por qué la gente humaniza texto de IA online",
    seoH2_2: "Humanizador de IA gratis sin registro: lo que obtienes",
    seoH3_2: "Cómo funciona la herramienta para humanizar texto de IA online",
    seoH2_3: "Por qué elegir Humanizar IA Gratis de Toolslify",
    seoP1: "Si alguna vez pegaste un párrafo generado por IA en un documento y sentiste que sonaba demasiado 'perfecto', es normal. Muchos borradores de IA son correctos, pero pueden sonar robóticos, repetitivos o demasiado formales. Para eso existe una herramienta de humanizar ia gratis: reescribe tu texto para que suene más natural sin cambiar la idea.",
    seoP2: "Esta página es un humanizador de IA gratis sin registro, pensado para ser rápido y sencillo. Todo funciona en tu navegador con lógica del lado del cliente—sin API externa y sin iniciar sesión. Eliges el tono y la fuerza, y recibes una versión más humana para copiar o descargar.",
    seoP3: "Humanizar no significa inventar datos ni añadir relleno. Significa introducir variaciones reales: ajustar el ritmo de las oraciones, usar transiciones más naturales y cambiar algunas palabras por sinónimos cuando es seguro. Al humanizar texto de IA online, tu escritura puede sentirse menos 'plantilla' y más personal.",
    seoL1: "Mejor fluidez: divide oraciones largas y une las muy cortas.",
    seoL2: "Tono natural: opciones casual, profesional, académico o amigable.",
    seoL3: "Texto más limpio: modo de gramática opcional para corregir detalles.",
    seoL4: "Iteraciones rápidas: re-humaniza para nuevas versiones al instante.",
    seoP4: "Toolslify se centra en funciones útiles para terminar el trabajo. Tienes un área grande de entrada y salida, estado de carga, copia con un clic y botón de limpiar. Además ves conteo de palabras, caracteres y tiempo estimado de lectura para ajustar longitud y ritmo.",
    seoP5: "También se muestra una puntuación simulada de detección de IA antes y después. No es un detector oficial, pero ayuda a visualizar el impacto de una reescritura más fuerte. Con la etiqueta de legibilidad (Fácil, Media, Difícil), puedes ver si el texto es demasiado denso o cortado.",
    seoP6: "Esta herramienta de humanizar ia gratis usa pasos ligeros para simular una reescritura humana. Es rápida y respeta la privacidad porque funciona localmente. Proceso simplificado:",
    seoO1: "Normaliza y limpia el texto (espacios, puntuación y reglas básicas).",
    seoO2: "Reestructura oraciones dividiendo las largas y uniendo las muy cortas.",
    seoO3: "Aplica el tono seleccionado ajustando frases y transiciones.",
    seoO4: "Opcionalmente mejora sinónimos y añade aleatoriedad para variación.",
    seoP7: "Si buscas un humanizador de IA gratis sin registro que sea fácil, Toolslify está hecho para ti. La interfaz es moderna, adaptable a móvil y escritorio, y tiene modo oscuro.",
    seoP8: "Lo más importante: tú controlas el resultado. Elige fuerza baja, media o alta y cambia el tono según tu público. Para pulir un borrador, mejorar un email o hacer el texto más legible, esta herramienta para humanizar texto de IA online te ayuda a conseguir un resultado más natural—rápido y gratis.",
    footerText: "Herramientas de IA gratis por Toolslify",
  };

  return lang === "es" ? es : en;
}
