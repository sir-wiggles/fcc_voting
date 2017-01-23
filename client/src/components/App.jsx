const React    = require("react");

const ReactRouter = require("react-router");
const IndexLink   = ReactRouter.IndexLink;
const Link        = ReactRouter.Link;

const Store = require("../controllers/store");
const Actions = require("../controllers/actions");

let App = React.createClass({

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

    handleLogout: function() {
        this.props.route.history.push("/");
        Actions.logout(); 
    },

    render: function() {
        
        let mypolls = <li><Link activeClassName="active" to="/polls">My Polls</Link></li>;
        let newpoll = <li><Link activeClassName="active" to="/new">New Poll</Link></li>;
        let logout  = <li><Link activeClassName="active" onClick={this.handleLogout}>logout</Link></li>;
        let signup  = <li key={1} ><Link activeClassName="active" to="/signup">Signup</Link></li>;
        let login   = <li key={2} ><Link activeClassName="active" to="/login">login</Link></li>;

        return (
            <div>
                <h1>Simple SPA</h1>
                <ul className="header">
                    <li><IndexLink activeClassName="active" to="/">Home</IndexLink></li>
                    { Store.isAuthenticated() ? mypolls : null }
                    { Store.isAuthenticated() ? newpoll : null } 
                    { Store.isAuthenticated() ? logout  : [signup, login] }
                </ul>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        );
    }
});

module.exports = App;
