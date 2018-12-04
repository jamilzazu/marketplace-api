const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'users'
  }
)

/**
 * @description: Hook pré save
 * Verifica se o password não alterado nessa operação, e caso retorne false
 * a senha sera criptografada com o bcryptjs
 */
UserSchema.pre('save', async function (next) {
  // Verifica se o password não foi modificado
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 8)
})

module.exports = mongoose.model('User', UserSchema)
