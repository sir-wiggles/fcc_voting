const React = require("react");
const ReactDOM = require("react-dom");
const Store = require("../controllers/store");
const Actions = require("../controllers/actions");

let Login = React.createClass({

    componentDidMount: function() { 
        console.log("Login.componentDidMount");
        Store.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        console.log("Login.componentWillUnmount");
        Store.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        console.log("Login._onChange");
        this.setState({});
    },

    handleLogin: function(e) {
        let _this    = this;
        let username = ReactDOM.findDOMNode(this.refs.username).value;
        let password = ReactDOM.findDOMNode(this.refs.password).value;
        let body = {username: username, password: password};
        console.log("Login.handleLogin");

        let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (req.readyState === 4) {
                let data = JSON.parse(req.response);
                if (data.success) {
                    _this.props.route.history.push("/");
                    Actions.login(data);
                } else {
                    return;
                }
            };
        };
        req.open('POST', 'api/auth', true);
        req.setRequestHeader('Content-type', 'application/json');
        req.send(JSON.stringify(body)); 
    },

    render: function() {
        return (
            <div>
                <input ref="username" type="text" />
                <input ref="password" type="password" />
                <button onClick={this.handleLogin}>Login</button>
            </div>
        );
    },
});

module.exports = Login;
