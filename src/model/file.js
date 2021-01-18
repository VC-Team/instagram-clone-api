const { Schema, model } = require("mongoose");
const Types = Schema.Types;

const accessTargetScheme = new Schema({
    type: {
        type: String,
        targetId: Types.ObjectId,
    }
})

const _schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    originName: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    ext: {
        type: String,
        default: ""
    },
    info: {
        type: Object,
        default: {},
    },
    createdBy: {
        type: Types.ObjectId,
        required: true,
    },
    mediaType: {
        type: String,
        required: true,
    },
    accessTargets: {
        type: [accessTargetScheme],
        required: false,
    },
    storageName: {
        type: String,
        required: true,
    },
    label: {
        type: Object,
        default: {},
    },
    accessToken: {
        type: String,
        required: true,
    },
}, { timestamps: true })

module.exports = model("file", _schema);
