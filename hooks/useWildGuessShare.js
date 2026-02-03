/**
 * useWildGuessShare - Custom React hook for sharing Wild Guess challenges
 * Supports: WhatsApp, Twitter, Facebook, Telegram, Copy to Clipboard
 */

import { useState } from 'react';

const useWildGuessShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Message templates for different platforms
  const shareMessages = {
    whatsapp: "🎭 Can you guess who I am? Send me anonymous messages and try to figure out my identity! 👀\n\nAccept the challenge:",
    twitter: "🎭 I just created a Wild Guess challenge! Can you figure out who I am? 👀 #WildGuess",
    facebook: "I just started a Wild Guess challenge! Can you identify me? Send me anonymous messages!",
    telegram: "Can you guess who I am? Join my Wild Guess challenge and send me anonymous messages! 🎭👀",
    default: "Can you guess who I am? 🎭 Send me anonymous messages and try to figure out my identity! 👀"
  };

  /**
   * Share to WhatsApp
   */
  const shareToWhatsApp = (shareLink) => {
    const message = encodeURIComponent(
      shareMessages.whatsapp + '\n' + shareLink
    );
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank', 'width=500,height=600');
  };

  /**
   * Share to Twitter
   */
  const shareToTwitter = (shareLink) => {
    const text = encodeURIComponent(
      shareMessages.twitter + '\n\n' + shareLink
    );
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(twitterUrl, '_blank', 'width=500,height=600');
  };

  /**
   * Share to Facebook
   */
  const shareToFacebook = (shareLink) => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}&quote=${encodeURIComponent(shareMessages.facebook)}`;
    window.open(facebookUrl, '_blank', 'width=500,height=600');
  };

  /**
   * Share to Telegram
   */
  const shareToTelegram = (shareLink) => {
    const text = encodeURIComponent(
      shareMessages.telegram + '\n' + shareLink
    );
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${text}`;
    window.open(telegramUrl, '_blank', 'width=500,height=600');
  };

  /**
   * Copy link to clipboard
   */
  const copyToClipboard = async (shareLink) => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      return false;
    }
  };

  /**
   * Share using Web Share API (if available)
   */
  const nativeShare = async (shareLink, title = "Wild Guess Challenge") => {
    if (!navigator.share) {
      console.log('Web Share API not available');
      return false;
    }

    try {
      setIsSharing(true);
      await navigator.share({
        title: title,
        text: shareMessages.default,
        url: shareLink
      });
      return true;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return false;
    } finally {
      setIsSharing(false);
    }
  };

  /**
   * Share via email
   */
  const shareViaEmail = (shareLink) => {
    const subject = encodeURIComponent('Join my Wild Guess Challenge! 🎭');
    const body = encodeURIComponent(
      `Hey! I just started a Wild Guess challenge. Can you figure out who I am?\n\nSend me anonymous messages and try to guess my identity!\n\n${shareLink}\n\nTalk soon! 👀`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  /**
   * Generate share embed code for website/blog
   */
  const generateEmbedCode = (shareLink) => {
    return `<iframe src="${shareLink}" width="400" height="600" frameborder="0" style="border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></iframe>`;
  };

  /**
   * Generate QR code URL (using external service)
   */
  const generateQRCode = (shareLink) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareLink)}`;
  };

  return {
    isSharing,
    copyFeedback,
    shareToWhatsApp,
    shareToTwitter,
    shareToFacebook,
    shareToTelegram,
    shareViaEmail,
    copyToClipboard,
    nativeShare,
    generateEmbedCode,
    generateQRCode,
    shareMessages
  };
};

export default useWildGuessShare;
