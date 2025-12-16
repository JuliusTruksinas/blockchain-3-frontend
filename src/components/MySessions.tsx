import { useState, useEffect } from 'react';
import { getSessions, acceptSession, rejectSession, completeSession, confirmSession } from '../services/dataService';
import { Session, SessionStatus } from '../types';
import { Calendar, Clock, User, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { DisputeModal } from './DisputeModal';
import { toast } from 'sonner@2.0.3';

interface MySessionsProps {
  userAddress: string;
  userRole: 'student' | 'tutor';
}

export function MySessions({ userAddress, userRole }: MySessionsProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);

  // Load sessions from localStorage
  const loadSessions = () => {
    const allSessions = getSessions();
    const filtered = allSessions.filter(session => 
      userRole === 'student' 
        ? session.studentAddress === userAddress
        : session.tutorAddress === userAddress
    );
    setSessions(filtered);
  };

  // Load on mount and set up refresh interval
  useEffect(() => {
    loadSessions();
    
    // Refresh every 2 seconds to pick up changes
    const interval = setInterval(loadSessions, 2000);
    
    return () => clearInterval(interval);
  }, [userAddress, userRole]);

  const getStatusColor = (status: SessionStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'delivered': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'disputed': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'resolved': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: SessionStatus) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'delivered': return <CheckCircle2 className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle2 className="w-4 h-4" />;
      case 'disputed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleAcceptSession = async (sessionId: number) => {
    const success = acceptSession(sessionId);
    if (success) {
      toast.success('Session accepted! The session has been scheduled.');
      loadSessions();
    } else {
      toast.error('Failed to accept session');
    }
  };

  const handleRejectSession = async (sessionId: number) => {
    const success = rejectSession(sessionId);
    if (success) {
      toast.success('Session rejected. Funds will be refunded to the student.');
      loadSessions();
    } else {
      toast.error('Failed to reject session');
    }
  };

  const handleMarkDelivered = async (sessionId: number) => {
    const success = completeSession(sessionId);
    if (success) {
      toast.success('Session marked as delivered. Waiting for student confirmation.');
      loadSessions();
    } else {
      toast.error('Failed to mark session as delivered');
    }
  };

  const handleConfirmSession = async (sessionId: number) => {
    const success = confirmSession(sessionId);
    if (success) {
      toast.success('Session confirmed! Payment has been released to the tutor.');
      loadSessions();
    } else {
      toast.error('Failed to confirm session');
    }
  };

  const handleOpenDispute = (session: Session) => {
    setSelectedSession(session);
    setIsDisputeModalOpen(true);
  };

  const handleDisputeSubmitted = () => {
    loadSessions();
  };

  return (
    <div className="space-y-4">
      {sessions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No sessions yet</p>
          <p className="text-slate-400 text-sm mt-1">
            {userRole === 'student' 
              ? 'Book your first tutoring session to get started'
              : 'Session requests will appear here'
            }
          </p>
        </div>
      ) : (
        sessions.map(session => (
          <div
            key={session.id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-slate-900">{session.subject}</h3>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded border text-xs ${getStatusColor(session.status)}`}>
                    {getStatusIcon(session.status)}
                    {session.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-600 text-sm">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {userRole === 'student' ? session.tutorName : 'Student'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(session.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {session.duration}h
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-900">{session.amount} ETH</p>
                <p className="text-slate-500 text-sm">
                  {session.status === 'pending' || session.status === 'accepted' ? 'In Escrow' : ''}
                </p>
              </div>
            </div>

            <p className="text-slate-600 text-sm mb-4">{session.details}</p>

            {/* Actions for Tutor */}
            {userRole === 'tutor' && session.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleAcceptSession(session.id)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Accept Session
                </button>
                <button
                  onClick={() => handleRejectSession(session.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject Session
                </button>
              </div>
            )}

            {userRole === 'tutor' && session.status === 'accepted' && (
              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleMarkDelivered(session.id)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Mark as Delivered
                </button>
              </div>
            )}

            {/* Actions for Student */}
            {userRole === 'student' && session.status === 'delivered' && (
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleConfirmSession(session.id)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirm Completion
                </button>
                <button
                  onClick={() => handleOpenDispute(session)}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Open Dispute
                </button>
              </div>
            )}

            {session.status === 'confirmed' && (
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm">
                    {userRole === 'student' 
                      ? 'Session completed and payment released' 
                      : 'Payment received'
                    }
                  </span>
                </div>
              </div>
            )}

            {session.status === 'disputed' && (
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">Dispute opened - awaiting admin resolution</span>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {/* Dispute Modal */}
      {isDisputeModalOpen && selectedSession && (
        <DisputeModal
          session={selectedSession}
          onClose={() => {
            setIsDisputeModalOpen(false);
            setSelectedSession(null);
          }}
          onDisputeSubmitted={handleDisputeSubmitted}
        />
      )}
    </div>
  );
}
