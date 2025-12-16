import { useState } from 'react';
import { mockTutors } from '../data/mockData';
import { Star, CheckCircle, Edit2 } from 'lucide-react';

interface TutorProfileProps {
  tutorAddress: string;
}

export function TutorProfile({ tutorAddress }: TutorProfileProps) {
  // Find tutor by address (mock data)
  const tutor = mockTutors.find(t => t.address === tutorAddress) || mockTutors[0];
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: tutor.name,
    subject: tutor.subject,
    hourlyRate: tutor.hourlyRate,
    bio: tutor.bio,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for updating tutor profile on-chain or off-chain
    console.log('Update Profile:', formData);
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src={tutor.avatar}
              alt={tutor.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-slate-900">{tutor.name}</h2>
                {tutor.verified && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              <p className="text-slate-600">{tutor.subject}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-slate-900">{tutor.rating.toFixed(1)}</span>
                </div>
                <span className="text-slate-600 text-sm">
                  {tutor.totalSessions} sessions completed
                </span>
              </div>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Hourly Rate (ETH)</label>
              <input
                type="number"
                step="0.001"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-slate-600 text-sm mb-1">Bio</label>
              <p className="text-slate-900">{tutor.bio}</p>
            </div>
            <div>
              <label className="block text-slate-600 text-sm mb-1">Hourly Rate</label>
              <p className="text-slate-900">{tutor.hourlyRate} ETH</p>
            </div>
            <div>
              <label className="block text-slate-600 text-sm mb-1">Wallet Address</label>
              <p className="text-slate-900 font-mono text-sm">{tutor.address}</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 text-sm mb-1">Total Earnings</p>
          <p className="text-slate-900 text-2xl">{(tutor.totalSessions * tutor.hourlyRate * 1.5).toFixed(2)} ETH</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 text-sm mb-1">Completed Sessions</p>
          <p className="text-slate-900 text-2xl">{tutor.totalSessions}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 text-sm mb-1">Average Rating</p>
          <p className="text-slate-900 text-2xl">{tutor.rating.toFixed(1)} ★</p>
        </div>
      </div>
    </div>
  );
}
