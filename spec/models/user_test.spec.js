let mongoose = require('mongoose');
let User = require('../../models/user');
let Bicycle = require('../../models/bicycle');
let Booking = require('../../models/booking');


describe('Testing Usuarios', () => {
    beforeAll((done) => { mongoose.connection.close(done) });

    beforeEach( (done) => {
        mongoose.disconnect();

        let mongoDBPath = "mongodb+srv://admUser:AvUdCmTBCasY0i0d@cluster0.iy9dp.mongodb.net/BicycleNetworkTest?retryWrites=true&w=majority";
        mongoose.connect(mongoDBPath, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        mongoose.connection.on('connected', () => {
            console.log('MongoDB is connected');
            done();
        });
    });

    afterEach( (done) => {
        Booking.deleteMany({}, function (err, success) {
            if (err) {
                console.log(err);
            }

            User.deleteMany({}, function (err, success) {
                if (err) {
                    console.log(err);
                }

                Bicycle.deleteMany({}, function (err, success) {
                    if (err) {
                        console.log(err);
                    }
                    
                    mongoose.connection.close(done);
                });
            })
        });
    });

    describe('Cuando un Usuario reserva una Bici', () => {
        it('Debe existir la reserva', (done) => {
            const user = new User({ 
                name: 'Julian',
                email: 'mg@gmail.com',
                password: 'JoJo'
            });
            user.save();

            const bicycle = new Bicycle({ code: 1, color: 'verde', model: 'urbana' });
            bicycle.save();

            let today = new Date();
            let tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            user.booking(bicycle.id, today, tomorrow, function (err, booking) {
                Booking.find({}).populate('bicycle').populate('user').exec(function (err, bookings) {
                    expect(bookings.length).toBe(1);
                    expect(bookings[0].reservedDays()).toBe(2);
                    expect(bookings[0].bicycle.code).toBe(1);
                    expect(bookings[0].user.name).toBe(user.name);

                    done();
                });
            });
        });
    });


});