# Heart Buddy Database Schema Overview

## Database Status: ✅ Connected (MySQL)
- **Database Name**: `heart_buddy`
- **Total Tables**: 10
- **Current State**: All tables created, no data yet

---

## 📊 TABLE STRUCTURE SUMMARY

### 1. **USERS** (Core table for all users)
**Purpose**: Store registered user information

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Unique user ID (auto-increment) |
| phone | VARCHAR(20) UNIQUE | User's phone number (login credential) |
| username | VARCHAR(100) | Display name |
| avatar_url | VARCHAR(255) | Profile picture URL |
| bio | TEXT | User biography |
| is_verified | BOOLEAN | Account verification status |
| free_checks_remaining | INT | Number of free relationship checks (default: 3) |
| created_at | TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Current Data**: 0 rows

---

### 2. **RELATIONSHIPS** (Core feature - relationship tracking)
**Purpose**: Track declared relationships between users

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Unique relationship ID |
| user1_id | INT (FK → users) | First user in relationship |
| user2_id | INT (FK → users) | Second user in relationship |
| status | ENUM | 'pending', 'confirmed', 'declined' |
| is_public | BOOLEAN | Whether relationship is publicly visible (default: TRUE) |
| created_at | TIMESTAMP | When relationship was declared |

**Unique Constraint**: `(user1_id, user2_id)` - prevents duplicate relationships

**Current Data**: 0 rows

---

### 3. **TRUST_SIGNALS** (Risk detection system)
**Purpose**: Store trust/risk indicators for users

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Signal ID |
| user_id | INT (FK → users) | User being flagged |
| relationship_id | INT (FK → relationships) | Related relationship (optional) |
| signal_type | VARCHAR(100) | Type of signal (e.g., 'multiple_declarations') |
| confidence_score | DECIMAL(3,2) | Confidence level (0.00 to 1.00) |
| created_at | TIMESTAMP | When signal was detected |

**Current Data**: 0 rows

---

### 4. **CHECKS_HISTORY** (Relationship lookup tracking)
**Purpose**: Log all relationship status checks performed by users

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Check ID |
| user_id | INT (FK → users) | User performing the check |
| partner_phone | VARCHAR(20) | Phone number being checked |
| result | VARCHAR(50) | Check result status |
| created_at | TIMESTAMP | When check was performed |

**Current Data**: 0 rows

---

## 🎭 WILD GUESS FEATURE TABLES

### 5. **WILD_GUESS_CHALLENGES** (Main challenge table)
**Purpose**: Core table for Wild Guess anonymous challenge sessions

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Challenge ID |
| target_user_id | INT (FK → users) | User who created the challenge |
| anonymous_user_id | INT (FK → users) | The anonymous user (NULL until revealed) |
| challenge_token | VARCHAR(255) UNIQUE | Unique shareable token |
| share_link | VARCHAR(255) | Full shareable URL |
| status | ENUM | 'active', 'identity_guessed', 'identity_revealed', 'expired', 'completed' |
| timer_duration_seconds | INT | Challenge duration (default: 300 = 5 min) |
| timer_started_at | TIMESTAMP | When timer started |
| timer_ends_at | TIMESTAMP | When timer expires |
| is_identity_revealed | BOOLEAN | Whether identity was revealed |
| revealed_by | ENUM | 'correct_guess', 'gift_reward', 'manual' |
| target_guessed_user_id | INT (FK → users) | Who the target guessed |
| guess_was_correct | BOOLEAN | Was the guess correct |
| created_at | TIMESTAMP | Challenge creation time |
| updated_at | TIMESTAMP | Last update time |

**Indexes**: 
- `idx_target_user` on target_user_id
- `idx_status` on status  
- `idx_anonymous_user` on anonymous_user_id

**Current Data**: 0 rows

---

### 6. **WILD_GUESS_MESSAGES** (Real-time chat)
**Purpose**: Store chat messages within challenges

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Message ID |
| challenge_id | INT (FK → wild_guess_challenges) | Parent challenge |
| sender_user_id | INT (FK → users) | Who sent the message |
| sender_type | ENUM | 'anonymous' or 'registered' |
| sender_name | VARCHAR(100) | Name shown for anonymous sender |
| message_text | TEXT | Message content |
| message_type | ENUM | 'text', 'emoji', 'hint', 'system' |
| is_read | BOOLEAN | Read status |
| created_at | TIMESTAMP | When message was sent |

**Indexes**:
- `idx_challenge` on challenge_id
- `idx_created_at` on created_at (for chronological ordering)

**Current Data**: 0 rows

---

### 7. **WILD_GUESS_GUESSES** (Guess attempts tracking)
**Purpose**: Record all guess attempts in challenges

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Guess ID |
| challenge_id | INT (FK → wild_guess_challenges) | Parent challenge |
| guessed_user_id | INT (FK → users) | Who was guessed |
| is_correct | BOOLEAN | Was guess correct |
| guess_timestamp | TIMESTAMP | When guess was made |
| points_earned | INT | Points awarded (default: 0) |
| created_at | TIMESTAMP | Record creation time |

**Indexes**:
- `idx_challenge` on challenge_id
- `idx_correct` on is_correct

**Current Data**: 0 rows

---

### 8. **WILD_GUESS_GIFTS** (Gift/reward system)
**Purpose**: Track gifts requested/sent during challenges

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Gift ID |
| challenge_id | INT (FK → wild_guess_challenges) | Parent challenge |
| requested_by_user_id | INT (FK → users) | Who requested the gift |
| recipient_user_id | INT (FK → users) | Who receives the gift |
| gift_type | VARCHAR(100) | Type of gift (e.g., 'heart_gem', 'iphone17') |
| gift_name | VARCHAR(255) | Display name |
| gift_emoji | VARCHAR(10) | Emoji representation |
| gift_description | TEXT | Gift description |
| is_accepted | BOOLEAN | Whether gift was accepted |
| acceptance_timestamp | TIMESTAMP | When accepted |
| used_to_reveal | BOOLEAN | Whether gift was used to reveal identity |
| created_at | TIMESTAMP | When gift was created |

**Gift Types Available**:
- 💎 heart_gem (Heart Gem)
- 🍫 chocolate (Chocolate)
- 📱 iphone17 (iPhone 17)
- 📱 iphone16 (iPhone 16)
- 💐 bouquet (Bouquet)
- 🌸 flowers (Flowers)
- 👜 pradotx (Pradotx Luxury)
- 🦁 lion (Lion Badge)

**Indexes**:
- `idx_challenge` on challenge_id
- `idx_recipient` on recipient_user_id

**Current Data**: 0 rows

---

### 9. **WILD_GUESS_CLUES** (Hint system)
**Purpose**: Store hints/clues shared by anonymous users

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Clue ID |
| challenge_id | INT (FK → wild_guess_challenges) | Parent challenge |
| clue_text | TEXT | The hint/clue content |
| clue_type | ENUM | 'personality', 'hobby', 'location', 'work', 'physical', 'emoji' |
| revealed_by_gift | BOOLEAN | Whether unlocked via gift |
| created_at | TIMESTAMP | When clue was added |

**Index**: `idx_challenge` on challenge_id

**Current Data**: 0 rows

---

### 10. **WILD_GUESS_STATS** (Leaderboard & user statistics)
**Purpose**: Track user performance metrics for leaderboard

| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Stat ID |
| user_id | INT UNIQUE (FK → users) | User being tracked |
| total_challenges | INT | Total challenges participated in |
| correct_guesses | INT | Number of correct guesses made |
| wrong_guesses | INT | Number of wrong guesses |
| identities_revealed | INT | Times identity was revealed |
| gifts_received | INT | Total gifts received |
| gifts_used | INT | Total gifts used |
| total_points | INT | Cumulative points |
| win_streak | INT | Current winning streak |
| rank_position | INT | Global leaderboard position |
| created_at | TIMESTAMP | Stats record creation |
| updated_at | TIMESTAMP | Last stats update |

**Indexes**:
- `idx_points` on total_points (for leaderboard sorting)
- `idx_rank` on rank_position

**Current Data**: 0 rows

---

## 🔗 KEY RELATIONSHIPS

### Foreign Key Dependencies:
```
users (base table)
  ├── relationships (user1_id, user2_id)
  ├── trust_signals (user_id)
  ├── checks_history (user_id)
  ├── wild_guess_challenges (target_user_id, anonymous_user_id, target_guessed_user_id)
  ├── wild_guess_messages (sender_user_id)
  ├── wild_guess_guesses (guessed_user_id)
  ├── wild_guess_gifts (requested_by_user_id, recipient_user_id)
  └── wild_guess_stats (user_id)

wild_guess_challenges
  ├── wild_guess_messages (challenge_id)
  ├── wild_guess_guesses (challenge_id)
  ├── wild_guess_gifts (challenge_id)
  └── wild_guess_clues (challenge_id)
```

---

## 📝 NOTES

### Database Configuration:
- **Host**: localhost
- **User**: root
- **Password**: [configured in config/database.js]
- **Connection Pool**: Max 10 connections

### Current State:
- ✅ All 10 tables successfully created
- ⚠️ No data in any tables yet
- ✅ All foreign key constraints in place
- ✅ All indexes created

### Next Steps to Populate Data:
1. Create test users via `/api/auth/signup`
2. Create Wild Guess challenges via `/api/wild-guess/create`
3. Send messages via `/api/wild-guess/:challengeId/message`
4. Make guesses via `/api/wild-guess/:challengeId/guess`

---

## 🔄 API Endpoints Using These Tables

### User Management:
- `POST /api/auth/signup` → Creates user in `users` table

### Relationship Features:
- `POST /api/check` → Queries `relationships` and `trust_signals`
- `POST /api/relationships/declare` → Inserts into `relationships`
- `POST /api/relationships/approve` → Updates `relationships`

### Wild Guess Features:
- `POST /api/wild-guess/create` → Creates `wild_guess_challenges`
- `GET /api/wild-guess/:token` → Reads `wild_guess_challenges` + related data
- `POST /api/wild-guess/:challengeId/message` → Inserts into `wild_guess_messages`
- `GET /api/wild-guess/:challengeId/messages` → Queries `wild_guess_messages`
- `POST /api/wild-guess/:challengeId/guess` → Inserts into `wild_guess_guesses`
- `POST /api/wild-guess/:challengeId/request-gift` → Creates `wild_guess_gifts`
- `GET /api/wild-guess/stats/leaderboard` → Queries `wild_guess_stats`
- `GET /api/wild-guess/stats/:userId` → Queries `wild_guess_stats`

---

**Generated**: February 3, 2026
**Status**: ✅ Schema verified and operational
