import { Session, Dispute, ContractEvent, Tutor } from '../types';

// Hardcoded users with Ethereum wallets
export const HARDCODED_USERS = {
  student: {
    address: '0x1234567890123456789012345678901234567890',
    name: 'Alice Johnson',
    role: 'student' as const,
  },
  tutor: {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    name: 'Dr. Sarah Chen',
    role: 'tutor' as const,
    subject: 'Mathematics',
    hourlyRate: 0.05,
    rating: 4.9,
    totalSessions: 127,
    verified: true,
    bio: 'PhD in Mathematics with 10+ years of teaching experience.',
  },
  admin: {
    address: '0xADMIN00000000000000000000000000000000000',
    name: 'Admin User',
    role: 'admin' as const,
  },
};

// Initial tutors list
const initialTutors: Tutor[] = [
  {
    id: '1',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    name: 'Dr. Sarah Chen',
    subject: 'Mathematics',
    hourlyRate: 0.05,
    rating: 4.9,
    totalSessions: 127,
    verified: true,
    bio: 'PhD in Mathematics with 10+ years of teaching experience. Specializing in calculus, algebra, and statistics.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    address: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    name: 'Prof. James Wilson',
    subject: 'Physics',
    hourlyRate: 0.06,
    rating: 4.8,
    totalSessions: 93,
    verified: true,
    bio: 'University professor specializing in quantum mechanics and classical physics.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    address: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
    name: 'Maria Rodriguez',
    subject: 'Chemistry',
    hourlyRate: 0.045,
    rating: 4.7,
    totalSessions: 78,
    verified: true,
    bio: 'Organic chemistry expert. Helping students ace their exams.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  },
  {
    id: '4',
    address: '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
    name: 'David Park',
    subject: 'Computer Science',
    hourlyRate: 0.07,
    rating: 5.0,
    totalSessions: 156,
    verified: true,
    bio: 'Software engineer turned educator. Teaching programming and algorithms.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  },
  {
    id: '5',
    address: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
    name: 'Emily Thompson',
    subject: 'English Literature',
    hourlyRate: 0.04,
    rating: 4.6,
    totalSessions: 64,
    verified: true,
    bio: 'Masters in English Literature. Passionate about helping students.',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
  },
  {
    id: '6',
    address: '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
    name: 'Alex Kumar',
    subject: 'Biology',
    hourlyRate: 0.048,
    rating: 4.8,
    totalSessions: 91,
    verified: false,
    bio: 'Medical student with expertise in cellular biology and genetics.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
  },
];

// LocalStorage keys
const STORAGE_KEYS = {
  SESSIONS: 'tutor_marketplace_sessions',
  DISPUTES: 'tutor_marketplace_disputes',
  EVENTS: 'tutor_marketplace_events',
  TUTORS: 'tutor_marketplace_tutors',
  SESSION_COUNTER: 'tutor_marketplace_session_counter',
  DISPUTE_COUNTER: 'tutor_marketplace_dispute_counter',
};

// Initialize localStorage with default data if empty
export function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DISPUTES)) {
    localStorage.setItem(STORAGE_KEYS.DISPUTES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TUTORS)) {
    localStorage.setItem(STORAGE_KEYS.TUTORS, JSON.stringify(initialTutors));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SESSION_COUNTER)) {
    localStorage.setItem(STORAGE_KEYS.SESSION_COUNTER, '1');
  }
  if (!localStorage.getItem(STORAGE_KEYS.DISPUTE_COUNTER)) {
    localStorage.setItem(STORAGE_KEYS.DISPUTE_COUNTER, '1');
  }
}

// Get next session ID
function getNextSessionId(): number {
  const counter = parseInt(localStorage.getItem(STORAGE_KEYS.SESSION_COUNTER) || '1');
  localStorage.setItem(STORAGE_KEYS.SESSION_COUNTER, (counter + 1).toString());
  return counter;
}

// Get next dispute ID
function getNextDisputeId(): number {
  const counter = parseInt(localStorage.getItem(STORAGE_KEYS.DISPUTE_COUNTER) || '1');
  localStorage.setItem(STORAGE_KEYS.DISPUTE_COUNTER, (counter + 1).toString());
  return counter;
}

// Event logging
function logEvent(event: ContractEvent) {
  const events = getEvents();
  events.push(event);
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  console.log('Blockchain Event:', event);
}

// Tutors
export function getTutors(): Tutor[] {
  const data = localStorage.getItem(STORAGE_KEYS.TUTORS);
  return data ? JSON.parse(data) : [];
}

// Sessions
export function getSessions(): Session[] {
  const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  return data ? JSON.parse(data) : [];
}

function saveSessions(sessions: Session[]) {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function getSessionById(id: number): Session | undefined {
  const sessions = getSessions();
  return sessions.find(s => s.id === id);
}

// Disputes
export function getDisputes(): Dispute[] {
  const data = localStorage.getItem(STORAGE_KEYS.DISPUTES);
  return data ? JSON.parse(data) : [];
}

function saveDisputes(disputes: Dispute[]) {
  localStorage.setItem(STORAGE_KEYS.DISPUTES, JSON.stringify(disputes));
}

// Events
export function getEvents(): ContractEvent[] {
  const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return data ? JSON.parse(data) : [];
}

// ============================================
// BLOCKCHAIN EVENT FUNCTIONS
// ============================================

/**
 * Event: SessionRequested
 * Student requests a session with a tutor, deposits ETH into escrow
 */
export function requestSession(
  studentAddress: string,
  tutorAddress: string,
  tutorName: string,
  subject: string,
  date: string,
  duration: number,
  amount: number,
  details: string
): number {
  const sessions = getSessions();
  const sessionId = getNextSessionId();
  
  const newSession: Session = {
    id: sessionId,
    studentAddress,
    tutorAddress,
    tutorName,
    subject,
    date,
    duration,
    amount,
    status: 'pending',
    details,
    requestedAt: Date.now(),
  };
  
  sessions.push(newSession);
  saveSessions(sessions);
  
  logEvent({
    type: 'SessionRequested',
    sessionId,
    timestamp: Date.now(),
    data: { studentAddress, tutorAddress, amount },
  });
  
  return sessionId;
}

/**
 * Event: SessionAccepted
 * Tutor accepts the session request
 */
export function acceptSession(sessionId: number): boolean {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session || session.status !== 'pending') {
    return false;
  }
  
  session.status = 'accepted';
  saveSessions(sessions);
  
  logEvent({
    type: 'SessionAccepted',
    sessionId,
    timestamp: Date.now(),
  });
  
  return true;
}

/**
 * Event: SessionRejected
 * Tutor rejects the session, funds returned to student
 */
export function rejectSession(sessionId: number): boolean {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session || session.status !== 'pending') {
    return false;
  }
  
  session.status = 'rejected';
  saveSessions(sessions);
  
  logEvent({
    type: 'SessionRejected',
    sessionId,
    timestamp: Date.now(),
  });
  
  return true;
}

/**
 * Event: SessionCompleted
 * Tutor marks session as completed/delivered
 */
export function completeSession(sessionId: number): boolean {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session || session.status !== 'accepted') {
    return false;
  }
  
  session.status = 'delivered';
  saveSessions(sessions);
  
  logEvent({
    type: 'SessionCompleted',
    sessionId,
    timestamp: Date.now(),
  });
  
  return true;
}

/**
 * Event: SessionConfirmed
 * Student confirms session completion, funds released to tutor
 */
export function confirmSession(sessionId: number): boolean {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session || session.status !== 'delivered') {
    return false;
  }
  
  session.status = 'confirmed';
  session.completedAt = Date.now();
  saveSessions(sessions);
  
  logEvent({
    type: 'SessionConfirmed',
    sessionId,
    timestamp: Date.now(),
  });
  
  return true;
}

/**
 * Event: DisputeOpened
 * Student opens a dispute for a delivered session
 */
export function openDispute(
  sessionId: number,
  studentAddress: string,
  tutorAddress: string,
  reason: string
): number {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session || session.status !== 'delivered') {
    throw new Error('Cannot open dispute for this session');
  }
  
  session.status = 'disputed';
  saveSessions(sessions);
  
  const disputes = getDisputes();
  const disputeId = getNextDisputeId();
  
  const newDispute: Dispute = {
    id: disputeId,
    sessionId,
    studentAddress,
    tutorAddress,
    reason,
    openedAt: Date.now(),
    status: 'open',
  };
  
  disputes.push(newDispute);
  saveDisputes(disputes);
  
  logEvent({
    type: 'DisputeOpened',
    sessionId,
    timestamp: Date.now(),
    data: { disputeId, reason },
  });
  
  return disputeId;
}

/**
 * Event: DisputeResolved
 * Admin resolves a dispute, deciding fund allocation
 */
export function resolveDispute(
  disputeId: number,
  decision: string,
  favorStudent: boolean
): boolean {
  const disputes = getDisputes();
  const dispute = disputes.find(d => d.id === disputeId);
  
  if (!dispute || dispute.status !== 'open') {
    return false;
  }
  
  dispute.status = 'resolved';
  dispute.resolution = decision;
  dispute.resolvedAt = Date.now();
  saveDisputes(disputes);
  
  // Update session status
  const sessions = getSessions();
  const session = sessions.find(s => s.id === dispute.sessionId);
  if (session) {
    session.status = 'resolved';
    saveSessions(sessions);
  }
  
  logEvent({
    type: 'DisputeResolved',
    sessionId: dispute.sessionId,
    timestamp: Date.now(),
    data: { disputeId, decision, favorStudent },
  });
  
  return true;
}

// Utility to clear all data (for testing/reset)
export function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  localStorage.removeItem(STORAGE_KEYS.DISPUTES);
  localStorage.removeItem(STORAGE_KEYS.EVENTS);
  localStorage.removeItem(STORAGE_KEYS.SESSION_COUNTER);
  localStorage.removeItem(STORAGE_KEYS.DISPUTE_COUNTER);
  initializeStorage();
}
