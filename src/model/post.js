const { Schema, model } = require("mongoose");
const Types = Schema.Types;

const CommentsSchema = new Schema({
    author: {
        type: Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    replies: {
        type: [],
        required: false
    },
    tags: {
        type: String,
        required: false
    }
})

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
    peopleLike: {
        type: [Types.ObjectId],
        required: false,
        default: []
    },
    comments: {
        type: [CommentsSchema],
        required: true
    },
}, { timestamps: true })

module.exports = model("post", _schema);
