var express    = require("express");
var bodyParser = require("body-parser");
var morgan     = require("morgan");
var mongoose   = require("mongoose");
var jwt        = require("jsonwebtoken");
var sha256     = require("sha256");
var md5        = require("js-md5");

var config     = require("./config");
var User       = require("./models/user");
var Poll       = require("./models/poll");
//=========================

const ObjectId = mongoose.Types.ObjectId;

var app  = express();
var port = process.env.PORT || 3001;

mongoose.Promise = global.Promise;
mongoose.connect(config.database);

app.set("secret", config.secret);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan("combined"));
}

var apiRoutes = express.Router();

apiRoutes.post("/signup", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (!(username && password)) {
        return res.status(400).json({success: false, message: "Username and password required for signup."});
    };

    var user = new User({
        username : username,
        password : sha256(password),
    });

    user.save(function(err) {
        if (err) throw err;
        res.json({success: true, message: "User created successfully."});
    });
});


apiRoutes.post("/auth", function(req, res) {
    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.status(409).json({success: false, message: "Authentication failed. User not found"});
        } else if (user) {
            if (user.password != sha256(req.body.password)) {
                res.status(409).json({success: false, message: "Authentication failed. Wrong password"});
            } else {
                var token = jwt.sign(user, app.get("secret"), {
                    expiresIn: "1d",
                });

                res.json({
                    success: true,
                    message: "Token granted.",
                    token: token,
                });
            };
        };
    });
});

apiRoutes.put("/polls/:pid/:cid", function(req, res) {

    Poll.update(
        {
            "_id": new ObjectId(req.params.pid), 
            "choices._id": new ObjectId(req.params.cid)
        }, 
        {$inc: {"choices.$.votes": 1}},
        function(err, data) {
            if (err) throw err;
            res.json(data);
        }
    );
});

apiRoutes.get("/polls/:pid", function(req, res) {
    
    Poll.findOne(
        {_id: req.params.pid},
        function(err, data){
            if (err) throw err;
            res.json(data);
        }
    );
});

apiRoutes.get("/polls", function(req, res) {
    Poll.find({}, function(err, data) {
        if (err) throw err;
        res.json(data);
    });
});

apiRoutes.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (token) {
        jwt.verify(token, app.get("secret"), function( err, decoded ) {
            if (err) {
                return res.json({success: false, message: "Failed to authenticate token."});
            } else {
                req.decoded = decoded;
                next();
            };
        });
    } else {
        return res.status(403).send({
            success: false,
            message: "No token provided."
        });
    };
});

apiRoutes.get("/", function(req, res) {
    res.json({message: "Welcome"});
});

apiRoutes.get("/user/polls", function(req, res) {
    Poll.find({
        user_id: req.decoded._doc._id
    }, function(err, data) {
        if (err) throw err;
        res.json(data);
    });
});

apiRoutes.get("/user/polls/:id", function(req, res) {
    Poll.findOne(
        {_id: new ObjectId(req.params.id)},
        function(err, data) {
            if (err) throw err;
            res.json(data);
        }
    );
});

apiRoutes.delete("/user/polls/:id", function(req, res) {
    Poll.remove(
        {_id: new ObjectId(req.params.id), user_id: req.decoded._doc._id}, 
        function(err, data) {
            if (err) throw err;
            if (data.result.n === 1) {
                return res.json({status: true, message: "Poll deleted"});
            } else {
                return res.status(403).json({status: false, message: "Can't delete a poll from another user"});
            }
            res.json(data);
        }
    );
});

apiRoutes.post("/user/polls", function(req, res) {
    var title   = req.body.title;
    var choices = req.body.choices;

    if (!title) {
        return res.json({success: false, message: "Must supply a title."});
    };

    if (!choices) {
        return res.json({success: false, message: "Must supply choices."});
    } else {
        choices = choices.filter((d) => { return d.toString().length > 0 });
    };

    var poll = new Poll({
        user_id : req.decoded._doc._id,
        date    : new Date(),
        title   : title,
        choices : choices.map((d) => { return {title: d, votes: 0} })
    });

    poll.save(function(err, data) {
            if (err) throw err;
            res.status(201).json(data);
        }
    );
});


app.use("/api", apiRoutes);

server = app.listen(port, function() {
    console.log("listining on port " + port);
});

module.exports = server;
