const React = require("react");
const Store = require("../controllers/store");
const Actions = require("../controllers/actions");

let PollView = React.createClass({

    getInitialState: function() {
        return {data: Store.getPolls()};
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
        let poll = Store.getPoll(this.props.params.pid);
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
