var Auction = require('../../auctions/models/auction');
var Bid = require('../models/bid');
var moment = require("moment");

var env = process.env.NODE_ENV || 'production';

var config = require('../../../config/config')[env];
var rootPath = config.root;

var app = require('../../../app');
var io = app.io;

// Bid Controller actions
exports.list = function(req, res){
    var perPage = 10
    , page = req.query.page > 0 ? req.query.page : 0;
    console.log(req.params);
	Bid.find(
		{auction: req.params.auction_id}).
        populate('auction').
        populate('user').
        sort({created: -1}).
        limit(perPage).
        skip(perPage * Number(page)).
        exec(
	        function(err, bids){
                if (err){
                    console.log(err);
                }
                Bid.find({auction: req.params.auction_id}).count().exec(function (err, count) {
                    console.log(count);
                    res.render(
                        rootPath + '/app/bids/views/lists', {
                            bids: bids, auction: bids[0].auction,
                            page: page,
                            pages: count / perPage
                        }
                    );
                });
                
	    });
}