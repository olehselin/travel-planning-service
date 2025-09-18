# Travel Planning Service

A modern travel planning application built with React, TypeScript, and Firebase. This MVP allows users to create trips, add places, and collaborate with others.

## Features

### Authentication
- User registration and login
- Firebase Authentication integration
- Protected routes

### Trip Management
- Create, read, update, and delete trips
- Add trip details (title, description, dates)
- Date validation (start date ≤ end date)
- Search and filter trips

### Places Management
- Add places to trips with day numbers
- Organize places by day
- Add notes for each place
- Edit and delete places

### Collaboration
- Invite users via email to collaborate
- Role-based access control (Owner/Collaborator)
- Manage trip access and permissions

## Tech Stack

- **Frontend**: React 18, TypeScript
- **State Management**: Zustand
- **Authentication & Database**: Firebase
- **UI Components**: Shadcn/ui
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── Layout.tsx      # Main layout component
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── lib/                # Utility libraries
│   ├── firebase.ts     # Firebase configuration
│   └── utils.ts        # Utility functions
├── pages/              # Page components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── TripsPage.tsx
│   ├── TripDetailsPage.tsx
│   └── TripAccessPage.tsx
├── services/           # API services
│   ├── authService.ts
│   └── tripsService.ts
├── stores/             # Zustand stores
│   ├── authStore.ts
│   └── tripsStore.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd travel-planning-service
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase config to `src/lib/firebase.ts`

4. Update Firebase configuration in `src/lib/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
}
```

5. Start the development server:
```bash
npm run dev
```

6. Open http://localhost:5173 in your browser

## Firebase Setup

### Authentication
1. Go to Firebase Console > Authentication
2. Enable Email/Password sign-in method
3. Configure authorized domains

### Firestore Database
1. Go to Firebase Console > Firestore Database
2. Create database in production mode
3. Set up security rules (see below)

### Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Trips: users can read/write their own trips
    match /trips/{tripId} {
      allow read, write: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid || 
         exists(/databases/$(database)/documents/tripAccess/$(tripId + '_' + request.auth.uid)));
    }
    
    // Places: users can read/write places for trips they have access to
    match /places/{placeId} {
      allow read, write: if request.auth != null && 
        (exists(/databases/$(database)/documents/trips/$(resource.data.tripId)) &&
         (get(/databases/$(database)/documents/trips/$(resource.data.tripId)).data.ownerId == request.auth.uid ||
          exists(/databases/$(database)/documents/tripAccess/$(resource.data.tripId + '_' + request.auth.uid))));
    }
    
    // Trip Access: users can read/write access for trips they own
    match /tripAccess/{accessId} {
      allow read, write: if request.auth != null && 
        (resource.data.invitedBy == request.auth.uid ||
         get(/databases/$(database)/documents/trips/$(resource.data.tripId)).data.ownerId == request.auth.uid);
    }
  }
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Routes

- `/` - Home page (redirects to trips)
- `/login` - User login
- `/register` - User registration
- `/trips` - List of user's trips
- `/trips/:id` - Trip details and places
- `/trips/:id/access` - Manage trip access (Owner only)
- `/accept-invite/:token` - Accept invitation by token

## Features Implemented

### ✅ Core Features
- [x] User authentication (register/login)
- [x] Trip CRUD operations
- [x] Place management within trips
- [x] Date validation
- [x] Search functionality
- [x] Responsive design

### ✅ Collaboration Features
- [x] Complete invite system with email simulation
- [x] Role-based access control
- [x] Access management interface
- [x] Invite acceptance page with token validation
- [x] Email invitation system (simulated)
- [x] Invite expiration (24 hours)
- [x] Duplicate invite prevention
- [x] Self-invite prevention
- [ ] Real-time collaboration
- [ ] Trip sharing via public links
- [ ] Advanced search and filtering
- [ ] Trip templates
- [ ] Export functionality
- [ ] Mobile app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
