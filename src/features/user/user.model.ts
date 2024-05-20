import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required:  [true, 'Please provide a username']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false
    }
  },
  {
    timestamps: true,
  },
)

const User = mongoose.model('User', userSchema)
export default User
