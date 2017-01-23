

const Constants = {
    CHANGE_EVENT: null,
    LOGOUT: null,
    LOGIN: null,
    SIGNUP: null,
    SET_POLLS: null,

    VIEW_ACTION: null,
};

for (var key in Constants) {
    if (true) { Constants[key] = key; };
};

module.exports = Constants;
