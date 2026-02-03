# Wild Guess Feature - Database Schema Documentation

## Overview
Wild Guess is a real-time anonymous chat game where users can share a link to receive anonymous messages, engage in back-and-forth conversations, and play a guessing challenge with timers and gift rewards.

## Game Flow
1. **Challenge Creation**: User shares a unique link on status
2. **Anonymous User Joins**: Anonymous user sends first message
3. **Real-time Chat**: Both parties exchange messages
4. **Guessing Game**: 
   - Timer starts (default: 300 seconds / 5 minutes)
   - User tries to guess the anonymous person's identity
   - Wrong guess? Timer continues
   - Anonymous user can request a gift to reveal identity if timer expires
5. **Identity Reveal**: Either by correct guess or gift acceptance

---

## Database Tables

### 1. **users**
Core user data for registered members.

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Primary key |
| phone | VARCHAR(20) | User phone number (unique) |
| username | VARCHAR(100) | Display username |
| avatar_url | VARCHAR(255) | Profile picture URL |
| bio | TEXT | User bio/about |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last profile update |
| is_verified | BOOLEAN | Phone verification status |
| free_checks_remaining | INT | Free verification checks left |

---

### 2. **wild_guess_challenges**
Main challenge session tracking.

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Challenge ID |
| target_user_id | INT (FK) | User who shared the link |
| anonymous_user_id | INT (FK) | User playing anonymously (NULL until revealed) |
| challenge_token | VARCHAR(255) | Unique shareable token |
| share_link | VARCHAR(255) | Full shareable URL |
| status | ENUM | 'active', 'identity_guessed', 'identity_revealed', 'expired', 'completed' |
| timer_duration_seconds | INT | Challenge duration (default: 300) |
| timer_started_at | TIMESTAMP | When timer began |
| timer_ends_at | TIMESTAMP | When timer expires |
| is_identity_revealed | BOOLEAN | Has identity been revealed? |
| revealed_by | ENUM | How revealed: 'correct_guess', 'gift_reward', 'manual' |
| target_guessed_user_id | INT (FK) | User ID of correct guess (if any) |
| guess_was_correct | BOOLEAN | Was the guess correct? |
| created_at | TIMESTAMP | Challenge creation time |
| updated_at | TIMESTAMP | Last update |

---

### 3. **wild_guess_messages**
Real-time chat messages during challenge.

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Message ID |
| challenge_id | INT (FK) | Associated challenge |
| sender_user_id | INT (FK) | Message sender (NULL for anonymous) |
| sender_type | ENUM | 'anonymous' or 'registered' |
| message_text | TEXT | Message content |
| message_type | ENUM | 'text', 'emoji', 'hint', 'system' |
| is_read | BOOLEAN | Read status |
| created_at | TIMESTAMP | Message timestamp |

---

### 4. **wild_guess_guesses**
User's guessing attempts during challenge.

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Guess ID |
| challenge_id | INT (FK) | Associated challenge |
| guessed_user_id | INT (FK) | User that was guessed |
| is_correct | BOOLEAN | Was this guess correct? |
| guess_timestamp | TIMESTAMP | When guess was made |
| points_earned | INT | Points awarded (0 if wrong) |
| created_at | TIMESTAMP | Record timestamp |

---

### 5. **wild_guess_gifts**
Reward system for identity revelation.

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Gift ID |
| challenge_id | INT (FK) | Associated challenge |
| requested_by_user_id | INT (FK) | Anonymous user requesting gift |
| recipient_user_id | INT (FK) | Registered user receiving gift |
| gift_type | VARCHAR(100) | Type: 'emoji', 'badge', 'premium', etc. |
| gift_name | VARCHAR(255) | Gift display name |
| gift_emoji | VARCHAR(10) | Emoji representation (e.g., "🎁") |
| gift_description | TEXT | Gift description |
| is_accepted | BOOLEAN | Did user accept gift? |
| acceptance_timestamp | TIMESTAMP | When gift was accepted |
| used_to_reveal | BOOLEAN | Was gift used for reveal? |
| created_at | TIMESTAMP | Request timestamp |

---

### 6. **wild_guess_clues**
Hints shared during the guessing challenge.

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Clue ID |
| challenge_id | INT (FK) | Associated challenge |
| clue_text | TEXT | The clue content |
| clue_type | ENUM | 'personality', 'hobby', 'location', 'work', 'physical', 'emoji' |
| revealed_by_gift | BOOLEAN | Was this clue unlocked via gift? |
| created_at | TIMESTAMP | Clue timestamp |

---

### 7. **wild_guess_stats**
User statistics and leaderboard data.

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Stat record ID |
| user_id | INT (FK, UNIQUE) | Associated user |
| total_challenges | INT | Challenges participated in |
| correct_guesses | INT | Successful identity guesses |
| wrong_guesses | INT | Failed guesses |
| identities_revealed | INT | Times identity was revealed |
| gifts_received | INT | Total gifts received |
| gifts_used | INT | Total gifts used |
| total_points | INT | Cumulative points earned |
| win_streak | INT | Current win streak |
| rank_position | INT | Leaderboard ranking |
| created_at | TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | Last update |

---

### 8. **relationships** (Existing)
Tracks relationship declarations between users.

---

### 9. **checks_history** (Existing)
Audit trail of verification checks.

---

### 10. **trust_signals** (Existing)
Confidence scores for relationships.

---

## Key Features

### Real-Time Chat
- Messages stored with timestamp and sender type (anonymous/registered)
- Message types: text, emoji, hint, system
- Read status tracking

### Game Mechanics
- **Timer**: Configurable countdown (default 5 minutes)
- **Guesses**: Unlimited guesses, track which ones are correct
- **Points**: Awarded for correct guesses
- **Leaderboard**: Ranked by total points

### Reward System
- **Gifts**: Anonymous user requests gift to reveal identity
- **Gift Types**: emoji 🎁, badge 🏆, premium features, etc.
- **Acceptance Flow**: User accepts → can use for reveal

### Identity Reveal Methods
1. **Correct Guess**: User correctly identifies anonymous person
2. **Gift Reward**: Anonymous user gifts item → user accepts → reveals identity
3. **Manual**: Challenge creator manually reveals (admin override)

### Clue System
- Share hints about your identity
- Different categories: personality, hobby, location, work, physical, emoji
- Some clues can be locked behind gift rewards

---

## API Functions Available

### Challenge Management
- `createWildGuessChallenge(targetUserId, timerDuration)` - Create new challenge
- `getChallenge(challengeId)` - Get challenge details
- `getChallengeByChallengeToken(token)` - Find challenge by share link token
- `getUserChallenges(userId)` - Get all challenges for a user
- `updateChallengeStatus(challengeId, status)` - Update challenge state
- `revealChallengeIdentity(challengeId, revealedByUserId, method)` - Reveal identity

### Messaging
- `addWildGuessMessage(challengeId, senderId, senderType, text)` - Send message
- `getChallengeMessages(challengeId)` - Retrieve chat history
- `markMessagesAsRead(challengeId)` - Mark messages as read

### Guessing
- `addWildGuessGuess(challengeId, guessedUserId, isCorrect, points)` - Record guess
- `getChallengeGuesses(challengeId)` - Get all guesses in challenge

### Gifts
- `addWildGuessGift(challengeId, requestedById, recipientId, giftData)` - Request gift
- `acceptWildGuessGift(giftId)` - Accept/claim gift
- `useGiftToReveal(giftId, challengeId)` - Use gift to reveal identity
- `getChallengeGifts(challengeId)` - Get challenge gifts
- `getUserGifts(userId)` - Get user's gift inventory

### Clues
- `addWildGuessClue(challengeId, clueText, clueType)` - Add hint
- `getChallengeClues(challengeId)` - Get all clues

### Stats & Leaderboard
- `getOrCreateUserStats(userId)` - Get user statistics
- `updateUserStats(userId, updates)` - Update stats after game
- `getLeaderboard(limit)` - Get top players

---

## Example Challenge Flow

```
1. User A clicks "Share Challenge"
   → New challenge created with token "abc123xyz"
   → Share link: /wild-guess/abc123xyz

2. User B (anonymous) clicks link, sends message: "Hey! Can you guess who I am?"
   → Message stored, timer starts (5 min)
   → Challenge status: "active"

3. User A replies: "Give me a hint!"
   → Back-and-forth messages exchanged
   → Clues added to challenge

4. User A guesses: "Is it John?"
   → Guess recorded but wrong
   → Points: 0

5. Timer: 2:00 remaining
   → User B requests gift: 🎁 "Premium Badge"
   → User A can accept or continue guessing

6. User A accepts gift
   → Gift marked as accepted
   → Can click "Use Gift to Reveal"
   → Challenge status: "identity_revealed"
   → User B identity disclosed

7. Challenge marked "completed"
   → Stats updated
   → Leaderboard recalculated
```

---

## Indexes for Performance
- `idx_target_user` on `wild_guess_challenges(target_user_id)`
- `idx_status` on `wild_guess_challenges(status)`
- `idx_anonymous_user` on `wild_guess_challenges(anonymous_user_id)`
- `idx_challenge` on `wild_guess_messages(challenge_id)`
- `idx_created_at` on `wild_guess_messages(created_at)` - for sorting
- `idx_points` on `wild_guess_stats(total_points)` - for leaderboard
- `idx_rank` on `wild_guess_stats(rank_position)`

---

## Environment Variables
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=j173s/20000/2025
DB_NAME=heart_buddy
DB_PORT=3306
APP_URL=http://localhost:3000 (for share links)
```

---

## Next Steps
1. Create API endpoints for Wild Guess feature
2. Implement WebSocket for real-time messaging
3. Build frontend UI for challenge creation and chat
4. Add timer logic and notifications
5. Implement leaderboard and stats dashboard
6. Create gift marketplace
