(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeartBuddyLaunch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/heart-buddy/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/heart-buddy/node_modules/react/index.js [client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'lucide-react'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
;
;
// API Configuration - Vercel will auto-detect this
const API_URL = ("TURBOPACK compile-time truthy", 1) ? window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api' : "TURBOPACK unreachable";
function HeartBuddyLaunch() {
    _s();
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [signedIn, setSignedIn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [checkPhone, setCheckPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [checkResult, setCheckResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [partnerPhone, setPartnerPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [relationships, setRelationships] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Load user from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeartBuddyLaunch.useEffect": ()=>{
            const savedUser = localStorage.getItem("heartBuddyUser");
            if (savedUser) {
                const user = JSON.parse(savedUser);
                setCurrentUser(user);
                setSignedIn(true);
                setPhone(user.phone);
                loadUserRelationships(user.phone);
            }
        }
    }["HeartBuddyLaunch.useEffect"], []);
    // Auto-clear messages after 5 seconds
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeartBuddyLaunch.useEffect": ()=>{
            if (error || success) {
                const timer = setTimeout({
                    "HeartBuddyLaunch.useEffect.timer": ()=>{
                        setError(null);
                        setSuccess(null);
                    }
                }["HeartBuddyLaunch.useEffect.timer"], 5000);
                return ({
                    "HeartBuddyLaunch.useEffect": ()=>clearTimeout(timer)
                })["HeartBuddyLaunch.useEffect"];
            }
        }
    }["HeartBuddyLaunch.useEffect"], [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-rose-50 to-white text-gray-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-white border-b",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-6 py-4 flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 text-pink-600 font-bold text-xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Heart, {
                                    className: "w-6 h-6"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 245,
                                    columnNumber: 13
                                }, this),
                                " Heart Buddy"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 244,
                            columnNumber: 11
                        }, this),
                        !signedIn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "bg-pink-600 text-white px-4 py-2 rounded-lg",
                            children: "Sign up"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 248,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm text-gray-600",
                                    children: [
                                        currentUser?.phone,
                                        " • ",
                                        currentUser?.freeChecksRemaining,
                                        " free checks left"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 253,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSignOut,
                                    className: "text-sm text-gray-600 hover:text-pink-600",
                                    children: "Sign out"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 256,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 252,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                    lineNumber: 243,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                lineNumber: 242,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto px-6 py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertTriangle, {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 271,
                            columnNumber: 13
                        }, this),
                        error
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                    lineNumber: 270,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                lineNumber: 269,
                columnNumber: 9
            }, this),
            success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto px-6 py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckCircle, {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 279,
                            columnNumber: 13
                        }, this),
                        success
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                    lineNumber: 278,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                lineNumber: 277,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-5xl font-extrabold leading-tight",
                                children: [
                                    "Protect Your Heart. Avoid Heartbreaks.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                        lineNumber: 290,
                                        columnNumber: 13
                                    }, this),
                                    "Prevent Cheating."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                lineNumber: 288,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-6 text-gray-600 text-lg",
                                children: "Heart Buddy helps singles and couples date with clarity. Check if someone is already taken, declare relationships safely, detect trust risks, and protect your emotional peace before getting emotionally invested."
                            }, void 0, false, {
                                fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                lineNumber: 293,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-8 flex gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "#check",
                                        className: "bg-pink-600 text-white px-6 py-3 rounded-xl",
                                        children: "Check Someone"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                        lineNumber: 300,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "#declare",
                                        className: "border px-6 py-3 rounded-xl",
                                        children: "Declare Relationship"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                        lineNumber: 303,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                lineNumber: 299,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                        lineNumber: 287,
                        columnNumber: 9
                    }, this),
                    !signedIn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-2xl shadow-xl p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold mb-3",
                                children: "Sign up with your phone number"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                lineNumber: 311,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: phone,
                                onChange: (e)=>setPhone(e.target.value),
                                placeholder: "e.g., +254712345678",
                                className: "w-full border px-4 py-3 rounded-xl mb-3",
                                disabled: loading
                            }, void 0, false, {
                                fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                lineNumber: 312,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSignUp,
                                disabled: loading || !phone,
                                className: "w-full bg-pink-600 text-white py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Loader2, {
                                            className: "w-5 h-5 animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                            lineNumber: 326,
                                            columnNumber: 19
                                        }, this),
                                        "Processing..."
                                    ]
                                }, void 0, true) : "Continue"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                lineNumber: 319,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500 mt-3",
                                children: "No profiles. No oversharing. Just trust."
                            }, void 0, false, {
                                fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                lineNumber: 333,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                        lineNumber: 310,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                lineNumber: 286,
                columnNumber: 7
            }, this),
            signedIn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "check",
                className: "max-w-7xl mx-auto px-6 py-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl shadow p-6 max-w-xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-bold flex items-center gap-2 mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShieldCheck, {
                                    className: "w-5 h-5 text-pink-600"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 345,
                                    columnNumber: 15
                                }, this),
                                " Check If Someone Is Taken"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 344,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 mb-4",
                            children: "Enter a phone number to see whether a relationship has already been declared. We never show private details."
                        }, void 0, false, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 348,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            value: checkPhone,
                            onChange: (e)=>setCheckPhone(e.target.value),
                            placeholder: "Enter phone number (e.g., +254712345678)",
                            className: "w-full border px-4 py-3 rounded-xl mb-3",
                            disabled: loading
                        }, void 0, false, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 352,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleCheck,
                            disabled: loading || !checkPhone,
                            className: "bg-pink-600 text-white w-full py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Loader2, {
                                        className: "w-5 h-5 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                        lineNumber: 366,
                                        columnNumber: 19
                                    }, this),
                                    "Checking..."
                                ]
                            }, void 0, true) : "Run Check"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 359,
                            columnNumber: 13
                        }, this),
                        checkResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 p-4 rounded-xl border bg-gray-50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    className: "block mb-2",
                                    children: [
                                        "Status: ",
                                        checkResult.status
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 375,
                                    columnNumber: 17
                                }, this),
                                checkResult.trustSignals && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-semibold text-orange-600",
                                            children: "Trust Signals:"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                            lineNumber: 378,
                                            columnNumber: 21
                                        }, this),
                                        checkResult.trustSignals.map((signal, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm bg-orange-50 p-2 rounded border border-orange-200",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        className: "capitalize",
                                                        children: [
                                                            signal.type.replace(/_/g, " "),
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                                        lineNumber: 386,
                                                        columnNumber: 25
                                                    }, this),
                                                    " ",
                                                    signal.description
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                                lineNumber: 382,
                                                columnNumber: 23
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 377,
                                    columnNumber: 19
                                }, this),
                                checkResult.details && checkResult.details.verifiedAt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-600 mt-2",
                                    children: [
                                        "Verified on",
                                        " ",
                                        new Date(checkResult.details.verifiedAt).toLocaleDateString()
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 393,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 374,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-gray-500 mt-2",
                            children: [
                                currentUser?.freeChecksRemaining,
                                " free checks remaining. Then KES 100 per search."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 400,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                    lineNumber: 343,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                lineNumber: 342,
                columnNumber: 9
            }, this),
            signedIn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "declare",
                className: "max-w-7xl mx-auto px-6 py-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl shadow p-6 max-w-xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-bold mb-3",
                            children: "Declare a Relationship"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 412,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 mb-4",
                            children: "Declaring a relationship is simple. Enter your partner's phone number and they'll receive a request to approve. Once approved, you both receive a verified digital relationship certificate."
                        }, void 0, false, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 413,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            value: partnerPhone,
                            onChange: (e)=>setPartnerPhone(e.target.value),
                            placeholder: "Partner phone number (e.g., +254712345678)",
                            className: "w-full border px-4 py-3 rounded-xl mb-3",
                            disabled: loading
                        }, void 0, false, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 418,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleDeclareRelationship,
                            disabled: loading || !partnerPhone,
                            className: "bg-pink-600 text-white px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Loader2, {
                                        className: "w-5 h-5 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                        lineNumber: 432,
                                        columnNumber: 19
                                    }, this),
                                    "Processing..."
                                ]
                            }, void 0, true) : "Declare Relationship"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 425,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                    lineNumber: 411,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                lineNumber: 410,
                columnNumber: 9
            }, this),
            signedIn && relationships.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "max-w-7xl mx-auto px-6 py-16",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl shadow p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-bold mb-4",
                            children: "My Relationships"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 447,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: relationships.map((rel)=>{
                                const isInitiator = rel.initiator_phone === currentUser.phone;
                                const partnerPhone = isInitiator ? rel.partner_phone : rel.initiator_phone;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border rounded-xl p-4 bg-gray-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-start mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold",
                                                            children: [
                                                                isInitiator ? "You declared" : "Declared by",
                                                                ": ",
                                                                partnerPhone
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                                            lineNumber: 462,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-600",
                                                            children: [
                                                                "Status:",
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: rel.status === "verified" ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold",
                                                                    children: rel.status === "verified" ? "✓ Verified" : "Pending Approval"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                                                    lineNumber: 467,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                                            lineNumber: 465,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                                    lineNumber: 461,
                                                    columnNumber: 23
                                                }, this),
                                                rel.status === "verified" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `text-xs px-2 py-1 rounded ${rel.is_public ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-700"}`,
                                                    children: rel.is_public ? "Public" : "Private"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                                    lineNumber: 479,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                            lineNumber: 460,
                                            columnNumber: 21
                                        }, this),
                                        rel.status === "pending" && !isInitiator && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleApproveRelationship(rel.id),
                                            className: "mt-3 bg-green-600 text-white px-4 py-2 rounded-lg text-sm",
                                            children: "Approve Relationship"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                            lineNumber: 492,
                                            columnNumber: 23
                                        }, this),
                                        rel.status === "verified" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3 flex gap-3 flex-wrap",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleShareCertificate(rel.certificate_id),
                                                    className: "border px-4 py-2 rounded-lg flex items-center gap-2 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Share2, {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                                            lineNumber: 506,
                                                            columnNumber: 27
                                                        }, this),
                                                        " Share Certificate"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                                    lineNumber: 502,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleTogglePrivacy(rel.id, rel.is_public),
                                                    className: "border px-4 py-2 rounded-lg flex items-center gap-2 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Lock, {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                                            lineNumber: 512,
                                                            columnNumber: 27
                                                        }, this),
                                                        rel.is_public ? "Make Private" : "Make Public"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                                    lineNumber: 508,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                            lineNumber: 501,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, rel.id, true, {
                                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                                    lineNumber: 456,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                            lineNumber: 448,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                    lineNumber: 446,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                lineNumber: 445,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "text-center text-sm text-gray-500 py-10 border-t bg-white",
                children: "© 2026 Heart Buddy – We Prevent Cheating, Not Peace"
            }, void 0, false, {
                fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
                lineNumber: 526,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx",
        lineNumber: 240,
        columnNumber: 5
    }, this);
}
_s(HeartBuddyLaunch, "Ke1Du0jRdVceWGAEAoU2MlUZWyI=");
_c = HeartBuddyLaunch;
var _c;
__turbopack_context__.k.register(_c, "HeartBuddyLaunch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/heart-buddy/pages/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/heart-buddy/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$frontend$2f$HeartBuddyLaunch$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/heart-buddy/frontend/HeartBuddyLaunch.jsx [client] (ecmascript)");
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$heart$2d$buddy$2f$frontend$2f$HeartBuddyLaunch$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/Desktop/heart-buddy/pages/index.js",
        lineNumber: 4,
        columnNumber: 10
    }, this);
}
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/Desktop/heart-buddy/pages/index.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/Desktop/heart-buddy/pages/index.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/Desktop/heart-buddy/pages/index\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/Desktop/heart-buddy/pages/index.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__725556f6._.js.map