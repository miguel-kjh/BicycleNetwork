var User = require('../models/user');
var Token = require('../models/token');

module.exports = {
    confirmationGet: function(req, res, next) {
        Token.findOne({ token: req.params.token }, function(err, token) {
            console.log(token + ' ' + token._userId);
            if (!token)
                return res
                    .status(400)
                    .send({ type: 'not-verified', msg: 'No se encontró usuario con ese token' });
            User.findById(token._userId, function(err, user) {
                if (!user) return res.status(400).send({ msg: 'No se encontró a ese usuario' });
                if (user.verified) return res.redirect('/users');
                user.verified = true;
                user.save(function(err){
                    if(err){ return res.status(500).send({msg: err.message}); }
                    res.redirect('/');
                });
            });
        });
    },
};