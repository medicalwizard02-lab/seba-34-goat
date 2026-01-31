<<<<<<< HEAD
# Heart Buddy

A relationship verification platform that helps individuals and couples make informed decisions through transparent relationship declarations and privacy-first verification.

## Overview

Heart Buddy provides a secure platform where users can:
- Verify whether a relationship has been declared
- Declare relationships with mutual partner approval
- Manage relationship privacy settings
- Generate verifiable digital relationship certificates
- Interact with the system without exposing sensitive personal data

The platform is designed around consent, minimal data exposure, and clarity.

## Features

### Core Functionality
- **User Authentication**: Phone-based signup and login
- **Relationship Verification**: Check whether a relationship has been declared
- **Relationship Declaration**: Mutual partner approval workflow
- **Privacy Controls**: Public or private relationship visibility
- **Digital Certificates**: Verifiable relationship confirmation artifacts
- **Check History**: Audit trail of verification attempts

### Technical Features
- RESTful API architecture
- JSON-based data persistence
- CORS-enabled API access
- Centralized error handling
- Phone number validation (Kenyan format)
- Demo data for development and testing

## Technology Stack

### Backend
- **Runtime**: Node.js (>= 14.x)
- **Framework**: Express.js
- **Architecture**: REST API
- **Storage**: JSON file persistence
- **Middleware**: CORS, request validation

### Frontend
- **Framework**: React
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

### Deployment
- **Platform**: Vercel
- **Model**: Serverless functions

## Project Structure
heart-buddy/
├── api/
│ └── index.js # Backend API server
├── frontend/
│ └── HeartBuddyLaunch.jsx # Frontend component
├── package.json
├── vercel.json
├── .gitignore
└── README.md


## Installation

### Prerequisites
- Node.js version 14.x or higher
- npm or yarn

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd heart-buddy
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001/api`

4. Test the health endpoint:
```bash
curl http://localhost:3001/api/health
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register or login user

### Relationship Verification
- `POST /api/check` - Check if someone is in a relationship

### Relationship Management
- `POST /api/relationships/declare` - Declare a new relationship
- `POST /api/relationships/approve` - Approve a relationship request
- `GET /api/relationships/:phone` - Get user's relationships
- `PATCH /api/relationships/:relationshipId/privacy` - Update privacy settings

### Certificates
- `GET /api/certificate/:certificateId` - Get relationship certificate

### System
- `GET /api/health` - Health check endpoint

## Phone Number Format

All phone numbers must be in Kenyan format:
- Format: `+254XXXXXXXXX`
- Length: 13 characters
- Example: `+254712345678`

## Demo Data

The platform includes demo data for testing:

| Phone Number | Status |
|--------------|--------|
| `+254711111111` | In verified relationship with `+254722222222` |
| `+254722222222` | In verified relationship with `+254711111111` |
| `+254733333333` | Has trust risk signals detected |
| Any other number | Not declared in any relationship |

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid input)
- `402` - Payment Required (no free checks remaining)
- `403` - Forbidden (unauthorized action)
- `404` - Not Found
- `409` - Conflict (duplicate relationship)
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```

## Security Considerations

- Phone number validation on all endpoints
- Relationship approval requires partner verification
- Private relationships not exposed in searches
- Certificate IDs are cryptographically generated
- Input sanitization and validation

## Data Storage

The application uses JSON file storage (`/tmp/database.json` on Vercel) with the following structure:

- **users**: User accounts with phone numbers and free check counts
- **relationships**: Relationship declarations and verifications
- **trustSignals**: Warning indicators and risk signals
- **checksHistory**: Audit trail of all verification checks

## Frontend Integration

The React component is located in `frontend/HeartBuddyLaunch.jsx` and includes:

- User authentication flow
- Relationship checking interface
- Relationship declaration forms
- Relationship management dashboard
- Real-time API integration
- Loading states and error handling
- Success notifications

### Using the Frontend Component

```javascript
import HeartBuddyLaunch from './frontend/HeartBuddyLaunch';

function App() {
  return <HeartBuddyLaunch />;
}

export default App;
```

## Testing

### Manual Testing

1. Start the server:
```bash
npm run dev
```

2. Test health endpoint:
```bash
curl http://localhost:3001/api/health
```

3. Test signup:
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"phone":"+254700000001"}'
```

4. Test checking someone:
```bash
curl -X POST http://localhost:3001/api/check \
  -H "Content-Type: application/json" \
  -d '{
    "checkerPhone":"+254700000001",
    "checkPhone":"+254711111111"
  }'
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Database Issues
The database is automatically recreated with demo data on startup if it doesn't exist or is corrupted.

### Deployment Issues
- Ensure all files are committed to Git
- Verify `vercel.json` configuration is correct
- Check Vercel deployment logs for errors

## Contributing

This is a production application. For modifications:

1. Create a new branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- Check the API documentation above
- Review error messages in responses
- Verify phone number format
- Ensure all dependencies are installed

## Changelog

### Version 1.0.0 (2026-01-31)
- Initial release
- Complete API implementation
- Frontend integration
- Vercel deployment support
- Demo data included
- Comprehensive documentation

---

**Heart Buddy** - We Prevent Cheating, Not Peace © 2026

=======
# JUN-_goat-
>>>>>>> 8b35a740176246ff33cd8d1b60d0f92bae929c52
