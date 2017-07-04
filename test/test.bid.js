var should = require("should");
var mongoose = require('mongoose');
var moment = require('moment');
var request = require('supertest');

mongoose.Promise = global.Promise;
var User = require("../app/users/models/users.js");

var app = require("../app");
app.use(require('body-parser').json());
var agent = request.agent(app);

var Auction = require("../app/auctions/models/auction.js");
var Bid = require("../app/bids/models/bid.js");
var db;
var cookie;
var auction_id, user_id;
var unavailable_at;


var env = process.env.NODE_ENV || 'test';
var config = require('../config/config')[env];

describe('Bid', function() {

    before(function() {
        db = mongoose.connect(config.db);
        return
        agent
        .post('/register')
        .send({
            username: 'ahsan_test_2',
            password: 'testy',
            email: 'ahsan@example.com'
        })
        .expect(302)
        .then(function(res){
          const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]);
          cookie = cookies.join(';');
          console.log(cookie);
          agent.saveCookies(res);
        }, function(err){
            console.log(err);
        });

        // done();
    });

    after(function(done) {
        User.remove({}, function() {
            mongoose.connection.close();
            done();
        });
    });

    beforeEach(function(done) {
        var auction = new Auction({
            title: 'Room Quickly',
            description: 'Description',
            min_bids: 1000,
            auction_start: moment().add(10, 'm').toDate()
        });

        User({username: 'ahsan_test_3', password: '123456'}).save(function(err, user){
            if(err) console.log(err);
            user_id = user._id;
            auction.save(function(error, actn) {
                if (error) console.log('error' + error.message);
                // else console.log(actn);

                auction_id = actn._id;

                var bid = new Bid({
                    price: 1100,
                    user: user._id,
                    auction: actn._id
                });

                bid.save(function(e, bid){
                    if(e) return done(e);

                    done();
                });
            });
        });

    });

    it('find bids by auction', function(done) {
        Bid.find({ auction: auction_id }, function(err, auctions) {
            if(err) return done(err);
            auctions.should.not.be.empty();

            done();
        });
    });

    it('find bids by user', function(done) {
        Bid.find({ user: user_id }, function(err, auctions) {
            if(err) return done(err);
            auctions.should.not.be.empty();

            done();
        });
    });

    it('bid lists', function(done){

        Bid.find({}, function(err, bids){
            if(err) return done(err);

            // console.log(auctions);
            bids.should.not.be.empty();
            done();
        })

    });

    // it('last minute bid add one minute at auction end time', function(done){
    //     Auction.remove({}, function(){
    //         var auction = new Auction({
    //             title: 'Room Quickly 1',
    //             description: 'Description 1',
    //             min_bids: 1000,
    //             auction_start: moment().toDate(),
    //             unavailable_at: moment().add(1, 'm').toDate()
    //         });

    //         auction.save(function(error, act) {
    //             if (error) console.log('error' + error.message);
    //             else console.log(act);
    //             // done();
    //             unavailable_at = act.unavailable_at;

    //             var bid = new Bid({
    //                 price: 1100,
    //                 user: user_id,
    //                 auction: act._id
    //             });

    //             bid.save(function(e, bid){
    //                 if(e) return done(e);

    //                 auction.bids.push(bid);

    //                 if(moment() >= moment(auction.unavailable_at).subtract(1, 'm')
    //                     && moment() <= moment(auction.unavailable_at)){
    //                     auction.unavailable_at = moment(auction.unavailable_at).add(1, 'm').toDate();
    //                 }
    //                 console.log(unavailable_at);
    //                 auction.save(function(e, a){
    //                     moment(unavailable_at)
    //                     .should
    //                     .be
    //                     .aboveOrEqual(moment(a.unavailable_at));
    //                     done();
    //                 });
    //             });
    //     });
    //     });
    // })

    afterEach(function(done) {
        Auction.remove({}, function() {
            User.remove({}, function(){
                Bid.remove({}, function(){
                    done();
                });
            });
        });

     });

});