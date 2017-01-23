const Dispatcher = require("./dispatcher");
const Constants = require("./constants");

var Actions = {
    logout: function(item) {
        console.log("Actions.logout", item);
        Dispatcher.handleAction({
            actionType: Constants.LOGOUT,
            data: item
        });
    },
    login: function(item) {
        console.log("Actions.login", item);
        Dispatcher.handleAction({
            actionType: Constants.LOGIN,
            data: item
        });
    },
    signup: function(item) {
        console.log("Actions.login", item);
        Dispatcher.handleAction({
            actionType: Constants.SIGNUP,
            data: item
        });
    },
    setPolls: function(item) {
        console.log("Actions.setAllPolls", item);
        Dispatcher.handleAction({
            actionType: Constants.SET_POLLS,
            data: item
        });
    },
};

module.exports = Actions;
