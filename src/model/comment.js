const { Schema, model } = require("mongoose");
const Types = Schema.Types;

const _schema = new Schema({
    author: {
        type: Types.ObjectId,
        required: true
    },
    postId: {
        type: Types.ObjectId,
        required: false
    },
    parentId: {
        type: Types.ObjectId,
        required: false
    },
    content: {
        type: String,
        required: true
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
    }
})

module.exports = model("comment", _schema);