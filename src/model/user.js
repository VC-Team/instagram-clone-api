const { Schema, model } = require("mongoose");
const Types = Schema.Types;

const _schema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  following: {
    type: [Types.ObjectId],
    required: true,
    default: []
  },
  block: {
    type: [Types.ObjectId],
    required: true,
    default: []
  },
  userName: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true,
  },
}, { timestamps: true })

module.exports = model("user", _schema);