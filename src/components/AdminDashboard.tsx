import { useState, useEffect } from 'react';
import { getDisputes, getSessions, getTutors, getSessionById, resolveDispute } from '../services/dataService';
import { Dispute } from '../types';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdminDashboardProps {
  connectedAddress: string;
}

export function AdminDashboard({ connectedAddress }: AdminDashboardProps) {
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  // Load disputes from localStorage
  const loadDisputes = () => {
    const allDisputes = getDisputes();
    setDisputes(allDisputes);
  };

  // Load on mount and set up refresh interval
  useEffect(() => {
    loadDisputes();
    
    // Refresh every 2 seconds to pick up changes
    const interval = setInterval(loadDisputes, 2000);
    
    return () => clearInterval(interval);
  }, []);

  if (!connectedAddress) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Shield className="w-16 h-16 text-slate-300 mb-4" />
        <p className="text-slate-500">Please connect your wallet to continue</p>
      </div>
    );
  }

  const handleResolveDispute = async (disputeId: number, decision: 'refund_student' | 'pay_tutor') => {
    const decisionText = decision === 'refund_student' ? 'Refunded to Student' : 'Paid to Tutor';
    const favorStudent = decision === 'refund_student';

    try {
      const txHash = await resolveDispute(disputeId, decisionText, favorStudent);
      toast.success(`Dispute resolved: ${decisionText}. Tx: ${txHash.slice(0, 10)}…`);
      loadDisputes();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resolve dispute';
      toast.error(message);
    }
  };

  const openDisputes = disputes.filter(d => d.status === 'open');
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved');
  const sessions = getSessions();
  const tutors = getTutors();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-sm p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8" />
          <h2>Admin Dashboard</h2>
        </div>
        <p className="text-purple-100">Manage disputes and maintain platform integrity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 text-sm mb-1">Open Disputes</p>
          <p className="text-slate-900 text-2xl">{openDisputes.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 text-sm mb-1">Resolved Disputes</p>
          <p className="text-slate-900 text-2xl">{resolvedDisputes.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 text-sm mb-1">Total Sessions</p>
          <p className="text-slate-900 text-2xl">{sessions.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 text-sm mb-1">Active Tutors</p>
          <p className="text-slate-900 text-2xl">{tutors.length}</p>
        </div>
      </div>

      {/* Open Disputes */}
      <div>
        <h3 className="text-slate-900 mb-4">Open Disputes</h3>
        {openDisputes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-slate-500">No open disputes</p>
            <p className="text-slate-400 text-sm mt-1">All disputes have been resolved</p>
          </div>
        ) : (
          <div className="space-y-4">
            {openDisputes.map(dispute => {
              const session = getSessionById(dispute.sessionId);
              if (!session) return null;

              return (
                <div
                  key={dispute.id}
                  className="bg-white rounded-lg shadow-sm border border-orange-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-slate-900 mb-1">
                          Dispute #{dispute.id} - Session #{session.id}
                        </h4>
                        <p className="text-slate-600 text-sm">{session.subject}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm">
                      {new Date(dispute.openedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Session Details */}
                  <div className="bg-slate-50 rounded-lg p-4 mb-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tutor:</span>
                      <span className="text-slate-900">{session.tutorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Amount in Escrow:</span>
                      <span className="text-slate-900">{session.amount} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Duration:</span>
                      <span className="text-slate-900">{session.duration} hours</span>
                    </div>
                  </div>

                  {/* Dispute Reason */}
                  <div className="mb-4">
                    <label className="block text-slate-700 text-sm mb-1">Student&apos;s Complaint:</label>
                    <p className="text-slate-900 bg-white border border-slate-200 rounded-lg p-3">
                      {dispute.reason}
                    </p>
                  </div>

                  {/* Resolution Actions */}
                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleResolveDispute(dispute.id, 'refund_student')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      Refund Student
                    </button>
                    <button
                      onClick={() => handleResolveDispute(dispute.id, 'pay_tutor')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Pay Tutor
                    </button>
                  </div>

                  {/* Party Addresses */}
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
                    <div>
                      <label className="block text-slate-600 text-xs mb-1">Student Address</label>
                      <p className="text-slate-900 font-mono text-xs truncate">
                        {dispute.studentAddress}
                      </p>
                    </div>
                    <div>
                      <label className="block text-slate-600 text-xs mb-1">Tutor Address</label>
                      <p className="text-slate-900 font-mono text-xs truncate">
                        {dispute.tutorAddress}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolved Disputes */}
      {resolvedDisputes.length > 0 && (
        <div>
          <h3 className="text-slate-900 mb-4">Recently Resolved</h3>
          <div className="space-y-4">
            {resolvedDisputes.slice(0, 5).map(dispute => {
              const session = getSessionById(dispute.sessionId);
              if (!session) return null;

              return (
                <div
                  key={dispute.id}
                  className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-slate-900 mb-1">
                          Dispute #{dispute.id} - Session #{session.id}
                        </h4>
                        <p className="text-slate-600 text-sm mb-2">{session.subject}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-600">
                            Resolution: {dispute.resolution}
                          </span>
                          <span className="text-slate-500">
                            {dispute.resolvedAt && new Date(dispute.resolvedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
