const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todo = new Schema({
    nametodo: {
        type: String,
        trim: true
    },
}, {
    versionKey: false,
    timestamps: true,
});

module.exports = mongoose.model('Todo', todo);