# MongoDB Migration Guide

PenOrbit has been successfully converted from JSON file-based database to MongoDB for production use.

## What Changed

- **Database**: JSON files → MongoDB
- **Connection**: Added MongoDB connection with connection pooling
- **Data Structure**: `id` fields changed to `_id` (MongoDB standard)
- **All API routes**: Updated to handle async database operations

## Environment Setup

Make sure your `.env.local` file contains:
```
MONGODB_URI=mongodb+srv://alifrayhan2024:gc5SEMW2StEMGBQB@cluster0.fxasc6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

## Migration

Your existing data has been migrated to MongoDB:
- ✅ 3 users migrated
- ✅ 1 post migrated  
- ✅ 3 subscribers migrated

## Database Collections

- `users` - User accounts and profiles
- `posts` - Blog posts with comments
- `subscribers` - Newsletter subscribers
- `counters` - Auto-increment counters for IDs

## Production Ready Features

- Connection pooling for better performance
- Proper error handling
- Async/await for all database operations
- MongoDB indexes for better query performance
- Scalable architecture

## Running the Application

```bash
npm run dev    # Development
npm run build  # Build for production
npm start      # Start production server
```

## Re-running Migration (if needed)

```bash
npm run migrate
```

**Note**: Migration will clear existing MongoDB data and re-import from JSON files.

## Default Admin Login

- Email: `admin@penorbit.com`
- Password: `123456`