const React = require("react");
const Store = require("../controllers/store");
const Actions = require("../controllers/actions");
const ReactBS = require("react-bootstrap");
const ListGroup = ReactBS.ListGroup;
const ListGroupItem = ReactBS.ListGroupItem;
const Link = require("react-router").Link;

let Home = React.createClass({
    getInitialState: function() {
        return {data: Store.getPolls()};
    },
    componentWillMount: function() {
        let _this = this;
        let req = new XMLHttpRequest();
        req.onreadystatechange = function(){
            if (req.readyState === 4) {
                let data = JSON.parse(req.response);
                if (data) {
                    Actions.setPolls({type: "all", data: data});
                } else {
                    return;
                }
            };
        };
        req.open('GET', 'api/polls', true);
        req.setRequestHeader('Content-type', 'application/json');
        req.setRequestHeader('x-access-token', Store.getToken());
        req.send(); 
    },

    componentDidMount: function() { 
        Store.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({
            data: Store.getPolls(),
        });
    },

    render: function() {
        let polls = this.state.data.map(function(d, i) {
            let path = "polls/" + d._id;
            return <ListGroupItem key={i}><Link to={path}>{d.title}</Link></ListGroupItem>;
        });
        return (
            <ListGroup>
                {polls} 
            </ListGroup>
        );
    },
});

module.exports = Home;
