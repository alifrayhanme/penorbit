// MongoDB collection schemas and helper functions
export const collections = {
  USERS: 'users',
  POSTS: 'posts',
  SUBSCRIBERS: 'subscribers',
  CONTACTS: 'contacts'
};

// Default admin user
export const defaultUser = {
  _id: 1,
  name: "Admin",
  email: "admin@penorbit.com",
  password: "$2b$12$0Y1Ae1hN4BqXHi060us.DOhlsnvHQlwAbYfKtknTrcW.C1rLD/6Ku", // 123456
  role: "admin",
  status: "active",
  profession: "Administrator",
  profilePic: "https://th.bing.com/th/id/R.1a6edf21575a6a9c778312a8eb9c3991?rik=NoEWi%2bBoAsSrJQ&pid=ImgRaw&r=0",
  createdAt: new Date()
};

// Helper function to get next ID
export const getNextId = async (db, collection) => {
  const counter = await db.collection('counters').findOneAndUpdate(
    { _id: collection },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  return counter.seq;
};