export type LumnResult = {
  ok: boolean;
  logs: string[];
  systemName?: string;
  windows: { title: string; text: string[]; width: number; height: number }[];
  error?: string;
};

/**
 * Lumn v0.1 starter interpreter.
 * This intentionally supports only a small, explicit subset of the proposed language.
 * It does NOT execute JavaScript, HTML, shell commands, or arbitrary source strings.
 */
export function runLumn(source: string): LumnResult {
  const logs: string[] = [];
  const windows: LumnResult["windows"] = [];
  const systemMatch = source.match(/SYSTEM\s+["']?([A-Za-z_][\w-]*)["']?\s*\{([\s\S]*?)\}/i);
  const systemName = systemMatch?.[1] ?? "Untitled OS";

  const printRegex = /\bPRINT\s+["']([^"']*)["']/g;
  for (const match of source.matchAll(printRegex)) logs.push(match[1]);

  const windowRegex = /WINDOW\s+["']([^"']+)["']\s*\{([\s\S]*?)\}/g;
  for (const match of source.matchAll(windowRegex)) {
    const body = match[2];
    const title = body.match(/\btitle\s*:\s*["']([^"']+)["']/i)?.[1] ?? match[1];
    const width = Number(body.match(/\bwidth\s*:\s*(\d+)/i)?.[1] ?? 520);
    const height = Number(body.match(/\bheight\s*:\s*(\d+)/i)?.[1] ?? 300);
    const text = [...body.matchAll(/\bTEXT\s+["']([^"']*)["']/g)].map((m) => m[1]);
    windows.push({ title, text, width, height });
  }

  const allowed = /^\s*(SYSTEM|DESKTOP|WINDOW|TEXT|PRINT|BOOT|WAIT|LET|CONST|STATE|FUNCTION|IF|ELSE|RETURN|ON|BUTTON|IMPORT|EXPORT)\b/m;
  const suspicious = /<script|<\/script|javascript:|eval\s*\(|new\s+Function|fetch\s*\(|XMLHttpRequest|document\.cookie/i;
  if (suspicious.test(source)) {
    return { ok: false, logs, windows: [], error: "L-1006: Disallowed source pattern. Lumn does not execute embedded scripts or unrestricted browser APIs." };
  }
  if (source.trim() && !allowed.test(source)) {
    return { ok: false, logs, windows: [], error: "L-1001: No recognized Lumn declaration found. Try SYSTEM, DESKTOP, WINDOW, TEXT, or PRINT." };
  }
  if (/\bWINDOW\b/.test(source) && windows.length === 0) {
    return { ok: false, logs, windows: [], error: "L-1001: WINDOW declaration could not be parsed. Check its braces and quoted name." };
  }
  logs.unshift(`Lumn Runtime v0.1 initialized.`);
  logs.push(`Virtual system: ${systemName}`);
  logs.push(`Window declarations: ${windows.length}`);
  return { ok: true, logs, systemName, windows };
}
