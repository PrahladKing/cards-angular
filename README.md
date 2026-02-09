# Cards Game - Multiplayer Real-time Card Game

A multiplayer card game application built with Angular and Firebase, featuring real-time gameplay and room-based multiplayer functionality similar to Ludo.

## Features

- 🎴 **Real-time Multiplayer**: Play cards with friends in real-time using Firebase Realtime Database
- 🏠 **Room System**: Create or join rooms using 6-digit room codes
- 👥 **Friend Invites**: Share room codes with friends to join games
- 🎮 **Interactive Gameplay**: Select and play cards with a modern UI
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Realtime Database enabled

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Realtime Database** in your Firebase project (for rooms/game data)
3. Enable **Firestore Database** in your Firebase project (for users data)
4. Copy your Firebase configuration from Project Settings
5. Update `src/environments/environment.ts` and `src/environments/environment.prod.ts` with your Firebase credentials:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
};
```

### 3. Configure Firebase Realtime Database Rules

In Firebase Console, go to Realtime Database > Rules and set:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Note**: 
- For production, implement proper authentication and security rules.
- The code includes a fallback mechanism if indexes are not defined. Firebase will automatically create indexes when queries are first executed, but you may see a warning in the console until the index is created.

### 3.1 Configure Firestore Security Rules

In Firebase Console, go to Firestore Database > Rules and set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if true;
    }
  }
}
```

**Note**: For production, implement proper authentication and security rules. The above rules allow public access for development only.

### 4. Run the Application

```bash
npm start
```

The application will be available at `http://localhost:4200`

## How to Play

1. **Create a Room**:
   - Enter your name
   - Click "Create Room"
   - Share the 6-digit room code with friends

2. **Join a Room**:
   - Enter your name and the room code
   - Click "Join Room"

3. **Start the Game**:
   - Wait for at least 2 players to join
   - Host clicks "Start Game" to begin

4. **Gameplay**:
   - Select a card from your hand
   - Click "Play Card" to play it
   - Or click "Draw Card" to draw from the deck
   - Turns rotate automatically

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/           # Home page with room creation/joining
│   │   ├── game-room/      # Game room component
│   │   └── card/           # Card display component
│   ├── services/
│   │   ├── firebase.service.ts    # Firebase operations
│   │   ├── room.service.ts         # Room management
│   │   └── game.service.ts         # Game logic
│   ├── models/
│   │   └── room.model.ts           # TypeScript interfaces
│   └── app.routes.ts       # Routing configuration
└── environments/           # Environment configuration
```

## Technologies Used

- **Angular 20**: Frontend framework
- **Firebase Realtime Database**: Backend for real-time synchronization
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming
- **SCSS**: Styling

## Development

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test
```

## License

MIT
