import { getToolBySlug } from "./site-data.js";
import { runStudioTool } from "./studio-tool-engine.js";

export async function runTool(slug, payload = {}) {
  const configuredTool = getToolBySlug(slug);

  if (configuredTool?.workspace === "studio") {
    return runStudioTool(configuredTool, payload);
  }

  throw new Error("Unsupported tool");
}
