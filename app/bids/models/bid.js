var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var moment = require('moment');
var Schema   = mongoose.Schema;

// set up a mongoose model and pass it using module.exports

var bidSchema = new Schema({
    price: {type: Number, required: true, default:0},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    auction: {type: Schema.Types.ObjectId, ref: 'Auction'},
    created: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Bid', bidSchema);