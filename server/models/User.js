import db from "../db/connection.js";

const User = {
  async create(userData) {
    const collection = db.collection('users');
    return await collection.insertOne(userData);
  },

  async findByUsername(username) {
    const collection = db.collection('users');
    return await collection.findOne({ username });
  },

  // Placeholder for other methods
};

export default User;