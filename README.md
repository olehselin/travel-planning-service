# Travel Planning Service

A modern travel planning application built with React, TypeScript, and Firebase. This MVP allows users to create trips, add places, and collaborate with others through email invitations.

## 🚀 Features

### ✅ Authentication

- User registration and login with Firebase Authentication
- Protected routes with role-based access
- Persistent authentication state
- Email verification support

### ✅ Trip Management

- Create, read, update, and delete trips
- Add trip details (title, description, start/end dates)
- Date validation (start date ≤ end date)
- Search and filter trips by title
- Responsive trip cards with status indicators

### ✅ Places Management

- Add places to trips with day numbers
- Organize places by day (sorted by dayNumber)
- Add notes for each place
- Edit and delete places
- Day-based organization for trip planning

### ✅ Collaboration System

- **Email invitations** via EmailJS integration
- **Role-based access control** (Owner/Collaborator)
- **Invite management** with expiration (24 hours)
- **Token-based invite acceptance**
- **Duplicate invite prevention**
- **Self-invite prevention**
- **Fallback mode** (console URL) for testing

### ✅ Email Integration

- **Multiple email providers** supported:
  - EmailJS (200 emails/month free)
  - Resend API (3000 emails/month free)
  - Gmail SMTP (500 emails/day free)
- **Email setup UI** for easy configuration
- **Template-based emails** with trip details
- **Automatic fallback** to console mode

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **State Management**: Zustand
- **Authentication & Database**: Firebase (Auth + Firestore)
- **UI Components**: Shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Email Service**: EmailJS, Resend API, Gmail SMTP
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Form Handling**: Radix UI Forms

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components (Button, Card, Input, etc.)
│   ├── Layout.tsx      # Main layout with navigation
│   ├── ProtectedRoute.tsx # Route protection wrapper
│   ├── ErrorBoundary.tsx  # Error handling component
│   ├── EmailSetup.tsx  # Email configuration component
│   └── EmailTest.tsx   # Email testing component
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/                # Utility libraries
│   ├── firebase.ts     # Firebase configuration
│   ├── utils.ts        # Utility functions
│   └── permissions.ts  # Permission checking utilities
├── pages/              # Page components
│   ├── LoginPage.tsx   # User login
│   ├── RegisterPage.tsx # User registration
│   ├── TripsPage.tsx   # Trip list with search
│   ├── TripDetailsPage.tsx # Trip details and places
│   ├── TripAccessPage.tsx # Manage trip access
│   ├── AcceptInvitePage.tsx # Accept email invitations
│   └── EmailSetupPage.tsx # Email service configuration
├── services/           # API services
│   ├── authService.ts  # Authentication service
│   ├── tripsService.ts # Trip management service
│   ├── emailService.ts # Email service (Firebase Functions)
│   └── freeEmailService.ts # Free email providers
├── stores/             # Zustand stores
│   ├── authStore.ts    # Authentication state
│   └── tripsStore.ts   # Trips and places state
├── types/              # TypeScript type definitions
│   └── index.ts        # All type definitions
├── App.tsx             # Main app component with routing
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
  appId: "your-app-id",
};
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

## ✅ Features Status

### 🎯 Core Features (100% Complete)

- [x] **User authentication** (register/login with Firebase)
- [x] **Trip CRUD operations** (create, read, update, delete)
- [x] **Place management** within trips with day organization
- [x] **Date validation** (start date ≤ end date)
- [x] **Search functionality** for trips
- [x] **Responsive design** with modern UI
- [x] **Error handling** with error boundaries

### 🤝 Collaboration Features (100% Complete)

- [x] **Complete email invitation system** with multiple providers
- [x] **Role-based access control** (Owner/Collaborator)
- [x] **Access management interface** for trip owners
- [x] **Invite acceptance page** with token validation
- [x] **Email invitation system** (EmailJS, Resend, Gmail SMTP)
- [x] **Invite expiration** (24 hours)
- [x] **Duplicate invite prevention**
- [x] **Self-invite prevention**
- [x] **Fallback mode** for testing without email setup

### 📧 Email Integration (100% Complete)

- [x] **Multiple email providers** (EmailJS, Resend, Gmail)
- [x] **Email setup UI** for easy configuration
- [x] **Template-based emails** with trip details
- [x] **Automatic fallback** to console mode
- [x] **Email testing functionality**

### 🚀 Future Enhancements (Not Implemented)

- [ ] Real-time collaboration
- [ ] Trip sharing via public links
- [ ] Advanced search and filtering
- [ ] Trip templates
- [ ] Export functionality (PDF, CSV)
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Trip analytics and insights

## 🚀 Deployment

### Firebase Hosting (Recommended)

1. **Build the project:**
```bash
npm run build
```

2. **Deploy to Firebase:**
```bash
firebase deploy --only hosting
```

### Other Hosting Options

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for deployment

### Environment Variables

For production deployment, make sure to:
- Update Firebase configuration in `src/lib/firebase.ts`
- Set up email service credentials
- Configure Firestore security rules

See `DEPLOYMENT.md` for detailed deployment instructions.

## 🧪 Testing

### Manual Testing
1. **Create a user account** and verify registration
2. **Create a trip** and add places
3. **Test email invitations** (with or without email setup)
4. **Test collaboration** by accepting invites
5. **Test permissions** (Owner vs Collaborator access)

### Email Testing
- **With Email Setup**: Real emails will be sent
- **Without Email Setup**: Check browser console for invite URLs
- **Fallback Mode**: Always works for testing

## 📚 Documentation

- `EMAILJS_KEYS_SETUP.md` - EmailJS setup instructions
- `FREE_EMAIL_SETUP.md` - Free email provider options
- `DEPLOYMENT.md` - Detailed deployment guide
- `Description Task.txt` - Original project requirements (Ukrainian)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use existing UI components from `src/components/ui/`
- Maintain responsive design
- Test email functionality in both modes
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** for the beautiful UI components
- **Firebase** for authentication and database
- **EmailJS** for free email service
- **Vite** for fast development experience
