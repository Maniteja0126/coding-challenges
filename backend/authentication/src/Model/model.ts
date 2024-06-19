import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: { type: String },
  password: { type: String }
});

export const UserData = mongoose.model('UserData', userSchema);
