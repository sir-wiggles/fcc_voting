import {hashHistory} from 'react-router';

export function logout() {
    return {
        type: 'LOGOUT'
    };
};

export function voteSuccess(loc, pid, cid) {
    let poll = {loc, pid, cid};
    return {poll, type: "VOTE_SUCCESS"};
};

export function voteError(response) {
    return {response, type: "VOTE_ERROR"};
};

export function vote(loc, pid, cid) {
    return dispatch => {
        fetch('api/polls/' + pid + '/' + cid, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                response.json()
                    .then(json => {
                        dispatch(voteSuccess(loc, pid, cid));
                    })
            } else {
                const error = new Error(response.statusText);
                error.response = response;
                dispatch(voteError(error));
                throw error;
            }
        })
    }
}

export function createPollSuccess(poll) {
    return {poll, type: "CREATE_POLL_SUCCESS"};
};

export function createPollError(response) {
    return {response, type: "CREATE_POLL_ERROR"};
};

export function create(token, title, choices) {
    return dispatch => {
        fetch('api/user/polls', {
            method: 'post',
            headers: {
                'x-access-token': token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                choices: choices
            })
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                response.json()
                    .then(json => {
                        dispatch(createPollSuccess(json));
                    })
            } else {
                const error = new Error(response.statusText);
                error.response = response;
                dispatch(createPollError(error));
                throw error;
            }
        })
    }
};

export function getAllPollsSuccess(polls) {
    return {polls, type: "GET_ALL_POLLS_SUCCESS"};
};

export function getAllPollsError(response) {
    return {response, type: "GET_ALL_POLLS_ERROR"};
};

export function getAllPolls() {
    return dispatch => {
        fetch('api/polls', {
            method: 'get',
            headers: {
                'Accept': 'application/json'
            },
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                response.json()
                    .then(json => {
                        dispatch(getAllPollsSuccess(json));
                    })
            } else {
                const error = new Error(response.statusText);
                error.response = response;
                dispatch(getAllPollsError(error));
                throw error;
            }
        })
    }
}

export function signupSuccess(token) {
    return { token, type: 'SIGNUP_SUCCESS' };
};

export function signupError(response) {
    return { response, type: 'SIGNUP_ERROR' };
};

export function signup(username, password) {
    return dispatch => {
        fetch('api/signup', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                response.json()
                    .then(json => {
                        dispatch(signupSuccess(json.token));
                    })
                hashHistory.push('/');
            } else {
                const error = new Error(response.statusText);
                error.response = response;
                dispatch(signupError(error));
                throw error;
            }
        }).catch(error => {
            console.log("signup failed ", error)
        })
    };
};

export function loginSuccess(token) {
    return { token, type: 'LOGIN_SUCCESS' };
};

export function loginError(error) {
    return { error, type: 'LOGGED_FAILED' };
};

export function login(username, password) {
    return dispatch => {
        fetch('api/auth', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                response.json()
                    .then(json => {
                        dispatch(loginSuccess(json.token));
                        dispatch(getMyPolls(json.token));
                    });
                hashHistory.push('/');
            } else {
                const error = new Error(response.statusText);
                error.response = response;
                dispatch(loginError(error));
                throw error;
            }
        }).catch(error => {
            console.log('login failed ', error);
        });
    };
};

export function getMyPollsSuccess(polls) {
    return {polls, type: "GET_MY_POLLS_SUCCESS"};
};

export function getMyPollsError(response) {
    return {response, type: "GET_MY_POLLS_ERROR"};
};

export function getMyPolls(token) {
    return dispatch => {
        fetch('api/user/polls', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                response.json()
                    .then(json => {
                        dispatch(getMyPollsSuccess(json));
                    });
                hashHistory.push('/');
            } else {
                const error = new Error(response.statusText);
                error.response = response;
                dispatch(loginError(error));
                throw error;
            }
        }).catch(error => {
            console.log('get my polls failed ', error);
        });
    };
};
