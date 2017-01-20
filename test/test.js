process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let sha256   = require("sha256");
let jwt      = require("jsonwebtoken");

//Require the dev-dependencies
let chai     = require('chai');
let chaiHttp = require('chai-http');
let should   = chai.should();

let server = require('../app/server');
let config = require("../app/config");
let User   = require('../app/models/user');
let Poll   = require('../app/models/poll');

chai.use(chaiHttp);
//Our parent block
describe('Open API Calls', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => { 
            Poll.remove({}, (err) => {
                done();
            });
        });     
    });

    describe('/signup', () =>{
        it('it should craete a new user', (done) => {
            chai.request(server)
                .post('/api/signup')
                .send({username: "test", password: "asdf"})
                .set("Content-Type", "application/json")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
        it("it should fail will missing username", (done) => {
            chai.request(server)
                .post('/api/signup')
                .send({username: "test"})
                .set("Content-Type", "application/json")
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        it("it should fail will missing password", (done) => {
            chai.request(server)
                .post('/api/signup')
                .send({password: "test"})
                .set("Content-Type", "application/json")
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('/api/auth', () => {
        it("it should authenticate use with valid certs", (done) => {
            let user  = new User({username: "test", password: sha256("asdf")});
            user.save((err, user) => {
                if (err) throw err;
                User.findOne({username: "test"}, (err, user) => {
                    let token = jwt.sign(user, config.secret, {
                        expiresIn: "1d",
                    });
                    chai.request(server)
                        .post('/api/auth')
                        .send({username: "test", password: "asdf"})
                        .set("Content-Type", "application/json")
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.token.should.eq(token);
                            done();
                        });
                });
            });
        });

        it("it should fail use with invalid username", (done) => {
            let user  = new User({username: "test", password: sha256("asdf")});
            user.save((err, user) => {
                if (err) throw err;
                chai.request(server)
                    .post('/api/auth')
                    .send({username: "test_false", password: "asdf"})
                    .set("Content-Type", "application/json")
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.not.have.property("token");
                        done();
                    });
            });
        });

        it("it should fail use with invalid password", (done) => {
            let user  = new User({username: "test", password: sha256("asdf")});
            user.save((err, user) => {
                if (err) throw err;
                chai.request(server)
                    .post('/api/auth')
                    .send({username: "test", password: "asdf_false"})
                    .set("Content-Type", "application/json")
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.not.have.property("token");
                        done();
                    });
            });
        });
    });
});


describe('Token required API Calls', () => {

    let token_1;
    let token_2;

    let user_1;
    let user_2;

    beforeEach((done) => { //Before each test we empty the database
        let u = new User({username: "test", password: sha256("foo")});
        u.save((err, u) => {
            User.findOne({username: "test"}, (err, u) => {
                user_1 = u;
                token_1 = jwt.sign(u, config.secret, {expiresIn: "1d"});
                u = new User({username: "test2", password: sha256("foo2")});
                u.save((err, u) => {
                    User.findOne({username: "test2"}, (err, u) => {
                        user_2 = u;
                        token_2 = jwt.sign(u, config.secret, {expiresIn: "1d"});
                        done();
                    });
                });
            });
        });
    });

    afterEach((done) => {
        User.remove({}, (err) => { 
            Poll.remove({}, (err) => {
                user_1_polls = [];
                done();
            });
        });     
    });

    describe('/api', () => {
        it('it should give welcome message', (done) => {
            chai.request(server)
                .get('/api')
                .set("x-access-token", token_1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eq("Welcome");
                    done();
                });
        });

        it('it should fail with no token', (done) => {
            chai.request(server)
                .get('/api/')
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                });
        });
    });

    describe('/api/user/polls', () => {

        let user_1_polls = [];

        beforeEach((done) => {
            for (let i = 0; i < 3; i++){
                let poll = new Poll({
                    user_id: user_1._id, 
                    date: new Date(),
                    title: "poll_" + i,
                    choices: [
                        {
                            title: "choice_1",
                            votes: 0,
                        },
                        {
                            title: "choice_2",
                            votes: 0,
                        }
                    ]
                });
                poll.save((err, data) => {
                    if (err) throw err;
                    user_1_polls.push(data);
                    if (i == 2) {
                        done();
                    };
                });
            };
        });

        afterEach((done) => {
            Poll.remove({}, (err) => {
                if (err) throw err;
                user_1_polls = [];
                done();
            })
        })

        it("it should list all users' polls", (done) => {
            chai.request(server)
                .get('/api/user/polls')
                .set('x-access-token', token_1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.length.should.be.eq(3);
                    done();
                });
        });

        it("it should only list this users' polls", (done) => {
            chai.request(server)
                .get('/api/user/polls')
                .set('x-access-token', token_2)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.length.should.be.eq(0);
                    done();
                });
        });

        it("it should be protected with a token", (done) => {
            chai.request(server)
                .get('/api/user/polls')
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                });
        });

        describe("GET ./:id", () => {
            it("it should return one poll", (done) => {
                let poll = user_1_polls[0]
                chai.request(server)
                    .get("/api/user/polls/" + poll._id)
                    .set("x-access-token", token_1)
                    .end((err, res) => {
                        res.body.title.should.be.eq(poll.title);
                        res.body._id.should.be.eq(poll._id.toString())
                        done();
                    });
            });

            it("it should return one poll from other user", (done) => {
                let poll = user_1_polls[0]
                chai.request(server)
                    .get("/api/user/polls/" + poll._id)
                    .set("x-access-token", token_2)
                    .end((err, res) => {
                        res.body.title.should.be.eq(poll.title);
                        res.body._id.should.be.eq(poll._id.toString())
                        done();
                    });
            });
        });

        describe("DELETE ./:id", () => {
            it("it should delete user poll from author request", (done) => {
                let poll = user_1_polls[0]
                chai.request(server)
                    .delete("/api/user/polls/" + poll._id)
                    .set("x-access-token", token_1)
                    .end((err, res) => {
                        res.should.have.status(200);                        
                        done();
                    });
            });

            it("it should not be able to delete poll from other user", (done) => {
                let poll = user_1_polls[0]
                chai.request(server)
                    .delete("/api/user/polls/" + poll._id)
                    .set("x-access-token", token_2)
                    .end((err, res) => {
                        res.should.have.status(403);
                        done();
                    });
            });
        });
        describe("PUT ./:id/:cid", () => {
            it("it should be able to vote on poll", (done) => {
                let poll = user_1_polls[0]
                chai.request(server)
                    .put("/api/polls/" + poll._id + "/" + poll.choices[0]._id)
                    .set("x-access-token", token_1)
                    .end((err, res) => {
                        res.should.have.status(200);                        
                        done();
                    });
            });
            it("it should be able to vote on poll without token", (done) => {
                let poll = user_1_polls[0]
                chai.request(server)
                    .put("/api/polls/" + poll._id + "/" + poll.choices[0]._id)
                    .end((err, res) => {
                        res.should.have.status(200);                        
                        done();
                    });
            });
        });
    });

    describe("POST /user/polls", () => {
        it("should create poll", (done) => {
            chai.request(server)
                .post("/api/user/polls")
                .set('x-access-token', token_1)
                .send({title: "example", choices: ["a", "b"]})
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.title.should.eq("example");
                    res.body.choices.length.should.eq(2);
                    done();
                })
        });
        it("should need token", (done) => {
            chai.request(server)
                .post("/api/user/polls")
                .send({title: "example", choices: ["a", "b"]})
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                })
        });
    });
});
















