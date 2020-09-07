const nodemailer = require('nodemailer');

let mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jennifer80@ethereal.email',
        pass: 'pZghdY73CPUT9a9wpF'
    }
};

module.exports = nodemailer.createTransport(mailConfig);