const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')

// Usuários do sistema
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

/**
 * @description: Método chamado no momento do login para verificar se a senha informada no body(hash) é
 * igual a senha do usuário cadastrada no banco de dados
 */
UserSchema.methods = {
  compareHash (password) {
    return bcrypt.compare(password, this.password)
  }
}

// Métodos estáticos podem ser chamados sem a instância da classe
UserSchema.statics = {
  // Gera o token de autenticação do usuário
  generateToken ({ id }) {
    return jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.ttl
    })
  }
}

module.exports = mongoose.model('User', UserSchema)
