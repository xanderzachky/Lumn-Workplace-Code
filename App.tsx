import { useMemo, useState } from "react";
import { BookOpen, ChevronDown, Code2, FileCode2, Folder, FolderOpen, Play, RotateCcw, Save, Search, Square, Terminal, Upload, Monitor, Copy, Download, Cpu, HardDrive, MemoryStick } from "lucide-react";
import { runLumn } from "./lumn/engine";

const starter = `SYSTEM "NovaOS" {
  name: "NovaOS"
  version: "1.0.0"
  developer: "Xeno"
  architecture: "virtual"
}

DESKTOP MainDesktop {
  wallpaper: "#080B18"
  resolution: 1280x720
  taskbar: true
}

WINDOW "System Information" {
  title: "About NovaOS"
  width: 520
  height: 300

  TEXT "NovaOS is running."
  TEXT "Powered by Lumn Runtime."
}

PRINT "Boot sequence ready"
`;

const handbook = `# Lumn Language Handbook — v0.1

Lumn is a custom hybrid language for defining fictional operating systems inside Lumn Workspace.

## Supported starter syntax

\`\`\`lumn
SYSTEM "NovaOS" {
  name: "NovaOS"
  version: "1.0.0"
}

WINDOW "About" {
  title: "About NovaOS"
  width: 520
  height: 300
  TEXT "Hello from Lumn"
}

PRINT "Runtime ready"
\`\`\`

## Current implementation status

- SYSTEM declaration: basic name extraction
- WINDOW declaration: title, width, height and TEXT children
- PRINT: quoted text output
- DESKTOP: accepted as a declaration placeholder
- Variables, functions, conditions, events, virtual storage and process APIs: planned, not implemented yet

Only use syntax marked as supported when testing this starter runtime.
`;

type FileEntry = { name: string; content: string };
export default function App() {
  const [file, setFile] = useState<FileEntry>({ name: "main.lumn", content: starter });
  const [logs, setLogs] = useState<string[]>(["Lumn Workspace ready.", "Open a project or run the starter file."]);
  const [result, setResult] = useState<ReturnType<typeof runLumn> | null>(null);
  const [active, setActive] = useState("editor");
  const [projectName, setProjectName] = useState("NovaOS");
  const [handbookOpen, setHandbookOpen] = useState(false);

  const run = () => {
    const next = runLumn(file.content);
    setResult(next);
    setLogs(next.ok ? next.logs : [next.error ?? "Unknown error"]);
    setActive("preview");
  };
  const save = () => {
    localStorage.setItem("lumn-starter-project", JSON.stringify({ projectName, file }));
    setLogs((old) => [...old, "Project saved in this browser."]);
  };
  const load = () => {
    const raw = localStorage.getItem("lumn-starter-project");
    if (!raw) return setLogs((old) => [...old, "No saved project found."]);
    try { const data = JSON.parse(raw); setProjectName(data.projectName); setFile(data.file); setLogs((old) => [...old, "Project restored."]); }
    catch { setLogs((old) => [...old, "Could not read saved project."]); }
  };
  const importFiles = async (list: FileList | null) => {
    if (!list?.length) return;
    const chosen = Array.from(list).find((f) => f.name.endsWith(".lumn"));
    if (!chosen) return setLogs((old) => [...old, "Import expects at least one .lumn file. ZIP/folder import is not included in this starter."]);
    setFile({ name: chosen.name, content: await chosen.text() });
    setLogs((old) => [...old, `Imported ${chosen.name}.`]);
  };
  const exportFile = () => {
    const blob = new Blob([file.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = file.name; a.click();
    URL.revokeObjectURL(url);
  };
  const copyHandoff = async () => {
    await navigator.clipboard.writeText(handbook + "\n\n" + file.content);
    setLogs((old) => [...old, "Lumn handbook and current source copied for AI handoff."]);
  };
  const previewWindows = result?.ok ? result.windows : [];
  const status = useMemo(() => result ? (result.ok ? "Ready" : "Error") : "Idle", [result]);

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark">L</div><span>Lumn</span><span className="muted">Workspace</span></div>
      <nav><button className="nav-active"><Code2 size={15}/> Workspace</button><button onClick={() => setHandbookOpen(!handbookOpen)}><BookOpen size={15}/> Handbook</button><button onClick={copyHandoff}><Copy size={15}/> AI Handoff</button></nav>
      <div className="top-actions"><span className="version">LANGUAGE v0.1</span><button className="icon-btn" title="Save project" onClick={save}><Save size={16}/></button></div>
    </header>

    <div className="projectbar">
      <div className="crumb"><FolderOpen size={15}/><input value={projectName} onChange={(e) => setProjectName(e.target.value)} aria-label="Project name"/></div>
      <div className="project-actions">
        <label className="small-btn"><Upload size={14}/> Import .lumn<input hidden type="file" accept=".lumn,text/plain" onChange={(e) => importFiles(e.target.files)}/></label>
        <button className="small-btn" onClick={load}>Open saved</button>
        <button className="small-btn" onClick={exportFile}><Download size={14}/> Export file</button>
      </div>
    </div>

    <main className="workspace">
      <aside className="sidebar">
        <div className="side-heading">PROJECT</div>
        <div className="tree-item selected"><FileCode2 size={15}/>{file.name}</div>
        <div className="tree-item"><Folder size={15}/>system <span className="planned">planned</span></div>
        <div className="tree-item"><Folder size={15}/>assets <span className="planned">planned</span></div>
        <div className="side-divider"/>
        <div className="side-heading">DEVELOPMENT</div>
        <button className="side-link" onClick={() => setActive("editor")}><Code2 size={15}/> Code Editor</button>
        <button className="side-link" onClick={() => setActive("preview")}><Monitor size={15}/> Sandbox Preview</button>
        <button className="side-link" onClick={() => setHandbookOpen(true)}><BookOpen size={15}/> Language Handbook</button>
        <div className="sidebar-bottom"><span className="dot"/> Local workspace <span className="muted">·</span> v0.1</div>
      </aside>

      <section className="main-panel">
        <div className="tabs"><button className={active === "editor" ? "tab active" : "tab"} onClick={() => setActive("editor")}><FileCode2 size={14}/>{file.name}</button><button className={active === "preview" ? "tab active" : "tab"} onClick={() => setActive("preview")}><Monitor size={14}/>Sandbox Preview</button><div className="tab-spacer"/><span className={`status ${status === "Error" ? "error" : ""}`}><span className="dot"/>{status}</span></div>

        {active === "editor" ? <div className="editor-wrap"><div className="editor-toolbar"><span> LUMN SOURCE <span className="muted">/ {file.name}</span></span><div><button className="small-btn" onClick={save}><Save size={14}/> Save</button><button className="run-btn" onClick={run}><Play size={14} fill="currentColor"/> Run</button></div></div><div className="code-area"><div className="line-numbers">{file.content.split("\n").map((_, i) => <div key={i}>{i + 1}</div>)}</div><textarea spellCheck={false} value={file.content} onChange={(e) => setFile({ ...file, content: e.target.value })} aria-label="Lumn code editor"/></div></div>
        : <div className="preview-wrap"><div className="preview-toolbar"><span><Monitor size={14}/> LUMN SANDBOX OS</span><div><button className="small-btn" onClick={() => setResult(null)}><RotateCcw size={14}/> Reset</button><button className="run-btn" onClick={run}><Play size={14}/> Boot / Run</button></div></div><div className="os-screen"><div className="os-top"><span>{result?.systemName ?? "Lumn Sandbox"}</span><span>Virtual Environment</span></div><div className="os-content">{result?.ok ? (previewWindows.length ? previewWindows.map((w, i) => <div className="os-window" key={i} style={{ width: `min(${w.width}px, 90%)`, minHeight: Math.min(w.height, 360) }}><div className="window-title"><span>{w.title}</span><span>—　□　×</span></div><div className="window-body">{w.text.map((t, j) => <p key={j}>{t}</p>)}</div></div>) : <div className="empty-os"><Monitor size={34}/><h2>{result.systemName}</h2><p>Virtual system initialized. No windows declared.</p></div>) : <div className="empty-os"><Monitor size={34}/><h2>Sandbox is idle</h2><p>Run a valid Lumn project to boot the virtual OS.</p></div>}</div><div className="os-taskbar"><span>◈</span><span>{result?.systemName ?? "Lumn Sandbox"}</span><span className="task-time">SIMULATED SESSION</span></div></div></div>}

        <div className="console"><div className="console-head"><span><Terminal size={14}/> TERMINAL</span><button onClick={() => setLogs([])}>Clear</button></div><div className="console-lines">{logs.map((line, i) => <div key={i} className={line.includes("L-") ? "log-error" : ""}><span className="prompt">›</span>{line}</div>)}</div></div>
      </section>

      <aside className="inspector"><div className="inspector-title">SYSTEM INSPECTOR</div><div className="inspect-card"><div className="inspect-label"><MemoryStick size={14}/> Virtual memory</div><strong>—</strong><div className="meter"><span style={{width:"0%"}}/></div><small>Not implemented in v0.1</small></div><div className="inspect-card"><div className="inspect-label"><Cpu size={14}/> Virtual processes</div><strong>{result?.ok ? "1" : "0"}</strong><small>Basic runtime session</small></div><div className="inspect-card"><div className="inspect-label"><HardDrive size={14}/> Virtual storage</div><strong>—</strong><small>Planned for a future version</small></div><div className="inspector-note"><strong>Runtime scope</strong><p>This starter interprets a limited Lumn subset. It does not boot a real operating system or access host hardware.</p></div></aside>
    </main>

    {handbookOpen && <div className="modal-backdrop" onClick={() => setHandbookOpen(false)}><div className="handbook-modal" onClick={(e) => e.stopPropagation()}><div className="modal-head"><div><BookOpen size={18}/> <strong>Lumn Language Handbook</strong></div><button onClick={() => setHandbookOpen(false)}>×</button></div><pre>{handbook}</pre><div className="modal-actions"><button className="small-btn" onClick={copyHandoff}><Copy size={14}/> Copy handbook + current code</button><button className="run-btn" onClick={() => setHandbookOpen(false)}>Close</button></div></div></div>}
  </div>;
}
