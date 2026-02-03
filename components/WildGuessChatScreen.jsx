import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Shield, Clock, Gift, MoreVertical, AlertCircle, Share2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import useRealtimeChat from '../hooks/useRealtimeChat';

/**
 * WildGuessChatScreen - Main chat interface for Wild Guess challenges
 * Features: Real-time messaging, typing indicators, timer, gift system
 */
const WildGuessChatScreen = ({
  challenge,
  currentUser,
  onBack,
  onGuess,
  onRequestGift
}) => {
  const {
    messages,
    isLoading,
    error,
    typing,
    sendMessage,
    sendTypingIndicator,
    fetchMessages
  } = useRealtimeChat(challenge?.id, currentUser?.id);

  const messagesEndRef = useRef(null);
  const [timeRemaining, setTimeRemaining] = React.useState(null);
  const [guessMode, setGuessMode] = React.useState(false);
  const [selectedGuess, setSelectedGuess] = React.useState(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Timer countdown
  useEffect(() => {
    if (!challenge?.timer_ends_at) return;

    const updateTimer = () => {
      const endTime = new Date(challenge.timer_ends_at);
      const now = new Date();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeRemaining('EXPIRED');
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [challenge?.timer_ends_at]);

  const handleSendMessage = async (messageText, messageType) => {
    const success = await sendMessage(messageText, messageType);
    if (success && messageType === 'text') {
      await fetchMessages();
    }
  };

  const handleMakeGuess = async (userId) => {
    if (onGuess) {
      await onGuess(userId);
      setGuessMode(false);
    }
  };

  const handleShare = () => {
    const shareLink = challenge?.share_link || '';
    const shareText = "Can you guess who I am? 🎭 Send me anonymous messages and try to figure out my identity! 👀";
    
    if (navigator.share) {
      navigator.share({
        title: 'Wild Guess Challenge',
        text: shareText,
        url: shareLink
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareLink);
        alert('Link copied to clipboard!');
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareLink);
      alert('Link copied to clipboard!');
    }
  };

  const isTimerExpired = timeRemaining === 'EXPIRED';

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-lg">
                🎭 {challenge?.status === 'identity_revealed' ? 'Challenge Complete!' : 'Wild Guess'}
              </h1>
              <p className="text-xs text-blue-100">Anonymous Challenge</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className={`flex items-center gap-1 px-3 py-2 rounded-full ${
              isTimerExpired ? 'bg-red-500' : 'bg-white/20'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm font-bold">{timeRemaining || '00:00'}</span>
            </div>

            {/* Share Button */}
            <button 
              onClick={handleShare}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Share Challenge"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Menu */}
            <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Challenge Status Bar */}
        <div className="bg-white/10 rounded-lg p-2 text-xs">
          {challenge?.status === 'identity_revealed' && (
            <div className="flex items-center gap-2 text-green-100">
              <Shield className="w-4 h-4" />
              Identity revealed! 🎉
            </div>
          )}
          {isTimerExpired && challenge?.status !== 'identity_revealed' && (
            <div className="flex items-center gap-2 text-red-100">
              <AlertCircle className="w-4 h-4" />
              Timer expired! Anonymous user can now request a gift to reveal their identity.
            </div>
          )}
          {challenge?.status === 'active' && (
            <div className="text-blue-100">
              Try to guess the anonymous user's identity before time runs out!
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-gray-50">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="text-gray-500">
              <div className="text-4xl mb-2">👋</div>
              <p className="font-semibold">No messages yet</p>
              <p className="text-sm">Share the challenge link and wait for responses!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <ChatMessage
                key={msg.id || index}
                message={msg}
                isOwn={msg.sender_type === 'registered' && msg.sender_user_id === currentUser?.id}
                senderName={msg.sender_type === 'anonymous' ? '🔒 Anonymous' : currentUser?.username}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Guess Mode */}
      {guessMode && challenge?.status === 'active' && (
        <div className="bg-blue-50 border-t border-blue-200 p-4">
          <h3 className="font-bold text-blue-900 mb-3">👥 Make a Guess</h3>
          <p className="text-sm text-blue-800 mb-4">
            Click on a contact to guess who this anonymous person is:
          </p>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {/* Placeholder for contact list - would be populated from challenge data */}
            <div className="bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-500 transition-colors text-center text-sm">
              Choose Contact
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {challenge?.status === 'active' && (
        <div className="bg-white border-t border-gray-200 p-4 flex gap-2">
          <button
            onClick={() => setGuessMode(!guessMode)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
          >
            👥 Make a Guess
          </button>

          {isTimerExpired && (
            <button
              onClick={onRequestGift}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4" />
              Request Gift
            </button>
          )}
        </div>
      )}

      {/* Chat Input */}
      {challenge?.status === 'active' && (
        <ChatInput
          onSendMessage={handleSendMessage}
          onTyping={sendTypingIndicator}
          isLoading={isLoading}
          disabled={false}
        />
      )}

      {/* Completed State */}
      {challenge?.status === 'identity_revealed' && (
        <div className="bg-green-50 border-t border-green-200 p-4 text-center">
          <p className="text-green-900 font-semibold mb-3">
            🎉 Challenge completed! The identity has been revealed.
          </p>
          <button
            onClick={onBack}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Back to Challenges
          </button>
        </div>
      )}
    </div>
  );
};

export default WildGuessChatScreen;
