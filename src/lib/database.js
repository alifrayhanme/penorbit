import clientPromise from './mongodb.js';
import { collections, defaultUser, getNextId } from './models.js';

let database;

const getDb = async () => {
  try {
    if (!database) {
      const client = await clientPromise;
      database = client.db('penorbit');
      
      // Ensure default admin user exists
      const adminExists = await database.collection(collections.USERS).findOne({ email: 'admin@penorbit.com' });
      if (!adminExists) {
        await database.collection(collections.USERS).insertOne(defaultUser);
      }
    }
    return database;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
};

const updateReaction = async (post, userId, reactionType) => {
  if (!post.userReactions) post.userReactions = {};
  const current = post.userReactions[userId];
  const opposite = reactionType === 'like' ? 'dislike' : 'like';
  
  if (current === reactionType) {
    delete post.userReactions[userId];
    post[reactionType + 's'] = Math.max(0, (post[reactionType + 's'] || 0) - 1);
  } else {
    if (current === opposite) {
      post[opposite + 's'] = Math.max(0, (post[opposite + 's'] || 0) - 1);
    }
    post.userReactions[userId] = reactionType;
    post[reactionType + 's'] = (post[reactionType + 's'] || 0) + 1;
  }
  return post.userReactions[userId];
};

export const db = {
  // Users
  getUsers: async () => {
    const database = await getDb();
    return await database.collection(collections.USERS).find({}).toArray();
  },
  getUserById: async (id) => {
    const database = await getDb();
    return await database.collection(collections.USERS).findOne({ _id: parseInt(id) });
  },
  getUserByEmail: async (email) => {
    const database = await getDb();
    return await database.collection(collections.USERS).findOne({ email });
  },
  createUser: async (userData) => {
    const database = await getDb();
    const _id = await getNextId(database, collections.USERS);
    const user = { _id, ...userData, status: "active", createdAt: new Date() };
    await database.collection(collections.USERS).insertOne(user);
    return user;
  },
  updateUserStatus: async (userId, status) => {
    const database = await getDb();
    const result = await database.collection(collections.USERS).findOneAndUpdate(
      { _id: parseInt(userId), email: { $ne: "admin@penorbit.com" } },
      { $set: { status } },
      { returnDocument: 'after' }
    );
    return result;
  },
  deleteUser: async (userId) => {
    const database = await getDb();
    const result = await database.collection(collections.USERS).findOneAndDelete(
      { _id: parseInt(userId), email: { $ne: "admin@penorbit.com" } }
    );
    return result;
  },
  updateUserProfile: async (userId, updates) => {
    const database = await getDb();
    const result = await database.collection(collections.USERS).findOneAndUpdate(
      { _id: parseInt(userId) },
      { $set: updates },
      { returnDocument: 'after' }
    );
    return result;
  },

  // Posts
  getPosts: async () => {
    const database = await getDb();
    return await database.collection(collections.POSTS).find({}).sort({ createdAt: -1 }).toArray();
  },
  getPostById: async (id) => {
    const database = await getDb();
    return await database.collection(collections.POSTS).findOne({ _id: parseInt(id) });
  },
  createPost: async (postData) => {
    const database = await getDb();
    const _id = await getNextId(database, collections.POSTS);
    const post = { 
      _id, 
      ...postData, 
      likes: 0, 
      dislikes: 0, 
      comments: [],
      status: 'active',
      createdAt: new Date()
    };
    await database.collection(collections.POSTS).insertOne(post);
    return post;
  },
  updatePost: async (id, updates) => {
    const database = await getDb();
    const result = await database.collection(collections.POSTS).findOneAndUpdate(
      { _id: parseInt(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );
    return result;
  },
  suspendPost: async (id) => {
    const database = await getDb();
    const post = await database.collection(collections.POSTS).findOne({ _id: parseInt(id) });
    if (post) {
      const newStatus = post.status === 'suspended' ? 'active' : 'suspended';
      const result = await database.collection(collections.POSTS).findOneAndUpdate(
        { _id: parseInt(id) },
        { $set: { status: newStatus } },
        { returnDocument: 'after' }
      );
      return result;
    }
    return null;
  },
  deletePost: async (id) => {
    const database = await getDb();
    const result = await database.collection(collections.POSTS).findOneAndDelete({ _id: parseInt(id) });
    return result;
  },
  likePost: async (postId, userId) => {
    const database = await getDb();
    const post = await database.collection(collections.POSTS).findOne({ _id: parseInt(postId) });
    if (post) {
      const userReaction = updateReaction(post, userId, 'like');
      await database.collection(collections.POSTS).updateOne(
        { _id: parseInt(postId) },
        { $set: { likes: post.likes, dislikes: post.dislikes, userReactions: post.userReactions } }
      );
      return { post, userReaction };
    }
    return null;
  },
  dislikePost: async (postId, userId) => {
    const database = await getDb();
    const post = await database.collection(collections.POSTS).findOne({ _id: parseInt(postId) });
    if (post) {
      const userReaction = updateReaction(post, userId, 'dislike');
      await database.collection(collections.POSTS).updateOne(
        { _id: parseInt(postId) },
        { $set: { likes: post.likes, dislikes: post.dislikes, userReactions: post.userReactions } }
      );
      return { post, userReaction };
    }
    return null;
  },
  addComment: async (postId, comment) => {
    const database = await getDb();
    const commentId = await getNextId(database, 'comments');
    const newComment = { 
      id: commentId, 
      ...comment, 
      status: 'active',
      createdAt: new Date()
    };
    const result = await database.collection(collections.POSTS).findOneAndUpdate(
      { _id: parseInt(postId) },
      { $push: { comments: newComment } },
      { returnDocument: 'after' }
    );
    return result;
  },
  deleteComment: async (postId, commentId) => {
    const database = await getDb();
    const result = await database.collection(collections.POSTS).findOneAndUpdate(
      { _id: parseInt(postId) },
      { $pull: { comments: { id: parseInt(commentId) } } },
      { returnDocument: 'after' }
    );
    return result;
  },
  suspendComment: async (postId, commentId) => {
    const database = await getDb();
    const post = await database.collection(collections.POSTS).findOne({ _id: parseInt(postId) });
    if (post?.comments) {
      const comment = post.comments.find(c => c.id === parseInt(commentId));
      if (comment) {
        comment.status = comment.status === 'suspended' ? 'active' : 'suspended';
        await database.collection(collections.POSTS).updateOne(
          { _id: parseInt(postId), "comments.id": parseInt(commentId) },
          { $set: { "comments.$.status": comment.status } }
        );
        return await database.collection(collections.POSTS).findOne({ _id: parseInt(postId) });
      }
    }
    return null;
  },

  // Newsletter
  getSubscribers: async () => {
    const database = await getDb();
    return await database.collection(collections.SUBSCRIBERS).find({}).toArray();
  },
  addSubscriber: async (email) => {
    const database = await getDb();
    const existing = await database.collection(collections.SUBSCRIBERS).findOne({ email });
    if (existing) return null;
    
    const _id = await getNextId(database, collections.SUBSCRIBERS);
    const subscriber = {
      _id,
      email,
      subscribedAt: new Date(),
      status: 'active'
    };
    await database.collection(collections.SUBSCRIBERS).insertOne(subscriber);
    return subscriber;
  },
  removeSubscriber: async (email) => {
    const database = await getDb();
    const result = await database.collection(collections.SUBSCRIBERS).findOneAndDelete({ email });
    return result;
  },

  // Contacts
  getContacts: async () => {
    const database = await getDb();
    return await database.collection(collections.CONTACTS).find({}).sort({ createdAt: -1 }).toArray();
  },
  addContact: async (contactData) => {
    const database = await getDb();
    const _id = await getNextId(database, collections.CONTACTS);
    const contact = {
      _id,
      ...contactData,
      createdAt: new Date()
    };
    await database.collection(collections.CONTACTS).insertOne(contact);
    return contact;
  },
  updateContactStatus: async (id, status) => {
    const database = await getDb();
    const result = await database.collection(collections.CONTACTS).findOneAndUpdate(
      { _id: id },
      { $set: { status } },
      { returnDocument: 'after' }
    );
    return result;
  },
  deleteContact: async (id) => {
    const database = await getDb();
    const result = await database.collection(collections.CONTACTS).findOneAndDelete({ _id: id });
    return result;
  }
};