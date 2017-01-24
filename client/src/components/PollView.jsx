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

    selectChoice: function(e) {
        this.setState({
            selectedOption: e.target.value
        });
    },

    handleVote: function(e) {
        if (!this.state.selectedOption) {
            return;
        };

        let _this = this;
        let pid = this.props.params.pid;
        let cid = this.state.selectedOption;
        let req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (req.readyState === 4) {
                let data = JSON.parse(req.response);
                if (data.success) {
                    console.log(_this.state.data[pid][cid].votes)
                    _this.state.data[pid][cid].votes += 1;
                    console.log(_this.state.data[pid][cid].votes)
                    _this.setState()
                } else {
                    return;
                }
            };
        };
        req.open('PUT', 'api/polls/' + pid + "/" + cid, true);
        req.setRequestHeader('Content-type', 'application/json');
        req.setRequestHeader('x-access-token', Store.getToken());
        req.send(JSON.stringify()); 
    },

    render: function() {
        let poll = Store.getPoll(this.props.params.pid);
        if (poll.length === 0) {
            return <div></div>;
        };
        poll = poll[0];
        let choices = poll.choices.map((d, i) => {
            return (
                <form action="" key={i}>
                    <li key={i}>
                        <div key={i}>
                            <span>{d.title}</span> 
                            <span>{d.votes}</span> 
                        </div>
                        <input type="radio" name="chocie" value={d._id} onChange={this.selectChoice}/>
                    </li>
                </form>
             );
        })
        return (
            <div>
                <h1>{poll.title}</h1>
                <ul>
                    {choices}
                </ul>
                <button onClick={this.handleVote}>Vote</button>
            </div>
        );
    },
});

module.exports = PollView;
