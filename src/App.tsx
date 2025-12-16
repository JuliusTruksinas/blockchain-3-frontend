import { useState, useEffect } from 'react';
import { StudentDashboard } from './components/StudentDashboard';
import { TutorDashboard } from './components/TutorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { UserCircle2, GraduationCap, Shield } from 'lucide-react';
import { initializeStorage, HARDCODED_USERS } from './services/dataService';
import { Toaster } from './components/ui/sonner';

type UserRole = 'student' | 'tutor' | 'admin';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('student');

  // Initialize localStorage on mount
  useEffect(() => {
    initializeStorage();
  }, []);

  // Get current user data based on role
  const getCurrentUser = () => {
    return HARDCODED_USERS[userRole];
  };

  const currentUser = getCurrentUser();

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-indigo-600" />
                <h1 className="text-slate-900">Tutor Marketplace</h1>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                  Decentralized
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Role Switcher */}
                <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                  <button
                    onClick={() => setUserRole('student')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                      userRole === 'student'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UserCircle2 className="w-4 h-4" />
                    <span className="text-sm">Student</span>
                  </button>
                  <button
                    onClick={() => setUserRole('tutor')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                      userRole === 'tutor'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm">Tutor</span>
                  </button>
                  <button
                    onClick={() => setUserRole('admin')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                      userRole === 'admin'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Admin</span>
                  </button>
                </div>

                {/* Wallet Display */}
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <div className="text-sm">
                    <div className="font-medium">{currentUser.name}</div>
                    <div className="text-xs opacity-75">
                      {currentUser.address.slice(0, 6)}...{currentUser.address.slice(-4)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {userRole === 'student' && <StudentDashboard connectedAddress={currentUser.address} />}
          {userRole === 'tutor' && <TutorDashboard connectedAddress={currentUser.address} />}
          {userRole === 'admin' && <AdminDashboard connectedAddress={currentUser.address} />}
        </main>
      </div>
    </>
  );
}