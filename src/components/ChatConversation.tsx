import React from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import {
  ActionKey,
  DEMO_RESPONSES,
  DemoFile,
  EmployeeProfile,
  SUGGESTED_ACTIONS,
} from '../data/demoData';
import { DoubleSparkleIcon } from './Icons';

export interface ConversationTurn {
  id: string;
  userMessage: string;
  matchedAction: ActionKey | null;
  attachedSampleFile?: string | null;
}

interface ChatConversationProps {
  employee: EmployeeProfile;
  turn: ConversationTurn;
  isProcessing: boolean;
  processingStepIndex: number;
  files: DemoFile[];
  onTriggerAction: (key: ActionKey) => void;
  onOpenFilePreview: (fileId: string) => void;
  onReset: () => void;
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
  employee,
  turn,
  isProcessing,
  processingStepIndex,
  files,
  onTriggerAction,
  onOpenFilePreview,
  onReset,
}) => {
  const responseData = turn.matchedAction
    ? DEMO_RESPONSES[turn.matchedAction]
    : null;

  const generatedFile = responseData
    ? files.find((f) => f.id === responseData.generatedFileId)
    : null;

  const remainingActions = SUGGESTED_ACTIONS.filter(
    (a) => a.key !== turn.matchedAction
  );

  return (
    <div className="flex flex-col space-y-3 animate-in fade-in duration-150">
      {/* Top conversation bar with clear Reset control */}
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="font-medium text-slate-700">
            {responseData ? responseData.shortLabel : 'Guided Demo Session'}
          </span>
          <span aria-hidden="true">·</span>
          <span>Sample Data</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset conversation
        </button>
      </div>

      {/* User Message Bubble */}
      <div className="flex flex-col items-end">
        <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-[#1D6AE5] text-white px-3.5 py-2 text-xs leading-relaxed shadow-xs">
          {turn.attachedSampleFile && (
            <div className="flex items-center gap-1.5 text-[10.5px] bg-white/15 rounded-md px-2 py-0.5 mb-1 font-mono">
              <FileText className="w-3 h-3 shrink-0" />
              <span className="truncate">{turn.attachedSampleFile}</span>
            </div>
          )}
          <div>{turn.userMessage}</div>
        </div>
      </div>

      {/* Processing State */}
      {isProcessing ? (
        <div className="flex items-start gap-2.5">
          <img
            src={employee.avatar}
            alt={employee.name}
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5 border border-slate-200"
          />
          <div className="flex-1 border border-slate-200/90 rounded-2xl rounded-tl-sm bg-slate-50/70 p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
              <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin shrink-0" />
              <span>{employee.name} is working on your request...</span>
            </div>
            <div className="text-[11px] text-slate-500 pl-5 transition-all duration-150">
              {responseData
                ? responseData.processingSteps[
                    Math.min(
                      processingStepIndex,
                      responseData.processingSteps.length - 1
                    )
                  ]
                : 'Checking guided demo workflows...'}
            </div>
          </div>
        </div>
      ) : responseData ? (
        /* Supported Demo Action Result */
        <div className="flex items-start gap-2.5 animate-in fade-in duration-150">
          <img
            src={employee.avatar}
            alt={employee.name}
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5 border border-slate-200"
          />
          <div className="flex-1 min-w-0 border border-slate-200/90 rounded-2xl rounded-tl-sm bg-white p-3 space-y-2.5 shadow-2xs">
            {/* Result Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <h3 className="text-xs font-semibold text-slate-900">
                    {responseData.headline}
                  </h3>
                </div>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  {responseData.subtitle}
                </p>
              </div>
            </div>

            <p className="text-[11.5px] text-slate-700 leading-relaxed">
              {responseData.summaryText}
            </p>

            {/* KPI Metrics Row (for Generate a Report) */}
            {responseData.metrics && (
              <div className="grid grid-cols-3 gap-2">
                {responseData.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200/80 rounded-lg p-2 bg-slate-50/50"
                  >
                    <div className="text-[10px] text-slate-500 truncate">
                      {metric.label}
                    </div>
                    <div className="text-xs font-semibold text-slate-900 font-mono tabular-nums mt-0.5">
                      {metric.value}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-mono tabular-nums mt-0.5">
                      {metric.delta}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Competitor Comparison Table */}
            {responseData.competitorTable && (
              <div className="overflow-x-auto border border-slate-200/90 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-semibold text-slate-600">
                      <th className="py-1.5 px-2">Competitor</th>
                      <th className="py-1.5 px-2">Pricing Shift</th>
                      <th className="py-1.5 px-2">Product / Positioning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[10.5px]">
                    {responseData.competitorTable.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="py-1.5 px-2 font-semibold text-slate-900 whitespace-nowrap">
                          {row.name}
                        </td>
                        <td className="py-1.5 px-2 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                          {row.pricingShift}
                        </td>
                        <td className="py-1.5 px-2 text-slate-600">
                          {row.keyUpdate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Report Segment Breakdown Table */}
            {responseData.reportTable && (
              <div className="overflow-x-auto border border-slate-200/90 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-semibold text-slate-600">
                      <th className="py-1.5 px-2">Segment</th>
                      <th className="py-1.5 px-2 text-right">SQLs</th>
                      <th className="py-1.5 px-2 text-right">Reply Rate</th>
                      <th className="py-1.5 px-2 text-right">Pipeline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[10.5px] font-mono tabular-nums">
                    {responseData.reportTable.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="py-1.5 px-2 font-sans font-medium text-slate-900">
                          {row.segment}
                        </td>
                        <td className="py-1.5 px-2 text-right text-slate-700">
                          {row.sqls}
                        </td>
                        <td className="py-1.5 px-2 text-right text-emerald-700 font-medium">
                          {row.replyRate}
                        </td>
                        <td className="py-1.5 px-2 text-right font-semibold text-slate-900">
                          {row.pipeline}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Weekly Summary Highlights */}
            {responseData.highlights && (
              <div className="space-y-1.5">
                {responseData.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200/80 rounded-lg p-2 bg-slate-50/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-slate-900">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-medium text-indigo-700 shrink-0">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-600 mt-0.5 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Actionable Takeaway Callout */}
            <div className="rounded-lg bg-indigo-50/60 border border-indigo-100 p-2 text-[11px] text-slate-800 leading-relaxed">
              {responseData.takeaway}
            </div>

            {/* Generated Artifact File Link */}
            {generatedFile && (
              <button
                type="button"
                onClick={() => onOpenFilePreview(generatedFile.id)}
                className="w-full flex items-center justify-between gap-2 p-2 rounded-lg border border-slate-200 hover:border-indigo-300 bg-slate-50/60 hover:bg-indigo-50/30 transition-colors text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
                    {generatedFile.type === 'XLSX' ? (
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-slate-900 group-hover:text-indigo-700 truncate">
                      {generatedFile.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono tabular-nums">
                      {generatedFile.type} · {generatedFile.size} · Click to inspect file
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-0.5 text-[10.5px] font-medium text-indigo-600 shrink-0">
                  Open
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </button>
            )}

            {/* Try another suggested action */}
            <div className="pt-1 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-400 mr-0.5">Try next:</span>
              {remainingActions.map((act) => (
                <button
                  key={act.key}
                  type="button"
                  onClick={() => onTriggerAction(act.key)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/40 text-[10.5px] font-medium text-slate-700 hover:text-indigo-700 transition-colors cursor-pointer"
                >
                  <DoubleSparkleIcon className="w-3 h-3 text-slate-500" />
                  {act.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Guided Demo Fallback for Freeform Custom Messages */
        <div className="flex items-start gap-2.5 animate-in fade-in duration-150">
          <img
            src={employee.avatar}
            alt={employee.name}
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5 border border-slate-200"
          />
          <div className="flex-1 border border-slate-200/90 rounded-2xl rounded-tl-sm bg-white p-3 space-y-2.5 shadow-2xs">
            <div className="text-xs font-semibold text-slate-900">
              Interactive Guided Product Demo
            </div>
            <p className="text-[11.5px] text-slate-600 leading-relaxed">
              This embedded preview uses deterministic sample data so you can explore {employee.name}&apos;s capabilities immediately without connecting a live AI model or external CRM. Select one of the supported workflows below to see a realistic output:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {SUGGESTED_ACTIONS.map((act) => (
                <button
                  key={act.key}
                  type="button"
                  onClick={() => onTriggerAction(act.key)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-200 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/50 text-[11px] font-medium text-slate-800 hover:text-indigo-700 transition-colors cursor-pointer"
                >
                  <DoubleSparkleIcon className="w-3 h-3 text-indigo-600" />
                  {act.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
