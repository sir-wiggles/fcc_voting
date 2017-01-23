const React    = require("react");
const ReactDOM = require("react-dom");
const Store    = require("../controllers/store");
const Actions  = require("../controllers/actions");

let Signup = React.createClass({

    componentDidMount: function() { 
        Store.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({});
    },

    handleSignup: function(e) {
        let _this = this;
        let username = ReactDOM.findDOMNode(this.refs.username).value;
        let password = ReactDOM.findDOMNode(this.refs.password).value;
        let body = {username: username, password: password};
        

        let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (req.readyState === 4) {
                let data = JSON.parse(req.response);
                if (data.success) {
                    _this.props.route.history.push("/");
                    Actions.signup(data);
                } else {
                    return;
                }
            };
        };
        req.open('POST', 'api/signup', true);
        req.setRequestHeader('Content-type', 'application/json');
        req.send(JSON.stringify(body)); 
    },

    render: function() {
        return (
            <div>
                <input ref="username" type="text" />
                <input ref="password" type="password" />
                <button onClick={this.handleSignup}>Signup</button>
            </div>
        );
    },
});

module.exports = Signup;
