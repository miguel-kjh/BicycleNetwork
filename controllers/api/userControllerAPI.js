let User = require('../../models/user');

exports.userList = function(req, res){
    User.find({}, function (err, user) {  
        res.status(200).json({
            user: user
        });
    });
};

exports.userCreate = function (req, res) {  
    let user = new User({
        name: req.body.name
    });

    user.save(function (err) { 
        res.status(200).json(user);
    });
};

exports.userBooking = function (req, res) {  
    User.findById(req.body.id, function(err, user) {
        user.booking(req.body.bicycleId, req.body.from, req.body.to, function (err) {
            res.status(200).send();
        })
    })
};