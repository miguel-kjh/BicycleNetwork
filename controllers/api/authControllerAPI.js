const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    authenticate: function(req, res, next) {
        User.findOne({ email: req.body.email }, function(err, userInfo) {
            if(err) {
                next(err);
            } else {
                if (userInfo === null) { return res.status(401).json({ status: "error", message: "Email/Bad Password", data: null }); }
                if( userInfo != null && bcrypt.compareSync(req.body.password, userInfo.password)) {
                    const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '7d' });
                    res.status(200).json({ message: "User found", data: { usuario: userInfo, token: token }});
                } else {
                    res.status(401).json({ status: "error", message: "Email/Bad Password", data: null });
                }
            }
        });
    },

    forgotPassword: function(req, res, next) {
        User.findOne({ email: req.body.email }, function(err, user) {
            if (!user) return res.status(401).json({ message: "That user does not exist", data: null });
            user.resetPassword(function(err) {
                if (err) { return next(err); }
                res.status(200).json({ message: "An email was sent to reset the password", data: null });
            });
        });
    },

    authFacebookToken: function (req, res, next) {
        if (req.user) {
            req.user.save().then( () => {
                const token = jwt.sign({ id: req.user.id }, req.app.get('secretKey'), { expiresIn: '7d' });
    
                res.status(200).json({
                    message: 'User not found',
                    data: {
                        user: req.user,
                        token: token
                    }
                });
            }).catch( (err) => {
                console.log(err);
                res.status(500).json({ message: err.message });
            });
    
        } else {
            res.status(401);
        }
    }
}