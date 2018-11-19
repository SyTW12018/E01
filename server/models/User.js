import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: { type: 'String', required: true },
  email: { type: 'String', required: true },
  password: { type: 'String', required: true },
  slug: { type: 'String' },
  cuid: { type: 'String', required: true, index: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
});

export default mongoose.model('User', userSchema);
