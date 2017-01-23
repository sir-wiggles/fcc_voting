const Flux = require("flux");
const Constants = require("./constants");

const Dispatcher = new Flux.Dispatcher();
Dispatcher.handleAction = function(action) {
    this.dispatch({
        source: Constants.VIEW_ACTION,
        action: action,
    });
};

module.exports = Dispatcher;
