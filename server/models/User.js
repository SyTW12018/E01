import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  cuid: {
    type: 'String', required: true, index: true, unique: true,
  },
  name: { type: 'String', required: true },
  email: { type: 'String', required: true, unique: true },
  password: { type: 'String', required: true },
  role: { type: 'String', default: 'registeredUser', required: true },
  slug: { type: 'String' },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});

export default mongoose.model('User', userSchema);
