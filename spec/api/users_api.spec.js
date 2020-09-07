require('dotenv').config();
let User = require('../../models/user');
let mongoose = require('mongoose');
let request = require('request');
let server  = require('../../bin/www');
const urlServer = 'http://localhost:3000/api/users'


describe('test API', () => {
    beforeEach(function (done) {
        mongoose.connection.close().then(() => {
            let mongoDB = process.env.MONGO_URI;
            mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
    
            let db = mongoose.connection;
            db.on('error', console.error.bind(console, 'MongoDB connection error: '));
            db.once('open', function () {
                console.log('We are connected to test database!');
                done();
            });

        });

    });

    afterEach(function(done) {
        User.deleteMany({}, function (error, success) {  
            if(error) console.log('error');
            done();
        });   
    });
    
    describe('GET', () => {
        it('Status 200', (done) => {
            request.get(urlServer, function (error, res, body) {  
                expect(res.statusCode).toBe(200);
                let result = JSON.parse(body);
                expect(result.user.length).toBe(0);
                done();
            });
        });
    });

    describe("POST /create", ()=> {
        it("Status 200", (done)=> {
            let headers = {'content-type': 'application/json'};
            let user = '{"name":"Mike", "email": "hola@gmail.com", "password":"ikwendew"}';
            request.post({
                headers: headers,
                url: urlServer + '/create',
                body: user
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                let userSaved = JSON.parse(body);
                expect(userSaved.name).toBe("Mike");
                expect(userSaved.email).toBe("hola@gmail.com");
                expect(userSaved.password).not.toBeNull();
                done();
            });
        });
    });
});