let Bicycle = require('../../models/bicycle');
let mongoose = require('mongoose');
let request = require('request');
let server  = require('../../bin/www');
const urlServer = 'http://localhost:3000/api/bicycles'


describe('test API', () => {
    beforeEach(function (done) {
        mongoose.connection.close().then(() => {
            let mongoDB = "mongodb+srv://admUser:AvUdCmTBCasY0i0d@cluster0.iy9dp.mongodb.net/BicycleNetworkTest?retryWrites=true&w=majority";
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
        Bicycle.deleteMany({}, function (error, success) {  
            if(error) console.log('error');
            done();
        });   
    });
    
    describe('GET', () => {
        it('Status 200', (done) => {
            request.get(urlServer, function (error, res, body) {  
                expect(res.statusCode).toBe(200);
                //let result = JSON.parse(body);
                //expect(result.bicycles.length).toBe(0);
                done();
            });
        });
    });

    describe("POST /create", ()=> {
        it("Status 200", (done)=> {
            let headers = {'content-type': 'application/json'};
            let bicycle = '{"id":3,"color":"rojo","model":"Urbana","lat":27.852403,"lng":-15.439928}';
            request.post({
                headers: headers,
                url: urlServer + '/create',
                body: bicycle
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                /*let b = JSON.parse(body).bicycle;
                expect(b.color).toBe("rojo");
                expect(b.localitation[0]).toBe(27.852403);
                expect(b.localitation[1]).toBe(-15.439928);*/
                done();
            });
        });
    });
});

