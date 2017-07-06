var should = require("should");
var mongoose = require('mongoose');
var request = require('supertest');

mongoose.Promise = global.Promise;
var User = require("../app/users/models/users.js");

var app = require("../app");
app.use(require('body-parser').json());

var db;
var agent = request.agent(app);

var env = process.env.NODE_ENV || 'test';
var config = require('../config/config')[env];

describe('User', function() {

    before(function(done) {
        db = mongoose.connect(config.db);
            done();
    });

    after(function(done) {
        mongoose.connection.close();
        done();
    });

    beforeEach(function(done) {
        var user = new User({
            username: '12345',
            password: 'testy'
        });

        // user.save(function(error) {
        //     if (error) console.log('error' + error.message);
        //     else console.log('no error');
        //     done();
        // });
        User.register(user, user.password, function(err, new_user){
            if (err){
                console.log(err);
                return done(err);
                // return res.render(rootPath+'/views/users/register', {user: new_user});
            }
            done();
        });
    });

    it('find a user by username', function(done) {
        User.findOne({ username: '12345' }, function(err, user) {
            user.username.should.eql('12345');
            console.log("   username: ", user.username);
            done();
        });
    });

    it('registration', function(done){
        agent
        .post('/register')
        .send({username: "ahsan_test", password: "testy", email: "ahsan@example.com"})
        .expect(302)
        .expect('Location', '/auction')
        .end(function(err, res){
            if(err) return done(err);
            // console.log(res.headers.location);
            done();
        });
        
    });

    it('logout', function(done){
        agent
        .get('/logout')
        .expect('Location', '/')
        .end(function(err, res){
            if(err) return done(err);

            res.should.have.property('status', 302);
            done();
        })
    });

    it('login', function(done){
        
        agent
            .post('/login')
            .set('Accept', 'application/json')
            .set('Content-type', 'application/json')
            .send({username: "12345", password: "testy"})
            .expect(302)
            .end(function(err, res){
                if(err) return done(err);
                
                // agent.saveCookies(res);
                // console.log(res.headers.location);

                res.headers.location.should.eql('/auction');
                done();
            });

        // done();
    });

    afterEach(function(done) {
        User.remove({}, function() {
            done();
        });
     });

});
