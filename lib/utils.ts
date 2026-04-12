import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAvatar(firstName: string, lastName: string): string {
  const initials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;

  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
  ];
  let hash = 0;
  for (let i = 0; i < firstName.length; i++) {
    hash = firstName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  const backgroundColor = colors[colorIndex];

  const canvas = document.createElement("canvas");
  canvas.width = 120;
  canvas.height = 120;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, 120, 120);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 48px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials, 60, 60);

  return canvas.toDataURL("image/png");
}

export function getRelativeTimeFormat(date: Date) {
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime(); // Difference in milliseconds
  const diffInSecs = Math.floor(diffInMs / 1000);

  const minutes = Math.floor(diffInSecs / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Approximate
  const years = Math.floor(days / 365); // Approximate

  const rtf = new Intl.RelativeTimeFormat(navigator.language, {
    numeric: "auto",
  });

  // Determine the appropriate unit
  if (Math.abs(diffInSecs) < 60) {
    return rtf.format(diffInSecs, "second");
  } else if (Math.abs(minutes) < 60) {
    return rtf.format(minutes, "minute");
  } else if (Math.abs(hours) < 24) {
    return rtf.format(hours, "hour");
  } else if (Math.abs(days) < 30) {
    return rtf.format(days, "day");
  } else if (Math.abs(months) < 12) {
    return rtf.format(months, "month");
  } else {
    return rtf.format(years, "year");
  }
}
