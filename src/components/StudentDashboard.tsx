import { useState, useEffect } from 'react';
import { TutorBrowser } from './TutorBrowser';
import { MySessions } from './MySessions';
import { BookingModal } from './BookingModal';
import { Search, BookOpen } from 'lucide-react';
import { Tutor } from '../types';

interface StudentDashboardProps {
  connectedAddress: string;
}

export function StudentDashboard({ connectedAddress }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'sessions'>('browse');
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh data when tab changes
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [activeTab]);

  const handleBookSession = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setIsBookingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsBookingModalOpen(false);
    setSelectedTutor(null);
  };

  if (!connectedAddress) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Search className="w-16 h-16 text-slate-300 mb-4" />
        <p className="text-slate-500">Please connect your wallet to continue</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('browse')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'browse'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4" />
          Browse Tutors
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'sessions'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          My Sessions
        </button>
      </div>

      {/* Content */}
      {activeTab === 'browse' && (
        <TutorBrowser onBookSession={handleBookSession} key={refreshKey} />
      )}
      {activeTab === 'sessions' && (
        <MySessions userAddress={connectedAddress} userRole="student" key={refreshKey} />
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && selectedTutor && (
        <BookingModal
          tutor={selectedTutor}
          studentAddress={connectedAddress}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}