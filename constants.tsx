import { ClientStatus, ProjectStatus, ServiceOption, Client, Project } from './types';

export const INITIAL_SERVICES: ServiceOption[] = [
  { id: 'srv_1', name: 'SEO & Website Marketing', description: 'Comprehensive SEO audit, keyword strategy, and website optimization.', priceEstimate: 2500 },
  { id: 'srv_2', name: 'Custom Website Development', description: 'High-performance React/Next.js websites.', priceEstimate: 5000 },
  { id: 'srv_3', name: 'Social Media Management', description: 'Content creation and community management for IG/LinkedIn.', priceEstimate: 1200 },
  { id: 'srv_4', name: 'Custom CRM & Tools', description: 'Tailored internal software solutions.', priceEstimate: 8000 },
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c_1',
    name: 'John Doe',
    company: 'Acme Construction',
    industry: 'Construction',
    email: 'john@acme.com',
    phone: '555-0123',
    website: 'https://acme-const.com',
    projectNotes: 'Website is very slow, not mobile friendly. Needs a complete redesign and local SEO for "contractors in [City]".',
    status: ClientStatus.LEAD,
    lastContacted: '2023-10-25',
    interestedServices: ['srv_1', 'srv_2'],
    interactions: [
      { id: 'i_1', date: '2023-10-25', type: 'Call', notes: 'Initial intro. Interested in new site.' }
    ]
  },
  {
    id: 'c_2',
    name: 'Jane Smith',
    company: 'TechFlow Inc',
    industry: 'Software',
    email: 'jane@techflow.io',
    phone: '555-9876',
    website: 'https://techflow.io',
    projectNotes: 'Good design but no conversion funnel. Needs landing pages for their new SaaS product.',
    status: ClientStatus.NEGOTIATING,
    lastContacted: '2023-11-01',
    interestedServices: ['srv_4'],
    interactions: []
  },
  {
    id: 'c_3',
    name: 'Robert Brown',
    company: 'Bakery Delights',
    industry: 'Food & Beverage',
    email: 'bob@bakery.com',
    phone: '555-4567',
    website: 'https://bakerydelights.net',
    projectNotes: 'Needs social media setup and a simple online ordering system added to current site.',
    status: ClientStatus.CLOSED,
    lastContacted: '2023-10-20',
    interestedServices: ['srv_3'],
    interactions: []
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p_1',
    clientId: 'c_3',
    title: 'Social Media Launch',
    status: ProjectStatus.IN_PROGRESS,
    deadline: '2023-12-15',
    value: 1200,
    description: 'Launch campaign for holiday season.'
  }
];