var mongoose =  require('mongoose'),
    UserPrice = mongoose.model('UserPrice');

// Error handling method
var getErrorMessage = function(err){
    if (err.errors){
        for(var errName in err.errors) {
            if (err.errors[errName].message) {
                return err.errors[errName].message;
            } else {
                return 'Unknown server error';
            }
        }
    }
};

// Create
exports.create = function(req, res) {
    var userPrice = new UserPrice(req.body);
    userPrice.creator = req.user;
    userPrice.save(function(err){
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(userPrice);
        }
    });
    
};

// List
exports.list = function(req, res) {
    UserPrice.find().sort('-created').populate('owner', 'displayName').exec(function(err, userPrices){
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(userPrices);
        }
    });
};

// Find userPrice by user
exports.userPriceByUser = function(req, res, next, id) {
    UserPrice.findOne({owner: id}).exec(function(err, userPrice){
        if(err){
            return next(err);
        }
        // if(!userPrice) {
        //     return next(new Error('Failed to load userPrice ' + id));
        // }
        req.userPrice = userPrice;
        next();
    });
};

// Read
exports.read = function(req, res) {
    res.json(req.userPrice);
};

// Update
exports.update = function(req, res) {
    var userPrice = req.userPrice;
    userPrice.bkPrice0 = req.body.bkPrice0;
    userPrice.bkPrice1 = req.body.bkPrice1;
    userPrice.bkPrice2 = req.body.bkPrice2;
    userPrice.bkPrice3 = req.body.bkPrice3;
    userPrice.bkPrice4 = req.body.bkPrice4;
    userPrice.bkPrice5 = req.body.bkPrice5;
    userPrice.bkPrice6 = req.body.bkPrice6;
    userPrice.bkPrice7 = req.body.bkPrice7;
    userPrice.bkPrice8 = req.body.bkPrice8;
    userPrice.bkPrice9 = req.body.bkPrice9;
    userPrice.bkPrice10 = req.body.bkPrice10;
    userPrice.bkPrice11 = req.body.bkPrice11;
    userPrice.bkPrice12 = req.body.bkPrice12;
    userPrice.bkPrice13 = req.body.bkPrice13;
    userPrice.bkPrice14 = req.body.bkPrice14;
    userPrice.bkPrice15 = req.body.bkPrice15;
    userPrice.bkPrice16 = req.body.bkPrice16;
    userPrice.bkPrice17 = req.body.bkPrice17;
    userPrice.bkPrice18 = req.body.bkPrice18;
    userPrice.bkPrice19 = req.body.bkPrice19;
    userPrice.bkPrice20 = req.body.bkPrice20;
    userPrice.bkPrice21 = req.body.bkPrice21;
    userPrice.bkPrice22 = req.body.bkPrice22;
    userPrice.bkPrice23 = req.body.bkPrice23;
    userPrice.bkPrice24 = req.body.bkPrice24;
    userPrice.bkPrice25 = req.body.bkPrice25;
    userPrice.bkPrice26 = req.body.bkPrice26;
    userPrice.bkPrice27 = req.body.bkPrice27;
    userPrice.bkPrice28 = req.body.bkPrice28;
    userPrice.bkPrice29 = req.body.bkPrice29;
    userPrice.bkPrice30 = req.body.bkPrice30;
    userPrice.bkPrice31 = req.body.bkPrice31;
    userPrice.ctPrice0 = req.body.ctPrice0;
    userPrice.ctPrice1 = req.body.ctPrice1;
    userPrice.ctPrice2 = req.body.ctPrice2;
    userPrice.ctPrice3 = req.body.ctPrice3;
    userPrice.ctPrice4 = req.body.ctPrice4;
    userPrice.ctPrice5 = req.body.ctPrice5;
    userPrice.ctPrice6 = req.body.ctPrice6;
    userPrice.ctPrice7 = req.body.ctPrice7;
    userPrice.ctPrice8 = req.body.ctPrice8;
    userPrice.ctPrice9 = req.body.ctPrice9;
    userPrice.ctPrice10 = req.body.ctPrice10;
    userPrice.ctPrice11 = req.body.ctPrice11;
    userPrice.ctPrice12 = req.body.ctPrice12;
    userPrice.ctPrice13 = req.body.ctPrice13;
    userPrice.ctPrice14 = req.body.ctPrice14;
    userPrice.ctPrice15 = req.body.ctPrice15;
    userPrice.ctPrice16 = req.body.ctPrice16;
    userPrice.ctPrice17 = req.body.ctPrice17;
    userPrice.ctPrice18 = req.body.ctPrice18;
    userPrice.ctPrice19 = req.body.ctPrice19;
    userPrice.ctPrice20 = req.body.ctPrice20;
    userPrice.ctPrice21 = req.body.ctPrice21;
    userPrice.ctPrice22 = req.body.ctPrice22;
    userPrice.ctPrice23 = req.body.ctPrice23;
    userPrice.ctPrice24 = req.body.ctPrice24;
    userPrice.ctPrice25 = req.body.ctPrice25;
    userPrice.ctPrice26 = req.body.ctPrice26;
    userPrice.ctPrice27 = req.body.ctPrice27;
    userPrice.ctPrice28 = req.body.ctPrice28;
    userPrice.ctPrice29 = req.body.ctPrice29;
    userPrice.ctPrice30 = req.body.ctPrice30;
    userPrice.ctPrice31 = req.body.ctPrice31;

    userPrice.save(function(err){
        if(err){
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(userPrice);
        }
    });
};

// Delete
exports.delete = function(req, res){
    var userPrice = req.userPrice;
    userPrice.remove(function(err){
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(userPrice);
        }
    });
};

