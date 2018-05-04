var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserPriceSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    bkPrice1: {
        type: Number,
        default: 0
    },
    bkPrice2: {
        type: Number,
        default: 0
    },
    bkPrice3: {
        type: Number,
        default: 0
    },
    bkPrice4: {
        type: Number,
        default: 0
    },
    bkPrice5 : {
        type: Number,
        default: 0
    },
    bkPrice6: {
        type: Number,
        default: 0
    },
    bkPrice7: {
        type: Number,
        default: 0
    },
    ctPrice1: {
        type: Number,
        default: 0
    },
    ctPrice2: {
        type: Number,
        default: 0
    },
    ctPrice3: {
        type: Number,
        default: 0
    },
    ctPrice4: {
        type: Number,
        default: 0
    },
    ctPrice5: {
        type: Number,
        default: 0
    },
    ctPrice6: {
        type: Number,
        default: 0
    },
    ctPrice7: {
        type: Number,
        default: 0
    }
});

mongoose.model('UserPrice', UserPriceSchema);