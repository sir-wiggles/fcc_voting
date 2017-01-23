const React = require("react");
const ReactDOM = require("react-dom");
const Store = require("../controllers/store");
const Actions = require("../controllers/actions");

let NewPoll = React.createClass({
    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState({});
    },
    handleCreate: function(e) {
        let _this = this;
        let title = ReactDOM.findDOMNode(this.refs.title).value; 
        let choices = ReactDOM.findDOMNode(this.refs.choices).value;
        choices = choices.split(",");

        let body = {title: title, choices: choices};
        let req = new XMLHttpRequest();
        req.onreadystatechange = function(){
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
        req.open('POST', 'api/user/polls', true);
        req.setRequestHeader('Content-type', 'application/json');
        req.setRequestHeader('x-access-token', Store.getToken());
        req.send(JSON.stringify(body)); 
    },
    render: function() {
        return (
                <div>
                <input ref="title" type="text" />
                <input ref="choices" type="text" />
                <button onClick={this.handleCreate}>Create</button>
                </div>
               );
    },
});

module.exports = NewPoll;
