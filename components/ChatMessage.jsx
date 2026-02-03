import React from 'react';
import { Check, CheckCheck, Loader2 } from 'lucide-react';

/**
 * ChatMessage - Individual message bubble component
 * Displays message with sender type, timestamp, and read status
 */
const ChatMessage = ({ message, isOwn, senderName = "Anonymous" }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString();
  };

  const renderMessageContent = () => {
    switch (message.message_type) {
      case 'emoji':
        return (
          <div className="text-5xl">
            {message.message_text}
          </div>
        );
      case 'hint':
        return (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded">
            <div className="text-xs font-semibold text-yellow-800 mb-1">💡 HINT</div>
            <div className="text-yellow-900">{message.message_text}</div>
          </div>
        );
      case 'system':
        return (
          <div className="bg-gray-100 text-gray-700 text-sm italic text-center px-3 py-2 rounded">
            {message.message_text}
          </div>
        );
      default:
        return <div className="break-words">{message.message_text}</div>;
    }
  };

  return (
    <div className={`mb-4 flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg`}>
        {/* Sender name for group context */}
        {!isOwn && message.sender_type === 'anonymous' && (
          <div className="text-xs text-gray-500 mb-1 px-2">
            🔒 {senderName}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`
            rounded-lg px-4 py-2 shadow-sm
            ${isOwn
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-200 text-gray-800 rounded-bl-none'
            }
          `}
        >
          {renderMessageContent()}
        </div>

        {/* Timestamp and read status */}
        <div
          className={`
            text-xs text-gray-500 mt-1 flex items-center gap-1
            ${isOwn ? 'justify-end' : 'justify-start'}
          `}
        >
          <span>{formatTime(message.created_at)}</span>
          {isOwn && (
            message.is_read ? (
              <CheckCheck className="w-3 h-3 text-blue-400" />
            ) : (
              <Check className="w-3 h-3" />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
