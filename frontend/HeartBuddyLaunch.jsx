import React, { useState, useEffect } from "react";
import { Heart, ShieldCheck, CheckCircle, Share2, Lock, AlertTriangle, Loader2, Sparkles, Gift, MessageCircle, Zap, Crown, Flower, Smartphone, Gem, Wine } from "lucide-react";

// API Configuration - Vercel will auto-detect this
const API_URL = typeof window !== 'undefined' 
  ? (window.location.hostname === 'localhost' 
      ? 'http://localhost:3001/api' 
      : '/api')
  : '/api';

// Gift type mappings with emojis and descriptions
const GIFT_TYPES = {
  heart_gem: { emoji: '💎', label: 'Heart Gem', description: 'A precious gem of love' },
  chocolate: { emoji: '🍫', label: 'Chocolate', description: 'Sweet treat for you' },
  iphone17: { emoji: '📱', label: 'iPhone 17', description: 'Latest iPhone model' },
  iphone16: { emoji: '📱', label: 'iPhone 16', description: 'Premium smartphone' },
  bouquet: { emoji: '💐', label: 'Bouquet', description: 'Beautiful flowers' },
  flowers: { emoji: '🌸', label: 'Flowers', description: 'Fresh blooms' },
  pradotx: { emoji: '👜', label: 'Pradotx Luxury', description: 'Luxury gift' },
  lion: { emoji: '🦁', label: 'Lion', description: 'Wild & fierce' }
};

// Enhanced gift configuration with rarity, colors, and icons
const ENHANCED_GIFTS = {
  heart_gem: {
    name: 'Heart Gem',
    rarity: 'legendary',
    icon: Gem,
    color: 'from-red-400 to-pink-500',
    bgColor: 'from-red-50 to-pink-100',
    borderColor: 'border-red-300',
    glowColor: 'shadow-red-500/50',
    value: '⭐⭐⭐⭐⭐',
    description: 'A precious gem of pure love'
  },
  chocolate: {
    name: 'Chocolate',
    rarity: 'common',
    icon: Wine,
    color: 'from-amber-600 to-orange-500',
    bgColor: 'from-amber-50 to-orange-100',
    borderColor: 'border-amber-300',
    glowColor: 'shadow-amber-500/30',
    value: '⭐⭐',
    description: 'Sweet chocolate treat'
  },
  iphone17: {
    name: 'iPhone 17',
    rarity: 'legendary',
    icon: Smartphone,
    color: 'from-slate-900 to-slate-700',
    bgColor: 'from-slate-50 to-gray-100',
    borderColor: 'border-slate-400',
    glowColor: 'shadow-slate-500/50',
    value: '⭐⭐⭐⭐⭐',
    description: 'Latest generation phone'
  },
  iphone16: {
    name: 'iPhone 16',
    rarity: 'rare',
    icon: Smartphone,
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'from-cyan-50 to-blue-100',
    borderColor: 'border-cyan-300',
    glowColor: 'shadow-cyan-500/40',
    value: '⭐⭐⭐⭐',
    description: 'Premium smartphone'
  },
  bouquet: {
    name: 'Bouquet',
    rarity: 'rare',
    icon: Flower,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-50 to-pink-100',
    borderColor: 'border-purple-300',
    glowColor: 'shadow-purple-500/40',
    value: '⭐⭐⭐⭐',
    description: 'Beautiful flower arrangement'
  },
  flowers: {
    name: 'Flowers',
    rarity: 'common',
    icon: Flower,
    color: 'from-rose-400 to-pink-400',
    bgColor: 'from-rose-50 to-pink-100',
    borderColor: 'border-rose-300',
    glowColor: 'shadow-rose-500/30',
    value: '⭐⭐⭐',
    description: 'Fresh blooms'
  },
  pradotx: {
    name: 'Pradotx Luxury',
    rarity: 'legendary',
    icon: Crown,
    color: 'from-yellow-600 to-amber-500',
    bgColor: 'from-yellow-50 to-amber-100',
    borderColor: 'border-yellow-400',
    glowColor: 'shadow-yellow-500/50',
    value: '⭐⭐⭐⭐⭐',
    description: 'Ultra-luxury brand gift'
  },
  lion: {
    name: 'Lion',
    rarity: 'rare',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-50 to-red-100',
    borderColor: 'border-orange-400',
    glowColor: 'shadow-orange-500/40',
    value: '⭐⭐⭐⭐',
    description: 'Wild & fierce spirit'
  }
};

// Confetti component
const Confetti = ({ show }) => {
  if (!show) return null;

  const confetti = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 2 + Math.random() * 1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-bounce"
          style={{
            left: `${c.left}%`,
            top: '-10px',
            animation: `fall ${c.duration}s linear forwards`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Enhanced Gift Card Component
const GiftCard = ({ gift, giftInfo, isNew }) => {
  const IconComponent = giftInfo.icon;
  const rarityColors = {
    common: 'bg-gray-200 text-gray-800',
    rare: 'bg-blue-200 text-blue-800',
    legendary: 'bg-gradient-to-r from-yellow-300 to-orange-300 text-gray-900',
  };

  return (
    <div
      className={`relative bg-gradient-to-br ${giftInfo.bgColor} border-2 ${giftInfo.borderColor} rounded-3xl p-6 text-center shadow-xl ${giftInfo.glowColor} shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 ${
        isNew ? 'animate-slideIn' : ''
      }`}
      style={{
        animation: isNew ? 'slideIn 0.6s ease-out' : 'none',
      }}
    >
      {/* Rarity Badge */}
      <div className="absolute -top-3 -right-3">
        <span className={`${rarityColors[giftInfo.rarity]} px-3 py-1 rounded-full text-xs font-bold uppercase shadow-lg`}>
          {giftInfo.rarity}
        </span>
      </div>

      {/* Icon */}
      <div className={`bg-gradient-to-br ${giftInfo.color} p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-3 text-white shadow-lg`}>
        <IconComponent size={32} />
      </div>

      {/* Gift Name */}
      <h4 className="text-sm font-bold text-gray-800 mb-1">{giftInfo.name}</h4>

      {/* Value Stars */}
      <p className="text-xs font-semibold text-amber-600 mb-2">{giftInfo.value}</p>

      {/* Description */}
      <p className="text-xs text-gray-600 mb-3">{giftInfo.description}</p>

      {/* Date */}
      <p className="text-xs text-gray-500">
        {new Date(gift.created_at).toLocaleDateString()}
      </p>

      {/* Shine effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default function HeartBuddyLaunch() {
  const [showSignup, setShowSignup] = useState(false);
  const [phone, setPhone] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [checkPhone, setCheckPhone] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [partnerPhone, setPartnerPhone] = useState("");
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [nglMessage, setNglMessage] = useState("");
  const [nglRecipientPhone, setNglRecipientPhone] = useState("");
  const [nglMessages, setNglMessages] = useState([]);
  const [guessPhone, setGuessPhone] = useState("");
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [userGifts, setUserGifts] = useState([]);
  const [showNglTab, setShowNglTab] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newGiftId, setNewGiftId] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("heartBuddyUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setSignedIn(true);
      setPhone(user.phone);
      loadUserRelationships(user.phone);
      loadNglMessages(user.phone);
      loadUserGifts(user.phone);
    }
  }, []);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Load user relationships
  const loadUserRelationships = async (userPhone) => {
    try {
      const response = await fetch(`${API_URL}/relationships/${userPhone}`);
      const data = await response.json();
      if (response.ok) {
        setRelationships(data.relationships);
      }
    } catch (err) {
      console.error("Failed to load relationships:", err);
    }
  };

  // Load NGL messages
  const loadNglMessages = async (userPhone) => {
    try {
      const response = await fetch(`${API_URL}/ngl/messages/${userPhone}`);
      const data = await response.json();
      if (response.ok) {
        setNglMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to load NGL messages:", err);
    }
  };

  // Load user gifts
  const loadUserGifts = async (userPhone) => {
    try {
      const response = await fetch(`${API_URL}/ngl/gifts/${userPhone}`);
      const data = await response.json();
      if (response.ok) {
        const oldLength = userGifts.length;
        const newGifts = data.gifts;
        setUserGifts(newGifts);
        
        // If new gift received, show confetti and highlight it
        if (newGifts.length > oldLength) {
          const latestGift = newGifts[0];
          setNewGiftId(latestGift.id);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);
          setTimeout(() => setNewGiftId(null), 4000);
        }
      }
    } catch (err) {
      console.error("Failed to load gifts:", err);
    }
  };

  // Handle sign up/login
  const handleSignUp = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setCurrentUser(data.user);
      setSignedIn(true);
      localStorage.setItem("heartBuddyUser", JSON.stringify(data.user));
      setSuccess(data.message);
      loadUserRelationships(data.user.phone);
    } catch (err) {
      setError("Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle checking someone
  const handleCheck = async () => {
    setError(null);
    setSuccess(null);
    setCheckResult(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkerPhone: currentUser.phone,
          checkPhone: checkPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message);
        setLoading(false);
        return;
      }

      setCheckResult(data.result);
      setCurrentUser({ ...currentUser, freeChecksRemaining: data.freeChecksRemaining });
      localStorage.setItem("heartBuddyUser", JSON.stringify({
        ...currentUser,
        freeChecksRemaining: data.freeChecksRemaining
      }));
    } catch (err) {
      setError("Failed to perform check. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle declaring relationship
  const handleDeclareRelationship = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/relationships/declare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initiatorPhone: currentUser.phone,
          partnerPhone: partnerPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setSuccess("Relationship declaration sent! Waiting for partner approval.");
      setPartnerPhone("");
      loadUserRelationships(currentUser.phone);
    } catch (err) {
      setError("Failed to declare relationship. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle approving relationship
  const handleApproveRelationship = async (relationshipId) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/relationships/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerPhone: currentUser.phone,
          relationshipId: relationshipId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setSuccess("Relationship verified successfully!");
      loadUserRelationships(currentUser.phone);
    } catch (err) {
      setError("Failed to approve relationship. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle privacy toggle
  const handleTogglePrivacy = async (relationshipId, currentIsPublic) => {
    try {
      const response = await fetch(`${API_URL}/relationships/${relationshipId}/privacy`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPublic: !currentIsPublic,
          userPhone: currentUser.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        loadUserRelationships(currentUser.phone);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to update privacy settings.");
    }
  };

  // Handle share certificate
  const handleShareCertificate = (certificateId) => {
    const url = `${window.location.origin}/certificate/${certificateId}`;
    navigator.clipboard.writeText(url);
    setSuccess("Certificate link copied to clipboard!");
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("heartBuddyUser");
    setSignedIn(false);
    setCurrentUser(null);
    setPhone("");
    setRelationships([]);
    setCheckResult(null);
  };

  // Handle sending anonymous message
  const handleSendNgl = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/ngl/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientPhone: nglRecipientPhone,
          message: nglMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setSuccess("Anonymous message sent! Your secret is safe 🤐");
      setNglMessage("");
      setNglRecipientPhone("");
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle guessing sender
  const handleGuessNgl = async (messageId) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/ngl/guess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: messageId,
          recipientPhone: currentUser.phone,
          guessedPhone: guessPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setSuccess("Great guess! You've earned a gift! 🎁");
      await handleSendGift(messageId, guessPhone);
      setGuessPhone("");
      setActiveMessageId(null);
      loadNglMessages(currentUser.phone);
    } catch (err) {
      setError("Failed to record guess. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle sending gift
  const handleSendGift = async (messageId, toPhone) => {
    try {
      // Random gift type from available gifts
      const giftTypes = Object.keys(GIFT_TYPES);
      const randomGift = giftTypes[Math.floor(Math.random() * giftTypes.length)];
      
      const response = await fetch(`${API_URL}/ngl/gift`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromPhone: currentUser.phone,
          toPhone: toPhone,
          giftType: randomGift,
          messageId: messageId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        loadUserGifts(toPhone);
      }
    } catch (err) {
      console.error("Failed to send gift:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-blue-100 text-gray-900 font-sans">
      {/* HEADER */}
      <header className="backdrop-blur-md bg-white/70 shadow-md border-b sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-pink-600 font-extrabold text-2xl tracking-tight drop-shadow-sm">
            <Heart className="w-7 h-7" /> Heart Buddy
          </div>
          {!signedIn ? (
            <button className="bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-5 py-2 rounded-xl shadow-lg font-semibold hover:scale-105 transition-transform">
              Sign up
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-xs md:text-sm text-gray-600 bg-white/60 px-3 py-1 rounded-full shadow">
                {currentUser?.phone} • {currentUser?.freeChecksRemaining} free checks left
              </span>
              <button
                onClick={handleSignOut}
                className="text-xs md:text-sm text-gray-600 hover:text-pink-600 font-semibold px-3 py-1 rounded-full hover:bg-pink-50 transition"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ALERTS */}
      {error && (
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="bg-gradient-to-r from-red-100 to-pink-100 border border-red-300 text-red-800 px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg animate-pulse">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      )}
      {success && (
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="bg-gradient-to-r from-green-100 to-blue-100 border border-green-300 text-green-800 px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">{success}</span>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        {!signedIn && !showSignup && (
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-gray-900 drop-shadow">
                Find Love, Not Lies.<br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-fuchsia-500">Verify Relationships. Build Trust.</span>
              </h1>
              <p className="mt-6 text-gray-700 text-lg md:text-xl font-medium">
                Heart Buddy is your digital shield against heartbreak. Instantly check if someone is already in a relationship, declare your love with mutual consent, and get a verifiable digital certificate. No oversharing, just trust.
              </p>
              <ul className="mt-8 space-y-3 text-gray-700 text-base">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> 100% privacy-first verification</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> No fake profiles, no catfishing</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Free checks for new users</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Digital certificate for verified couples</li>
              </ul>
              <div className="mt-10">
                <button
                  className="bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-8 py-3 rounded-2xl shadow-lg font-bold text-lg hover:scale-105 transition-transform"
                  onClick={() => setShowSignup(true)}
                >
                  Get Started
                </button>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center gap-6">
              <div className="w-full h-64 md:h-80 bg-gradient-to-br from-pink-200 via-fuchsia-100 to-blue-100 rounded-3xl shadow-2xl flex items-center justify-center">
                <Heart className="w-32 h-32 text-pink-400 drop-shadow-lg animate-pulse" />
              </div>
              <div className="w-full bg-white/80 rounded-2xl p-6 shadow-lg border border-pink-100">
                <p className="font-semibold text-pink-600 mb-2">What users say:</p>
                <div className="text-gray-700 text-sm space-y-2">
                  <p>“I found out the truth before it was too late. Thank you Heart Buddy!”</p>
                  <p>“The certificate gave us peace of mind as a couple.”</p>
                  <p>“No more guessing. I trust again.”</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {!signedIn && showSignup && (
          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-pink-100">
            <h3 className="font-bold text-lg mb-4 text-pink-600">Sign up with your phone number</h3>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., +254712345678"
              className="w-full border-2 border-pink-200 focus:border-pink-400 px-4 py-3 rounded-xl mb-4 outline-none transition"
              disabled={loading}
            />
            <button
              onClick={handleSignUp}
              disabled={loading || !phone}
              className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue"
              )}
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">
              No profiles. No oversharing. Just trust.
            </p>
            <button
              className="mt-6 text-pink-500 underline text-xs hover:text-fuchsia-600"
              onClick={() => setShowSignup(false)}
            >
              ← Back to Home
            </button>
          </div>
        )}
        {signedIn && (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-gray-900 drop-shadow">
                Protect Your Heart.<br className="hidden md:block" /> Avoid Heartbreaks.<br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-fuchsia-500">Prevent Cheating.</span>
              </h1>
              <p className="mt-6 text-gray-700 text-lg md:text-xl font-medium">
                Heart Buddy helps singles and couples date with clarity. Check if someone is already taken, declare relationships safely, detect trust risks, and protect your emotional peace before getting emotionally invested.
              </p>
              <div className="mt-8 flex gap-4">
                <a href="#check" className="bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-7 py-3 rounded-2xl shadow-lg font-semibold hover:scale-105 transition-transform">
                  Check Someone
                </a>
                <a href="#declare" className="border-2 border-pink-400 text-pink-600 px-7 py-3 rounded-2xl font-semibold hover:bg-pink-50 transition">
                  Declare Relationship
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* CHECK SOMEONE */}
      {signedIn && (
        <section id="check" className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-pink-100">
            <h3 className="text-2xl font-extrabold flex items-center gap-2 mb-3 text-pink-600">
              <ShieldCheck className="w-6 h-6" /> Check If Someone Is Taken
            </h3>
            <p className="text-gray-700 mb-4 font-medium">
              Enter a phone number to see whether a relationship has already been declared. We never show private details.
            </p>
            <input
              value={checkPhone}
              onChange={(e) => setCheckPhone(e.target.value)}
              placeholder="Enter phone number (e.g., +254712345678)"
              className="w-full border-2 border-pink-200 focus:border-pink-400 px-4 py-3 rounded-xl mb-4 outline-none transition"
              disabled={loading}
            />
            <button
              onClick={handleCheck}
              disabled={loading || !checkPhone}
              className="bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white w-full py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Checking...
                </>
              ) : (
                "Run Check"
              )}
            </button>
            {checkResult && (
              <div className="mt-6 p-5 rounded-2xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white shadow-inner">
                <strong className="block mb-2 text-lg">Status: {checkResult.status}</strong>
                {checkResult.trustSignals && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm font-semibold text-orange-600">
                      Trust Signals:
                    </p>
                    {checkResult.trustSignals.map((signal, idx) => (
                      <div
                        key={idx}
                        className="text-sm bg-orange-50 p-2 rounded border border-orange-200"
                      >
                        <strong className="capitalize">{signal.type.replace(/_/g, " ")}:</strong>{" "}
                        {signal.description}
                      </div>
                    ))}
                  </div>
                )}
                {checkResult.details && checkResult.details.verifiedAt && (
                  <p className="text-sm text-gray-600 mt-2">
                    Verified on {new Date(checkResult.details.verifiedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-4 text-center">
              {currentUser?.freeChecksRemaining} free checks remaining. Then KES 100 per search.
            </p>
          </div>
        </section>
      )}

      {/* DECLARE RELATIONSHIP */}
      {signedIn && (
        <section id="declare" className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-pink-100">
            <h3 className="text-2xl font-extrabold mb-3 text-pink-600">Declare a Relationship</h3>
            <p className="text-gray-700 mb-4 font-medium">
              Declaring a relationship is simple. Enter your partner's phone number and they'll receive a request to approve. Once approved, you both receive a verified digital relationship certificate.
            </p>
            <input
              value={partnerPhone}
              onChange={(e) => setPartnerPhone(e.target.value)}
              placeholder="Partner phone number (e.g., +254712345678)"
              className="w-full border-2 border-pink-200 focus:border-pink-400 px-4 py-3 rounded-xl mb-4 outline-none transition"
              disabled={loading}
            />
            <button
              onClick={handleDeclareRelationship}
              disabled={loading || !partnerPhone}
              className="bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-7 py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Declare Relationship"
              )}
            </button>
          </div>
        </section>
      )}

      {/* MY RELATIONSHIPS */}
      {signedIn && relationships.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-pink-100">
            <h3 className="text-2xl font-extrabold mb-6 text-pink-600">My Relationships</h3>
            <div className="space-y-6">
              {relationships.map((rel) => {
                const isInitiator = rel.initiator_phone === currentUser.phone;
                const partnerPhone = isInitiator ? rel.partner_phone : rel.initiator_phone;
                return (
                  <div
                    key={rel.id}
                    className="border-2 border-pink-200 rounded-2xl p-5 bg-gradient-to-br from-pink-50 to-white shadow-inner flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <p className="font-semibold text-lg text-gray-800">
                        {isInitiator ? "You declared" : "Declared by"}: <span className="text-pink-600">{partnerPhone}</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Status: <span className={rel.status === "verified" ? "text-green-600 font-bold" : "text-yellow-600 font-bold"}>
                          {rel.status === "verified" ? "✓ Verified" : "Pending Approval"}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
                      {rel.status === "verified" && (
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${rel.is_public ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-700"}`}>
                          {rel.is_public ? "Public" : "Private"}
                        </span>
                      )}
                      {rel.status === "pending" && !isInitiator && (
                        <button
                          onClick={() => handleApproveRelationship(rel.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:scale-105 transition-transform"
                        >
                          Approve Relationship
                        </button>
                      )}
                      {rel.status === "verified" && (
                        <>
                          <button
                            onClick={() => handleShareCertificate(rel.certificate_id)}
                            className="border-2 border-pink-400 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-pink-50 transition"
                          >
                            <Share2 className="w-4 h-4" /> Share Certificate
                          </button>
                          <button
                            onClick={() => handleTogglePrivacy(rel.id, rel.is_public)}
                            className="border-2 border-pink-400 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-pink-50 transition"
                          >
                            <Lock className="w-4 h-4" />
                            {rel.is_public ? "Make Private" : "Make Public"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* NGL FEATURE */}
      {signedIn && (
        <section className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-purple-200">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-2xl font-extrabold text-purple-600">
                <span className="flex items-center gap-2"><Sparkles className="w-6 h-6" /> NGL (Not Gonna Lie)</span>
              </h3>
            </div>

            {/* SEND ANONYMOUS MESSAGE */}
            <div className="mb-8 pb-8 border-b border-purple-100">
              <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-500" /> Send Anonymous Message
              </h4>
              <p className="text-sm text-gray-600 mb-4">Send a private message anonymously to someone. They'll try to guess who sent it!</p>
              <input
                value={nglRecipientPhone}
                onChange={(e) => setNglRecipientPhone(e.target.value)}
                placeholder="Recipient's phone number (e.g., +254712345678)"
                className="w-full border-2 border-purple-200 focus:border-purple-400 px-4 py-3 rounded-xl mb-3 outline-none transition"
                disabled={loading}
              />
              <textarea
                value={nglMessage}
                onChange={(e) => setNglMessage(e.target.value)}
                placeholder="Write your anonymous message... (keep it kind!)"
                className="w-full border-2 border-purple-200 focus:border-purple-400 px-4 py-3 rounded-xl mb-3 outline-none transition resize-none"
                rows="3"
                disabled={loading}
              />
              <button
                onClick={handleSendNgl}
                disabled={loading || !nglMessage.trim() || !nglRecipientPhone}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 transition-transform"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Anonymously"
                )}
              </button>
            </div>

            {/* RECEIVE & GUESS MESSAGES */}
            {nglMessages.length > 0 && (
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-purple-500" /> Messages for You ({nglMessages.length})
                </h4>
                <div className="space-y-4">
                  {nglMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="border-2 border-purple-200 rounded-2xl p-5 bg-gradient-to-br from-purple-50 to-white shadow-inner"
                    >
                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl mb-4">
                        <p className="text-gray-800 italic">"{msg.message}"</p>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">
                        Received {new Date(msg.created_at).toLocaleDateString()} • Status: {msg.guessed ? "✓ Guessed" : "Pending"}
                      </p>
                      
                      {!msg.guessed && (
                        <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder="Who sent this? (+254...)"
                            value={activeMessageId === msg.id ? guessPhone : ""}
                            onChange={(e) => {
                              setActiveMessageId(msg.id);
                              setGuessPhone(e.target.value);
                            }}
                            disabled={loading || activeMessageId !== msg.id}
                            className="flex-1 border-2 border-purple-200 focus:border-purple-400 px-3 py-2 rounded-lg outline-none transition text-sm"
                          />
                          <button
                            onClick={() => handleGuessNgl(msg.id)}
                            disabled={loading || activeMessageId !== msg.id || !guessPhone}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            Guess!
                          </button>
                        </div>
                      )}
                      {msg.guessed && (
                        <div className="bg-green-100 border border-green-300 text-green-800 px-3 py-2 rounded-lg text-sm font-semibold">
                          ✓ You guessed correctly! Check your gifts 🎁
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {nglMessages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No anonymous messages yet. Share your link to receive some!</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* GIFTS DISPLAY */}
      {signedIn && userGifts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-yellow-300">
            <h3 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 flex items-center gap-3">
              <Gift className="w-8 h-8 text-yellow-600" /> 
              Your Gift Collection 
              <span className="text-2xl text-yellow-500 font-bold">({userGifts.length})</span>
            </h3>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
              <div className="bg-white/60 rounded-2xl p-3 border border-yellow-200">
                <p className="text-2xl font-bold text-yellow-600">{userGifts.length}</p>
                <p className="text-xs text-gray-600">Total Gifts</p>
              </div>
              <div className="bg-white/60 rounded-2xl p-3 border border-yellow-200">
                <p className="text-2xl font-bold text-purple-600">
                  {userGifts.filter(g => ENHANCED_GIFTS[g.gift_type]?.rarity === 'legendary').length}
                </p>
                <p className="text-xs text-gray-600">Legendary</p>
              </div>
              <div className="bg-white/60 rounded-2xl p-3 border border-yellow-200">
                <p className="text-2xl font-bold text-blue-600">
                  {userGifts.filter(g => ENHANCED_GIFTS[g.gift_type]?.rarity === 'rare').length}
                </p>
                <p className="text-xs text-gray-600">Rare</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {userGifts.map((gift) => {
                const giftInfo = ENHANCED_GIFTS[gift.gift_type];
                const isNew = newGiftId === gift.id;
                return (
                  <GiftCard
                    key={gift.id}
                    gift={gift}
                    giftInfo={giftInfo}
                    isNew={isNew}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Confetti effect */}
      <Confetti show={showConfetti} />

      {/* FOOTER */}
      <footer className="text-center text-xs md:text-sm text-gray-500 py-8 border-t bg-white/70 backdrop-blur-md mt-10 shadow-inner">
        <span className="font-semibold text-pink-600">© 2026 Heart Buddy</span> – We Prevent Cheating, Not Peace
      </footer>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-slideIn {
          animation: slideIn 0.6s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
