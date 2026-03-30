import { permanentRedirect } from "next/navigation";

export default function LegacyHumanizerPage() {
  permanentRedirect("/tools/ai-humanizer-free");
}
