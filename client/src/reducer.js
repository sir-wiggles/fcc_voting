import {fromJS} from 'immutable';

let initialState = fromJS({
    "allPolls": [],
    "userPolls": [],
})

function reducer(state = initialState, action) {
    switch( action.type ) {
        case "LOGOUT":
            return state.set("token", "");

        case "VOTE_SUCCESS":
            let listType = "allPolls";
            if (action.poll.loc === "my") {
                listType = "userPolls";
            }
            let list = state.get(listType);
            let i1 = list.findIndex(d => {return d.get("_id") === action.poll.pid})
            let i2 = list.getIn([i1, 'choices']).findIndex(d => {return d.get("_id") === action.poll.cid})
            return state.updateIn([listType, i1, 'choices', i2, 'votes'], d => { return d + 1 })

        case "LOGIN_SUCCESS":
            return state.set('token', action.token);
        case "LOGIN_FAIL":
            return state;

        case "SIGNUP_SUCCESS":
            return state.set("token", action.token);
        case "SIGNUP_ERROR":
            return state.set("token", action.token);


        case "GET_ALL_POLLS_SUCCESS":
            return state.set("allPolls", fromJS(action.polls));
        case "GET_ALL_POLLS_ERROR":
            return state;

        case "CREATE_POLL_SUCCESS":
            let s1 = state.update(
                "allPolls",
                fromJS(action.poll),
                allPolls => {return allPolls.push(fromJS(action.poll))}
            );
            let s2 = s1.update(
                "userPolls",
                fromJS(action.poll),
                userPolls => {return userPolls.push(fromJS(action.poll))}
            );
            return s2;

        case "GET_MY_POLLS_SUCCESS":
            return state.set("userPolls", fromJS(action.polls));
        default:
            return state;
    }
};

export default reducer;
