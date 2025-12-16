export interface Tutor {
  id: string;
  address: string;
  name: string;
  subject: string;
  hourlyRate: number; // in ETH
  rating: number;
  totalSessions: number;
  verified: boolean;
  bio: string;
  avatar: string;
}

export interface Student {
  email: string;
  name: string;
  address: string;
}

export interface TutorUser extends Student {
  subject: string;
  hourlyRate: number;
  rating: number;
  totalSessions: number;
  verified: boolean;
  bio?: string;
}

export interface Session {
  id: number;
  studentAddress: string;
  tutorAddress: string;
  tutorName: string;
  subject: string;
  date: string;
  duration: number; // in hours
  amount: number; // in ETH
  status: SessionStatus;
  details: string;
  requestedAt: number;
  completedAt?: number;
}

export type SessionStatus = 
  | 'pending' // Requested by student, awaiting tutor response
  | 'accepted' // Tutor accepted, session scheduled
  | 'rejected' // Tutor rejected
  | 'delivered' // Tutor marked as delivered
  | 'confirmed' // Student confirmed completion
  | 'disputed' // Student opened dispute
  | 'resolved'; // Admin resolved dispute

export interface Dispute {
  id: number;
  sessionId: number;
  studentAddress: string;
  tutorAddress: string;
  reason: string;
  openedAt: number;
  status: 'open' | 'resolved';
  resolution?: string;
  resolvedAt?: number;
}

export interface ContractEvent {
  type: 'SessionRequested' | 'SessionAccepted' | 'SessionRejected' | 'SessionCompleted' | 'SessionConfirmed' | 'DisputeOpened' | 'DisputeResolved';
  sessionId: number;
  timestamp: number;
  data?: any;
}