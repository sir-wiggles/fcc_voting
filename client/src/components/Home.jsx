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
        console.log("Home.componentWillMount");
        console.log(this.props.location.pathname);
        let _this = this;
        let req = new XMLHttpRequest();
        req.onreadystatechange = function(){
            if (req.readyState === 4) {
                let data = JSON.parse(req.response);
                console.log(data);
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
        console.log("Home.componentDidMount")
        console.log(this.props.location.pathname);
        Store.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        console.log("Home.componentWillUnmount")
        console.log(this.props.location.pathname);
        Store.removeChangeListener(this._onChange);
    },

    componentWillReceiveProps: function() {
        console.log("Home.componentWillReceiveProps");
        console.log(this.props.location.pathname);
    },

    componentDidReceiveProps: function() {
        console.log("Home.componentDidReceiveProps");
        console.log(this.props.location.pathname);
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
