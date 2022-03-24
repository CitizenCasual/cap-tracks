import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
const SALT_ROUNDS = 6

const ticketSchema = new mongoose.Schema({
  ticketOwner: {type: Schema.Types.ObjectId, ref: 'Profile'},
  fare: Number,
  startStation: String,
  endStation: String,
  time: Date,
}, {
  timestamps: true,
})

const favoriteRoutesSchema = new mongoose.Schema({

})

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, lowercase: true, unique: true },
  googleId: String,
  password: String,
  isSenior: Boolean,
  tickets: [ticketSchema],
  profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"}
}, {
  timestamps: true,
})

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password
    return ret
  },
})

userSchema.pre('save', function (next) {
  const user = this
  if (!user.isModified('password')) return next()
  bcrypt.hash(user.password, SALT_ROUNDS)
  .then(hash => {
    user.password = hash
    next()
  })
  .catch(err => {
    next(err)
  })
})

userSchema.methods.comparePassword = function (tryPassword, cb) {
  bcrypt.compare(tryPassword, this.password, cb)
}

const User = mongoose.model('User', userSchema)
const Ticket = mongoose.model('Ticket', ticketSchema)
const favoriteRoutes = mongoose.model('FavoriteRoutes', favoriteRoutesSchema)

export { User, Ticket, }