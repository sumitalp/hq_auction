var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var moment = require('moment');

// set up a mongoose model and pass it using module.exports

var auctionSchema = new Schema({
    title: {type: String, required: true, default:""},
    slug: {type: String, unique: true},
    description: {type: String},
    image: {type: String},
    created: {type: Date, default: Date.now},
    updated: { type: Date, default: Date.now },
    auction_start: Date,
    unavailable_at: { type: Date},
    min_bids: {type: Number, required: true},
    bids: [
        {type: Schema.Types.ObjectId, ref: 'Bid'}
    ],
    active: {type: Boolean, default: true},
});

auctionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Auction', auctionSchema);