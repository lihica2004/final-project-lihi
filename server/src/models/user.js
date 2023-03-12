const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  email: {
      type: String,
      unique: true,
      required: true, 
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
            throw new Error('Email is invalid')
        }
      }
  }, 
  password: {
    type: String,
    required: true, 
    trim: true,
    minlength: 7
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

userSchema.virtual('requests', {
  ref: 'Request',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function() {
  console.log("sodjs")
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'finalproject', { expiresIn:
    '1 hour' })

  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user;
}

userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User;
