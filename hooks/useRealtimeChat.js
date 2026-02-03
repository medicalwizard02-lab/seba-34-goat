import { useState, useEffect, useCallback } from 'react';

/**
 * useRealtimeChat - Custom hook for real-time chat messaging
 * Supports WebSocket connections for instant message updates
 */
const useRealtimeChat = (challengeId, userId) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typing, setTyping] = useState(null);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!challengeId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/wild-guess/${challengeId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [challengeId]);

  // Send message
  const sendMessage = useCallback(async (messageText, messageType = 'text') => {
    if (!messageText.trim() || !challengeId) return;

    // Determine sender type based on userId format
    const isAnonymous = userId && userId.toString().startsWith('anon_');
    const senderType = isAnonymous ? 'anonymous' : 'registered';
    const senderIdForRequest = isAnonymous ? null : userId;

    try {
      const response = await fetch(`/api/wild-guess/${challengeId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: senderIdForRequest,
          senderType: senderType,
          messageText: messageText.trim(),
          messageType
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Add message to local state optimistically
        const newMessage = {
          id: data.messageId,
          challenge_id: challengeId,
          sender_user_id: userId,
          sender_type: senderType,
          message_text: messageText,
          message_type: messageType,
          is_read: false,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMessage]);
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
      return false;
    }
  }, [challengeId, userId]);

  // Send typing indicator
  const sendTypingIndicator = useCallback(async () => {
    if (!challengeId) return;
    try {
      await fetch(`/api/wild-guess/${challengeId}/typing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isTyping: true })
      });
    } catch (err) {
      console.error('Error sending typing indicator:', err);
    }
  }, [challengeId, userId]);

  // Initialize - fetch messages on mount
  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 2 seconds
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  return {
    messages,
    isConnected,
    isLoading,
    error,
    typing,
    sendMessage,
    sendTypingIndicator,
    fetchMessages
  };
};

export default useRealtimeChat;
