const Dispatcher = require("./dispatcher");
const Constants = require("./constants");

var Actions = {
    logout: function(item) {
        Dispatcher.handleAction({
            actionType: Constants.LOGOUT,
            data: item
        });
    },
    login: function(item) {
        Dispatcher.handleAction({
            actionType: Constants.LOGIN,
            data: item
        });
    },
    signup: function(item) {
        Dispatcher.handleAction({
            actionType: Constants.SIGNUP,
            data: item
        });
    },
    setPolls: function(item) {
        Dispatcher.handleAction({
            actionType: Constants.SET_POLLS,
            data: item
        });
    },
};

module.exports = Actions;
