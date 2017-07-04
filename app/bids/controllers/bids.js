var Auction = require('../../auctions/models/auction');
var Bid = require('../models/bid');
var moment = require("moment");

var env = process.env.NODE_ENV || 'production';

var config = require('../../../config/config')[env];
var rootPath = config.root;

var app = require('../../../app');
var io = app.io;

// Bid Controller actions
exports.add = function(req, res){
    Auction.findById(req.params.auction_id, function(err, auction){
        if(err) console.log(err);
        res.render(rootPath + '/app/bids/views/add', {auction: auction});
    });
}

exports.create = function(req, res){
    var bid = new Bid();
    bid.price = req.body.price;
    bid.auction = req.body.auction_id;
    bid.user = req.user._id;

    Auction.findById(req.body.auction_id, function(err, auction){
        if(err) console.log(err);

        bid.save(function(err, bid){
            if(err){
                return next(err);
            } 
            auction.bids.push(bid);

            // Add one minute for avoiding last min bid
            var now = moment().toDate();
            var oneMinAgo = moment(auction.unavailable_at).subtract(1, 'minutes').toDate();

            if(oneMinAgo <= now && now <= moment(auction.unavailable_at).toDate()){
                auction.unavailable_at = moment(auction.unavailable_at).add(1, 'minutes').toDate();
            }

            // Auction save with bid info
            auction.save(function(error, act){
                if(error) console.log(error);

                // Check bid is accepted or rejected
                if(auction.min_bids <= bid.price){
                    Bid.findOne({auction: bid.auction, created: {$lt: bid.created}})
                    .sort({created: -1}).limit(1).exec(function(err, lastBid){
                        if(err) console.log(err);

                        if(lastBid){
                            var diffPercent = lastBid.price * 0.05;
                            console.log(bid.price - lastBid.price >= diffPercent);
                            if (bid.price - lastBid.price >= diffPercent){
                                Bid.find({auction: bid.auction}).distinct('user').exec(function(err, users){
                                    if (err) console.log(err);

                                    // Send Notification to other users
                                    global.socket.emit(
                                        'notify',
                                        req.user._id,
                                        users, 
                                        req.user.username + ' is the new winner of the auction (' + auction.title + ')'
                                    );
                                    // Response
                                    res.format({
                                        html: function(){
                                            req.flash('message', 'Bid is submitted successfully.');
                                            res.redirect('/bids/'+auction._id);
                                        },
                                        json: function(){
                                            res.status(201).json({
                                                "message": "Bid is submitted successfully.",
                                                "redirect_url": "/bids/"+auction._id
                                            });
                                        }
                                    });

                                });
                                        
                            } else {
                                res.format({
                                    html: function(){
                                        req.flash('message', 'Bid is submitted successfully.');
                                        res.redirect('/bids/'+auction._id);
                                    },
                                    json: function(){
                                        res.status(201).json({
                                            "message": "Bid is submitted successfully.",
                                            "redirect_url": "/bids/"+auction._id
                                        });
                                    }
                                });
                            }
                        } else {
                            res.format({
                                html: function(){
                                    req.flash('message', 'Bid is submitted successfully.');
                                    res.redirect('/bids/'+auction._id);
                                },
                                json: function(){
                                    res.status(201).json({
                                        "message": "Bid is submitted successfully.",
                                        "redirect_url": "/bids/"+auction._id
                                    });
                                }
                            });
                        }
                    });
                } else {
                    res.format({
                        html: function(){
                            req.flash('message', 'Bid is unsuccessful due to lower than minimum bid amount.');
                            res.redirect('/bid/add/'+auction._id);
                        },
                        json: function(){
                            res.status(201).json({
                                "message": "Bid is unsuccessful due to lower than minimum bid amount.",
                                "redirect_url": "/bid/add/"+auction._id
                            });
                        }
                    });
    
                }
            });

        });
        
    });
    
}

exports.isWinner = function(req, res){
    res.set('Content-Type', 'text/plain');

    Bid.findById(req.params.id)
    .populate('auction')
    .exec(function(err, bid){
        if(err){
            return next(err);
        }

        if(bid.auction.min_bids > bid.price){
            res.end('Bid price is lower than minimum bid.');
        }

        Bid.findOne({auction: bid.auction, created: {$lt: bid.created}})
        .sort({created: -1}).limit(1).exec(function(err, lastBid){
            if(err) console.log(err);

            Bid.find({auction: bid.auction, created: {$gt: bid.created}})
            .sort({created: 1}).exec(function(err, nextBids){
                if(err) console.log(err);

                console.log(nextBids);
                if(nextBids.length > 0 && nextBids){
                    var nextBid = nextBids[nextBids.length - 1];
                    var diffPercent = bid.price * 0.05;
                    console.log(nextBid.price - bid.price >= diffPercent);
                    if (nextBid.price - bid.price >= diffPercent){
                        res.end('This bid is no longer winner.');
                    }
                    res.end('This bid is winner.');
                } else if(lastBid) {
                    console.log('Inside Last Bid');
                    var diffLast = lastBid.price * 0.05;
                    console.log(bid.price, lastBid.price, diffLast);
                    if(bid.price - lastBid.price >= diffLast){
                        res.end('This bid is winner.');
                    }
                    res.end('This bid is no longer winner.');
                } else {
                    res.end('');
                }

            });
        });
        
    });
}

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