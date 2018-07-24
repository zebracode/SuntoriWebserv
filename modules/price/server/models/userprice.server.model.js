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
    bkPrice0: {
        type: Number,
        default: 0
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
    bkPrice8: {
        type: Number,
        default: 0
    },
    bkPrice9: {
            type: Number,
            default: 0
        },
    bkPrice10: {
            type: Number,
            default: 0
        },
    bkPrice11: {
            type: Number,
            default: 0
        },
    bkPrice12: {
            type: Number,
            default: 0
        },
    bkPrice13: {
                type: Number,
                default: 0
            },
    bkPrice14: {
                type: Number,
                default: 0
            },
    bkPrice15: {
                type: Number,
                default: 0
            },
    bkPrice16: {
                type: Number,
                default: 0
            },
    bkPrice17: {
        type: Number,
        default: 0
    },
    bkPrice18: {
            type: Number,
            default: 0
        },
    bkPrice19: {
            type: Number,
            default: 0
        },
    bkPrice20: {
            type: Number,
            default: 0
        },
    bkPrice21: {
            type: Number,
            default: 0
        },
    bkPrice22: {
                type: Number,
                default: 0
            },
    bkPrice23: {
                type: Number,
                default: 0
            },
    bkPrice24: {
                type: Number,
                default: 0
            },
    bkPrice25: {
                type: Number,
                default: 0
            },
    bkPrice26: {
            type: Number,
            default: 0
        },
    bkPrice27: {
            type: Number,
            default: 0
        },
    bkPrice28: {
            type: Number,
            default: 0
        },
    bkPrice29: {
                type: Number,
                default: 0
            },
    bkPrice30: {
                type: Number,
                default: 0
            },
    bkPrice31: {
                type: Number,
                default: 0
            },
    ctPrice0: {
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
    },
    ctPrice8: {
        type: Number,
        default: 0
    },
    ctPrice9: {
        type: Number,
        default: 0
    },
    ctPrice10: {
        type: Number,
        default: 0
    },
    ctPrice11: {
        type: Number,
        default: 0
    },
    ctPrice12: {
        type: Number,
        default: 0
    },
    ctPrice13: {
        type: Number,
        default: 0
    },
    ctPrice14: {
        type: Number,
        default: 0
    },
    ctPrice15: {
        type: Number,
        default: 0
    },
    ctPrice16: {
        type: Number,
        default: 0
    },
    ctPrice17: {
        type: Number,
        default: 0
    },
    ctPrice18: {
        type: Number,
        default: 0
    },
    ctPrice19: {
        type: Number,
        default: 0
    },
    ctPrice20: {
        type: Number,
        default: 0
    },
    ctPrice21: {
        type: Number,
        default: 0
    },
    ctPrice22: {
        type: Number,
        default: 0
    },
    ctPrice23: {
        type: Number,
        default: 0
    },
    ctPrice24: {
        type: Number,
        default: 0
    },
    ctPrice25: {
        type: Number,
        default: 0
    },
    ctPrice26: {
        type: Number,
        default: 0
    },
    ctPrice27: {
        type: Number,
        default: 0
    },
    ctPrice28: {
        type: Number,
        default: 0
    },
    ctPrice29: {
        type: Number,
        default: 0
    },
    ctPrice30: {
        type: Number,
        default: 0
    },
    ctPrice31: {
        type: Number,
        default: 0
    }
});

mongoose.model('UserPrice', UserPriceSchema);
