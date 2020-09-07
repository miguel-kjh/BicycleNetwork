let mongoose = require('mongoose');
let schema = mongoose.Schema;
let moment = require('moment');

let booking = new schema({
    from: Date,
    to: Date,
    bicycle: {type: schema.Types.ObjectId, ref: 'Bicycle'},
    user: {type: schema.Types.ObjectId, ref: 'User'}
});

booking.methods.reservedDays = function () {
    return moment(this.to).diff(moment(this.from), 'days') + 1;
}

module.exports = mongoose.model('Booking', booking);
