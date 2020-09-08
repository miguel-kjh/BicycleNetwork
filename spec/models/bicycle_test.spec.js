require('dotenv').config();
let mongoose = require('mongoose');
let Bicycle = require('../../models/bicycle');

describe('Testing DB', () => {

    beforeAll((done) => { mongoose.connection.close(done) });


    beforeEach(function (done) {
        mongoose.disconnect();

        let mongoDBPath = process.env.MONGO_URI_TEST;
        mongoose.connect(mongoDBPath, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        mongoose.connection.on('connected', () => {
            console.log('MongoDB is connected');
            done();
        });

    });

    afterEach(function(done) {
        Bicycle.deleteMany({}, function (error, success) {  
            if(error) console.log('error');
            done();
        });   
    });

    describe('Create Test', () => {
        it('create a instance of one elemente', () => {
            let bicycle = Bicycle.createInstance(1, "verde" , "urbana",[1,-1]);

            expect(bicycle.code).toBe(1);
            expect(bicycle.color).toBe("verde");
            expect(bicycle.model).toBe("urbana");
            expect(bicycle.localitation[0]).toBe(1);
            expect(bicycle.localitation[1]).toBe(-1);
        });
    });

    describe('Get list of elemente', () => {
        it('start empty',(done) =>{
            Bicycle.getAll(function(err,result){
                expect(result.length).toBe(0);
                done();
            });            
        });
    });

    describe('Add element',() => {
        it('Add only one element', (done) => {
            let element = new Bicycle({code: 1, color: "verde", model: "urbano"});
            Bicycle.add(element, function(err, success){
                if (err) console.log(err);
                Bicycle.getAll(function(err,result){
                    expect(result.length).toBe(1);
                    expect(result[0].code).toBe(1);
                    done();
                }); 
            });            
        });        
    });

    describe('Find element',() => {
        it('Find By Code', (done) => {
            Bicycle.getAll(function (error, result) {  
                expect(result.length).toBe(0);
                let element1 = new Bicycle({code: 1, color: "verde", model: "urbano"});
                let element2 = new Bicycle({code: 2, color: "azul", model: "urbano"});
                Bicycle.add(element1, function(err, success){
                    if (err) console.log(err);
                    Bicycle.add(element2, function(err, success){
                        if (err) console.log(err);
                        Bicycle.findByCode(1,function(err,result){
                            expect(result.code).toBe(1);
                            expect(result.color).toBe(element1.color);
                            done();
                        }); 
                    });
                });   

            })   
        });        
    });

    describe('Remove element',() => {
        it('Remove By Code', (done) => {
            Bicycle.getAll(function (error, result) {  
                expect(result.length).toBe(0);
                let element1 = new Bicycle({code: 1, color: "verde", model: "urbano"});
                let element2 = new Bicycle({code: 2, color: "azul", model: "urbano"});
                Bicycle.add(element1, function(err, success){
                    if (err) console.log(err);
                    Bicycle.add(element2, function(err, success){
                        if (err) console.log(err);
                        Bicycle.getAll(function(err,result){
                            expect(result.length).toBe(2);
                            Bicycle.removeByCode(1,function(err,result){
                                Bicycle.getAll(function(err,result){
                                    expect(result.length).toBe(1);
                                    expect(result[0].color).toBe(element2.color);
                                    expect(result[0].code).toBe(element2.code);

                                    done();
                                }); 
                                
                            }); 
                        }); 
                    });
                });   

            })   
        });        
    });
});
