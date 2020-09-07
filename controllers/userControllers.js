var User = require('../models/user');

module.exports = {
    list: function(req, res, next) {
        User.find({}, (err, users) => {
            res.render('users/index', { users: users });
        });
    },

    update_get: function(req, res, next) {
        User.findById(req.params.id, function(err, user) {
            res.render('users/update', { errors: {}, user: user });
        });
    },

    update: function(req, res, next) {
        let update_values = { name: req.body.nombre };
        User.findByIdAndUpdate(req.params.id, update_values, function(err, user) {
            if (err) {
                console.log(err);
                res.render('users/update', {
                    errors: err.errors,
                    user: new User({
                        name: req.body.name,
                        email: req.body.email,
                    }),
                });
            } else {
                res.redirect('users');
                return;
            }
        });
    },

    create_get: function(req, res, next) {
        res.render('users/create', { errors: {}, user: new User() });
    },

    create: function(req, res, next) {
        if (req.body.password != req.body.confirm_password) {
            res.render('users/create', {
                errors: {
                    confirm_password: { message: 'The passwords are incorret' },
                },
                user: new User({ 
                    name: req.body.name, 
                    email: req.body.email 
                }),
            });
            return;
        }

        User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            }, function(err, newUser) {
                if (err) {
                    res.render('users/create', {
                        errors: err.errors,
                        user: new User({
                            name: req.body.name,
                            email: req.body.email,
                        })
                    });
                } else {
                    newUser.sendEmail();
                    res.redirect('/users');
                }
            }
        );
    },
    
    delete: function(req, res, next) {
        User.findByIdAndDelete(req.body.id, function(err) {
            if (err) next(err);
            else res.redirect('/users');
        });
    },
};