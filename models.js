var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Drawing = new Schema({  
    title: { type: String, required: true },  
    description: { type: String },  
    approved: { type: Boolean, required: true, default: false },
    url: { type: String, unique: true },  
    modified: { type: Date, default: Date.now },
    rnd: { type: Number, default: Math.random, index: true }
});

Drawing.set('toJSON', {
    transform: function(doc, ret, options) {
        var retJson = {
        	id: ret._id,
        	title: ret.title,
            description: ret.description,
            url: ret.url,
            modified: ret.modified
        };
        return retJson;
    }
});

var DrawingModel = mongoose.model('Drawing', Drawing);  

module.exports = {
	Drawing: DrawingModel
};