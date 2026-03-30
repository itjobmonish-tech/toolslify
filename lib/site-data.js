export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.toolslify.com";
export const SOCIAL_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Toolslify premium AI tool suite",
};
export const TWITTER_IMAGE_PATH = "/twitter-image";

export const NAV_ITEMS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/tools", label: "Tools" },
  { href: "/#use-cases", label: "Use cases" },
  { href: "/#faq", label: "FAQ" },
];

export const TRUST_BADGES = [
  "No signup for core tools",
  "10,000+ weekly users",
  "No data stored after processing",
  "Built for students, teams, and creators",
];

export const HERO_METRICS = [
  { value: "10,000+", label: "active users" },
  { value: "<2s", label: "fast first load target" },
  { value: "9", label: "guided product routes" },
];

export const HOW_IT_WORKS = [
  {
    title: "Add your source",
    description: "Paste text, drop a PDF, or record a voice note. Each workspace starts with one obvious input step.",
  },
  {
    title: "Run the tool",
    description: "Choose the format, tone, or conversion path you need and trigger the AI-style workflow with one clear action.",
  },
  {
    title: "Review and export",
    description: "Copy the result, download the file, or restore a previous version from local history without leaving the page.",
  },
];

export const USE_CASES = [
  {
    audience: "Students",
    title: "Write cleaner submissions with less last-minute stress",
    body: "Use the humanizer, assignment generator, and PDF converter to turn rough inputs into polished study-ready outputs without juggling five different sites.",
  },
  {
    audience: "Office teams",
    title: "Turn scattered notes into decisions and follow-ups fast",
    body: "Meeting summaries, voice transcripts, and PDF extraction help teams move from raw input to clear communication in a single workflow.",
  },
  {
    audience: "Creators",
    title: "Ship content that sounds natural and publish-ready",
    body: "The AI Humanizer makes robotic copy easier to trust, while export and history tools keep review loops quick when speed matters.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Toolslify feels like a real product, not a throwaway widget. The humanizer and meeting summary tools saved our team hours in the first week.",
    name: "Aarav Mehta",
    role: "Operations Lead at Northline",
  },
  {
    quote:
      "The assignment generator gives me a strong first draft structure, and the PDF notes flow makes revision way less chaotic before exams.",
    name: "Nina Shah",
    role: "Undergraduate student",
  },
  {
    quote:
      "I came for the AI Humanizer and stayed because the full suite is genuinely easier to use than most bloated AI dashboards.",
    name: "Marcus Reed",
    role: "Solo creator",
  },
];

export const HOME_FAQ = [
  {
    question: "What makes Toolslify different from a basic AI tool page?",
    answer:
      "Toolslify is built as a multi-tool SaaS workspace with focused flows, local history, export actions, polished UX, and dedicated SEO content for each intent-driven page.",
  },
  {
    question: "Do I need an account to use the platform?",
    answer:
      "No. The core experiences are usable without login, and the site stores only temporary preferences and local history in the browser for faster return visits.",
  },
  {
    question: "Is my data saved on your servers?",
    answer:
      "No. Inputs are processed in memory and not stored after the response is returned. Browser history stays local to the device unless you add your own backend later.",
  },
  {
    question: "Can I use Toolslify for school, work, and content creation?",
    answer:
      "Yes. The current suite is designed for those three high-frequency workflows: humanizing writing, generating structured answers, summarizing notes, transcribing speech, and extracting value from PDFs.",
  },
];

export const TOOLS = {
  "ai-humanizer": {
    slug: "ai-humanizer",
    path: "/tools/ai-humanizer",
    name: "AI Humanizer",
    shortName: "Humanizer",
    category: "Writing",
    group: "core",
    badge: "Flagship tool",
    seoTitle: "AI Humanizer | Make AI Text Sound Human | Toolslify",
    seoDescription:
      "Rewrite robotic drafts with Toolslify's premium AI Humanizer. Compare before and after text, adjust tone, see a simulated AI score, and export polished copy fast.",
    keywords: [
      "ai humanizer",
      "make ai text sound human",
      "humanize ai writing",
      "rewrite ai content to sound natural",
    ],
    headline: "Humanize AI copy with review controls that feel production ready",
    description:
      "Turn stiff AI text into cleaner writing with tone controls, rewrite strength, comparison highlights, local history, and a simulated AI detection panel.",
    ctaLabel: "Humanize text",
    inputTitle: "AI text input",
    inputPlaceholder:
      "Paste AI-generated copy, a rough essay paragraph, or a product description that sounds too flat. Toolslify will rewrite it into a more natural draft.",
    outputTitle: "Humanized result",
    outputPlaceholder:
      "Your rewritten version appears here with highlighted changes, copy and download actions, and an updated readability profile.",
    sidebarTitle: "Rewrite insights",
    theme: {
      primary: "#2563eb",
      secondary: "#14b8a6",
      surface: "rgba(37, 99, 235, 0.10)",
      glow: "rgba(37, 99, 235, 0.24)",
    },
    heroStats: [
      { label: "Rewrite modes", value: "3 tones" },
      { label: "Comparison view", value: "Before vs after" },
      { label: "Export options", value: "Copy + TXT" },
    ],
    featureCards: [
      {
        title: "AI score simulation",
        body: "See a confidence-style score shift as the draft becomes more human and less repetitive.",
      },
      {
        title: "Meaning-first rewrite",
        body: "The tool changes rhythm and phrasing without throwing away the original point you started with.",
      },
      {
        title: "Local draft history",
        body: "Your latest rewrites stay in browser storage so you can restore a stronger version in one click.",
      },
    ],
    useCases: [
      "Humanize essay paragraphs before submission.",
      "Polish AI-generated outreach and landing page copy.",
      "Refine product descriptions and creator scripts.",
    ],
    faq: [
      {
        question: "Does the AI Humanizer store my writing?",
        answer: "No. Inputs are processed in memory, while recent versions stay only in your own browser history.",
      },
      {
        question: "Can I compare the original and the rewritten draft?",
        answer: "Yes. Compare mode shows a side-by-side review and highlights changed wording for faster approval.",
      },
      {
        question: "Is the AI detection score real?",
        answer: "It is a UI simulation based on structural changes, readability shifts, and diff density so users can judge rewrite strength quickly.",
      },
    ],
    relatedSeoLinks: [
      { href: "/humanize-ai-text", label: "Humanize AI Text" },
      { href: "/ai-humanizer-free", label: "AI Humanizer Free" },
      { href: "/rewrite-ai-text", label: "Rewrite AI Text" },
    ],
  },
  "assignment-answer-generator": {
    slug: "assignment-answer-generator",
    path: "/tools/assignment-answer-generator",
    name: "Assignment Answer Generator",
    shortName: "Assignment Generator",
    category: "Students",
    group: "core",
    badge: "Academic workflow",
    seoTitle: "Assignment Answer Generator | Structured Academic Drafts | Toolslify",
    seoDescription:
      "Generate structured assignment answers with Toolslify. Add a question, choose answer depth, switch on academic tone, and export a polished response with key points.",
    keywords: [
      "assignment answer generator",
      "ai answer generator for students free",
      "write assignment answers automatically",
      "academic answer generator",
    ],
    headline: "Generate assignment answers with clearer structure and academic tone",
    description:
      "Paste the prompt, add supporting notes, and generate an answer with a thesis, supporting points, and a clean conclusion that is easier to edit before submission.",
    ctaLabel: "Generate answer",
    inputTitle: "Assignment brief",
    inputPlaceholder:
      "Enter the assignment question here. You can also add source notes, the class subject, and the style you want the response to follow.",
    outputTitle: "Structured answer",
    outputPlaceholder:
      "Your answer will appear with a clear opening, body paragraphs, conclusion, and quick study notes.",
    sidebarTitle: "Study-ready output",
    theme: {
      primary: "#6366f1",
      secondary: "#14b8a6",
      surface: "rgba(99, 102, 241, 0.10)",
      glow: "rgba(99, 102, 241, 0.22)",
    },
    heroStats: [
      { label: "Output style", value: "Academic or plain" },
      { label: "Answer depth", value: "Short to detailed" },
      { label: "Export", value: "Copy + DOC" },
    ],
    featureCards: [
      {
        title: "Answer structure",
        body: "Every response is broken into a thesis, supporting ideas, and a conclusion so editing feels simpler.",
      },
      {
        title: "Context aware",
        body: "Add notes, keywords, or a class subject to steer the generated answer toward the exact assignment goal.",
      },
      {
        title: "Revision support",
        body: "Study notes and highlight points make it easier to convert the draft into your own final submission.",
      },
    ],
    useCases: [
      "Short answers for homework and classroom discussion prompts.",
      "Long-form assignment drafts that need a fast outline first.",
      "Research-backed responses that need cleaner organization.",
    ],
    faq: [
      {
        question: "Can I choose an academic tone?",
        answer: "Yes. Turn on academic tone for more formal phrasing and a more classroom-friendly structure.",
      },
      {
        question: "Does the generator create a full final submission?",
        answer: "It creates a strong first draft and outline, which is best reviewed and personalized before final submission.",
      },
      {
        question: "Can I add my own notes?",
        answer: "Yes. Extra notes help the answer stay specific and better aligned with your class material.",
      },
    ],
    relatedSeoLinks: [
      { href: "/humanize-essay-ai", label: "Humanize Essay AI" },
      { href: "/ai-text-improver", label: "AI Text Improver" },
      { href: "/humanize-ai-text", label: "Humanize AI Text" },
    ],
  },
  "meeting-notes-summary": {
    slug: "meeting-notes-summary",
    path: "/tools/meeting-notes-summary",
    name: "Meeting Notes to Summary Converter",
    shortName: "Meeting Summary",
    category: "Teams",
    group: "core",
    badge: "Ops workflow",
    seoTitle: "Meeting Notes to Summary Converter | Toolslify",
    seoDescription:
      "Convert messy meeting notes into clean summaries, decisions, and action items with Toolslify. Switch between bullet and paragraph output in one workspace.",
    keywords: [
      "convert meeting notes to summary",
      "ai meeting notes summarizer free",
      "meeting notes summary converter",
      "summarize meeting notes",
    ],
    headline: "Turn messy meeting notes into clean summaries and action items",
    description:
      "Paste raw notes from standups, client calls, or workshops and generate a clear recap with key decisions, owners, and next steps.",
    ctaLabel: "Create summary",
    inputTitle: "Meeting notes",
    inputPlaceholder:
      "Paste raw meeting notes, speaker notes, or a rough transcript. Toolslify will condense the material into a readable summary and action list.",
    outputTitle: "Summary output",
    outputPlaceholder:
      "The result will be organized into a summary, decisions, risks, and action items that you can copy into Slack, Notion, or email.",
    sidebarTitle: "Meeting digest",
    theme: {
      primary: "#0f766e",
      secondary: "#1d4ed8",
      surface: "rgba(15, 118, 110, 0.10)",
      glow: "rgba(15, 118, 110, 0.22)",
    },
    heroStats: [
      { label: "Output format", value: "Bullets or prose" },
      { label: "Action list", value: "Owners + next steps" },
      { label: "Share fast", value: "Copy in one click" },
    ],
    featureCards: [
      {
        title: "Decision extraction",
        body: "The summary view separates decisions from open questions so updates are easier to share after a meeting ends.",
      },
      {
        title: "Action item cleanup",
        body: "Loose task mentions are rewritten into clearer owners, deliverables, and timing where possible.",
      },
      {
        title: "Paragraph and bullet modes",
        body: "Choose the output that fits your workflow whether you send async updates or build polished follow-up docs.",
      },
    ],
    useCases: [
      "Standups, weekly team syncs, and client calls.",
      "Workshop and brainstorm recaps for async teams.",
      "Founder notes that need a crisp summary before sharing.",
    ],
    faq: [
      {
        question: "Can I switch between bullet and paragraph output?",
        answer: "Yes. The meeting tool can generate a structured bullet digest or a more narrative summary paragraph.",
      },
      {
        question: "Does the summary include action items?",
        answer: "Yes. The output separates action items from decisions and from the high-level meeting recap.",
      },
      {
        question: "Can I use rough or incomplete notes?",
        answer: "Yes. The tool works best with clear notes, but it is designed to organize rough meeting inputs too.",
      },
    ],
    relatedSeoLinks: [
      { href: "/ai-text-improver", label: "AI Text Improver" },
      { href: "/rewrite-ai-text", label: "Rewrite AI Text" },
      { href: "/humanize-ai-text", label: "Humanize AI Text" },
    ],
  },
  "voice-note-to-text": {
    slug: "voice-note-to-text",
    path: "/tools/voice-note-to-text",
    name: "Voice Note to Text Converter",
    shortName: "Voice to Text",
    category: "Audio",
    group: "core",
    badge: "Speech workflow",
    seoTitle: "Voice Note to Text Converter | Toolslify",
    seoDescription:
      "Record a voice note, upload audio, and convert speech into editable text with Toolslify. Use in-browser recording instantly or connect an API key for file uploads.",
    keywords: [
      "voice to text converter online free",
      "audio to text ai tool",
      "voice note to text converter",
      "speech to text online",
    ],
    headline: "Convert spoken ideas into editable text without leaving the browser",
    description:
      "Use live browser recording for instant voice-to-text capture, or connect a transcription API key for uploaded audio files when you are ready to scale.",
    ctaLabel: "Convert audio",
    inputTitle: "Voice source",
    inputPlaceholder:
      "Record a voice note in the browser or upload an audio file to convert it into a clean transcript you can copy and reuse.",
    outputTitle: "Transcript",
    outputPlaceholder:
      "Your transcript will appear here with a clean reading view, quick export actions, and a short quality summary.",
    sidebarTitle: "Transcription status",
    theme: {
      primary: "#0891b2",
      secondary: "#2563eb",
      surface: "rgba(8, 145, 178, 0.10)",
      glow: "rgba(37, 99, 235, 0.18)",
    },
    heroStats: [
      { label: "Recording mode", value: "Live browser" },
      { label: "Upload path", value: "API ready" },
      { label: "Result", value: "Transcript + notes" },
    ],
    featureCards: [
      {
        title: "Live speech capture",
        body: "On supported browsers, Toolslify can capture speech in real time so quick recordings are usable immediately.",
      },
      {
        title: "Upload-ready backend",
        body: "Add an API key and the same workspace can process uploaded audio files for a production transcription path.",
      },
      {
        title: "Fast cleanup",
        body: "Transcripts are normalized for spacing and readability so they are easier to paste into docs, email, or task tools.",
      },
    ],
    useCases: [
      "Convert founder voice notes into launch drafts.",
      "Turn study voice memos into clean text.",
      "Transcribe field notes and short spoken reminders.",
    ],
    faq: [
      {
        question: "Does the live recording mode work without an API key?",
        answer: "Yes. Live recording uses the browser speech engine on supported browsers and works locally without extra configuration.",
      },
      {
        question: "What does the upload mode need?",
        answer: "Audio uploads are wired for server transcription and can be enabled by adding an API key in environment variables.",
      },
      {
        question: "Is the transcript stored?",
        answer: "No. The server processes the request in memory, and only your browser can keep a local history if you choose to save outputs.",
      },
    ],
    relatedSeoLinks: [
      { href: "/ai-text-improver", label: "AI Text Improver" },
      { href: "/humanize-ai-text", label: "Humanize AI Text" },
      { href: "/undetectable-ai-writer", label: "Undetectable AI Writer" },
    ],
  },
  "pdf-all-format-converter": {
    slug: "pdf-all-format-converter",
    path: "/tools/pdf-all-format-converter",
    name: "PDF to All Format Converter",
    shortName: "PDF Converter",
    category: "Documents",
    group: "core",
    badge: "Document workflow",
    seoTitle: "PDF to All Format Converter | Toolslify",
    seoDescription:
      "Upload a PDF and convert it into text, Word-ready output, a summary, or structured notes with Toolslify's premium PDF workflow.",
    keywords: [
      "convert pdf to notes online free",
      "pdf to text converter fast",
      "pdf summary converter",
      "pdf to word notes tool",
    ],
    headline: "Extract text, summaries, notes, and Word-ready output from one PDF upload",
    description:
      "Upload a PDF once, choose the format you need, and export the result as raw text, Word-friendly content, a clean summary, or study notes.",
    ctaLabel: "Convert PDF",
    inputTitle: "PDF file",
    inputPlaceholder:
      "Upload a PDF and choose whether you want the extracted text, a Word-friendly version, a summary, or structured notes.",
    outputTitle: "Converted output",
    outputPlaceholder:
      "Toolslify will extract the PDF text and reshape it into the format you selected so you can copy or download it right away.",
    sidebarTitle: "Conversion summary",
    theme: {
      primary: "#1d4ed8",
      secondary: "#f59e0b",
      surface: "rgba(29, 78, 216, 0.10)",
      glow: "rgba(29, 78, 216, 0.22)",
    },
    heroStats: [
      { label: "Input", value: "PDF upload" },
      { label: "Formats", value: "Text, Word, Summary, Notes" },
      { label: "Export", value: "Instant download" },
    ],
    featureCards: [
      {
        title: "Real text extraction",
        body: "The converter parses PDF content before reshaping it into the selected output instead of showing a fake placeholder flow.",
      },
      {
        title: "Multiple output modes",
        body: "Turn one PDF into raw text, a Word-ready document, condensed summary text, or study notes from the same screen.",
      },
      {
        title: "Clean download actions",
        body: "Each conversion result can be copied or downloaded immediately so the workflow feels fast from upload to export.",
      },
    ],
    useCases: [
      "Convert lecture PDFs into notes before exams.",
      "Extract client documents into a working text draft.",
      "Summarize long PDFs before sharing with a team.",
    ],
    faq: [
      {
        question: "Can I convert one PDF into different formats?",
        answer: "Yes. Choose between text, Word-ready, summary, and notes output from the same uploaded document.",
      },
      {
        question: "Does the tool keep the uploaded PDF?",
        answer: "No. The PDF is parsed in memory for the current request and is not stored on the server after processing.",
      },
      {
        question: "What if the PDF is image-only?",
        answer: "The current workflow is strongest with text-based PDFs. Image-only OCR can be added later as the next scaling step.",
      },
    ],
    relatedSeoLinks: [
      { href: "/ai-text-improver", label: "AI Text Improver" },
      { href: "/humanize-ai-text", label: "Humanize AI Text" },
      { href: "/ai-content-humanizer", label: "AI Content Humanizer" },
    ],
  },
  "humanize-ai-text": {
    slug: "humanize-ai-text",
    path: "/tools/humanize-ai-text",
    name: "Humanize AI Text",
    shortName: "Humanize AI Text",
    category: "Humanizer mode",
    group: "search-intent",
    badge: "Intent tool",
    seoTitle: "Humanize AI Text Tool | Toolslify",
    seoDescription:
      "Open Toolslify's Humanize AI Text workflow to soften robotic phrasing, compare edits, and export a cleaner draft with a premium AI humanizer experience.",
    keywords: [
      "humanize ai text",
      "how to make ai text sound human free",
      "convert ai writing to human writing",
      "humanize ai content tool",
    ],
    headline: "Humanize AI text with a guided workflow built for real drafts",
    description:
      "Use the flagship humanizer in a more intent-specific route focused on smoothing robotic phrasing, improving readability, and keeping the original meaning stable.",
    ctaLabel: "Humanize AI text",
    inputTitle: "AI text input",
    inputPlaceholder:
      "Paste AI-generated writing that sounds too even, too polished, or too abstract. Toolslify will turn it into a draft that reads more naturally.",
    outputTitle: "Humanized text",
    outputPlaceholder:
      "Your improved version appears here with compare mode, score simulation, and fast export actions.",
    sidebarTitle: "Humanizing signals",
    theme: {
      primary: "#2563eb",
      secondary: "#14b8a6",
      surface: "rgba(37, 99, 235, 0.10)",
      glow: "rgba(37, 99, 235, 0.24)",
    },
    heroStats: [
      { label: "Best for", value: "Essays + blogs" },
      { label: "Review mode", value: "Diff highlight" },
      { label: "Workflow", value: "Paste to export" },
    ],
    featureCards: [
      {
        title: "Meaning-safe rewrite",
        body: "The route is tuned for drafts that already say the right thing but still sound too machine-like to trust.",
      },
      {
        title: "Believable rhythm",
        body: "Sentence pacing, transitions, and repeated phrasing are softened before you copy the final version.",
      },
      {
        title: "First-time-friendly flow",
        body: "This guided route keeps the loop simple: add text, run the rewrite, compare changes, and export the stronger draft.",
      },
    ],
    useCases: [
      "Humanize blog intros and landing page copy.",
      "Fix stiff AI-generated paragraphs before publishing.",
      "Improve AI-assisted drafts without starting over.",
    ],
    faq: [
      {
        question: "How is this different from the main AI Humanizer?",
        answer: "It uses the same premium workspace, but the framing and content are tuned for people who specifically want to humanize AI text fast.",
      },
      {
        question: "Can I compare before and after text here too?",
        answer: "Yes. The same side-by-side review flow and change highlighting are available in this guided route.",
      },
      {
        question: "Is this useful for short and long drafts?",
        answer: "Yes. It works for anything from a short paragraph to a longer draft as long as the original meaning is worth preserving.",
      },
    ],
    relatedSeoLinks: [
      { href: "/humanize-ai-text", label: "Humanize AI Text Guide" },
      { href: "/ai-content-humanizer", label: "AI Content Humanizer" },
      { href: "/ai-text-improver", label: "AI Text Improver" },
    ],
  },
  "ai-humanizer-free": {
    slug: "ai-humanizer-free",
    path: "/tools/ai-humanizer-free",
    name: "AI Humanizer Free",
    shortName: "Humanizer Free",
    category: "Humanizer mode",
    group: "search-intent",
    badge: "No-login route",
    seoTitle: "AI Humanizer Free Tool | Toolslify",
    seoDescription:
      "Use Toolslify's AI Humanizer Free route to humanize AI text without signup and still get compare mode, score simulation, and export controls.",
    keywords: [
      "ai humanizer free",
      "free ai humanizer without login",
      "ai humanizer no signup",
      "free humanizer tool",
    ],
    headline: "AI Humanizer Free without the thin-page tradeoff",
    description:
      "Start immediately with a no-login humanizer route that still feels like a premium product, not a disposable free textarea page.",
    ctaLabel: "Start free humanizer",
    inputTitle: "Free humanizer input",
    inputPlaceholder:
      "Paste the draft you want to clean up. This route is designed for quick first runs without forcing signup or extra steps.",
    outputTitle: "Free result",
    outputPlaceholder:
      "Your cleaned version appears here with compare mode and export actions ready.",
    sidebarTitle: "Free route signals",
    theme: {
      primary: "#0f766e",
      secondary: "#f59e0b",
      surface: "rgba(15, 118, 110, 0.10)",
      glow: "rgba(15, 118, 110, 0.24)",
    },
    heroStats: [
      { label: "Signup", value: "Not required" },
      { label: "Export", value: "Copy + TXT" },
      { label: "Best for", value: "Fast first run" },
    ],
    featureCards: [
      {
        title: "No-login entry point",
        body: "The route lowers friction for first-time users who want to test quality before committing to anything else.",
      },
      {
        title: "Free without feeling cheap",
        body: "You still get comparison, a score panel, local history, and clear actions instead of a thin one-click widget.",
      },
      {
        title: "Trust-forward messaging",
        body: "The workspace keeps no-data-stored cues visible so the free experience still feels credible.",
      },
    ],
    useCases: [
      "Quick cleanup for assignments and essays.",
      "Fast rewrites for outreach and creator copy.",
      "Testing the humanizer before deeper use.",
    ],
    faq: [
      {
        question: "Do I need an account for this route?",
        answer: "No. This route is designed to work as an immediate no-login entry point.",
      },
      {
        question: "Is the output limited because it is free?",
        answer: "No. The key product controls remain available so the free run still feels useful and reviewable.",
      },
      {
        question: "Can I download the result?",
        answer: "Yes. Copy and TXT download actions are built into the workspace.",
      },
    ],
    relatedSeoLinks: [
      { href: "/ai-humanizer-free", label: "AI Humanizer Free Guide" },
      { href: "/humanize-ai-text", label: "Humanize AI Text" },
      { href: "/rewrite-ai-text", label: "Rewrite AI Text" },
    ],
  },
  "ai-paraphraser": {
    slug: "ai-paraphraser",
    path: "/tools/ai-paraphraser",
    name: "AI Paraphraser",
    shortName: "Paraphraser",
    category: "Humanizer mode",
    group: "search-intent",
    badge: "Rewrite route",
    seoTitle: "AI Paraphraser Tool | Toolslify",
    seoDescription:
      "Use Toolslify as an AI Paraphraser tool to refresh wording, improve flow, and compare your rewritten text without losing the original meaning.",
    keywords: [
      "ai paraphraser",
      "rewrite ai content",
      "convert ai writing to human writing",
      "paraphrase ai text online",
    ],
    headline: "Paraphrase AI writing without getting trapped in synonym-only rewrites",
    description:
      "This route focuses on cleaner wording and better flow, while still letting you review each rewrite against the original version.",
    ctaLabel: "Paraphrase text",
    inputTitle: "Paraphrase input",
    inputPlaceholder:
      "Paste the sentence or paragraph you want to reword. Toolslify will refresh the draft while protecting the main idea.",
    outputTitle: "Paraphrased draft",
    outputPlaceholder:
      "Your reworded version appears here with a compare view and quick export controls.",
    sidebarTitle: "Paraphrase review",
    theme: {
      primary: "#4f46e5",
      secondary: "#06b6d4",
      surface: "rgba(79, 70, 229, 0.10)",
      glow: "rgba(79, 70, 229, 0.22)",
    },
    heroStats: [
      { label: "Best for", value: "Wording refresh" },
      { label: "Tone control", value: "3 modes" },
      { label: "Review", value: "Before vs after" },
    ],
    featureCards: [
      {
        title: "Beyond synonym swaps",
        body: "The route helps improve phrasing and pacing instead of only replacing words with awkward alternatives.",
      },
      {
        title: "Cleaner readability",
        body: "Paraphrased output is shaped to feel smoother and more believable under normal human reading.",
      },
      {
        title: "Export-ready workflow",
        body: "Use compare mode, copy the stronger version, or download it for later editing without losing the original input.",
      },
    ],
    useCases: [
      "Refresh repetitive product copy.",
      "Reword essay sections without changing the point.",
      "Improve internal updates before sending them out.",
    ],
    faq: [
      {
        question: "Does this route use the same core engine as the humanizer?",
        answer: "Yes. It uses the same controlled rewrite workflow, but the positioning here is focused on paraphrasing and wording refresh.",
      },
      {
        question: "Is paraphrasing enough for robotic AI text?",
        answer: "Sometimes, but the biggest lift usually comes when wording changes are paired with rhythm and readability improvements too.",
      },
      {
        question: "Can I use this for short sentences and full paragraphs?",
        answer: "Yes. It is effective for both quick rewording and more substantial paragraph cleanup.",
      },
    ],
    relatedSeoLinks: [
      { href: "/ai-paraphraser", label: "AI Paraphraser Guide" },
      { href: "/rewrite-ai-text", label: "Rewrite AI Text" },
      { href: "/humanize-ai-text", label: "Humanize AI Text" },
    ],
  },
  "rewrite-ai-text": {
    slug: "rewrite-ai-text",
    path: "/tools/rewrite-ai-text",
    name: "Rewrite AI Text",
    shortName: "Rewrite AI",
    category: "Humanizer mode",
    group: "search-intent",
    badge: "Editorial route",
    seoTitle: "Rewrite AI Text Tool | Toolslify",
    seoDescription:
      "Open Toolslify's Rewrite AI Text workflow to clean robotic phrasing, protect the original meaning, and export a stronger final draft.",
    keywords: [
      "rewrite ai text",
      "rewrite ai content to avoid detection",
      "rewrite ai writing",
      "ai text rewrite tool",
    ],
    headline: "Rewrite AI text with a cleaner, more editorial workflow",
    description:
      "This route is designed for people who want to improve weak AI phrasing, reduce repetition, and keep the final text readable and believable.",
    ctaLabel: "Rewrite AI text",
    inputTitle: "Rewrite input",
    inputPlaceholder:
      "Paste the AI-assisted text you want to improve. Toolslify will rewrite it with smoother flow and clearer human-sounding phrasing.",
    outputTitle: "Rewritten result",
    outputPlaceholder:
      "Your rewritten version appears here with compare mode and export actions ready.",
    sidebarTitle: "Rewrite signals",
    theme: {
      primary: "#1d4ed8",
      secondary: "#f59e0b",
      surface: "rgba(29, 78, 216, 0.10)",
      glow: "rgba(29, 78, 216, 0.22)",
    },
    heroStats: [
      { label: "Use case", value: "AI cleanup" },
      { label: "Rewrite strength", value: "Adjustable" },
      { label: "Export", value: "Copy + TXT" },
    ],
    featureCards: [
      {
        title: "Focused cleanup",
        body: "The route targets robotic transitions, flat pacing, and vague phrasing before the output ever reaches export.",
      },
      {
        title: "Intent-preserving edits",
        body: "The meaning-first rewrite flow keeps the original point stable while improving how the writing actually reads.",
      },
      {
        title: "Review before release",
        body: "Compare mode and score simulation help you judge whether the rewrite truly improved the draft.",
      },
    ],
    useCases: [
      "Rewrite AI-heavy landing page sections.",
      "Improve generated internal docs and updates.",
      "Clean creator scripts and outreach drafts.",
    ],
    faq: [
      {
        question: "When should I use this route instead of the flagship AI Humanizer?",
        answer: "Use it when the exact intent is to rewrite weak AI text rather than simply soften the tone of a good draft.",
      },
      {
        question: "Can I keep the original meaning while rewriting?",
        answer: "Yes. The workflow is designed to protect meaning while changing rhythm, transitions, and generic phrasing.",
      },
      {
        question: "Is this route useful for marketing and essay drafts too?",
        answer: "Yes. It works well anywhere the draft sounds too generic or obviously machine-generated.",
      },
    ],
    relatedSeoLinks: [
      { href: "/rewrite-ai-text", label: "Rewrite AI Text Guide" },
      { href: "/ai-rewriter-tool", label: "AI Rewriter Tool" },
      { href: "/ai-text-improver", label: "AI Text Improver" },
    ],
  },
};

export function getAllTools() {
  return Object.values(TOOLS);
}

export function getToolBySlug(slug) {
  return TOOLS[slug] || null;
}

export function getFeaturedTools() {
  return getCoreTools();
}

export function getCoreTools() {
  return getAllTools().filter((tool) => tool.group === "core");
}

export function getSearchIntentTools() {
  return getAllTools().filter((tool) => tool.group === "search-intent");
}
