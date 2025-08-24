# PenOrbit Blog

A simple blog website built with Next.js where users can read, write, and share posts.

## Features

- Read blog posts
- Write new posts
- User authentication (sign in/up)
- Like and comment on posts
- Admin dashboard with global loading states
- Newsletter subscription
- Contact form
- Search posts
- Real-time processing indicators

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Admin Login

- Email: `admin@penorbit.com`
- Password: `123456`

## Admin Dashboard Features

- User management (suspend/activate/delete)
- Post management (suspend/activate/delete)
- Comment moderation
- Newsletter subscriber management
- Contact message handling
- Global loading states for all operations
- Processing indicators during updates

## Tech Stack

- **Framework:** Next.js 15
- **Styling:** Tailwind CSS
- **Database:** MongoDB (Production Ready)
- **Authentication:** NextAuth.js
- **Icons:** React Icons

## Project Structure

```
src/
├── app/
│   ├── about/         # About page
│   ├── admin/         # Admin dashboard
│   ├── api/           # API routes
│   ├── auth/          # Authentication pages
│   ├── Components/    # Reusable components
│   ├── contact/       # Contact page
│   ├── createblog/    # Blog creation page
│   ├── post/          # Individual post pages
│   ├── profile/       # User profile
│   └── search/        # Search functionality
├── hooks/             # Custom React hooks
└── lib/               # Utilities and database
data/                  # JSON database files
public/                # Static assets
```
