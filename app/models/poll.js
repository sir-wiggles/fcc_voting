var mongoose = require("mongoose");

var Schema = mongoose.Schema;

module.exports = mongoose.model("Poll", new Schema({
    user_id : String,
    date    : Date,
    title   : String,
    choices : [
        {
            title : String, 
            votes : Number,
        }
    ]
}));
