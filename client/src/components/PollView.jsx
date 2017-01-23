const React = require("react");
const Store = require("../controllers/store");
const Actions = require("../controllers/actions");

let PollView = React.createClass({

    getInitialState: function() {
        return {data: Store.getPolls()};
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

    _onChange: function() {
        this.setState({
            data: Store.getPolls(),
        });
    },

    render: function() {
        let poll = Store.getPoll(this.props.params.pid);
        console.log(poll);
        if (poll.length === 0) {
            return <div></div>;
        };
        poll = poll[0];
        let choices = poll.choices.map((d, i) => {
            return (
                <li key={i}>
                 <div>
                    <span>{d.title}</span> 
                    <span>{d.votes}</span> 
                 </div>
                </li>
             );
        })
        return (
            <div>
                <h1>{poll.title}</h1>
                <ul>
                    {choices}
                </ul>
            </div>
        );
    },
});

module.exports = PollView;
