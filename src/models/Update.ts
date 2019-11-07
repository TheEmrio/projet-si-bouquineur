import mongoose from 'mongoose'
import { User } from './User'
import { Book } from './Book'

export interface Update extends mongoose.Document {
  book: Book
  action: 'WITHDRAW' | 'RETURN'
  user: User
  date: Date
}

export const Update = mongoose.model<Update>('Update', new mongoose.Schema({
  book: { type: mongoose.Types.ObjectId, ref: 'Book' },
  action: String,
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  date: Date
}))
