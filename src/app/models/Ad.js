const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

// Anuncia um item - vendedor
const AdSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    purchasedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'ads'
  }
)

AdSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Ad', AdSchema)
