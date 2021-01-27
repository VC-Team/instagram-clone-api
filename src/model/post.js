const { Schema, model } = require("mongoose");
const Comment = require('../model/comment')
const Types = Schema.Types;

const _schema = new Schema({
    author: {
        type: Types.ObjectId,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    medias: {
        type: [String],
        required: true,
    },
    tags: {
        type: [Types.ObjectId],
        required: false,
        default: []
    },

    peopleLike: {
        type: [Types.ObjectId],
        required: false,
        default: []
    },
}, { timestamps: true })

module.exports = model("post", _schema);
