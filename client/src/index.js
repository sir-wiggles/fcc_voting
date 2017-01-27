import './index.css';

import React from 'react';
import { render } from 'react-dom';
import {
    hashHistory,
    Router,
    Route,
    IndexRoute,
    } from 'react-router';
import { Provider } from 'react-redux';
import { combineForms } from 'react-redux-form';
import { 
    createStore, 
    applyMiddleware,
    combineReducers} from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
//import {Map} from 'immutable';

import reducer from './reducer';

import {AppContainer} from './components/App';
import { LoginForm } from './components/Login';
import { SignupForm } from './components/Signup';
import { AllContainer } from './components/All';
import { MyContainer } from './components/My';
import { ViewContainer } from './components/View';
import { CreateForm } from './components/Create';

let middleware = [thunkMiddleware];
if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger({ }))
}


const store = createStore(combineReducers({
        reducer,
        forms: combineForms({ 
            login : {},
            signup: {},
            create: {},
            vote  : {choice: '0'},
        })
    }),
    applyMiddleware(...middleware)
)

function Auth(store) {
    return function() {
        if (!store.getState().reducer.get("token")) {
            hashHistory.push("login");
        };
    };
};

render(
  <Provider store={store}>
    <Router history={hashHistory}>
        <Route path="/" component={AppContainer} >
            <IndexRoute component={AllContainer} />        
            <Route path="login" component={LoginForm} />        
            <Route path="signup" component={SignupForm} />
            <Route path="my" component={MyContainer} onEnter={Auth(store)}/>
            <Route path="create" component={CreateForm} onEnter={Auth(store)}/>
            <Route path="view/:id" component={ViewContainer} />
        </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)

//{
    //allPolls:{ id: {} },
    //myPolls: { id: {} },
    //authentication: { token: "" }
//}
