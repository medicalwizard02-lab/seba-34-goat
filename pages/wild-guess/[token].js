import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import WildGuessChatScreen from '../../components/WildGuessChatScreen';
import { Loader2 } from 'lucide-react';

/**
 * /pages/wild-guess/[token].js
 * Challenge page - displays chat interface when accessing a wild guess challenge
 */
export default function WildGuessChallenge() {
  const router = useRouter();
  const { token } = router.query;
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch challenge data
  useEffect(() => {
    if (!token) return;

    const fetchChallenge = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/wild-guess/${token}`);
        
        if (!response.ok) {
          throw new Error('Challenge not found');
        }

        const data = await response.json();
        setChallenge(data.challenge);

        // Set current user (in production, get from auth context)
        setCurrentUser({
          id: data.challenge.anonymous_user_id || Math.random(),
          username: 'Anonymous User'
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching challenge:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [token]);

  const handleGuess = async (userId) => {
    try {
      const response = await fetch(`/api/wild-guess/${challenge.id}/guess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guessedUserId: userId,
          targetUserId: challenge.target_user_id
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isCorrect) {
          alert('🎉 Correct guess! You found them!');
          // Refresh challenge
          const newResponse = await fetch(`/api/wild-guess/${token}`);
          const newData = await newResponse.json();
          setChallenge(newData.challenge);
        } else {
          alert('❌ Wrong guess! Try again!');
        }
      }
    } catch (err) {
      console.error('Error making guess:', err);
      alert('Error making guess');
    }
  };

  const handleRequestGift = () => {
    alert('Gift feature coming soon!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <WildGuessChatScreen
        challenge={challenge}
        currentUser={currentUser}
        onBack={() => router.back()}
        onGuess={handleGuess}
        onRequestGift={handleRequestGift}
      />
    </div>
  );
}
