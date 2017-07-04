var Auction = require('../models/auction');
var moment = require("moment");

var env = process.env.NODE_ENV || 'production';
var config = require('../../../config/config')[env];
var rootPath = config.root;


// Auction controller actions
exports.add = function(req, res){
    res.render(rootPath + '/app/auctions/views/add', {});
}

exports.create = function(req, res, next){
    var auction = new Auction();
    auction.title = req.body.title;
    auction.description = req.body.description;
    auction.slug = auction.title.replace(/ /g, '-');
    auction.min_bids = req.body.min_bids;
    auction.auction_start = req.body.auction_start;
    auction.unavailable_at = moment(req.body.auction_start).add(10, 'm').toDate();

    auction.save(function(err, auction){
        if(err){
            return next(err);
        }
        res.format({
            html: function(){
                req.flash('message', 'Auction is saved successfully.');
                res.redirect('/auction');
            },
            json: function(){
                res.status(201).json({
                    "message": "Auction is created successfully.",
                    "redirect_url": "/auction"
                });
            }
        });
        
    });
}

exports.show = function(req, res, next){
    Auction.findById(req.params.id)
    .populate('bids')
    .exec(function(err, auction){
        if(err){
            return next(err);
        }
        res.format({
            html: function(){
                res.render(rootPath + '/app/auctions/views/show', {auction: auction});
            },
            json: function(){
                res.status(200).json({
                    "auction": auction
                });
            }
        });
        
    });
}

exports.list = function(req, res){
    Auction.find(
        {unavailable_at: {$gte: moment().toDate()}},
     function(err, auctions){
        if (err){
            console.log(err);
        }
        // console.log(auctions);
        res.format({
            html: function(){
                res.render(rootPath + '/app/auctions/views/lists', {auctions: auctions});
            },
            json: function(){
                res.status(200).json({
                    "auctions": auctions
                });
            }
        });
        
    });
}