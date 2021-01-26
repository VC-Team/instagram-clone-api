const { Schema, model } = require("mongoose");
const Types = Schema.Types;

const _schema = new Schema({
    type: {
        type: Number, // [0: like] - [1: comment] - [2: tag] - [3: follow] - [4: accept]
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        required: true
    },
    actionContent: {
        required: false
    },
    receiver: {
        type: [Types.ObjectId],
        require: true
    },
    impactedObjectId: {
        type: Types.ObjectId,
        required: false
    }
}, { timestamps: true })

module.exports = model("notification", _schema);