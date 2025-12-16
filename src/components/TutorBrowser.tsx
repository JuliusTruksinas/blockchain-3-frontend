import { useState } from 'react';
import { getTutors } from '../services/dataService';
import { Tutor } from '../types';
import { Star, CheckCircle, Clock } from 'lucide-react';

interface TutorBrowserProps {
  onBookSession: (tutor: Tutor) => void;
}

export function TutorBrowser({ onBookSession }: TutorBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const tutors = getTutors();
  const subjects = ['all', ...Array.from(new Set(tutors.map(t => t.subject)))];

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = 
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || tutor.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-slate-700 mb-2">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.map(tutor => (
          <div
            key={tutor.id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4 mb-4">
              <img
                src={tutor.avatar}
                alt={tutor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-slate-900 truncate">{tutor.name}</h3>
                  {tutor.verified && (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-slate-600 text-sm">{tutor.subject}</p>
              </div>
            </div>

            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{tutor.bio}</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-slate-900">{tutor.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600 text-sm">
                <Clock className="w-4 h-4" />
                <span>{tutor.totalSessions} sessions</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div>
                <p className="text-slate-600 text-sm">Hourly Rate</p>
                <p className="text-slate-900">{tutor.hourlyRate} ETH</p>
              </div>
              <button
                onClick={() => onBookSession(tutor)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTutors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No tutors found matching your criteria</p>
        </div>
      )}
    </div>
  );
}