# Helplytics AI – Community Support Platform

A production-level multi-page web application built with Next.js, MongoDB, NextAuth, and Tailwind CSS. This platform allows users to request help and offer help within a community, featuring AI-powered suggestions, trust scores, leaderboards, and a messaging system.

---

## 🚀 Features

### Core Pages
- **Landing Page** (`/`) - Hero section with platform overview and stats
- **Dashboard** (`/dashboard`) - Personal stats, recent requests, quick actions
- **Explore** (`/explore`) - Browse all requests with filtering (category, urgency, skills, location)
- **Create Request** (`/create-request`) - Create help requests with AI suggestions
- **Request Detail** (`/request/[id]`) - View request details, offer help, mark as solved
- **Onboarding** (`/onboarding`) - Complete profile setup with AI recommendations
- **Profile** (`/profile`) - View and edit user profile, skills, contributions
- **Leaderboard** (`/leaderboard`) - Rank users by trust score and contributions
- **Messages** (`/messages`) - Basic messaging system between users
- **Notifications** (`/notifications`) - Real-time updates on requests and matches
- **AI Center** (`/ai-center`) - Platform intelligence and trend insights

### AI Features
- **Auto Category Detection** - Detects category from description (Web Dev, Design, Career)
- **Urgency Detection** - Analyzes text for urgency keywords (High, Medium, Low)
- **Tag Suggestions** - Extracts relevant keywords from description
- **Description Rewrite** - Suggests improved versions of request descriptions

### Database Models
- **User** - name, email, skills, interests, location, trustScore, role, contributions, badges
- **Request** - title, description, category, tags, urgency, status, requester, helpers
- **Message** - sender, receiver, content, timestamp, read status
- **Notification** - userId, message, type, read status

### Bonus Features
✅ **Leaderboard System** - Rankings based on trust score and contributions
✅ **Trust Score System** - Dynamic scoring based on solved requests
✅ **Notifications** - Real-time updates for matches, status changes, reputation
✅ **AI Suggestions** - Smart recommendations for categories, tags, urgency

---

## 📦 Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with JWT strategy
- **Styling**: Tailwind CSS 4
- **UI Design**: Card-based, Notion/Stripe inspired design

---

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB instance

### Environment Variables
Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/helphub?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd helplytics-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:3000`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (pages)/
│   │   ├── ai-center/
│   │   ├── create-request/
│   │   ├── dashboard/
│   │   ├── explore/
│   │   ├── leaderboard/
│   │   ├── login/
│   │   ├── messages/
│   │   ├── notifications/
│   │   ├── onboarding/
│   │   ├── profile/
│   │   ├── request/[id]/
│   │   ├── signup/
│   │   └── page.js (Landing)
│   ├── api/
│   │   ├── ai/
│   │   │   └── suggestions/route.js
│   │   ├── auth/[...nextauth]/route.js
│   │   ├── messages/
│   │   │   ├── route.js
│   │   │   └── conversations/route.js
│   │   ├── notifications/
│   │   │   ├── route.js
│   │   │   └── count/route.js
│   │   ├── requests/
│   │   │   ├── route.js
│   │   │   └── [id]/
│   │   │       ├── route.js
│   │   │       ├── help/route.js
│   │   │       └── solve/route.js
│   │   └── users/
│   │       ├── leaderboard/route.js
│   │       ├── list/route.js
│   │       ├── onboarding/route.js
│   │       └── profile/route.js
│   ├── components/
│   │   ├── Badge.js
│   │   ├── HeroCard.js
│   │   ├── Navbar.js
│   │   └── SessionWrapper.js
│   ├── layout.js
│   └── globals.css
├── lib/
│   ├── ai.js
│   ├── mongodb.js
│   └── users.js
├── models/
│   ├── Message.js
│   ├── Notification.js
│   ├── Request.js
│   └── User.js
└── middleware.js
```

---

## 🔐 Authentication

Authentication is implemented using NextAuth.js with:
- Credentials provider (email/password)
- JWT session strategy
- Protected routes via session check
- MongoDB user storage with bcrypt password hashing

### Demo Users (Pre-configured)
- Ayesha Khan - `community@helphub.ai` / `password`
- Sara Noor - `sara@helphub.ai` / `password`
- Hassan Ali - `hassan@helphub.ai` / `password`

---

## 🤖 AI Implementation

The AI features are implemented using simple keyword-based logic:

### Category Detection
- Web Development: react, javascript, html, css, bug
- Design: figma, design, ui, ux
- Career: resume, interview, career

### Urgency Detection
- High: urgent, asap, deadline, tomorrow, stuck
- Medium: soon, help, review
- Low: Default

### Tag Extraction
Extracts relevant keywords from description and capitalizes them.

---

## 🎨 Design System

### Colors
- Primary: `#119D88` (Brand teal)
- Dark: `#1A2421` (Dark backgrounds)
- Light: `#FBFDFB` (Card backgrounds)
- Base: `#F8FAF9` (Page background)

### Typography
- Font: Geist Sans (variable)
- Monospace: Geist Mono

### Components
- **HeroCard**: Large hero sections with dark background
- **Badge**: Status indicators with variants
- **Cards**: White backgrounds with subtle borders and shadows
- **Buttons**: Rounded-full pills with primary/secondary variants

---

## 🛣️ API Routes

### Requests
- `GET /api/requests` - List all requests (with filters)
- `POST /api/requests` - Create new request
- `GET /api/requests/[id]` - Get request details
- `PUT /api/requests/[id]` - Update request
- `POST /api/requests/[id]/help` - Offer/withdraw help
- `POST /api/requests/[id]/solve` - Mark as solved/open

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/onboarding` - Complete onboarding
- `GET /api/users/leaderboard` - Get leaderboard rankings
- `GET /api/users/list` - Get all users list

### Messages
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get conversation list

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications` - Mark all as read
- `GET /api/notifications/count` - Get unread count

### AI
- `POST /api/ai/suggestions` - Get AI suggestions for request

---

## 📱 Responsive Design

The application is fully responsive:
- Mobile: Single column layouts
- Tablet: 2-column grids
- Desktop: Full multi-column layouts with sticky sidebars

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Variables for Production
Ensure these are set in your production environment:
- `MONGO_URI` - MongoDB connection string
- `NEXTAUTH_SECRET` - Random secret key
- `NEXTAUTH_URL` - Your production URL

---

## 📝 License

This project is built for educational purposes as part of the SMIT Grand Coding Night 2026.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 🐛 Known Issues

- Messages are not real-time (polling-based)
- AI suggestions use simple keyword matching
- Image uploads are not supported for requests

---

## 📧 Support

For support, email support@helphub.ai or join our community Discord.
