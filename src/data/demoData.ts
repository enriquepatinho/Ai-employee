import {
  AVATAR_ALEX,
  AVATAR_ENRIQUE,
  AVATAR_JOHN,
  AVATAR_JOHNNY,
  AVATAR_MAYA,
  JOHNNY_MASCOT,
} from '../assets/croppedAssets';

export type ActionKey = 'research-competitors' | 'generate-report' | 'summarize-week';

export interface EmployeeProfile {
  id: 'johnny' | 'maya' | 'alex';
  name: string;
  role: string;
  initial: string;
  avatar: string;
  mascot: string;
  status: 'online';
  greetingSubtext: string;
  composerPlaceholder: string;
  recentChats: {
    id: string;
    title: string;
    actionKey: ActionKey;
    timestamp: string;
  }[];
}

export interface CompetitorRow {
  name: string;
  pricingShift: string;
  keyUpdate: string;
  winAngle: string;
}

export interface ReportSegmentRow {
  segment: string;
  sqls: string;
  replyRate: string;
  pipeline: string;
}

export interface DemoActionResponse {
  key: ActionKey;
  label: string;
  shortLabel: string;
  userPrompt: string;
  processingSteps: string[];
  headline: string;
  subtitle: string;
  summaryText: string;
  metrics?: {
    label: string;
    value: string;
    delta: string;
  }[];
  competitorTable?: CompetitorRow[];
  reportTable?: ReportSegmentRow[];
  highlights?: {
    title: string;
    detail: string;
    tag: string;
  }[];
  takeaway: string;
  generatedFileId: string;
}

export interface DemoFile {
  id: string;
  name: string;
  type: 'PDF' | 'XLSX' | 'CSV' | 'MD';
  size: string;
  updatedAt: string;
  createdBy: string;
  actionKey: ActionKey;
  summary: string;
  previewSections: {
    heading: string;
    body: string[];
  }[];
}

export interface RecurringTaskItem {
  id: string;
  title: string;
  schedule: string;
  nextRun: string;
  channel: string;
  enabled: boolean;
  actionKey: ActionKey;
  description: string;
}

export interface ActivityLogItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  duration: string;
  tool: string;
  status: 'Completed';
  actionKey: ActionKey;
}

export interface ConnectedToolItem {
  id: string;
  name: string;
  category: string;
  status: 'Simulated Connected' | 'Read-Only Demo';
  lastSync: string;
  description: string;
}

export const USER_PROFILE = {
  name: 'Enrique Patinho',
  firstName: 'Enrique',
  email: 'enrique@lowcode.agency',
  avatar: AVATAR_ENRIQUE,
};

export const LOCKED_EMPLOYEE = {
  id: 'john',
  name: 'John',
  role: 'Data Engineering',
  note: 'Not included in your plan',
  avatar: AVATAR_JOHN,
};

export const EMPLOYEES: EmployeeProfile[] = [
  {
    id: 'johnny',
    name: 'Johnny',
    role: 'Sales Research',
    initial: 'J',
    avatar: AVATAR_JOHNNY,
    mascot: JOHNNY_MASCOT,
    status: 'online',
    greetingSubtext: 'Ask a question or give Johnny something to work on.',
    composerPlaceholder: 'Assign Johnny a task...',
    recentChats: [
      {
        id: 'chat-1',
        title: 'Weekly competitor research',
        actionKey: 'research-competitors',
        timestamp: '2h ago',
      },
      {
        id: 'chat-2',
        title: 'Q3 leads report',
        actionKey: 'generate-report',
        timestamp: 'Yesterday',
      },
      {
        id: 'chat-3',
        title: 'Update HubSpot contacts',
        actionKey: 'summarize-week',
        timestamp: 'Nov 8',
      },
      {
        id: 'chat-4',
        title: 'Summarize my week',
        actionKey: 'summarize-week',
        timestamp: 'Nov 6',
      },
    ],
  },
  {
    id: 'maya',
    name: 'Maya',
    role: 'Operations',
    initial: 'M',
    avatar: AVATAR_MAYA,
    mascot: JOHNNY_MASCOT,
    status: 'online',
    greetingSubtext: 'Ask a question or give Maya an operations workflow to run.',
    composerPlaceholder: 'Assign Maya a task...',
    recentChats: [
      {
        id: 'maya-1',
        title: 'Q3 vendor & SLA report',
        actionKey: 'generate-report',
        timestamp: '4h ago',
      },
      {
        id: 'maya-2',
        title: 'Weekly ops summary',
        actionKey: 'summarize-week',
        timestamp: 'Yesterday',
      },
    ],
  },
  {
    id: 'alex',
    name: 'Alex',
    role: 'Marketing',
    initial: 'A',
    avatar: AVATAR_ALEX,
    mascot: JOHNNY_MASCOT,
    status: 'online',
    greetingSubtext: 'Ask a question or give Alex a campaign research task.',
    composerPlaceholder: 'Assign Alex a task...',
    recentChats: [
      {
        id: 'alex-1',
        title: 'Competitor ad messaging audit',
        actionKey: 'research-competitors',
        timestamp: '3h ago',
      },
      {
        id: 'alex-2',
        title: 'Q3 attribution report',
        actionKey: 'generate-report',
        timestamp: '2d ago',
      },
    ],
  },
];

export const SUGGESTED_ACTIONS: {
  key: ActionKey;
  label: string;
}[] = [
  { key: 'research-competitors', label: 'Research competitors' },
  { key: 'generate-report', label: 'Generate a report' },
  { key: 'summarize-week', label: 'Summarize my week' },
];

export const DEMO_RESPONSES: Record<ActionKey, DemoActionResponse> = {
  'research-competitors': {
    key: 'research-competitors',
    label: 'Research competitors',
    shortLabel: 'Competitor Research',
    userPrompt: 'Research competitors and highlight recent pricing or product shifts.',
    processingSteps: [
      'Scanning public pricing pages & release notes (Veloce AI, Kinetix Ops, StrataFlow)...',
      'Cross-referencing 28 recent mid-market buyer reviews & feature matrices...',
      'Synthesizing sales battlecard with fictional benchmark data...',
    ],
    headline: 'Competitor Intelligence Brief — Q4 Update',
    subtitle: 'Fictional sample analysis across 3 tracked category competitors',
    summaryText:
      'I monitored pricing pages, public changelogs, and review sentiment across your top 3 competitors over the past 7 days. Two notable pricing and positioning shifts require sales team awareness:',
    competitorTable: [
      {
        name: 'Veloce AI',
        pricingShift: '$490 → $650/mo (+32%)',
        keyUpdate: 'Added SOC2 export; gated API webhooks behind Enterprise tier',
        winAngle: 'Lead with transparent webhook access & faster onboarding',
      },
      {
        name: 'Kinetix Ops',
        pricingShift: 'Removed free sandbox',
        keyUpdate: 'Repositioned homepage around "Autonomous RevOps Agents"',
        winAngle: 'Highlight PHOS interactive proof-of-value before contract',
      },
      {
        name: 'StrataFlow',
        pricingShift: 'Unchanged ($520/mo)',
        keyUpdate: 'Launched HubSpot bi-directional sync (beta); lacks custom RBAC',
        winAngle: 'Emphasize enterprise role permissions & audit logs',
      },
    ],
    takeaway:
      'Recommended action: Update the Veloce AI objection-handling snippet in HubSpot playbooks to emphasize our included webhook automation (saves mid-market buyers ~$1,920/yr).',
    generatedFileId: 'file-competitor-battlecard',
  },
  'generate-report': {
    key: 'generate-report',
    label: 'Generate a report',
    shortLabel: 'Q3 Pipeline Report',
    userPrompt: 'Generate a report on Q3 sales research attribution and outbound performance.',
    processingSteps: [
      'Aggregating fictional Q3 outbound sequence metrics & CRM deal stages...',
      'Calculating conversion velocity across 412 researched accounts...',
      'Formatting executive table & exporting spreadsheet artifact...',
    ],
    headline: 'Q3 Outbound & Research Attribution Report',
    subtitle: 'Fictional sample dataset · 412 enriched target accounts analyzed',
    summaryText:
      'Here is the Q3 performance breakdown for accounts enriched with automated sales research prior to AE outreach versus baseline cold sequences:',
    metrics: [
      {
        label: 'Attributed Pipeline',
        value: '$418,500',
        delta: '+24.2% vs Q2',
      },
      {
        label: 'Qualified SQLs',
        value: '142',
        delta: '31.4% conv. rate',
      },
      {
        label: 'AE Prep Saved',
        value: '18.5 hrs/wk',
        delta: 'Across 6 reps',
      },
    ],
    reportTable: [
      {
        segment: 'Mid-Market SaaS (100–500)',
        sqls: '68 SQLs',
        replyRate: '34.8%',
        pipeline: '$214,000',
      },
      {
        segment: 'Enterprise FinTech (500+)',
        sqls: '49 SQLs',
        replyRate: '26.1%',
        pipeline: '$152,500',
      },
      {
        segment: 'Healthcare Operations',
        sqls: '25 SQLs',
        replyRate: '21.9%',
        pipeline: '$52,000',
      },
    ],
    takeaway:
      'Accounts with trigger-based competitor signals converted 2.1x faster than static industry lists. Reallocating 30% of Q4 research capacity to Mid-Market SaaS is projected to add ~$65k in pipeline.',
    generatedFileId: 'file-q3-report',
  },
  'summarize-week': {
    key: 'summarize-week',
    label: 'Summarize my week',
    shortLabel: 'Weekly Summary',
    userPrompt: 'Summarize my week across completed research, CRM updates, and high-intent leads.',
    processingSteps: [
      'Reviewing completed research runs and HubSpot CRM sync logs (Nov 3 – Nov 10)...',
      'Filtering high-intent account signals and pending AE follow-ups...',
    ],
    headline: 'Weekly Sales Research Digest (Nov 3 – Nov 10)',
    subtitle: 'Fictional sample activity summary · 38 accounts enriched · 64 CRM records updated',
    summaryText:
      'Over the last 5 business days, I completed 12 scheduled research runs, updated 64 HubSpot contact records, and surfaced 3 high-priority buying signals for your review:',
    highlights: [
      {
        title: 'Northstar Logistics (ICP Score: 96/100)',
        detail: 'VP of RevOps posted 2 Sales Ops openings + evaluated competitor integration docs. Drafted 3 tailored outreach angles.',
        tag: 'High Intent',
      },
      {
        title: 'Meridian Cloud Systems (ICP Score: 91/100)',
        detail: 'Detected annual contract renewal window with Veloce AI in ~45 days. Decision-maker org chart mapped (4 stakeholders).',
        tag: 'Renewal Window',
      },
      {
        title: 'HubSpot CRM Hygiene & Contact Sync',
        detail: 'Flagged 14 champion job changes, replaced 9 bounced emails, and appended verified direct dials to 41 active Q4 opportunities.',
        tag: 'CRM Synced',
      },
    ],
    takeaway:
      'Monday Priority: Review and approve the 3 personalized outreach briefs for Northstar Logistics before the 9:00 AM sequence window.',
    generatedFileId: 'file-weekly-digest',
  },
};

export const INITIAL_RECURRING_TASKS: RecurringTaskItem[] = [
  {
    id: 'task-1',
    title: 'Weekly Competitor Pricing & Changelog Monitor',
    schedule: 'Every Monday · 08:00 AM EST',
    nextRun: 'Mon, Nov 16 at 8:00 AM',
    channel: 'Slack #sales-intel + PDF',
    enabled: true,
    actionKey: 'research-competitors',
    description: 'Tracks Veloce AI, Kinetix Ops, and StrataFlow for pricing tier edits, new feature launches, and G2 review trends.',
  },
  {
    id: 'task-2',
    title: 'Inbound Lead Enrichment & HubSpot Hygiene',
    schedule: 'Weekdays · 07:30 AM EST',
    nextRun: 'Tomorrow at 7:30 AM',
    channel: 'HubSpot CRM',
    enabled: true,
    actionKey: 'summarize-week',
    description: 'Enriches new MQLs with firmographics, tech stack signals, and verified decision-maker titles before AE routing.',
  },
  {
    id: 'task-3',
    title: 'Q3/Q4 Pipeline Attribution & Sequence Rollup',
    schedule: 'Every Friday · 04:00 PM EST',
    nextRun: 'Fri, Nov 13 at 4:00 PM',
    channel: 'Email + Files Repository',
    enabled: true,
    actionKey: 'generate-report',
    description: 'Generates a tabular breakdown of SQL conversion rates, reply rates by segment, and attributed revenue pipeline.',
  },
  {
    id: 'task-4',
    title: 'Champion Job-Change & Buying Signal Alert',
    schedule: 'Every Wednesday · 09:00 AM EST',
    nextRun: 'Wed, Nov 11 at 9:00 AM',
    channel: 'HubSpot Tasks',
    enabled: false,
    actionKey: 'summarize-week',
    description: 'Monitors closed-won customer champions for executive role moves into new target accounts.',
  },
];

export const INITIAL_FILES: DemoFile[] = [
  {
    id: 'file-competitor-battlecard',
    name: 'Competitor_Battlecard_Q4_Sample.pdf',
    type: 'PDF',
    size: '428 KB',
    updatedAt: 'Today, 09:14 AM',
    createdBy: 'Johnny (Sales Research)',
    actionKey: 'research-competitors',
    summary: 'Side-by-side pricing, feature gating, and objection-handling battlecard for Veloce AI, Kinetix Ops, and StrataFlow.',
    previewSections: [
      {
        heading: '1. Executive Summary (Fictional Demo Data)',
        body: [
          'Veloce AI increased its Enterprise tier pricing by 32% ($490 to $650/mo) and moved webhook automations out of the Pro plan.',
          'Kinetix Ops sunsetted its self-serve sandbox trial in favor of mandatory discovery calls, creating friction for mid-market evaluators.',
        ],
      },
      {
        heading: '2. Recommended Discovery Questions for AEs',
        body: [
          '"Are you currently paying extra for webhook triggers or custom CRM field mappings in your current stack?"',
          '"How important is testing an interactive workflow with your own team before committing to an annual enterprise seat license?"',
        ],
      },
    ],
  },
  {
    id: 'file-q3-report',
    name: 'Q3_Leads_Attribution_Report.xlsx',
    type: 'XLSX',
    size: '1.2 MB',
    updatedAt: 'Yesterday, 04:15 PM',
    createdBy: 'Johnny (Sales Research)',
    actionKey: 'generate-report',
    summary: 'Full Q3 outbound sequence conversion dataset covering 412 researched target accounts and $418.5k in attributed pipeline.',
    previewSections: [
      {
        heading: '1. Q3 Segment Performance Breakdown (Sample Data)',
        body: [
          'Mid-Market SaaS (100–500 employees): 68 SQLs generated · 34.8% positive reply rate · $214,000 qualified pipeline.',
          'Enterprise FinTech (500+ employees): 49 SQLs generated · 26.1% positive reply rate · $152,500 qualified pipeline.',
          'Healthcare Operations: 25 SQLs generated · 21.9% positive reply rate · $52,000 qualified pipeline.',
        ],
      },
      {
        heading: '2. Key Efficiency Findings',
        body: [
          'Automated pre-call dossiers reduced AE manual account prep from 24 minutes per prospect to 3.5 minutes.',
        ],
      },
    ],
  },
  {
    id: 'file-weekly-digest',
    name: 'Weekly_Sales_Digest_Nov10.md',
    type: 'MD',
    size: '96 KB',
    updatedAt: 'Today, 08:00 AM',
    createdBy: 'Johnny (Sales Research)',
    actionKey: 'summarize-week',
    summary: 'Weekly rollup of 38 researched accounts, 64 HubSpot contact updates, and top 3 high-intent buying signals.',
    previewSections: [
      {
        heading: '1. Priority Buying Signals Flagged This Week',
        body: [
          'Northstar Logistics (Score 96/100): Hiring 2 RevOps specialists; VP interacted with pricing comparison page.',
          'Meridian Cloud Systems (Score 91/100): Approaching 45-day renewal window with Veloce AI; 4 decision makers verified.',
        ],
      },
      {
        heading: '2. HubSpot CRM Hygiene Summary',
        body: [
          '64 contact records verified · 14 job changes updated · 9 invalid emails replaced with verified corporate addresses.',
        ],
      },
    ],
  },
  {
    id: 'file-hubspot-batch',
    name: 'HubSpot_Enriched_Contacts_Batch14.csv',
    type: 'CSV',
    size: '312 KB',
    updatedAt: 'Nov 8, 02:30 PM',
    createdBy: 'Johnny (Sales Research)',
    actionKey: 'summarize-week',
    summary: 'CSV export of 64 enriched HubSpot contacts with updated titles, LinkedIn URLs, and buying committee roles.',
    previewSections: [
      {
        heading: 'Sample Enriched Rows (Fictional Data)',
        body: [
          'claire.vance@northstar-demo.io · VP Revenue Operations · Champion · Verified Nov 8',
          'marcus.chen@meridiancloud-demo.com · Director of Sales Systems · Economic Buyer · Verified Nov 8',
          'elena.rostova@aetherbiolabs-demo.org · Head of Commercial IT · Technical Evaluator · Verified Nov 7',
        ],
      },
    ],
  },
];

export const INITIAL_ACTIVITY_LOG: ActivityLogItem[] = [
  {
    id: 'act-1',
    title: 'Compiled Q4 Competitor Pricing Battlecard',
    detail: 'Detected +32% Enterprise tier increase on Veloce AI and updated comparison matrix.',
    timestamp: 'Today · 09:14 AM',
    duration: '14s',
    tool: 'Web Monitor',
    status: 'Completed',
    actionKey: 'research-competitors',
  },
  {
    id: 'act-2',
    title: 'Synced 64 Enriched Contacts to HubSpot',
    detail: 'Flagged 14 champion job changes and appended ICP scores for Northstar Logistics.',
    timestamp: 'Today · 08:02 AM',
    duration: '9s',
    tool: 'HubSpot CRM',
    status: 'Completed',
    actionKey: 'summarize-week',
  },
  {
    id: 'act-3',
    title: 'Generated Q3 Outbound Attribution Report',
    detail: 'Analyzed 412 target accounts ($418.5k pipeline, 142 SQLs) and exported XLSX summary.',
    timestamp: 'Yesterday · 04:15 PM',
    duration: '18s',
    tool: 'Analytics Engine',
    status: 'Completed',
    actionKey: 'generate-report',
  },
  {
    id: 'act-4',
    title: 'Mapped Buying Committee for Meridian Cloud',
    detail: 'Identified 4 stakeholders ahead of upcoming Q4 renewal window.',
    timestamp: 'Nov 8 · 11:20 AM',
    duration: '11s',
    tool: 'Sales Research',
    status: 'Completed',
    actionKey: 'summarize-week',
  },
];

export const CONNECTED_TOOLS: ConnectedToolItem[] = [
  {
    id: 'tool-hubspot',
    name: 'HubSpot CRM',
    category: 'CRM & Pipeline',
    status: 'Simulated Connected',
    lastSync: '12 mins ago',
    description: 'Reads sample deal stages and writes enriched contact fields in demo sandbox.',
  },
  {
    id: 'tool-web',
    name: 'Competitor Changelog Monitor',
    category: 'Market Intelligence',
    status: 'Simulated Connected',
    lastSync: '1 hr ago',
    description: 'Tracks public pricing pages, release notes, and G2 category sentiment.',
  },
  {
    id: 'tool-sheets',
    name: 'Workspace Reports & Sheets',
    category: 'Document Export',
    status: 'Read-Only Demo',
    lastSync: 'Today, 08:00 AM',
    description: 'Formats structured PDF battlecards, XLSX pipeline tables, and weekly digests.',
  },
  {
    id: 'tool-slack',
    name: 'Slack #sales-intel',
    category: 'Team Alerts',
    status: 'Read-Only Demo',
    lastSync: 'Today, 09:14 AM',
    description: 'Posts instant buying-signal alerts and Monday morning research summaries.',
  },
];

/**
 * Matches freeform user input in the composer to one of the 3 deterministic demo actions,
 * or returns null so the guided demo fallback message is shown.
 */
export function matchIntentToAction(input: string): ActionKey | null {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;

  if (
    normalized.includes('competitor') ||
    normalized.includes('research') ||
    normalized.includes('rival') ||
    normalized.includes('battlecard') ||
    normalized.includes('pricing') ||
    normalized.includes('veloce') ||
    normalized.includes('kinetix')
  ) {
    return 'research-competitors';
  }

  if (
    normalized.includes('report') ||
    normalized.includes('q3') ||
    normalized.includes('lead') ||
    normalized.includes('pipeline') ||
    normalized.includes('analyze') ||
    normalized.includes('create a report') ||
    normalized.includes('generate') ||
    normalized.includes('metric')
  ) {
    return 'generate-report';
  }

  if (
    normalized.includes('summarize') ||
    normalized.includes('week') ||
    normalized.includes('hubspot') ||
    normalized.includes('contact') ||
    normalized.includes('digest') ||
    normalized.includes('update') ||
    normalized.includes('activity')
  ) {
    return 'summarize-week';
  }

  return null;
}
