import { useState, useEffect } from 'react';
import { MySessions } from './MySessions';
import { TutorProfile } from './TutorProfile';
import { BookOpen, User } from 'lucide-react';

interface TutorDashboardProps {
  connectedAddress: string;
}

export function TutorDashboard({ connectedAddress }: TutorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'sessions' | 'profile'>('sessions');
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh data when tab changes
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [activeTab]);

  if (!connectedAddress) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <User className="w-16 h-16 text-slate-300 mb-4" />
        <p className="text-slate-500">Please connect your wallet to continue</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'sessions'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Session Requests
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          My Profile
        </button>
      </div>

      {/* Content */}
      {activeTab === 'sessions' && (
        <MySessions userAddress={connectedAddress} userRole="tutor" key={refreshKey} />
      )}
      {activeTab === 'profile' && (
        <TutorProfile tutorAddress={connectedAddress} key={refreshKey} />
      )}
    </div>
  );
}