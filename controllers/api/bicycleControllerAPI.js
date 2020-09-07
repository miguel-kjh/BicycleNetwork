var Bicycle = require('../../models/bicycle');

exports.bicycleList = function (req,res) {
    Bicycle.getAll(function (error, result) {
        res.status(200).json({
            bicycles: result
        });  
    });
}

exports.bicycleCreate = function (req, res) { 
    let bicycle = new Bicycle({
        code: req.body.id, 
        color: req.body.color, 
        model: req.body.model,
        localitation: [req.body.lat, req.body.lng]
    });

    Bicycle.add(bicycle, function (error, newElement) { 
        res.status(200).json({
            bicycle: newElement
        });
    })
}

exports.bicycleDelete = function (req, res) { 
    Bicycle.removeByCode(req.body.code, function (err) {
        res.status(204).send();
    });
}