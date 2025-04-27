const mongoose = require('mongoose');

const noticeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Por favor ingrese un título para el aviso'],
    },
    content: {
      type: String,
      required: [true, 'Por favor ingrese el contenido del aviso'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notice', noticeSchema);
