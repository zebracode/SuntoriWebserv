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
    userPrice.bkPrice1 = req.body.bkPrice1;
    userPrice.bkPrice2 = req.body.bkPrice2;
    userPrice.bkPrice3 = req.body.bkPrice3;
    userPrice.bkPrice4 = req.body.bkPrice4;
    userPrice.bkPrice5 = req.body.bkPrice5;
    userPrice.bkPrice6 = req.body.bkPrice6;
    userPrice.bkPrice7 = req.body.bkPrice7;
    userPrice.bkPrice8 = req.body.bkPrice8;
    userPrice.ctPrice1 = req.body.ctPrice1;
    userPrice.ctPrice2 = req.body.ctPrice2;
    userPrice.ctPrice3 = req.body.ctPrice3;
    userPrice.ctPrice4 = req.body.ctPrice4;
    userPrice.ctPrice5 = req.body.ctPrice5;
    userPrice.ctPrice6 = req.body.ctPrice6;
    userPrice.ctPrice7 = req.body.ctPrice7;
    userPrice.ctPrice8 = req.body.ctPrice8;

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

