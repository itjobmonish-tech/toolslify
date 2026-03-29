export function cn(...values) {
  return values.filter(Boolean).join(" ");
}

export function formatRelativeTime(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.round(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

