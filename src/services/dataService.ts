import { BaseError, parseEther } from 'viem';
import { Session, Dispute, ContractEvent, Tutor } from '../types';
import { publicClient, getWalletClient } from './blockchainClient';
import { TUTOR_MARKETPLACE_ABI, TUTOR_MARKETPLACE_ADDRESS } from './contractConfig';

type ContractWriteName = Extract<(typeof TUTOR_MARKETPLACE_ABI)[number], { type: 'function' }>['name'];

// Hardcoded users with Ethereum wallets
export const HARDCODED_USERS = {
  student: {
    address: '0xa4f79d2D42cc00D01f7deB382734E3FC3fe9cE23',
    name: 'Alice Johnson',
    role: 'student' as const,
  },
  tutor: {
    address: '0x5F6056A3d86B7fF123F260730c11Eef8C910ec85',
    name: 'Dr. Sarah Chen',
    role: 'tutor' as const,
    subject: 'Mathematics',
    hourlyRate: 0.00005,
    rating: 4.9,
    totalSessions: 127,
    verified: true,
    bio: 'PhD in Mathematics with 10+ years of teaching experience.',
  },
  admin: {
    address: '0xAb77a619A330d9a6cE2D4ACD514D3edF4b60275A',
    name: 'Admin User',
    role: 'admin' as const,
  },
};

// Initial tutors list
const initialTutors: Tutor[] = [
  {
    id: '1',
    address: '0x5F6056A3d86B7fF123F260730c11Eef8C910ec85',
    name: 'Dr. Sarah Chen',
    subject: 'Mathematics',
    hourlyRate: 0.00005,
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

// Get next dispute ID
function getNextDisputeId(): number {
  const counter = parseInt(localStorage.getItem(STORAGE_KEYS.DISPUTE_COUNTER) || '1');
  localStorage.setItem(STORAGE_KEYS.DISPUTE_COUNTER, (counter + 1).toString());
  return counter;
}

function setNextSessionCounter(nextId: number) {
  localStorage.setItem(STORAGE_KEYS.SESSION_COUNTER, Math.max(nextId, 0).toString());
}

function getLocalSessions(): Session[] {
  const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  return data ? JSON.parse(data) : [];
}

function setLocalSessions(sessions: Session[]) {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

function toReadableError(error: unknown): Error {
  if (error instanceof BaseError) {
    return new Error(error.shortMessage || error.message);
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error('Unknown error');
}

async function executeContractWrite(
  functionName: ContractWriteName,
  args: readonly unknown[],
  value?: bigint
) {
  try {
    const walletClient = await getWalletClient();
    const [account] = await walletClient.getAddresses();

    if (!account) {
      throw new Error('Connect MetaMask before continuing.');
    }

    const hash = await walletClient.writeContract({
      address: TUTOR_MARKETPLACE_ADDRESS,
      abi: TUTOR_MARKETPLACE_ABI,
      functionName,
      args,
      account,
      ...(value !== undefined ? { value } : {}),
    });

    await publicClient.waitForTransactionReceipt({ hash });

    return hash;
  } catch (error) {
    throw toReadableError(error);
  }
}

function updateLocalSession(
  sessionId: number,
  updater: (session: Session) => Session
): Session | undefined {
  const sessions = getLocalSessions();
  const index = sessions.findIndex(s => s.id === sessionId);

  if (index === -1) {
    return undefined;
  }

  const updated = updater({ ...sessions[index] });
  sessions[index] = updated;
  setLocalSessions(sessions);
  return updated;
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
  return getLocalSessions();
}

function saveSessions(sessions: Session[]) {
  setLocalSessions(sessions);
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
export async function requestSession(
  studentAddress: string,
  tutorAddress: string,
  tutorName: string,
  subject: string,
  date: string,
  duration: number,
  amount: number,
  details: string
): Promise<number> {
  try {
    const counterBefore = (await publicClient.readContract({
      address: TUTOR_MARKETPLACE_ADDRESS,
      abi: TUTOR_MARKETPLACE_ABI,
      functionName: 'sessionCounter',
    })) as bigint;

    await executeContractWrite('requestSession', [tutorAddress, details], parseEther(amount.toString()));

    const sessionId = Number(counterBefore);

    const sessions = getLocalSessions();
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
    setLocalSessions(sessions);
    setNextSessionCounter(sessionId + 1);

    logEvent({
      type: 'SessionRequested',
      sessionId,
      timestamp: Date.now(),
      data: { studentAddress, tutorAddress, amount },
    });

    return sessionId;
  } catch (error) {
    throw toReadableError(error);
  }
}

/**
 * Event: SessionAccepted
 * Tutor accepts the session request
 */
export async function acceptSession(sessionId: number): Promise<void> {
  try {
    await executeContractWrite('acceptSession', [BigInt(sessionId)]);

    const updated = updateLocalSession(sessionId, session => ({
      ...session,
      status: 'accepted',
    }));

    if (!updated) {
      throw new Error('Session not found locally. Refresh and try again.');
    }

    logEvent({
      type: 'SessionAccepted',
      sessionId,
      timestamp: Date.now(),
    });
  } catch (error) {
    throw toReadableError(error);
  }
}

/**
 * Event: SessionRejected
 * Tutor rejects the session, funds returned to student
 */
export async function rejectSession(sessionId: number): Promise<void> {
  try {
    await executeContractWrite('rejectSession', [BigInt(sessionId)]);

    const updated = updateLocalSession(sessionId, session => ({
      ...session,
      status: 'rejected',
    }));

    if (!updated) {
      throw new Error('Session not found locally. Refresh and try again.');
    }

    logEvent({
      type: 'SessionRejected',
      sessionId,
      timestamp: Date.now(),
    });
  } catch (error) {
    throw toReadableError(error);
  }
}

/**
 * Event: SessionCompleted
 * Tutor marks session as completed/delivered
 */
export async function completeSession(sessionId: number): Promise<void> {
  try {
    await executeContractWrite('markCompleted', [BigInt(sessionId)]);

    const updated = updateLocalSession(sessionId, session => ({
      ...session,
      status: 'delivered',
    }));

    if (!updated) {
      throw new Error('Session not found locally. Refresh and try again.');
    }

    logEvent({
      type: 'SessionCompleted',
      sessionId,
      timestamp: Date.now(),
    });
  } catch (error) {
    throw toReadableError(error);
  }
}

/**
 * Event: SessionConfirmed
 * Student confirms session completion, funds released to tutor
 */
export async function confirmSession(sessionId: number): Promise<void> {
  try {
    await executeContractWrite('confirmSession', [BigInt(sessionId)]);

    const updated = updateLocalSession(sessionId, session => ({
      ...session,
      status: 'confirmed',
      completedAt: Date.now(),
    }));

    if (!updated) {
      throw new Error('Session not found locally. Refresh and try again.');
    }

    logEvent({
      type: 'SessionConfirmed',
      sessionId,
      timestamp: Date.now(),
    });
  } catch (error) {
    throw toReadableError(error);
  }
}

/**
 * Event: DisputeOpened
 * Student opens a dispute for a delivered session
 */
export async function openDispute(
  sessionId: number,
  studentAddress: string,
  tutorAddress: string,
  reason: string
): Promise<number> {
  try {
    const session = getSessionById(sessionId);

    if (!session || session.status !== 'delivered') {
      throw new Error('Cannot open dispute for this session');
    }

    await executeContractWrite('openDispute', [BigInt(sessionId)]);

    const updated = updateLocalSession(sessionId, current => ({
      ...current,
      status: 'disputed',
    }));

    if (!updated) {
      throw new Error('Session not found locally. Refresh and try again.');
    }

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
  } catch (error) {
    throw toReadableError(error);
  }
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
