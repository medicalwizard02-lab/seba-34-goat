# Wild Guess Share Feature - Integration Guide

## Overview
The Wild Guess feature now includes complete WhatsApp, social media, and link-sharing capabilities for registered users to share their challenges.

---

## Features Implemented

### 1. **WhatsApp Share** ✅
- Direct share to WhatsApp with pre-filled message
- Format: `https://wa.me/?text=<message>&link`
- Customizable message template

### 2. **Social Media Sharing** ✅
- **Twitter**: Tweet with challenge link
- **Facebook**: Share to timeline with description
- **Telegram**: Send via Telegram with custom message
- **Email**: Send challenge via email

### 3. **Copy to Clipboard** ✅
- One-click copy of challenge link
- Visual feedback when copied

### 4. **QR Code** ✅
- Generate scannable QR code
- Users can scan to join challenge
- No installation required

### 5. **Embed Code** ✅
- Generate iframe embed code
- For website integration
- Customizable width/height

### 6. **Native Share** ✅
- Uses device's native share sheet (mobile)
- Works on iOS and Android
- Respects device sharing preferences

---

## File Structure

```
heart_buddy-main/
├── pages/
│   └── api/
│       └── wild-guess.js           # API endpoints for challenges
├── components/
│   └── WildGuessShareCard.jsx       # Share UI component
├── hooks/
│   └── useWildGuessShare.js         # Custom React hook
└── config/
    └── dbHelpers.js                 # Database functions
```

---

## API Endpoints

### Create Challenge
```bash
POST /api/wild-guess/create
Content-Type: application/json

{
  "userId": 1,
  "timerDuration": 300
}

Response:
{
  "success": true,
  "challenge": {
    "id": 1,
    "target_user_id": 1,
    "challenge_token": "abc123xyz",
    "share_link": "http://localhost:3000/wild-guess/abc123xyz",
    "status": "active"
  },
  "shareLinks": {
    "app": "http://localhost:3000/wild-guess/abc123xyz",
    "whatsapp": "https://wa.me/?text=...",
    "twitter": "https://twitter.com/intent/tweet?...",
    "facebook": "https://www.facebook.com/sharer/...",
    "telegram": "https://t.me/share/url?...",
    "copy": "http://localhost:3000/wild-guess/abc123xyz"
  }
}
```

### Get Challenge
```bash
GET /api/wild-guess/:challengeToken

Response:
{
  "challenge": { ...challenge data... },
  "messages": [ ...messages... ],
  "guesses": [ ...guesses... ],
  "gifts": [ ...gifts... ],
  "clues": [ ...clues... ]
}
```

### Send Message
```bash
POST /api/wild-guess/:challengeId/message
Content-Type: application/json

{
  "senderId": 1,
  "senderType": "anonymous|registered",
  "messageText": "Hello! Can you guess who I am?",
  "messageType": "text"
}
```

### Make a Guess
```bash
POST /api/wild-guess/:challengeId/guess
Content-Type: application/json

{
  "guessedUserId": 5,
  "targetUserId": 1
}
```

---

## React Component Usage

### Basic Usage
```jsx
import WildGuessShareCard from '@/components/WildGuessShareCard';

function ChallengeCreated() {
  const challenge = {
    id: 1,
    share_link: 'http://localhost:3000/wild-guess/abc123xyz'
  };

  return (
    <div className="p-8">
      <WildGuessShareCard 
        challenge={challenge} 
        userName="John Doe"
      />
    </div>
  );
}
```

### With API Integration
```jsx
import { useState } from 'react';
import WildGuessShareCard from '@/components/WildGuessShareCard';

export default function CreateChallenge() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/wild-guess/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          timerDuration: 300
        })
      });
      
      const data = await response.json();
      setChallenge(data.challenge);
    } catch (error) {
      console.error('Error creating challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  if (challenge) {
    return <WildGuessShareCard challenge={challenge} />;
  }

  return (
    <button 
      onClick={handleCreate}
      disabled={loading}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Creating...' : 'Create Challenge'}
    </button>
  );
}
```

---

## Custom Hook Usage

```jsx
import useWildGuessShare from '@/hooks/useWildGuessShare';

function ShareOptions() {
  const {
    shareToWhatsApp,
    shareToTwitter,
    shareToFacebook,
    shareToTelegram,
    shareViaEmail,
    copyToClipboard,
    copyFeedback
  } = useWildGuessShare();

  const shareLink = 'http://localhost:3000/wild-guess/abc123xyz';

  return (
    <div className="flex gap-3">
      <button onClick={() => shareToWhatsApp(shareLink)}>
        WhatsApp
      </button>
      <button onClick={() => shareToTwitter(shareLink)}>
        Twitter
      </button>
      <button onClick={() => copyToClipboard(shareLink)}>
        {copyFeedback ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}
```

---

## Customization

### Change Share Messages
Edit `useWildGuessShare.js`:

```javascript
const shareMessages = {
  whatsapp: "Your custom WhatsApp message here",
  twitter: "Your custom Twitter message here",
  // ... more messages
};
```

### Modify Component Styling
All components use Tailwind CSS classes. Edit `WildGuessShareCard.jsx` to customize colors:

```jsx
// Change primary color from purple to your brand color
className="bg-gradient-to-r from-purple-600 to-pink-600"
// to
className="bg-gradient-to-r from-[your-color] to-[your-color]"
```

### Adjust Timer Duration
When creating challenge, modify the `timerDuration`:

```javascript
// Default is 300 seconds (5 minutes)
const challenge = await createWildGuessChallenge(userId, 600); // 10 minutes
```

---

## WhatsApp Integration Details

### Message Format
```
🎭 Can you guess who I am? Send me anonymous messages and try to figure out my identity! 👀

Accept the challenge: http://localhost:3000/wild-guess/abc123xyz
```

### How It Works
1. User clicks "Share to WhatsApp" button
2. Automatic WhatsApp Web/App link generated
3. Pre-filled message with challenge link
4. User can select contact and send
5. Recipient clicks link to join challenge

### Supported Devices
- ✅ Desktop (WhatsApp Web)
- ✅ iOS (WhatsApp App)
- ✅ Android (WhatsApp App)
- ✅ WhatsApp Business

---

## Database Integration

### Challenge Table Fields
```sql
- id: Challenge ID
- target_user_id: User who shared challenge
- anonymous_user_id: Anonymous participant (NULL until revealed)
- challenge_token: Unique shareable token
- share_link: Full generated URL
- timer_duration_seconds: Challenge duration
- timer_started_at: When timer began
- timer_ends_at: When timer expires
- status: active|identity_guessed|identity_revealed|expired|completed
```

### Helper Functions
```javascript
// Create challenge with automatic link generation
const challenge = await createWildGuessChallenge(userId, timerDuration);

// Get challenge by token
const challenge = await getChallengeByChallengeToken(token);

// Update challenge status
await updateChallengeStatus(challengeId, 'identity_revealed');

// Get user's challenges
const challenges = await getUserChallenges(userId);
```

---

## Environment Setup

Add to `.env.local`:
```
APP_URL=http://localhost:3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=j173s/20000/2025
DB_NAME=heart_buddy
```

---

## Testing Checklist

- [ ] WhatsApp share opens correct app/web
- [ ] Twitter share includes proper URL encoding
- [ ] Facebook share works without errors
- [ ] Telegram share includes message
- [ ] Email share opens mail client
- [ ] Copy to clipboard works
- [ ] QR code generates and scans correctly
- [ ] Embed code is valid HTML
- [ ] Challenge link is unique for each user
- [ ] Timer countdown works correctly
- [ ] Guess tracking records correctly
- [ ] Gift system functions properly
- [ ] Leaderboard updates after challenges
- [ ] User stats increment correctly

---

## Future Enhancements

### Planned Features
1. **Push Notifications** - Notify when message received
2. **Typing Indicators** - Show when user is typing
3. **Voice Messages** - Send audio in chat
4. **Photo Messages** - Send images in chat
5. **Stickers/Emojis** - Rich message expressions
6. **Challenge History** - View past challenges
7. **Achievements** - Badges for milestones
8. **Custom Timers** - User selectable duration
9. **Challenge Analytics** - View challenge stats
10. **Replay Challenges** - Challenge same person again

---

## Troubleshooting

### WhatsApp Share Not Opening
- Check if WhatsApp is installed
- Verify `https://wa.me/` is accessible
- Try WhatsApp Web as fallback
- Check browser console for errors

### Copy to Clipboard Not Working
- Requires HTTPS in production
- HTTP works in localhost
- Some browsers need permission prompt
- Fallback to manual text selection

### QR Code Not Displaying
- Verify `qrserver.com` API is accessible
- Check internet connection
- Clear browser cache
- Use alternative QR service if needed

### Challenge Link Expired
- Check `timer_ends_at` timestamp
- Verify timer started correctly
- Re-generate link if needed
- Database cleanup job for expired challenges

---

## Security Considerations

1. **HTTPS Required** - Use HTTPS for production
2. **Rate Limiting** - Limit challenge creation per user
3. **Token Validation** - Verify tokens before processing
4. **Input Sanitization** - Sanitize user messages
5. **CORS Configuration** - Restrict API access
6. **SQL Injection** - Use parameterized queries ✅
7. **XSS Protection** - Encode user input ✅
8. **Authentication** - Require login for sharing

---

## Performance Tips

1. **Database Indexes** - Already added on key fields
2. **Caching** - Cache leaderboard data
3. **Pagination** - Paginate messages for large challenges
4. **CDN** - Serve QR code images from CDN
5. **Lazy Loading** - Load components on demand
6. **Connection Pooling** - MySQL already using pool

---

## Support

For issues or questions, check:
- [Wild Guess Schema Documentation](./WILD_GUESS_SCHEMA.md)
- Database helper functions in `config/dbHelpers.js`
- API endpoints in `pages/api/wild-guess.js`
- Component props in `components/WildGuessShareCard.jsx`
