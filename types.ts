export enum ClientStatus {
  LEAD = 'Lead',
  CONTACTED = 'Contacted',
  NEGOTIATING = 'Negotiating',
  CLOSED = 'Closed',
  LOST = 'Lost'
}

export enum ProjectStatus {
  PLANNING = 'Planning',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  COMPLETED = 'Completed'
}

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  priceEstimate: number;
}

export interface Interaction {
  id: string;
  date: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note';
  notes: string;
}

export interface Client {
  id: string;
  name: string; // Contact Person Name
  company: string; // Business Name from Maps
  industry: string;
  email: string;
  phone: string;
  website: string; // URL from Maps
  projectNotes: string; // "What needs to be done"
  status: ClientStatus;
  lastContacted?: string;
  interestedServices: string[]; // IDs of ServiceOption
  interactions: Interaction[];
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  status: ProjectStatus;
  deadline: string;
  value: number;
  description: string;
}

export type ViewState = 'DASHBOARD' | 'CLIENTS' | 'PROJECTS' | 'SETTINGS';