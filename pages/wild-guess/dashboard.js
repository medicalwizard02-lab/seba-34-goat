import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Plus,
  MessageCircle,
  Clock,
  Check,
  AlertCircle,
  Trophy,
  Settings,
  LogOut
} from 'lucide-react';
import WildGuessShareCard from '../../components/WildGuessShareCard';

/**
 * /pages/wild-guess/dashboard.js
 * Wild Guess Dashboard - manage challenges and view activity
 */
export default function WildGuessDashboard() {
  const router = useRouter();
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newChallengeMode, setNewChallengeMode] = useState(false);
  const [newChallenge, setNewChallenge] = useState(null);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // active, completed, leaderboard

  // Initialize user and fetch data
  useEffect(() => {
    // In production, get from auth context
    const uid = localStorage.getItem('userId') || Math.floor(Math.random() * 1000);
    setUserId(uid);
    
    fetchUserChallenges(uid);
    fetchUserStats(uid);
  }, []);

  const fetchUserChallenges = async (uid) => {
    try {
      const response = await fetch(`/api/wild-guess/user/${uid}/challenges`);
      if (response.ok) {
        const data = await response.json();
        setChallenges(data.challenges || []);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async (uid) => {
    try {
      const response = await fetch(`/api/wild-guess/stats/${uid}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateChallenge = async () => {
    try {
      const response = await fetch('/api/wild-guess/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          timerDuration: 600
        })
      });

      if (response.ok) {
        const data = await response.json();
        setNewChallenge(data.challenge);
        setNewChallengeMode(true);
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('Failed to create challenge');
    }
  };

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => ['identity_revealed', 'identity_guessed'].includes(c.status));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎭 Wild Guess
              </h1>
              <p className="text-gray-600 text-sm">Challenge your friends anonymously</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCreateChallenge}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md"
              >
                <Plus className="w-5 h-5" />
                New Challenge
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem('userId');
                  router.push('/');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* New Challenge Modal */}
      {newChallengeMode && newChallenge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <button
                onClick={() => {
                  setNewChallengeMode(false);
                  fetchUserChallenges(userId);
                }}
                className="float-right text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <WildGuessShareCard
                challenge={newChallenge}
                userName="You"
              />
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<MessageCircle className="w-6 h-6" />}
              label="Active Challenges"
              value={stats.total_challenges}
              color="blue"
            />
            <StatCard
              icon={<Check className="w-6 h-6" />}
              label="Correct Guesses"
              value={stats.correct_guesses}
              color="green"
            />
            <StatCard
              icon={<Trophy className="w-6 h-6" />}
              label="Total Points"
              value={stats.total_points}
              color="yellow"
            />
            <StatCard
              icon={<AlertCircle className="w-6 h-6" />}
              label="Rank"
              value={`#${stats.rank_position || 'N/A'}`}
              color="purple"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border-b border-gray-200 mb-6">
          <div className="flex">
            {['active', 'completed', 'leaderboard'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-800'
                }`}
              >
                {tab === 'active' && <span>🎯 Active <span>({activeChallenges.length})</span></span>}
                {tab === 'completed' && <span>✅ Completed <span>({completedChallenges.length})</span></span>}
                {tab === 'leaderboard' && '🏆 Leaderboard'}
              </button>
            ))}
          </div>
        </div>

        {/* Active Challenges */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeChallenges.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-4">No active challenges</p>
                <button
                  onClick={handleCreateChallenge}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Create your first challenge
                </button>
              </div>
            ) : (
              activeChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onOpen={() => router.push(`/wild-guess/${challenge.challenge_token}`)}
                />
              ))
            )}
          </div>
        )}

        {/* Completed Challenges */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            {completedChallenges.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-500">No completed challenges yet</p>
              </div>
            ) : (
              completedChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onOpen={() => router.push(`/wild-guess/${challenge.challenge_token}`)}
                  completed
                />
              ))
            )}
          </div>
        )}

        {/* Leaderboard */}
        {activeTab === 'leaderboard' && <LeaderboardView />}
      </main>
    </div>
  );
}

// Challenge Card Component
function ChallengeCard({ challenge, onOpen, completed = false }) {
  const timeRemaining = challenge.timer_ends_at
    ? new Date(challenge.timer_ends_at).toLocaleString()
    : 'N/A';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {completed ? '✅' : '🎯'} Challenge #{challenge.id}
          </h3>
          <p className="text-sm text-gray-600">
            Status: <span className="font-medium capitalize">{challenge.status}</span>
          </p>
        </div>
        <button
          onClick={onOpen}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        >
          {completed ? 'View Details' : 'Open Chat'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Timer</p>
          <p className="font-medium text-gray-900">{timeRemaining}</p>
        </div>
        <div>
          <p className="text-gray-600">Messages</p>
          <p className="font-medium text-gray-900">{challenge.message_count || 0}</p>
        </div>
        <div>
          <p className="text-gray-600">Guesses</p>
          <p className="font-medium text-gray-900">{challenge.guess_count || 0}</p>
        </div>
        <div>
          <p className="text-gray-600">Share Link</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(challenge.share_link);
              alert('Link copied!');
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="opacity-20">{icon}</div>
      </div>
    </div>
  );
}

// Leaderboard Component
function LeaderboardView() {
  const [leaderboard, setLeaderboard] = React.useState([]);
  const [loadingLb, setLoadingLb] = React.useState(true);

  React.useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/wild-guess/stats/leaderboard?limit=20');
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data.leaderboard || []);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoadingLb(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loadingLb) {
    return <div className="text-center py-8 text-gray-500">Loading leaderboard...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Rank</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Player</th>
            <th className="px-6 py-3 text-center text-sm font-semibold">Correct Guesses</th>
            <th className="px-6 py-3 text-center text-sm font-semibold">Points</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leaderboard.map((user, index) => (
            <tr key={user.id} className={index < 3 ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
              <td className="px-6 py-4 text-sm font-bold text-gray-900">
                {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {user.username || `User #${user.id}`}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-600">
                {user.correct_guesses || 0}
              </td>
              <td className="px-6 py-4 text-sm text-center font-bold text-gray-900">
                {user.total_points || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
