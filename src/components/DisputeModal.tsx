import { useState } from 'react';
import { Session } from '../types';
import { X, AlertTriangle } from 'lucide-react';
import { openDispute } from '../services/dataService';
import { toast } from 'sonner';

interface DisputeModalProps {
  session: Session;
  onClose: () => void;
  onDisputeSubmitted?: () => void;
}

export function DisputeModal({ session, onClose, onDisputeSubmitted }: DisputeModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Open dispute and save to localStorage
      const disputeId = openDispute(
        session.id,
        session.studentAddress,
        session.tutorAddress,
        reason
      );

      toast.success(`Dispute opened successfully! Dispute ID: ${disputeId}. An admin will review your case.`);
      onDisputeSubmitted?.();
      onClose();
    } catch (error) {
      toast.error('Failed to open dispute');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <div>
              <h2 className="text-slate-900">Open Dispute</h2>
              <p className="text-slate-600 text-sm mt-1">Session #{session.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Warning */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-800 text-sm">
              Opening a dispute will pause this session and notify an admin. Please provide a detailed explanation of the issue. The admin will review both sides and make a final decision on fund allocation.
            </p>
          </div>

          {/* Session Info */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Tutor:</span>
              <span className="text-slate-900">{session.tutorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Subject:</span>
              <span className="text-slate-900">{session.subject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Amount:</span>
              <span className="text-slate-900">{session.amount} ETH</span>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-slate-700 mb-2">
              Reason for Dispute
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="Please explain in detail what went wrong with this session..."
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Opening Dispute...' : 'Open Dispute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}