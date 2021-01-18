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
        type: [CommentsSchema],
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
    medias: {
        type: [Types.ObjectId],
        required: true,
    },
    totalPeopleLike: {
        type: Number,
        required: false
    },
    peopleLike: {
        type: [Types.ObjectId],
        required: false,
        default: []
    },
    comments: {
        type: CommentsSchema,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    createAt: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = model("post", _schema);
