var mongoose = require("mongoose");

var Schema = mongoose.Schema;

module.exports = mongoose.model("User", new Schema({
    username : {type: String, index: {unique: true}},
    password : String,
}));

