import React, { useState, useEffect } from "react";
import { Heart, ShieldCheck, CheckCircle, Share2, Lock, AlertTriangle, Loader2 } from "lucide-react";

// API Configuration - Vercel will auto-detect this
const API_URL = typeof window !== 'undefined' 
  ? (window.location.hostname === 'localhost' 
      ? 'http://localhost:3001/api' 
      : '/api')
  : '/api';

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

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("heartBuddyUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setSignedIn(true);
      setPhone(user.phone);
      loadUserRelationships(user.phone);
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

      {/* FOOTER */}
      <footer className="text-center text-xs md:text-sm text-gray-500 py-8 border-t bg-white/70 backdrop-blur-md mt-10 shadow-inner">
        <span className="font-semibold text-pink-600">© 2026 Heart Buddy</span> – We Prevent Cheating, Not Peace
      </footer>
    </div>
  );
}
