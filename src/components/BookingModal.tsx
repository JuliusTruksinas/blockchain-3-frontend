import { useState } from 'react';
import { Tutor } from '../types';
import { X, Calendar, Clock, FileText, DollarSign } from 'lucide-react';
import { requestSession } from '../services/dataService';
import { toast } from 'sonner';

interface BookingModalProps {
  tutor: Tutor;
  studentAddress: string;
  onClose: () => void;
}

export function BookingModal({ tutor, studentAddress, onClose }: BookingModalProps) {
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(1);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = tutor.hourlyRate * duration;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Request session and save to localStorage
      const sessionId = requestSession(
        studentAddress,
        tutor.address,
        tutor.name,
        tutor.subject,
        date,
        duration,
        totalAmount,
        details
      );

      toast.success(`Session request submitted! Session ID: ${sessionId}. Payment escrowed.`);
      onClose();
    } catch (error) {
      toast.error('Failed to submit session request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-slate-900">Book a Session</h2>
            <p className="text-slate-600 text-sm mt-1">with {tutor.name}</p>
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
          {/* Tutor Info */}
          <div className="bg-slate-50 rounded-lg p-4 flex items-center gap-4">
            <img
              src={tutor.avatar}
              alt={tutor.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-slate-900">{tutor.name}</h3>
              <p className="text-slate-600">{tutor.subject}</p>
              <p className="text-indigo-600 text-sm">{tutor.hourlyRate} ETH/hour</p>
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <label className="flex items-center gap-2 text-slate-700 mb-2">
              <Calendar className="w-4 h-4" />
              Session Date & Time
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="flex items-center gap-2 text-slate-700 mb-2">
              <Clock className="w-4 h-4" />
              Duration (hours)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={0.5}>30 minutes</option>
              <option value={1}>1 hour</option>
              <option value={1.5}>1.5 hours</option>
              <option value={2}>2 hours</option>
              <option value={3}>3 hours</option>
            </select>
          </div>

          {/* Details */}
          <div>
            <label className="flex items-center gap-2 text-slate-700 mb-2">
              <FileText className="w-4 h-4" />
              Session Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              placeholder="Describe what you'd like to learn in this session..."
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Payment Info */}
          <div className="bg-indigo-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 mb-2">
              <DollarSign className="w-5 h-5" />
              <span>Payment Details</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-indigo-700">Rate:</span>
              <span className="text-indigo-900">{tutor.hourlyRate} ETH/hour</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-indigo-700">Duration:</span>
              <span className="text-indigo-900">{duration} hour{duration !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-indigo-200">
              <span className="text-indigo-900">Total Amount:</span>
              <span className="text-indigo-900">{totalAmount.toFixed(4)} ETH</span>
            </div>
            <p className="text-indigo-700 text-xs mt-2">
              Funds will be held in escrow until the session is completed
            </p>
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
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : `Book & Pay ${totalAmount.toFixed(4)} ETH`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}