import React, { useState } from 'react';
import {
  Share2,
  MessageCircle,
  Copy,
  CheckCircle,
  Share,
  Heart,
  Mail,
  Link,
  QrCode,
  Code
} from 'lucide-react';
import useWildGuessShare from '../hooks/useWildGuessShare';

/**
 * WildGuessShareCard - Component to display share options for Wild Guess challenge
 * Shows WhatsApp, Twitter, Facebook, Telegram, Email, and Copy options
 */
const WildGuessShareCard = ({ challenge, userName = "Anonymous" }) => {
  const {
    copyFeedback,
    shareToWhatsApp,
    shareToTwitter,
    shareToFacebook,
    shareToTelegram,
    shareViaEmail,
    copyToClipboard,
    nativeShare,
    generateQRCode
  } = useWildGuessShare();

  const [showQR, setShowQR] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const shareLink = challenge?.share_link || '';
  const qrCodeUrl = generateQRCode(shareLink);

  const shareButtons = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white',
      onClick: () => shareToWhatsApp(shareLink),
      emoji: '💬'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Share2,
      color: 'bg-blue-400 hover:bg-blue-500',
      textColor: 'text-white',
      onClick: () => shareToTwitter(shareLink),
      emoji: '𝕏'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Share,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white',
      onClick: () => shareToFacebook(shareLink),
      emoji: 'f'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: MessageCircle,
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white',
      onClick: () => shareToTelegram(shareLink),
      emoji: '✈️'
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-white',
      onClick: () => shareViaEmail(shareLink),
      emoji: '✉️'
    },
    {
      id: 'copy',
      name: copyFeedback ? 'Copied!' : 'Copy Link',
      icon: copyFeedback ? CheckCircle : Copy,
      color: copyFeedback ? 'bg-green-500' : 'bg-gray-600 hover:bg-gray-700',
      textColor: 'text-white',
      onClick: () => copyToClipboard(shareLink),
      emoji: copyFeedback ? '✅' : '📋'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-6 h-6 animate-pulse" fill="currentColor" />
          <h2 className="text-2xl font-bold">Challenge Created! 🎭</h2>
        </div>
        <p className="text-purple-100">
          Share this link to receive anonymous messages and start the guessing game!
        </p>
      </div>

      {/* Share Buttons Grid */}
      <div className="bg-white p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Share Challenge
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {shareButtons.map((button) => {
            const Icon = button.icon;
            return (
              <button
                key={button.id}
                onClick={button.onClick}
                className={`
                  ${button.color} ${button.textColor}
                  rounded-lg py-3 px-4 font-medium
                  transition-all duration-200 transform hover:scale-105
                  flex items-center justify-center gap-2
                  shadow-sm hover:shadow-md
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{button.emoji}</span>
                <span className="hidden sm:inline">{button.name}</span>
              </button>
            );
          })}
        </div>

        {/* Link Display */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <label className="text-sm font-medium text-gray-600 mb-2 block">
            Your Challenge Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:outline-none"
            />
            <button
              onClick={() => copyToClipboard(shareLink)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {copyFeedback ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="bg-gray-50 p-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* QR Code */}
        <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-500 transition-colors"
          onClick={() => setShowQR(!showQR)}>
          <QrCode className="w-8 h-8 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">QR Code</span>
          <span className="text-xs text-gray-500">Scan to share</span>
        </div>

        {/* Embed Code */}
        <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-500 transition-colors"
          onClick={() => setShowEmbed(!showEmbed)}>
          <Code className="w-8 h-8 text-green-600" />
          <span className="text-sm font-medium text-gray-700">Embed Code</span>
          <span className="text-xs text-gray-500">For website</span>
        </div>

        {/* Stats */}
        <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
          <Link className="w-8 h-8 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">Timer</span>
          <span className="text-xs text-gray-500">5:00 minutes</span>
        </div>
      </div>

      {/* QR Code Display */}
      {showQR && (
        <div className="bg-white p-6 border-t border-gray-200 text-center">
          <h4 className="font-semibold text-gray-800 mb-4">Share via QR Code</h4>
          <img
            src={qrCodeUrl}
            alt="QR Code"
            className="w-48 h-48 mx-auto border-2 border-gray-200 rounded-lg p-2"
          />
          <p className="text-sm text-gray-600 mt-3">
            Users can scan this QR code to join your challenge
          </p>
        </div>
      )}

      {/* Embed Code Display */}
      {showEmbed && (
        <div className="bg-white p-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Embed on Your Website</h4>
          <textarea
            value={`<iframe src="${shareLink}" width="400" height="600" frameborder="0" style="border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></iframe>`}
            readOnly
            className="w-full h-24 p-3 border border-gray-300 rounded-lg bg-gray-50 text-xs font-mono text-gray-700 focus:outline-none"
            onClick={(e) => e.target.select()}
          />
          <p className="text-xs text-gray-600 mt-2">
            Click to select all code. Copy and paste this into your website HTML.
          </p>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-blue-50 border-t border-blue-200 p-4 rounded-b-2xl">
        <h4 className="font-semibold text-blue-900 text-sm mb-2">🎯 How to use:</h4>
        <ul className="text-xs text-blue-800 space-y-1 ml-4 list-disc">
          <li>Share the link on your WhatsApp status, social media, or with friends</li>
          <li>Anonymous users click the link and send you messages</li>
          <li>Try to guess their identity before the timer runs out (5 minutes)</li>
          <li>If you're stuck, they can offer you a gift to reveal themselves</li>
          <li>Earn points and climb the leaderboard! 🏆</li>
        </ul>
      </div>
    </div>
  );
};

export default WildGuessShareCard;
