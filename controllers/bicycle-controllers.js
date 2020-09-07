var Bicycle = require('../models/bicycle');

exports.bicycleList =  function (req,res) {
    Bicycle.getAll(function (error, result) {
        res.render('bicycles/index', {bicycles: result});
    });
}

exports.bicycleCreateGet = function (req, res) { 
    res.render('bicycles/create')
}

exports.bicycleCreatePost = function (req, res) {
    let bicycle = new Bicycle({
        code: req.body.id, 
        color: req.body.color, 
        model: req.body.model,
        localitation: [req.body.lat, req.body.lng]
    });

    Bicycle.add(bicycle, function (error, newElement) { 
        res.redirect('/bicycles');
    });
}

exports.bicycleUpdateGet = function (req, res) {
    Bicycle.findByCode(req.params.code, function(err,bicycle){
        res.render('bicycles/update', {bicycle});
    }); 
}

exports.bicycleUpdatePost = function (req, res) { 
    Bicycle.findByCode(req.params.code, function (err, bicycle) {
        bicycle.color = req.body.color;
        bicycle.model = req.body.model;
        bicycle.localitation = [req.body.lat, req.body.lng];
        bicycle.save();
        
        res.redirect('/bicycles');
    });
    
}

exports.bicycleDeletePost = function (req, res) { 
    Bicycle.removeByCode(req.body.code, function (err) {
        res.redirect('/bicycles');
    });
}