const React    = require("react");
const ReactDOM = require("react-dom");

const ReactRouter = require("react-router");
const Router      = ReactRouter.Router;
const Route       = ReactRouter.Route;
const History     = ReactRouter.browserHistory;
const IndexRoute  = ReactRouter.IndexRoute;

const App     = require("./components/App.jsx");
const Home    = require("./components/Home.jsx");
const MyPolls = require("./components/MyPolls.jsx");
const NewPoll = require("./components/NewPoll.jsx");
const Signup  = require("./components/Signup.jsx");
const Login   = require("./components/Login.jsx");
const PollView = require("./components/PollView.jsx");

import './index.css';



ReactDOM.render(
  <Router history={History}>
    <Route path="/"           history={History} component={App} >
        <IndexRoute component={Home} />
        <Route path="/polls"  history={History} component={MyPolls}/>
        <Route path="/polls/:pid"  history={History} component={PollView}/>
        <Route path="/new"    history={History} component={NewPoll}/>
        <Route path="/login"  history={History} component={Login}/>
        <Route path="/signup" history={History} component={Signup}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
