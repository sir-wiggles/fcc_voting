const Dispatcher   = require("./dispatcher");
const Constants    = require("./constants");
const EventEmitter = require("events").EventEmitter;

const _store = {
    authenticated : true,
    token         : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7Il9fdiI6ImluaXQiLCJwYXNzd29yZCI6ImluaXQiLCJ1c2VybmFtZSI6ImluaXQiLCJfaWQiOiJpbml0In0sInN0YXRlcyI6eyJpZ25vcmUiOnt9LCJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJfX3YiOnRydWUsInBhc3N3b3JkIjp0cnVlLCJ1c2VybmFtZSI6dHJ1ZSwiX2lkIjp0cnVlfSwibW9kaWZ5Ijp7fSwicmVxdWlyZSI6e319LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwiZW1pdHRlciI6eyJkb21haW4iOm51bGwsIl9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7Il9fdiI6MCwicGFzc3dvcmQiOiJmMGU0YzJmNzZjNTg5MTZlYzI1OGYyNDY4NTFiZWEwOTFkMTRkNDI0N2EyZmMzZTE4Njk0NDYxYjE4MTZlMTNiIiwidXNlcm5hbWUiOiJhc2RmIiwiX2lkIjoiNTg4NDZhM2M2MGE0OGM3Y2UwYzFmMzQyIn0sIl9wcmVzIjp7IiRfX29yaWdpbmFsX3NhdmUiOltudWxsLG51bGxdLCIkX19vcmlnaW5hbF92YWxpZGF0ZSI6W251bGxdLCIkX19vcmlnaW5hbF9yZW1vdmUiOltudWxsXX0sIl9wb3N0cyI6eyIkX19vcmlnaW5hbF9zYXZlIjpbXSwiJF9fb3JpZ2luYWxfdmFsaWRhdGUiOltdLCIkX19vcmlnaW5hbF9yZW1vdmUiOltdfSwiaWF0IjoxNDg1MTI4NjUxLCJleHAiOjE0ODUyMTUwNTF9.DQc1EaTl0WeW3zVytWnV0gq5z-eF-pVcmLBxbuNpKHw",
    allPolls      : [],
    myPolls       : [],
};

var Store = Object.assign({}, EventEmitter.prototype, {
    addChangeListener: function(cb) {
        console.log("Store.addChangeListener", cb);
        this.on(Constants.CHANGE_EVENT, cb);
    },
    removeChangeListener: function(cb) {
        console.log("Store.removeChangeListener", cb);
        this.removeListener(Constants.CHANGE_EVENT, cb);
    },
    isAuthenticated: function() {
        return _store.authenticated;
    },
    setAuthenticated: function(state) {
        _store.authenticated = state;
    },
    setToken: function(token) {
        _store.token = token;
    },
    getToken: function() {
        return _store.token;
    },
    getPolls: function(type) {
        if (type === "my") {
            return _store.myPolls;
        };
        return _store.allPolls;
    },
    setPolls: function(data) {
        if (data.type === "my") {
            _store.myPolls = data.data;
        }
        _store.allPolls = data.data;
    },
    getPoll: function(id) {
        return _store.allPolls.filter((d) => {
            return d._id === id;
        });
    },
});

function logout(data) {
    Store.setAuthenticated(false);
    Store.setToken("");
};

function login(data) {
    Store.setAuthenticated(data.success);
    Store.setToken(data.token);
};

function signup(data) {
    Store.setAuthenticated(data.success);
    Store.setToken(data.token);
}

Dispatcher.register(function(payload) {
    console.log("Dispatche.register", payload);
    var action = payload.action;
    switch(action.actionType) {
        case Constants.LOGOUT:
            logout(action.data);
            break;
        case Constants.LOGIN:
            login(action.data);
            break;
        case Constants.SIGNUP:
            signup(action.data);
            break;
        case Constants.SET_POLLS:
            Store.setPolls(action.data);
            break;
        default:
            return true;
    };
    Store.emit(Constants.CHANGE_EVENT);
});

module.exports = Store;
