module.exports = [
"[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeartBuddyLaunch
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/Downloads/heart_buddy-main/heart_buddy-main/node_modules/lucide-react/dist/esm/icons/heart.js [ssr] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/Downloads/heart_buddy-main/heart_buddy-main/node_modules/lucide-react/dist/esm/icons/shield-check.js [ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/Downloads/heart_buddy-main/heart_buddy-main/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/Downloads/heart_buddy-main/heart_buddy-main/node_modules/lucide-react/dist/esm/icons/share-2.js [ssr] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/Downloads/heart_buddy-main/heart_buddy-main/node_modules/lucide-react/dist/esm/icons/lock.js [ssr] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Downloads/heart_buddy-main/heart_buddy-main/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Downloads/heart_buddy-main/heart_buddy-main/node_modules/lucide-react/dist/esm/icons/loader-circle.js [ssr] (ecmascript) <export default as Loader2>");
;
;
;
// API Configuration - Vercel will auto-detect this
const API_URL = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '/api';
function HeartBuddyLaunch() {
    const [showSignup, setShowSignup] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [signedIn, setSignedIn] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [checkPhone, setCheckPhone] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [checkResult, setCheckResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [partnerPhone, setPartnerPhone] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [relationships, setRelationships] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    // Load user from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
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
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (error || success) {
            const timer = setTimeout(()=>{
                setError(null);
                setSuccess(null);
            }, 5000);
            return ()=>clearTimeout(timer);
        }
    }, [
        error,
        success
    ]);
    // Load user relationships
    const loadUserRelationships = async (userPhone)=>{
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
    const handleSignUp = async ()=>{
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    phone
                })
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
        } finally{
            setLoading(false);
        }
    };
    // Handle checking someone
    const handleCheck = async ()=>{
        setError(null);
        setSuccess(null);
        setCheckResult(null);
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/check`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    checkerPhone: currentUser.phone,
                    checkPhone: checkPhone
                })
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || data.message);
                setLoading(false);
                return;
            }
            setCheckResult(data.result);
            setCurrentUser({
                ...currentUser,
                freeChecksRemaining: data.freeChecksRemaining
            });
            localStorage.setItem("heartBuddyUser", JSON.stringify({
                ...currentUser,
                freeChecksRemaining: data.freeChecksRemaining
            }));
        } catch (err) {
            setError("Failed to perform check. Please try again.");
        } finally{
            setLoading(false);
        }
    };
    // Handle declaring relationship
    const handleDeclareRelationship = async ()=>{
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/relationships/declare`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    initiatorPhone: currentUser.phone,
                    partnerPhone: partnerPhone
                })
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
        } finally{
            setLoading(false);
        }
    };
    // Handle approving relationship
    const handleApproveRelationship = async (relationshipId)=>{
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/relationships/approve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    partnerPhone: currentUser.phone,
                    relationshipId: relationshipId
                })
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
        } finally{
            setLoading(false);
        }
    };
    // Handle privacy toggle
    const handleTogglePrivacy = async (relationshipId, currentIsPublic)=>{
        try {
            const response = await fetch(`${API_URL}/relationships/${relationshipId}/privacy`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    isPublic: !currentIsPublic,
                    userPhone: currentUser.phone
                })
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
    const handleShareCertificate = (certificateId)=>{
        const url = `${window.location.origin}/certificate/${certificateId}`;
        navigator.clipboard.writeText(url);
        setSuccess("Certificate link copied to clipboard!");
    };
    // Handle sign out
    const handleSignOut = ()=>{
        localStorage.removeItem("heartBuddyUser");
        setSignedIn(false);
        setCurrentUser(null);
        setPhone("");
        setRelationships([]);
        setCheckResult(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-blue-100 text-gray-900 font-sans",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: "backdrop-blur-md bg-white/70 shadow-md border-b sticky top-0 z-30",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "max-w-4xl mx-auto px-4 py-4 flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 text-pink-600 font-extrabold text-2xl tracking-tight drop-shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                    className: "w-7 h-7"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 246,
                                    columnNumber: 13
                                }, this),
                                " Heart Buddy"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 245,
                            columnNumber: 11
                        }, this),
                        !signedIn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            className: "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-5 py-2 rounded-xl shadow-lg font-semibold hover:scale-105 transition-transform",
                            children: "Sign up"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 249,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-xs md:text-sm text-gray-600 bg-white/60 px-3 py-1 rounded-full shadow",
                                    children: [
                                        currentUser?.phone,
                                        " • ",
                                        currentUser?.freeChecksRemaining,
                                        " free checks left"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 254,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: handleSignOut,
                                    className: "text-xs md:text-sm text-gray-600 hover:text-pink-600 font-semibold px-3 py-1 rounded-full hover:bg-pink-50 transition",
                                    children: "Sign out"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 257,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 253,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                    lineNumber: 244,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                lineNumber: 243,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto px-4 py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-gradient-to-r from-red-100 to-pink-100 border border-red-300 text-red-800 px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg animate-pulse",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 272,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            className: "font-semibold",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 273,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                    lineNumber: 271,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                lineNumber: 270,
                columnNumber: 9
            }, this),
            success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "max-w-2xl mx-auto px-4 py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-gradient-to-r from-green-100 to-blue-100 border border-green-300 text-green-800 px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg animate-fade-in",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 280,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            className: "font-semibold",
                            children: success
                        }, void 0, false, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 281,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                    lineNumber: 279,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                lineNumber: 278,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "max-w-4xl mx-auto px-4 py-16 md:py-24",
                children: [
                    !signedIn && !showSignup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row gap-12 items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                        className: "text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-gray-900 drop-shadow",
                                        children: [
                                            "Find Love, Not Lies.",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {
                                                className: "hidden md:block"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                lineNumber: 292,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-fuchsia-500",
                                                children: "Verify Relationships. Build Trust."
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                lineNumber: 293,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                        lineNumber: 291,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "mt-6 text-gray-700 text-lg md:text-xl font-medium",
                                        children: "Heart Buddy is your digital shield against heartbreak. Instantly check if someone is already in a relationship, declare your love with mutual consent, and get a verifiable digital certificate. No oversharing, just trust."
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                        lineNumber: 295,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                        className: "mt-8 space-y-3 text-gray-700 text-base",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                        className: "w-5 h-5 text-green-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                        lineNumber: 299,
                                                        columnNumber: 57
                                                    }, this),
                                                    " 100% privacy-first verification"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                lineNumber: 299,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                        className: "w-5 h-5 text-green-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                        lineNumber: 300,
                                                        columnNumber: 57
                                                    }, this),
                                                    " No fake profiles, no catfishing"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                lineNumber: 300,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                        className: "w-5 h-5 text-green-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                        lineNumber: 301,
                                                        columnNumber: 57
                                                    }, this),
                                                    " Free checks for new users"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                lineNumber: 301,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                        className: "w-5 h-5 text-green-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                        lineNumber: 302,
                                                        columnNumber: 57
                                                    }, this),
                                                    " Digital certificate for verified couples"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                lineNumber: 302,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                        lineNumber: 298,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "mt-10",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            className: "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-8 py-3 rounded-2xl shadow-lg font-bold text-lg hover:scale-105 transition-transform",
                                            onClick: ()=>setShowSignup(true),
                                            children: "Get Started"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                            lineNumber: 305,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                        lineNumber: 304,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                lineNumber: 290,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex-1 flex flex-col items-center gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-full h-64 md:h-80 bg-gradient-to-br from-pink-200 via-fuchsia-100 to-blue-100 rounded-3xl shadow-2xl flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                            className: "w-32 h-32 text-pink-400 drop-shadow-lg animate-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                            lineNumber: 315,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                        lineNumber: 314,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-full bg-white/80 rounded-2xl p-6 shadow-lg border border-pink-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-pink-600 mb-2",
                                                children: "What users say:"
                                            }, void 0, false, {
                                                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                lineNumber: 318,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "text-gray-700 text-sm space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        children: "“I found out the truth before it was too late. Thank you Heart Buddy!”"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                        lineNumber: 320,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        children: "“The certificate gave us peace of mind as a couple.”"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                        lineNumber: 321,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        children: "“No more guessing. I trust again.”"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                        lineNumber: 322,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                lineNumber: 319,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                        lineNumber: 317,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                lineNumber: 313,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                        lineNumber: 289,
                        columnNumber: 11
                    }, this),
                    !signedIn && showSignup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "max-w-md mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-pink-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-lg mb-4 text-pink-600",
                                children: "Sign up with your phone number"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                lineNumber: 330,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                value: phone,
                                onChange: (e)=>setPhone(e.target.value),
                                placeholder: "e.g., +254712345678",
                                className: "w-full border-2 border-pink-200 focus:border-pink-400 px-4 py-3 rounded-xl mb-4 outline-none transition",
                                disabled: loading
                            }, void 0, false, {
                                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                lineNumber: 331,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: handleSignUp,
                                disabled: loading || !phone,
                                className: "w-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 transition-transform",
                                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            className: "w-5 h-5 animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                            lineNumber: 345,
                                            columnNumber: 19
                                        }, this),
                                        "Processing..."
                                    ]
                                }, void 0, true) : "Continue"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                lineNumber: 338,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500 mt-4 text-center",
                                children: "No profiles. No oversharing. Just trust."
                            }, void 0, false, {
                                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                lineNumber: 352,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                className: "mt-6 text-pink-500 underline text-xs hover:text-fuchsia-600",
                                onClick: ()=>setShowSignup(false),
                                children: "← Back to Home"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                lineNumber: 355,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                        lineNumber: 329,
                        columnNumber: 11
                    }, this),
                    signedIn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-2 gap-12 items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    className: "text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-gray-900 drop-shadow",
                                    children: [
                                        "Protect Your Heart.",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {
                                            className: "hidden md:block"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                            lineNumber: 367,
                                            columnNumber: 36
                                        }, this),
                                        " Avoid Heartbreaks.",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {
                                            className: "hidden md:block"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                            lineNumber: 367,
                                            columnNumber: 89
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-fuchsia-500",
                                            children: "Prevent Cheating."
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                            lineNumber: 368,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 366,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "mt-6 text-gray-700 text-lg md:text-xl font-medium",
                                    children: "Heart Buddy helps singles and couples date with clarity. Check if someone is already taken, declare relationships safely, detect trust risks, and protect your emotional peace before getting emotionally invested."
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 370,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mt-8 flex gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                            href: "#check",
                                            className: "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-7 py-3 rounded-2xl shadow-lg font-semibold hover:scale-105 transition-transform",
                                            children: "Check Someone"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                            lineNumber: 374,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                            href: "#declare",
                                            className: "border-2 border-pink-400 text-pink-600 px-7 py-3 rounded-2xl font-semibold hover:bg-pink-50 transition",
                                            children: "Declare Relationship"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                            lineNumber: 377,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 373,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 365,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                        lineNumber: 364,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                lineNumber: 287,
                columnNumber: 7
            }, this),
            signedIn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                id: "check",
                className: "max-w-4xl mx-auto px-4 py-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-pink-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                            className: "text-2xl font-extrabold flex items-center gap-2 mb-3 text-pink-600",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                    className: "w-6 h-6"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 391,
                                    columnNumber: 15
                                }, this),
                                " Check If Someone Is Taken"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 390,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "text-gray-700 mb-4 font-medium",
                            children: "Enter a phone number to see whether a relationship has already been declared. We never show private details."
                        }, void 0, false, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 393,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            value: checkPhone,
                            onChange: (e)=>setCheckPhone(e.target.value),
                            placeholder: "Enter phone number (e.g., +254712345678)",
                            className: "w-full border-2 border-pink-200 focus:border-pink-400 px-4 py-3 rounded-xl mb-4 outline-none transition",
                            disabled: loading
                        }, void 0, false, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 396,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: handleCheck,
                            disabled: loading || !checkPhone,
                            className: "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white w-full py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 transition-transform",
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "w-5 h-5 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                        lineNumber: 410,
                                        columnNumber: 19
                                    }, this),
                                    "Checking..."
                                ]
                            }, void 0, true) : "Run Check"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 403,
                            columnNumber: 13
                        }, this),
                        checkResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mt-6 p-5 rounded-2xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white shadow-inner",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                    className: "block mb-2 text-lg",
                                    children: [
                                        "Status: ",
                                        checkResult.status
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 419,
                                    columnNumber: 17
                                }, this),
                                checkResult.trustSignals && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mt-2 space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-semibold text-orange-600",
                                            children: "Trust Signals:"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                            lineNumber: 422,
                                            columnNumber: 21
                                        }, this),
                                        checkResult.trustSignals.map((signal, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "text-sm bg-orange-50 p-2 rounded border border-orange-200",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        className: "capitalize",
                                                        children: [
                                                            signal.type.replace(/_/g, " "),
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                        lineNumber: 430,
                                                        columnNumber: 25
                                                    }, this),
                                                    " ",
                                                    signal.description
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                lineNumber: 426,
                                                columnNumber: 23
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 421,
                                    columnNumber: 19
                                }, this),
                                checkResult.details && checkResult.details.verifiedAt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-600 mt-2",
                                    children: [
                                        "Verified on ",
                                        new Date(checkResult.details.verifiedAt).toLocaleDateString()
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 437,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 418,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "text-xs text-gray-500 mt-4 text-center",
                            children: [
                                currentUser?.freeChecksRemaining,
                                " free checks remaining. Then KES 100 per search."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 443,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                    lineNumber: 389,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                lineNumber: 388,
                columnNumber: 9
            }, this),
            signedIn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                id: "declare",
                className: "max-w-4xl mx-auto px-4 py-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-pink-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                            className: "text-2xl font-extrabold mb-3 text-pink-600",
                            children: "Declare a Relationship"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 454,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "text-gray-700 mb-4 font-medium",
                            children: "Declaring a relationship is simple. Enter your partner's phone number and they'll receive a request to approve. Once approved, you both receive a verified digital relationship certificate."
                        }, void 0, false, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 455,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            value: partnerPhone,
                            onChange: (e)=>setPartnerPhone(e.target.value),
                            placeholder: "Partner phone number (e.g., +254712345678)",
                            className: "w-full border-2 border-pink-200 focus:border-pink-400 px-4 py-3 rounded-xl mb-4 outline-none transition",
                            disabled: loading
                        }, void 0, false, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 458,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: handleDeclareRelationship,
                            disabled: loading || !partnerPhone,
                            className: "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-7 py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105 transition-transform",
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "w-5 h-5 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                        lineNumber: 472,
                                        columnNumber: 19
                                    }, this),
                                    "Processing..."
                                ]
                            }, void 0, true) : "Declare Relationship"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 465,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                    lineNumber: 453,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                lineNumber: 452,
                columnNumber: 9
            }, this),
            signedIn && relationships.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "max-w-4xl mx-auto px-4 py-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-pink-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                            className: "text-2xl font-extrabold mb-6 text-pink-600",
                            children: "My Relationships"
                        }, void 0, false, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 487,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: relationships.map((rel)=>{
                                const isInitiator = rel.initiator_phone === currentUser.phone;
                                const partnerPhone = isInitiator ? rel.partner_phone : rel.initiator_phone;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "border-2 border-pink-200 rounded-2xl p-5 bg-gradient-to-br from-pink-50 to-white shadow-inner flex flex-col md:flex-row md:items-center md:justify-between gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold text-lg text-gray-800",
                                                    children: [
                                                        isInitiator ? "You declared" : "Declared by",
                                                        ": ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-pink-600",
                                                            children: partnerPhone
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                            lineNumber: 499,
                                                            columnNumber: 73
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                    lineNumber: 498,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-600 mt-1",
                                                    children: [
                                                        "Status: ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: rel.status === "verified" ? "text-green-600 font-bold" : "text-yellow-600 font-bold",
                                                            children: rel.status === "verified" ? "✓ Verified" : "Pending Approval"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                            lineNumber: 502,
                                                            columnNumber: 33
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                    lineNumber: 501,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                            lineNumber: 497,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center",
                                            children: [
                                                rel.status === "verified" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: `text-xs px-3 py-1 rounded-full font-semibold ${rel.is_public ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-700"}`,
                                                    children: rel.is_public ? "Public" : "Private"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                    lineNumber: 509,
                                                    columnNumber: 25
                                                }, this),
                                                rel.status === "pending" && !isInitiator && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleApproveRelationship(rel.id),
                                                    className: "bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:scale-105 transition-transform",
                                                    children: "Approve Relationship"
                                                }, void 0, false, {
                                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                    lineNumber: 514,
                                                    columnNumber: 25
                                                }, this),
                                                rel.status === "verified" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleShareCertificate(rel.certificate_id),
                                                            className: "border-2 border-pink-400 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-pink-50 transition",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                                    lineNumber: 527,
                                                                    columnNumber: 29
                                                                }, this),
                                                                " Share Certificate"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                            lineNumber: 523,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleTogglePrivacy(rel.id, rel.is_public),
                                                            className: "border-2 border-pink-400 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-pink-50 transition",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                                    lineNumber: 533,
                                                                    columnNumber: 29
                                                                }, this),
                                                                rel.is_public ? "Make Private" : "Make Public"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                                            lineNumber: 529,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                            lineNumber: 507,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, rel.id, true, {
                                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 493,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 488,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                    lineNumber: 486,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                lineNumber: 485,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
                className: "text-center text-xs md:text-sm text-gray-500 py-8 border-t bg-white/70 backdrop-blur-md mt-10 shadow-inner",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "font-semibold text-pink-600",
                        children: "© 2026 Heart Buddy"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                        lineNumber: 549,
                        columnNumber: 9
                    }, this),
                    " – We Prevent Cheating, Not Peace"
                ]
            }, void 0, true, {
                fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
                lineNumber: 548,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx",
        lineNumber: 241,
        columnNumber: 5
    }, this);
}
}),
"[project]/Downloads/heart_buddy-main/heart_buddy-main/pages/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$frontend$2f$HeartBuddyLaunch$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/heart_buddy-main/heart_buddy-main/frontend/HeartBuddyLaunch.jsx [ssr] (ecmascript)");
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$heart_buddy$2d$main$2f$heart_buddy$2d$main$2f$frontend$2f$HeartBuddyLaunch$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/Downloads/heart_buddy-main/heart_buddy-main/pages/index.js",
        lineNumber: 4,
        columnNumber: 10
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__79c66697._.js.map