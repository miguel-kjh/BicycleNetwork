let mongoose = require('mongoose');
let schema = mongoose.Schema;

let bicycleSchema = new schema({
    code: Number,
    color: String,
    model: String,
    localitation: {
        type: [Number], index: {type: '2dsphere', sparse: true}
    }
});

bicycleSchema.statics.createInstance = function (code, color, model, localitation) {  
    return new this({
        code: code,
        color: color,
        model: model,
        localitation: localitation
    })
};

bicycleSchema.statics.updateInstance = function (code, newcode, color, model, localitation) {  
    this.findOne({ code: code }, function (err, doc){
        doc.code = newcode;
        doc.code = newcode;
        doc.color = color;
        doc.model = color;
        doc.localitation = localitation;
        doc.save();
    });
};

bicycleSchema.methods.toString = function () {  
    return 'code: ' + this.code + " | color: " + this.color;
};

bicycleSchema.statics.getAll = function (cb) {  
    return this.find({}, cb);
};

bicycleSchema.statics.add = function (bicycle, cb) {  
    this.create(bicycle, cb);
}

bicycleSchema.statics.findByCode = function (code, cb) {  
    return this.findOne({code: code}, cb);
}

bicycleSchema.statics.removeByCode = function (code, cb) {  
    return this.deleteOne({code: code}, cb);
}

module.exports = mongoose.model('Bicycle', bicycleSchema);