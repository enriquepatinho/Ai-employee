/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Code2,
  Lock,
  Mic,
  Paperclip,
  Plus,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  ChatConversation,
  ConversationTurn,
} from './components/ChatConversation';
import {
  ConnectedToolsPanel,
  EmbedModal,
  FilesPanel,
  RecentActivityPanel,
  RecurringTasksPanel,
} from './components/ContextualPanels';
import {
  BooksFilesIcon,
  CalendarClockIcon,
  ChatBubblesIcon,
  ClockOutlineIcon,
  CrossedToolsIcon,
  DocFileIcon,
  DoorExitIcon,
  DoubleSparkleIcon,
  FourPointStar,
  OrgHierarchyIcon,
  PlugIntegrationIcon,
  RepeatArrowsIcon,
  SidebarToggleIcon,
} from './components/Icons';
import {
  ActionKey,
  ActivityLogItem,
  DEMO_RESPONSES,
  DemoFile,
  EMPLOYEES,
  EmployeeProfile,
  INITIAL_ACTIVITY_LOG,
  INITIAL_FILES,
  INITIAL_RECURRING_TASKS,
  LOCKED_EMPLOYEE,
  RecurringTaskItem,
  SUGGESTED_ACTIONS,
  USER_PROFILE,
  matchIntentToAction,
} from './data/demoData';

type ActiveOverlay =
  | 'none'
  | 'recurring-tasks'
  | 'files'
  | 'recent-activity'
  | 'connected-tools';

type PreviewWidthMode = 'hero-640' | 'compact-540' | 'expanded';

export default function App() {
  const isIframeEmbed =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('embed') === 'true';

  // Preview width mode for testing the 500–650px hero embed target vs fluid width
  const [widthMode, setWidthMode] = useState<PreviewWidthMode>('hero-640');
  const [showEmbedModal, setShowEmbedModal] = useState(false);

  // Core application state
  const [selectedEmployeeId, setSelectedEmployeeId] =
    useState<EmployeeProfile['id']>('johnny');
  const [employeePopoverOpen, setEmployeePopoverOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedEmployeeSidebar, setExpandedEmployeeSidebar] = useState<
     EmployeeProfile['id'] | null
  >('johnny');
  const [showAllChats, setShowAllChats] = useState(false);

  // Conversation & Composer state
  const [currentTurn, setCurrentTurn] = useState<ConversationTurn | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStepIndex, setProcessingStepIndex] = useState(0);
  const [composerText, setComposerText] = useState('');
  const [attachedSampleFile, setAttachedSampleFile] = useState<string | null>(
    null
  );

  // Contextual panels state
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>('none');
  const [recurringTasks, setRecurringTasks] = useState<RecurringTaskItem[]>(
    INITIAL_RECURRING_TASKS
  );
  const [files] = useState<DemoFile[]>(INITIAL_FILES);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [activityLog, setActivityLog] =
    useState<ActivityLogItem[]>(INITIAL_ACTIVITY_LOG);

  // Subtle inline notice toast for secondary sidebar interactions
  const [inlineToast, setInlineToast] = useState<string | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);
  const composerInputRef = useRef<HTMLInputElement>(null);
  const stepTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);

  const activeEmployee =
    EMPLOYEES.find((e) => e.id === selectedEmployeeId) || EMPLOYEES[0];

  // Close employee dropdown popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setEmployeePopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (stepTimerRef.current) window.clearInterval(stepTimerRef.current);
      if (finishTimerRef.current) window.clearTimeout(finishTimerRef.current);
    };
  }, []);

  const showToast = (msg: string) => {
    setInlineToast(msg);
    window.setTimeout(() => {
      setInlineToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const triggerActionFlow = (
    actionKey: ActionKey | null,
    customUserPrompt?: string,
    attachmentName?: string | null
  ) => {
    if (stepTimerRef.current) window.clearInterval(stepTimerRef.current);
    if (finishTimerRef.current) window.clearTimeout(finishTimerRef.current);

    setActiveOverlay('none');
    setEmployeePopoverOpen(false);

    const promptText =
      customUserPrompt ||
      (actionKey ? DEMO_RESPONSES[actionKey].userPrompt : '');

    const newTurn: ConversationTurn = {
      id: `turn-${Date.now()}`,
      userMessage: promptText,
      matchedAction: actionKey,
      attachedSampleFile: attachmentName || null,
    };

    setCurrentTurn(newTurn);
    setIsProcessing(true);
    setProcessingStepIndex(0);

    stepTimerRef.current = window.setInterval(() => {
      setProcessingStepIndex((prev) => prev + 1);
    }, 320);

    finishTimerRef.current = window.setTimeout(() => {
      if (stepTimerRef.current) window.clearInterval(stepTimerRef.current);
      setIsProcessing(false);

      // Log completed action to Recent Activity if it matched a workflow
      if (actionKey) {
        const resp = DEMO_RESPONSES[actionKey];
        const newAct: ActivityLogItem = {
          id: `act-${Date.now()}`,
          title: resp.headline,
          detail: `Completed interactive demo run for "${resp.label}".`,
          timestamp: 'Just now',
          duration: '1.0s',
          tool: activeEmployee.role,
          status: 'Completed',
          actionKey,
        };
        setActivityLog((prev) => [newAct, ...prev.slice(0, 6)]);
      }
    }, 850);
  };

  const handleSuggestedActionClick = (actionKey: ActionKey) => {
    const actionObj = SUGGESTED_ACTIONS.find((a) => a.key === actionKey);
    triggerActionFlow(actionKey, actionObj?.label, attachedSampleFile);
    setAttachedSampleFile(null);
  };

  const handleComposerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = composerText.trim();
    if (!trimmed) return;

    const matchedKey = matchIntentToAction(trimmed);
    triggerActionFlow(matchedKey, trimmed, attachedSampleFile);
    setComposerText('');
    setAttachedSampleFile(null);
  };

  const handleResetDemo = () => {
    if (stepTimerRef.current) window.clearInterval(stepTimerRef.current);
    if (finishTimerRef.current) window.clearTimeout(finishTimerRef.current);
    setIsProcessing(false);
    setCurrentTurn(null);
    setActiveOverlay('none');
    setSelectedFileId(null);
    setComposerText('');
    setAttachedSampleFile(null);
    setEmployeePopoverOpen(false);
  };

  const handleSelectEmployee = (empId: EmployeeProfile['id']) => {
    setSelectedEmployeeId(empId);
    setExpandedEmployeeSidebar(empId);
    setEmployeePopoverOpen(false);
    const emp = EMPLOYEES.find((e) => e.id === empId);
    if (emp) {
      showToast(`Switched active AI Employee to ${emp.name} (${emp.role})`);
    }
  };

  const handleToggleRecurringTask = (taskId: string) => {
    setRecurringTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleOpenFilePreview = (fileId: string) => {
    setSelectedFileId(fileId);
    setActiveOverlay('files');
  };

  const handleSampleAttachmentToggle = () => {
    if (attachedSampleFile) {
      setAttachedSampleFile(null);
      showToast('Removed sample attachment');
    } else {
      setAttachedSampleFile('Target_Accounts_Q4_Sample.csv');
      composerInputRef.current?.focus();
    }
  };

  const handleSimulateVoiceInput = () => {
    const prompts = [
      'Research competitors and compare Q4 pricing changes',
      'Generate a report on Q3 sales research pipeline attribution',
      'Summarize my week across HubSpot updates and buying signals',
    ];
    const nextPrompt =
      prompts[Math.floor(Math.random() * prompts.length)];
    setComposerText(nextPrompt);
    composerInputRef.current?.focus();
    showToast('Simulated voice transcription filled in composer');
  };

  const containerMaxWidthClass = isIframeEmbed
    ? 'w-full max-w-full'
    : widthMode === 'compact-540'
    ? 'w-full max-w-[540px]'
    : widthMode === 'hero-640'
    ? 'w-full max-w-[650px]'
    : 'w-full max-w-[960px]';

  const isCompactWidth =
    !isIframeEmbed && (widthMode === 'compact-540' || widthMode === 'hero-640');

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        isIframeEmbed ? 'p-0 bg-transparent' : 'p-3 sm:p-5 bg-[#F4F6F9]'
      }`}
    >
      {/* Subtle Preview & Embed Control Bar (Hidden when ?embed=true) */}
      {!isIframeEmbed && (
        <div
          className={`${containerMaxWidthClass} mb-2.5 flex flex-wrap items-center justify-between gap-2 px-1 transition-all duration-200`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-800 tracking-tight">
              PHOS AI Employees
            </span>
            <span className="text-slate-300" aria-hidden="true">
              ·
            </span>
            <span className="text-[11px] text-slate-500">
              Interactive Hero Section Embed
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Viewport Width Switcher to test 500–650px Hero Region vs Expanded */}
            <div
              className="inline-flex items-center bg-slate-200/75 p-0.5 rounded-lg text-[11px]"
              role="group"
              aria-label="Preview container width"
            >
              <button
                type="button"
                onClick={() => setWidthMode('compact-540')}
                className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  widthMode === 'compact-540'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                540px
              </button>
              <button
                type="button"
                onClick={() => setWidthMode('hero-640')}
                className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  widthMode === 'hero-640'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                650px Hero
              </button>
              <button
                type="button"
                onClick={() => setWidthMode('expanded')}
                className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  widthMode === 'expanded'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Expanded
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetDemo}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer whitespace-nowrap"
              title="Reset interactive demo"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>

            <button
              type="button"
              onClick={() => setShowEmbedModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              <Code2 className="w-3 h-3" />
              Embed Code
            </button>
          </div>
        </div>
      )}

      {/* Main Self-Contained AI Employees Application Frame */}
      <div
        className={`${containerMaxWidthClass} bg-[#FAFAFA] border border-[#E4E7EC] rounded-2xl shadow-[0_12px_36px_-10px_rgba(15,23,42,0.08)] flex overflow-hidden transition-all duration-200 select-none`}
        style={{
          height: isIframeEmbed ? '100vh' : isCompactWidth ? '605px' : '650px',
        }}
      >
        {/* LEFT SIDEBAR */}
        <aside
          className={`${
            sidebarCollapsed
              ? 'w-12 px-1.5'
              : isCompactWidth
              ? 'w-[168px] px-2.5'
              : 'w-[210px] px-3'
          } py-3 bg-[#FAFAFA] flex flex-col justify-between shrink-0 transition-all duration-150 overflow-y-auto phos-embed-scroll`}
          aria-label="AI Employees Navigation"
        >
          <div className="space-y-3">
            {/* Top Brand Row: AI Employee + Collapse Icon */}
            <div className="flex items-center justify-between px-0.5">
              <button
                type="button"
                onClick={handleResetDemo}
                className="flex items-center gap-2 text-left cursor-pointer group min-w-0"
              >
                <div className="w-6 h-6 rounded-lg bg-[#1D6AE5] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#1557C0] transition-colors">
                  <FourPointStar className="w-3.5 h-3.5" />
                </div>
                {!sidebarCollapsed && (
                  <span className="text-[13px] font-semibold text-slate-900 tracking-tight truncate">
                    AI Employee
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer shrink-0"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-label={
                  sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                }
              >
                <SidebarToggleIcon className="w-4 h-4" />
              </button>
            </div>

            {/* + New Chat Primary Pill Button */}
            <button
              type="button"
              onClick={handleResetDemo}
              className={`w-full bg-[#1D6AE5] hover:bg-[#1659C7] active:bg-[#1249A6] text-white font-medium rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer ${
                sidebarCollapsed ? 'py-2 px-0' : 'py-1.5 px-3 text-[11.5px]'
              }`}
              title="Start a new chat"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
              {!sidebarCollapsed && (
                <span className="whitespace-nowrap">New Chat</span>
              )}
            </button>

            {/* FEATURES Section */}
            <div className="space-y-0.5">
              {!sidebarCollapsed && (
                <div className="px-1.5 pb-1 text-[9.5px] font-semibold tracking-wider text-slate-400 uppercase">
                  Features
                </div>
              )}
              <button
                type="button"
                onClick={() => setActiveOverlay('none')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11.5px] font-medium transition-colors cursor-pointer ${
                  activeOverlay === 'none'
                    ? 'text-slate-900 bg-slate-200/55'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                }`}
                title="Chat"
              >
                <ChatBubblesIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">Chat</span>}
              </button>

              <button
                type="button"
                onClick={() => setActiveOverlay('recurring-tasks')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11.5px] font-medium transition-colors cursor-pointer ${
                  activeOverlay === 'recurring-tasks'
                    ? 'text-indigo-700 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                }`}
                title="Scheduled Tasks"
              >
                <CalendarClockIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {!sidebarCollapsed && (
                  <span className="truncate">Scheduled Tasks</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedFileId(null);
                  setActiveOverlay('files');
                }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11.5px] font-medium transition-colors cursor-pointer ${
                  activeOverlay === 'files'
                    ? 'text-indigo-700 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                }`}
                title="Files"
              >
                <BooksFilesIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">Files</span>}
              </button>
            </div>

            {/* EMPLOYEES Section */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-1.5 pb-0.5 text-[9.5px] font-semibold tracking-wider text-slate-400 uppercase">
                  Employees
                </div>
              )}

              {EMPLOYEES.map((emp) => {
                const isSelected = emp.id === selectedEmployeeId;
                const isExpanded =
                  expandedEmployeeSidebar === emp.id && !sidebarCollapsed;
                const visibleChats = showAllChats
                  ? emp.recentChats
                  : emp.recentChats.slice(0, 3);

                return (
                  <div
                    key={emp.id}
                    className={`rounded-xl transition-colors ${
                      isSelected ? 'bg-[#EEF5FF] p-1.5' : 'px-1 py-0.5'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setExpandedEmployeeSidebar(
                            isExpanded ? null : emp.id
                          );
                        } else {
                          handleSelectEmployee(emp.id);
                        }
                      }}
                      className="w-full flex items-center justify-between gap-1.5 text-left cursor-pointer rounded-lg p-0.5"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover shrink-0 border border-white shadow-2xs"
                        />
                        {!sidebarCollapsed && (
                          <div className="min-w-0">
                            <div className="text-[11.5px] font-semibold text-slate-900 leading-tight truncate">
                              {emp.name}
                            </div>
                            <div className="text-[10px] text-slate-500 leading-tight truncate">
                              {emp.role}
                            </div>
                          </div>
                        )}
                      </div>

                      {!sidebarCollapsed && (
                        <div className="flex items-center gap-1 shrink-0">
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-emerald-600"
                            title="Online"
                          />
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          )}
                        </div>
                      )}
                    </button>

                    {/* Nested Recent Chats under active employee */}
                    {isExpanded && (
                      <div className="mt-1.5 space-y-0.5 pl-1">
                        {visibleChats.map((chat, idx) => {
                          const isChatActive =
                            currentTurn?.matchedAction === chat.actionKey ||
                            (!currentTurn && idx === 0 && emp.id === 'johnny');
                          return (
                            <button
                              key={chat.id}
                              type="button"
                              onClick={() =>
                                triggerActionFlow(chat.actionKey, chat.title)
                              }
                              className={`w-full text-left px-2 py-1 rounded-lg text-[10.5px] truncate transition-colors cursor-pointer ${
                                isChatActive
                                  ? 'bg-[#E1EEFF] text-[#1D6AE5] font-medium'
                                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                              }`}
                              title={chat.title}
                            >
                              {chat.title}
                            </button>
                          );
                        })}

                        {emp.recentChats.length > 3 && (
                          <button
                            type="button"
                            onClick={() => setShowAllChats((prev) => !prev)}
                            className="w-full flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-[#1D6AE5] hover:underline cursor-pointer"
                          >
                            <span>
                              {showAllChats ? 'Show less' : 'View all chats'}
                            </span>
                            <ChevronDown
                              className={`w-2.5 h-2.5 transition-transform ${
                                showAllChats ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Locked Employee Card (John) */}
              {!sidebarCollapsed && (
                <div className="mt-1.5 border border-slate-200/90 rounded-xl p-1.5 bg-white flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <img
                      src={LOCKED_EMPLOYEE.avatar}
                      alt={LOCKED_EMPLOYEE.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover shrink-0 opacity-85"
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-slate-800 leading-tight truncate">
                        {LOCKED_EMPLOYEE.name}
                      </div>
                      <div className="flex items-center gap-0.5 text-[9px] text-slate-400 truncate">
                        <Lock className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{LOCKED_EMPLOYEE.note}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        'Demo preview: Additional AI Employees can be added on the PHOS Growth plan.'
                      )
                    }
                    className="text-[9.5px] font-semibold text-[#1D6AE5] hover:underline shrink-0 cursor-pointer"
                  >
                    Get employee
                  </button>
                </div>
              )}
            </div>

            {/* MANAGE Section */}
            <div className="space-y-0.5">
              {!sidebarCollapsed && (
                <div className="px-1.5 pb-0.5 text-[9.5px] font-semibold tracking-wider text-slate-400 uppercase">
                  Manage
                </div>
              )}
              <button
                type="button"
                onClick={() => setActiveOverlay('connected-tools')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11.5px] font-medium transition-colors cursor-pointer ${
                  activeOverlay === 'connected-tools'
                    ? 'text-indigo-700 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                }`}
                title="Integrations"
              >
                <PlugIntegrationIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {!sidebarCollapsed && (
                  <span className="truncate">Integrations</span>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  showToast(
                    'Organization Workspace: LowCode Agency (3 active AI Employees · Demo Mode)'
                  )
                }
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11.5px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/40 transition-colors cursor-pointer"
                title="Organization"
              >
                <OrgHierarchyIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {!sidebarCollapsed && (
                  <span className="truncate">Organization</span>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Support & User Profile Footer */}
          <div className="space-y-2 pt-3">
            {!sidebarCollapsed && !isCompactWidth && (
              <div className="border border-slate-200/90 rounded-xl p-2.5 bg-white space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-900">
                  Need something changed?
                </div>
                <p className="text-[10px] text-slate-500 leading-snug">
                  Request a new capability, report an issue, or ask for help.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      'Guided Demo: In the full PHOS platform, this opens priority engineering support.'
                    )
                  }
                  className="w-full py-1 px-2 border border-slate-200 hover:border-slate-300 rounded-full text-[10.5px] font-medium text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Contact support
                </button>
              </div>
            )}

            {/* User Profile Pill */}
            <div className="border border-slate-200/90 rounded-xl p-1.5 bg-white flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <img
                  src={USER_PROFILE.avatar}
                  alt={USER_PROFILE.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                />
                {!sidebarCollapsed && (
                  <div className="min-w-0">
                    <div className="text-[10.5px] font-semibold text-slate-900 leading-tight truncate">
                      {USER_PROFILE.name}
                    </div>
                    <div className="text-[9.5px] text-slate-400 leading-tight truncate">
                      {USER_PROFILE.email}
                    </div>
                  </div>
                )}
              </div>
              {!sidebarCollapsed && (
                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer shrink-0"
                  title="Reset demo session"
                  aria-label="Reset demo session"
                >
                  <DoorExitIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN WORKSPACE CARD */}
        <main className="flex-1 bg-white my-1.5 mr-1.5 border border-[#E6E8EC] rounded-xl flex flex-col overflow-hidden relative">
          {/* TOP BAR */}
          <header className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0 relative z-20">
            {/* Employee Selector Dropdown Trigger + Popover */}
            <div className="relative" ref={popoverRef}>
              <button
                type="button"
                onClick={() => setEmployeePopoverOpen((prev) => !prev)}
                aria-expanded={employeePopoverOpen}
                aria-haspopup="listbox"
                className="inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/70 transition-colors cursor-pointer shadow-2xs"
              >
                <span className="w-4 h-4 rounded-full bg-[#E1EEFF] text-[#1D6AE5] text-[10px] font-bold flex items-center justify-center shrink-0">
                  {activeEmployee.initial}
                </span>
                <span className="text-[11.5px] font-semibold text-slate-900 whitespace-nowrap">
                  {activeEmployee.name}
                </span>
                <span className="text-slate-300 text-xs">-</span>
                <span className="text-[11px] text-slate-500 whitespace-nowrap">
                  {activeEmployee.role}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-150 ${
                    employeePopoverOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Employee Selection Popover (Matches Screenshot) */}
              {employeePopoverOpen && (
                <div
                  role="listbox"
                  aria-label="Select AI Employee"
                  className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200/90 rounded-2xl shadow-lg p-1.5 space-y-0.5 z-30 animate-in fade-in zoom-in-95 duration-120"
                >
                  {EMPLOYEES.map((emp) => {
                    const isSelected = emp.id === selectedEmployeeId;
                    return (
                      <button
                        key={emp.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelectEmployee(emp.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#EEF5FF]'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded-full object-cover shrink-0 border border-white shadow-2xs"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-900 leading-tight truncate">
                              {emp.name}
                            </div>
                            <div className="text-[10.5px] text-slate-500 leading-tight truncate">
                              {emp.role}
                            </div>
                          </div>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Top Bar Controls: Subtle Interactive Demo Indicator + Connected Tools + Files */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className="hidden sm:inline-flex items-center text-[10px] font-medium text-slate-400 px-1.5 select-none"
                title="Self-contained interactive product preview with fictional sample data"
              >
                Interactive Demo
              </span>

              <button
                type="button"
                onClick={() =>
                  setActiveOverlay((prev) =>
                    prev === 'connected-tools' ? 'none' : 'connected-tools'
                  )
                }
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeOverlay === 'connected-tools'
                    ? 'border-indigo-300 bg-indigo-50/70 text-indigo-700'
                    : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-800'
                }`}
              >
                <CrossedToolsIcon className="w-3.5 h-3.5 text-slate-600" />
                <span>Connected Tools</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedFileId(null);
                  setActiveOverlay((prev) =>
                    prev === 'files' ? 'none' : 'files'
                  );
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeOverlay === 'files'
                    ? 'border-indigo-300 bg-indigo-50/70 text-indigo-700'
                    : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-800'
                }`}
              >
                <DocFileIcon className="w-3.5 h-3.5 text-slate-600" />
                <span>Files</span>
              </button>
            </div>
          </header>

          {/* Subtle Inline Feedback Toast */}
          {inlineToast && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 text-white text-[11px] px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 animate-in fade-in duration-150">
              <span>{inlineToast}</span>
              <button
                type="button"
                onClick={() => setInlineToast(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* MAIN WORKSPACE CONTENT OR CONTEXTUAL OVERLAY */}
          {activeOverlay === 'recurring-tasks' ? (
            <div className="flex-1 overflow-hidden">
              <RecurringTasksPanel
                tasks={recurringTasks}
                onToggleTask={handleToggleRecurringTask}
                onRunTask={(actionKey, title) =>
                  triggerActionFlow(actionKey, `Run scheduled task: ${title}`)
                }
                onClose={() => setActiveOverlay('none')}
              />
            </div>
          ) : activeOverlay === 'files' ? (
            <div className="flex-1 overflow-hidden">
              <FilesPanel
                files={files}
                selectedFileId={selectedFileId}
                onSelectFile={setSelectedFileId}
                onRunRelatedAction={(actionKey) =>
                  triggerActionFlow(actionKey)
                }
                onClose={() => setActiveOverlay('none')}
              />
            </div>
          ) : activeOverlay === 'recent-activity' ? (
            <div className="flex-1 overflow-hidden">
              <RecentActivityPanel
                activities={activityLog}
                onInspectActivity={(actionKey) =>
                  triggerActionFlow(actionKey)
                }
                onClose={() => setActiveOverlay('none')}
              />
            </div>
          ) : activeOverlay === 'connected-tools' ? (
            <div className="flex-1 overflow-hidden">
              <ConnectedToolsPanel onClose={() => setActiveOverlay('none')} />
            </div>
          ) : (
            /* DEFAULT CHAT & DASHBOARD VIEW */
            <div className="flex-1 overflow-y-auto phos-embed-scroll px-4 py-3 flex flex-col justify-between gap-3">
              {/* Top / Center Welcome or Active Conversation */}
              {!currentTurn ? (
                <div className="my-auto pt-1 flex flex-col items-center text-center">
                  {/* Animated 3D Astronaut Mascot Video with non-cropping rounded frame */}
                  <div
                    className={`${
                      isCompactWidth ? 'w-[76px]' : 'w-[88px]'
                    } rounded-[20px] overflow-hidden bg-[#EDF3FC] border border-slate-200/70 shadow-[0_4px_14px_rgba(15,23,42,0.05)] mb-2.5 p-0.5 select-none shrink-0`}
                  >
                    <video
                      src="/assets/aistudio/magnific_w4TN61T7EI_5418c344.mp4"
                      poster={activeEmployee.mascot}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-auto block rounded-[17px] object-contain"
                    />
                  </div>

                  <h1
                    className={`${
                      isCompactWidth
                        ? 'text-[17px] leading-snug'
                        : 'text-xl leading-snug'
                    } font-semibold text-slate-900 tracking-tight text-balance`}
                  >
                    Good Morning, {USER_PROFILE.firstName}.
                    <br />
                    How Can I{' '}
                    <span className="text-[#1D6AE5]">Assist You Today?</span>
                  </h1>

                  <p className="text-[11.5px] text-slate-500 mt-1 mb-3">
                    {activeEmployee.greetingSubtext}
                  </p>

                  {/* Three Suggested Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {SUGGESTED_ACTIONS.map((action) => (
                      <button
                        key={action.key}
                        type="button"
                        onClick={() => handleSuggestedActionClick(action.key)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/90 hover:border-[#4F46E5] bg-white hover:bg-indigo-50/40 text-[11px] font-medium text-slate-700 hover:text-[#4F46E5] shadow-2xs transition-all duration-150 cursor-pointer whitespace-nowrap"
                      >
                        <DoubleSparkleIcon className="w-3.5 h-3.5 text-slate-500" />
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <ChatConversation
                    employee={activeEmployee}
                    turn={currentTurn}
                    isProcessing={isProcessing}
                    processingStepIndex={processingStepIndex}
                    files={files}
                    onTriggerAction={handleSuggestedActionClick}
                    onOpenFilePreview={handleOpenFilePreview}
                    onReset={handleResetDemo}
                  />
                </div>
              )}

              {/* Bottom Composer + 3 Contextual Cards */}
              <div className="space-y-2.5 shrink-0">
                {/* Message Composer Box */}
                <form
                  onSubmit={handleComposerSubmit}
                  className="border border-slate-200/90 focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-indigo-500/10 rounded-2xl p-2.5 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-all"
                >
                  <div className="flex items-center gap-2 px-1">
                    <FourPointStar className="w-3.5 h-3.5 text-[#1D6AE5] shrink-0" />
                    <input
                      ref={composerInputRef}
                      type="text"
                      value={composerText}
                      onChange={(e) => setComposerText(e.target.value)}
                      placeholder={activeEmployee.composerPlaceholder}
                      aria-label={activeEmployee.composerPlaceholder}
                      className="w-full text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                    />
                  </div>

                  {/* Attached sample file badge if active */}
                  {attachedSampleFile && (
                    <div className="mt-2 ml-5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/80 text-[10.5px] font-mono text-indigo-800">
                      <span>{attachedSampleFile}</span>
                      <button
                        type="button"
                        onClick={() => setAttachedSampleFile(null)}
                        className="text-indigo-500 hover:text-indigo-800 cursor-pointer"
                        aria-label="Remove sample file"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-0.5">
                    <button
                      type="button"
                      onClick={handleSampleAttachmentToggle}
                      title="Attach sample target accounts CSV"
                      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full border text-slate-600 transition-colors cursor-pointer ${
                        attachedSampleFile
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                          : 'bg-slate-50/90 hover:bg-slate-100 border-slate-200/80'
                      }`}
                      aria-label="Attach sample file"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleSimulateVoiceInput}
                        title="Simulate voice task dictation"
                        aria-label="Simulate voice task dictation"
                        className="w-7 h-7 rounded-full border border-slate-200/90 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="submit"
                        disabled={!composerText.trim() && !attachedSampleFile}
                        title="Send task to Johnny"
                        aria-label="Send message"
                        className="w-7 h-7 rounded-full bg-[#1D6AE5] hover:bg-[#1557C0] disabled:opacity-45 disabled:hover:bg-[#1D6AE5] text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                      >
                        <ArrowUp className="w-3.5 h-3.5 stroke-[2.25]" />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Bottom 3 Contextual Cards (Recurring Tasks, Files, Recent Activity) */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Card 1: Recurring Tasks */}
                  <button
                    type="button"
                    onClick={() => setActiveOverlay('recurring-tasks')}
                    className="text-left border border-slate-200/85 hover:border-slate-300 rounded-xl p-2.5 bg-white hover:bg-slate-50/60 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-1 w-full mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <RepeatArrowsIcon className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                        <span className="text-[11px] font-semibold text-slate-900 truncate">
                          Recurring Tasks
                        </span>
                      </div>
                      <span className="text-[9.5px] font-medium text-[#1D6AE5] group-hover:underline whitespace-nowrap shrink-0">
                        View tasks
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                      Automate work that {activeEmployee.name} should run on a
                      schedule.
                    </p>
                  </button>

                  {/* Card 2: Files */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFileId(null);
                      setActiveOverlay('files');
                    }}
                    className="text-left border border-slate-200/85 hover:border-slate-300 rounded-xl p-2.5 bg-white hover:bg-slate-50/60 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-1 w-full mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <DocFileIcon className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                        <span className="text-[11px] font-semibold text-slate-900 truncate">
                          Files
                        </span>
                      </div>
                      <span className="text-[9.5px] font-medium text-[#1D6AE5] group-hover:underline whitespace-nowrap shrink-0">
                        Browse files
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                      View reports, documents and files created by your
                      employees.
                    </p>
                  </button>

                  {/* Card 3: Recent Activity */}
                  <button
                    type="button"
                    onClick={() => setActiveOverlay('recent-activity')}
                    className="text-left border border-slate-200/85 hover:border-slate-300 rounded-xl p-2.5 bg-white hover:bg-slate-50/60 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-1 w-full mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <ClockOutlineIcon className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                        <span className="text-[11px] font-semibold text-slate-900 truncate">
                          Recent Activity
                        </span>
                      </div>
                      <span className="text-[9.5px] font-medium text-[#1D6AE5] group-hover:underline whitespace-nowrap shrink-0">
                        View activity
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                      See what {activeEmployee.name} has recently completed or
                      worked on.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Embed Code / Standalone HTML Export Modal */}
      {showEmbedModal && (
        <EmbedModal onClose={() => setShowEmbedModal(false)} />
      )}
    </div>
  );
}
