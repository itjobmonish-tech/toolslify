"use client";

import dynamic from "next/dynamic";
import { ToolSeoSections } from "@/components/marketing/tool-seo-sections";
import { ToolWorkspaceSkeleton } from "@/components/tools/tool-workspace-skeleton";
import { getToolPageContent } from "@/lib/tool-page-content";
import { getAllTools, getPopularTools, getRelatedTools, getToolBySlug } from "@/lib/site-data";

const createWorkspace = (loader) =>
  dynamic(loader, {
    loading: () => <ToolWorkspaceSkeleton />,
  });

const workspaceMap = {
  pdf: createWorkspace(() =>
    import("@/components/tools/pdf-workspace").then((mod) => mod.PdfWorkspace),
  ),
  image: createWorkspace(() =>
    import("@/components/tools/image-workspace").then((mod) => mod.ImageWorkspace),
  ),
  audio: createWorkspace(() =>
    import("@/components/tools/voice-workspace").then((mod) => mod.VoiceWorkspace),
  ),
  text: createWorkspace(() =>
    import("@/components/tools/text-workspace").then((mod) => mod.TextWorkspace),
  ),
  calculator: createWorkspace(() =>
    import("@/components/tools/calculator-workspace").then((mod) => mod.CalculatorWorkspace),
  ),
  utility: createWorkspace(() =>
    import("@/components/tools/utility-workspace").then((mod) => mod.UtilityWorkspace),
  ),
  studio: createWorkspace(() =>
    import("@/components/tools/studio-workspace").then((mod) => mod.StudioWorkspace),
  ),
};

export function ToolRouteShell({ slug }) {
  const tool = getToolBySlug(slug);

  if (!tool) return null;

  const Workspace = workspaceMap[tool.workspace];
  const shellStyle = createToolShellStyle(tool.interior?.theme);
  const content = getToolPageContent(tool);
  const popularTools = getPopularTools()
    .filter((item) => item.slug !== tool.slug)
    .slice(0, 5);
  const relatedTools = getRelatedTools(tool.slug, 5);
  const categoryTools = getAllTools()
    .filter((item) => item.slug !== tool.slug && item.categorySlug === tool.categorySlug)
    .slice(0, 5);
  const sidebarSections = [
    relatedTools.length
      ? {
          title: "Related tools",
          items: relatedTools.map((item) => ({
            label: item.name,
            href: item.path,
          })),
        }
      : null,
    categoryTools.length
      ? {
          title: `More ${tool.category}`,
          items: categoryTools.map((item) => ({
            label: item.name,
            href: item.path,
          })),
        }
      : null,
    popularTools.length
      ? {
          title: "Popular right now",
          items: popularTools.map((item) => ({
            label: item.name,
            href: item.path,
          })),
        }
      : null,
  ].filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 pt-1 sm:space-y-5" style={shellStyle}>
      <section className="tool-header-shell px-3 pb-1 pt-2 text-center sm:px-6">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#5f7391]">
          {tool.category}
        </p>
        <h1 className="mx-auto mt-4 max-w-[16ch] break-words text-[clamp(2.2rem,8vw,4.3rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[#24364f]">
          {tool.name}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-[1rem] leading-8 text-[#66758c]">
          {content.heroLead}
        </p>
      </section>

      <section className="tool-workspace-shell" data-workspace={tool.workspace}>
        {Workspace ? <Workspace slug={tool.slug} /> : <ToolWorkspaceSkeleton />}
      </section>

      <ToolSeoSections tool={tool} content={content} sidebarSections={sidebarSections} />
    </div>
  );
}

function createToolShellStyle(theme = {}) {
  const resolved = {
    primary: "#35527c",
    strong: "#24364f",
    soft: "rgba(53, 82, 124, 0.1)",
    surface: "rgba(245, 248, 252, 0.98)",
    edge: "rgba(53, 82, 124, 0.18)",
    glow: "rgba(36, 54, 79, 0.08)",
    ink: "#24364f",
  };

  return {
    "--primary": resolved.primary,
    "--primary-soft": resolved.soft,
    "--primary-edge": resolved.edge,
    "--accent-start": resolved.primary,
    "--accent-end": resolved.strong,
    "--accent-text": resolved.ink,
    "--accent-stronger": resolved.ink,
    "--accent-ring": resolved.soft,
    "--tool-primary": resolved.primary,
    "--tool-strong": resolved.strong,
    "--tool-soft": resolved.soft,
    "--tool-surface": resolved.surface,
    "--tool-edge": resolved.edge,
    "--tool-glow": resolved.glow,
    "--tool-ink": resolved.ink,
  };
}
