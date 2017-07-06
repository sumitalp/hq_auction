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
var db;
var cookie;

var env = process.env.NODE_ENV || 'test';
var config = require('../config/config')[env];

describe('Auction', function() {

    before(function(done) {
        db = mongoose.connect(config.db);
        
        agent
        .post('/register')
        .send({
            username: 'ahsan_test_2',
            password: 'testy',
            email: 'ahsan@example.com'
        })
        .expect(302)
        .end(function(err, res){
            if(err) return done(err);

            const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]);
            cookie = cookies.join(';');
            // console.log(res.headers);
            // agent.saveCookies(res);
            // console.log(cookie);
            res.headers.location.should.eql('/auction');

            done();
        });

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

        auction.save(function(error, actn) {
            if (error) console.log('error' + error.message);
            // else console.log(actn);
            done();
        });

    });

    it('find auction by title', function(done) {
        Auction.findOne({ title: 'Room Quickly' }, function(err, auction) {
            if(err) return done(err);
            auction.title.should.eql('Room Quickly');

            done();
        });
    });

    it('auction lists url success', function(){
        // Auction.remove({}, function(){
            // console.log(agent);
            return agent
                .get('/auction')
                .set('Content-type', 'application/json')
                .then(function(res){
                    res.should.have.property('status', 200);
                    // res.headers.location.should.eql('/login');
                    // console.log(res.body);
                }, function(error){
                    console.log(error);
                });
        // });

    });

    it('auction lists', function(done){

        Auction.find({}, function(err, auctions){
            if(err) return done(err);

            // console.log(auctions);
            auctions.should.not.be.empty();
            done();
        })

    });

    afterEach(function(done) {
        Auction.remove({}, function() {
            done();
        });

     });

});