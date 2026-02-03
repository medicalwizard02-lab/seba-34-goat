import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Lightbulb, Plus } from 'lucide-react';

/**
 * ChatInput - Message input component with rich features
 * Supports text, emoji, hints, and typing indicators
 */
const ChatInput = ({ onSendMessage, isLoading = false, disabled = false, onTyping }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showHintInput, setShowHintInput] = useState(false);
  const [hintText, setHintText] = useState('');
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Common emojis for quick access
  const commonEmojis = ['😂', '❤️', '😍', '🔥', '👍', '💯', '🎭', '😎', '🤔', '😅'];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Send typing indicator
    if (onTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onTyping();
      typingTimeoutRef.current = setTimeout(() => {
        // Stop typing indicator
      }, 1000);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message, 'text');
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const handleEmojiClick = (emoji) => {
    onSendMessage(emoji, 'emoji');
    setShowEmojiPicker(false);
  };

  const handleSendHint = () => {
    if (hintText.trim()) {
      onSendMessage(hintText, 'hint');
      setHintText('');
      setShowHintInput(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4 space-y-3">
      {/* Hint Input Mode */}
      {showHintInput && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded animate-slideIn">
          <label className="text-sm font-semibold text-yellow-800 mb-2 block">
            💡 Share a hint about your identity
          </label>
          <textarea
            value={hintText}
            onChange={(e) => setHintText(e.target.value)}
            placeholder="E.g., 'I work in tech and love coffee...'"
            className="w-full p-2 border border-yellow-200 rounded text-sm focus:outline-none focus:border-yellow-400"
            rows="2"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSendHint}
              disabled={!hintText.trim() || isLoading}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white rounded font-medium text-sm py-2 transition-colors"
            >
              Send Hint
            </button>
            <button
              onClick={() => setShowHintInput(false)}
              className="px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded font-medium text-sm py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg animate-slideIn">
          <p className="text-sm font-semibold text-gray-700 mb-2">Quick Reactions</p>
          <div className="flex gap-2 flex-wrap">
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl hover:scale-125 transition-transform"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input Area */}
      <div className="flex gap-2 items-end">
        {/* Action Buttons */}
        <div className="flex gap-1">
          {/* Emoji Picker Button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-blue-500 disabled:opacity-50"
            title="Add emoji"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Hint Button */}
          <button
            onClick={() => setShowHintInput(!showHintInput)}
            disabled={disabled}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-yellow-500 disabled:opacity-50"
            title="Add hint about your identity"
          >
            <Lightbulb className="w-5 h-5" />
          </button>

          {/* More Options */}
          <button
            disabled={disabled}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-800 disabled:opacity-50"
            title="More options"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Text Input */}
        <textarea
          ref={inputRef}
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={disabled || isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="1"
          style={{ maxHeight: '100px' }}
        />

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading || disabled}
          className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full transition-colors disabled:cursor-not-allowed"
          title="Send message"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Helper Text */}
      <div className="text-xs text-gray-500 text-center">
        Use <kbd className="px-2 py-1 bg-gray-100 rounded">Shift + Enter</kbd> for new line
      </div>
    </div>
  );
};

export default ChatInput;
