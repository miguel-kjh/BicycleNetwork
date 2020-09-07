let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Booking = require('./booking');
let bcrypt = require('bcrypt');
let crypto = require('crypto');
let uniqueValidator = require('mongoose-unique-validator');
let mailer = require('../mailer/mailer');
let Token = require('../models/token');


const saltRounds = 10;

const validateEmail = function (email) {  
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

var userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'the name is required']
    },
    email: {
        type: String,
        trim: true,
        require: [true, 'the name is required'],
        lowercase: true,
        validate: [validateEmail, 'please enter a valid email'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'the password is required']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verified: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(uniqueValidator, {message: 'This email {PATH} already exits'});

userSchema.pre('save', function (next) {
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

userSchema.methods.validPassword = function (password) {  
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.sendEmail = function(cb) {
    const token = new Token({
        _userId: this.id,
        token: crypto.randomBytes(16).toString('hex')
    });
    const emailDestination = this.email;
    
    token.save(function(err) {
        if (err) {
            return console.log(err.message);
        }

        const mailOptions = {
            from: 'no-reply@BicycleNetwork.com',
            to: emailDestination,
            subject: 'Account Verification',
            text: 'Hi,\n\n' + 'Please, to verify your account, click on the following link:\n\n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token
        };

        mailer.sendMail(mailOptions, function(err) {
            if (err) {
                return console.log(err.message);
            }

            console.log('Email send to ' + emailDestination + '.');
        });
    });
};

userSchema.methods.booking = function (bicycleId, from, to, cb) {  
    let booking = new Booking({
        user: this._id,
        bicycle: bicycleId, 
        from: from,
        to: to
    });
    booking.save(cb);
};


userSchema.methods.resetPassword = function(cb) {
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function(err) {
        if (err) { return cb(err); }

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Reseteo de password',
            text: 'Hola,\n\n' + 'Por favor, para resetear el password de su cuenta haga click en este link:\n' + 'http://localhost:3000' + '\/resetPassword\/' + token.token + '\n'
        };

        mailer.sendMail(mailOptions, function(err) {
            if (err) { return cb(err); }
            console.log('Se envio un email para resetear el password a: ' + email_destination + '.');
        });

        cb(null);
    });
};

module.exports = mongoose.model('User', userSchema);
