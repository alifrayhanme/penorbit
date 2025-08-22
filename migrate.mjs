import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dataDir = path.join(process.cwd(), 'data');

async function migrateData() {
  if (!uri) {
    console.error('MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('penorbit');
    
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('posts').deleteMany({});
    await db.collection('subscribers').deleteMany({});
    await db.collection('contacts').deleteMany({});
    await db.collection('counters').deleteMany({});
    
    console.log('Cleared existing collections');
    
    // Migrate users
    const usersPath = path.join(dataDir, 'users.json');
    if (fs.existsSync(usersPath)) {
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      const usersWithMongoDB = users.map(user => ({
        ...user,
        _id: user.id,
        createdAt: new Date()
      }));
      
      if (usersWithMongoDB.length > 0) {
        await db.collection('users').insertMany(usersWithMongoDB);
        console.log(`Migrated ${usersWithMongoDB.length} users`);
        
        // Set counter
        await db.collection('counters').insertOne({
          _id: 'users',
          seq: Math.max(...users.map(u => u.id)) + 1
        });
      }
    }
    
    // Migrate posts
    const postsPath = path.join(dataDir, 'posts.json');
    if (fs.existsSync(postsPath)) {
      const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
      const postsWithMongoDB = posts.map(post => ({
        ...post,
        _id: post.id,
        createdAt: new Date(post.createdAt || new Date()),
        comments: post.comments?.map(comment => ({
          ...comment,
          createdAt: new Date(comment.createdAt || new Date())
        })) || []
      }));
      
      if (postsWithMongoDB.length > 0) {
        await db.collection('posts').insertMany(postsWithMongoDB);
        console.log(`Migrated ${postsWithMongoDB.length} posts`);
        
        // Set counter
        await db.collection('counters').insertOne({
          _id: 'posts',
          seq: Math.max(...posts.map(p => p.id)) + 1
        });
        
        // Set comment counter
        const allCommentIds = posts
          .filter(p => p.comments && p.comments.length > 0)
          .flatMap(p => p.comments.map(c => c.id || 0));
        
        if (allCommentIds.length > 0) {
          await db.collection('counters').insertOne({
            _id: 'comments',
            seq: Math.max(...allCommentIds) + 1
          });
        }
      }
    }
    
    // Migrate subscribers
    const subscribersPath = path.join(dataDir, 'subscribers.json');
    if (fs.existsSync(subscribersPath)) {
      const subscribers = JSON.parse(fs.readFileSync(subscribersPath, 'utf8'));
      const subscribersWithMongoDB = subscribers.map(sub => ({
        ...sub,
        _id: sub.id,
        subscribedAt: new Date(sub.subscribedAt || new Date())
      }));
      
      if (subscribersWithMongoDB.length > 0) {
        await db.collection('subscribers').insertMany(subscribersWithMongoDB);
        console.log(`Migrated ${subscribersWithMongoDB.length} subscribers`);
        
        // Set counter
        await db.collection('counters').insertOne({
          _id: 'subscribers',
          seq: Math.max(...subscribers.map(s => s.id)) + 1
        });
      }
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

migrateData();