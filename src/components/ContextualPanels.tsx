import React, { useState } from 'react';
import {
  Check,
  ChevronLeft,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Play,
  Sparkles,
  X,
} from 'lucide-react';
import {
  ActionKey,
  ActivityLogItem,
  CONNECTED_TOOLS,
  DemoFile,
  RecurringTaskItem,
} from '../data/demoData';
import {
  generateStandaloneHtmlBundle,
  getIframeEmbedSnippet,
} from '../utils/standaloneExport';
import {
  ClockOutlineIcon,
  CrossedToolsIcon,
  DocFileIcon,
  RepeatArrowsIcon,
} from './Icons';

interface RecurringTasksPanelProps {
  tasks: RecurringTaskItem[];
  onToggleTask: (id: string) => void;
  onRunTask: (actionKey: ActionKey, taskTitle: string) => void;
  onClose: () => void;
}

export const RecurringTasksPanel: React.FC<RecurringTasksPanelProps> = ({
  tasks,
  onToggleTask,
  onRunTask,
  onClose,
}) => {
  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-150">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <RepeatArrowsIcon className="w-3.5 h-3.5 text-indigo-600" />
          <h2 className="text-xs font-semibold text-slate-900">
            Recurring Tasks · Scheduled Automations
          </h2>
          <span className="text-[10px] text-slate-500 font-mono tabular-nums">
            · {tasks.filter((t) => t.enabled).length} active
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3 h-3" />
          Back to Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto phos-embed-scroll p-3.5 space-y-2.5">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Configure automated research schedules that Johnny runs autonomously. Toggle schedules or trigger a sample run below:
        </p>

        {tasks.map((task) => (
          <div
            key={task.id}
            className="border border-slate-200/90 rounded-xl p-3 bg-white hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 truncate">
                    {task.title}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[10.5px] text-slate-500 font-mono tabular-nums">
                  <span>{task.schedule}</span>
                  <span aria-hidden="true">·</span>
                  <span>Output: {task.channel}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  role="switch"
                  aria-checked={task.enabled}
                  aria-label={`Toggle ${task.title}`}
                  onClick={() => onToggleTask(task.id)}
                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    task.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow transition duration-150 ${
                      task.enabled ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
              {task.description}
            </p>

            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-500 font-mono tabular-nums">
                {task.enabled ? `Next run: ${task.nextRun}` : 'Schedule paused in demo'}
              </span>
              <button
                type="button"
                onClick={() => onRunTask(task.actionKey, task.title)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                Run sample now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface FilesPanelProps {
  files: DemoFile[];
  selectedFileId: string | null;
  onSelectFile: (fileId: string | null) => void;
  onRunRelatedAction: (actionKey: ActionKey) => void;
  onClose: () => void;
}

export const FilesPanel: React.FC<FilesPanelProps> = ({
  files,
  selectedFileId,
  onSelectFile,
  onRunRelatedAction,
  onClose,
}) => {
  const activeFile = files.find((f) => f.id === selectedFileId) || null;

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-150">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2 min-w-0">
          <DocFileIcon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <h2 className="text-xs font-semibold text-slate-900 truncate">
            {activeFile ? activeFile.name : 'Files · Generated Reports & Artifacts'}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {activeFile && (
            <button
              type="button"
              onClick={() => onSelectFile(null)}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
            >
              All Files
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3 h-3" />
            Back to Chat
          </button>
        </div>
      </div>

      {activeFile ? (
        <div className="flex-1 overflow-y-auto phos-embed-scroll p-4 space-y-3">
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-900">
                {activeFile.name}
              </span>
              <span className="text-[10px] font-mono tabular-nums text-slate-500">
                {activeFile.type} · {activeFile.size}
              </span>
            </div>
            <div className="text-[10.5px] text-slate-500 mt-0.5">
              Created by {activeFile.createdBy} · {activeFile.updatedAt}
            </div>
            <p className="text-[11px] text-slate-700 mt-2 leading-relaxed">
              {activeFile.summary}
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
                Document Preview (Fictional Sample Data)
              </span>
              <button
                type="button"
                onClick={() => onRunRelatedAction(activeFile.actionKey)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Open in Chat
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>

            {activeFile.previewSections.map((sec, idx) => (
              <div key={idx} className="space-y-1.5">
                <h3 className="text-xs font-semibold text-slate-900">
                  {sec.heading}
                </h3>
                <ul className="space-y-1 pl-3.5 list-disc text-[11px] text-slate-600 leading-relaxed">
                  {sec.body.map((line, lineIdx) => (
                    <li key={lineIdx}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto phos-embed-scroll p-3.5 space-y-2">
          <p className="text-[11px] text-slate-500 mb-2">
            Click any document created by Johnny to inspect its sample contents:
          </p>
          {files.map((file) => (
            <button
              key={file.id}
              type="button"
              onClick={() => onSelectFile(file.id)}
              className="w-full text-left border border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/20 rounded-xl p-2.5 transition-all flex items-start justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-indigo-100/70 text-slate-700 group-hover:text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                  {file.type === 'XLSX' || file.type === 'CSV' ? (
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                  ) : (
                    <FileText className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-700 truncate transition-colors">
                    {file.name}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {file.summary}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono tabular-nums mt-1">
                    {file.type} · {file.size} · {file.updatedAt}
                  </div>
                </div>
              </div>
              <span className="text-[10.5px] font-medium text-indigo-600 shrink-0 self-center">
                Preview →
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface RecentActivityPanelProps {
  activities: ActivityLogItem[];
  onInspectActivity: (actionKey: ActionKey) => void;
  onClose: () => void;
}

export const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({
  activities,
  onInspectActivity,
  onClose,
}) => {
  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-150">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <ClockOutlineIcon className="w-3.5 h-3.5 text-indigo-600" />
          <h2 className="text-xs font-semibold text-slate-900">
            Recent Activity · Completed Work Log
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3 h-3" />
          Back to Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto phos-embed-scroll p-3.5 space-y-2">
        <p className="text-[11px] text-slate-500 mb-2">
          Simulated execution history showing tasks recently completed by Johnny:
        </p>
        {activities.map((item) => (
          <div
            key={item.id}
            className="border border-slate-200/90 rounded-xl p-2.5 bg-white hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900">
                  {item.title}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  {item.detail}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onInspectActivity(item.actionKey)}
                className="px-2 py-1 rounded-md text-[10.5px] font-medium text-indigo-600 hover:bg-indigo-50 shrink-0 transition-colors cursor-pointer"
              >
                View output
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-mono tabular-nums">
              <span className="text-emerald-700 font-medium">✓ {item.status}</span>
              <span aria-hidden="true">·</span>
              <span>{item.tool}</span>
              <span aria-hidden="true">·</span>
              <span>Duration: {item.duration}</span>
              <span aria-hidden="true">·</span>
              <span>{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ConnectedToolsPanelProps {
  onClose: () => void;
}

export const ConnectedToolsPanel: React.FC<ConnectedToolsPanelProps> = ({
  onClose,
}) => {
  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-150">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <CrossedToolsIcon className="w-3.5 h-3.5 text-indigo-600" />
          <h2 className="text-xs font-semibold text-slate-900">
            Connected Tools · Sandbox Integrations
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3 h-3" />
          Back to Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto phos-embed-scroll p-3.5 space-y-2.5">
        <div className="border border-indigo-100 bg-indigo-50/50 rounded-xl p-2.5 text-[11px] text-slate-700 leading-relaxed">
          <strong className="font-semibold text-indigo-950">Guided Demo Notice:</strong>{' '}
          In production, PHOS AI Employees connect securely via OAuth. In this interactive preview, all integrations operate on deterministic fictional datasets.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CONNECTED_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="border border-slate-200/90 rounded-xl p-2.5 bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-xs font-semibold text-slate-900">
                    {tool.name}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    ● {tool.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {tool.category} · Synced {tool.lastSync}
                </div>
                <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface EmbedModalProps {
  onClose: () => void;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const snippet = getIframeEmbedSnippet(window.location.origin);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadStandalone = () => {
    const html = generateStandaloneHtmlBundle();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phos-ai-employees-hero-demo.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Embed in PHOS Website Hero Section
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Self-contained iframe snippet (`?embed=true`) or single-file HTML bundle
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            aria-label="Close embed modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">
              1. Responsive Iframe Embed Code (500–650px Hero Region)
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Snippet
                </>
              )}
            </button>
          </div>
          <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed">
            {snippet}
          </pre>
        </div>

        <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-slate-800">
              2. Standalone HTML/CSS/JS Export
            </div>
            <p className="text-[11px] text-slate-500">
              Zero external dependencies, scoped styles, embedded base64 avatars
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadStandalone}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download HTML
          </button>
        </div>
      </div>
    </div>
  );
};
