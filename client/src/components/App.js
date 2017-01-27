import React from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../action_creators';
import {
    Navbar,
    Nav,
    NavItem,
} from 'react-bootstrap';
import {
    LinkContainer,
    IndexLinkContainer,
} from 'react-router-bootstrap';

export const App = React.createClass({

    componentDidMount: function() {
        this.props.getAllPolls();
    },

    render: function() {
        return (
      <div>
          <Navbar inverse collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#">FCC Voting</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <IndexLinkContainer to=""   > 
                      <NavItem>Home</NavItem>
                </IndexLinkContainer>

                  {  this.props.token ? <LinkContainer to="my"    > 
                            <NavItem>My    </NavItem> 
                        </LinkContainer> : null }

                </Nav>
                <Nav pullRight>

                  { !this.props.token ? <LinkContainer to="login" > 
                            <NavItem>Login </NavItem> 
                        </LinkContainer> : null }
                
                  { !this.props.token ? <LinkContainer to="signup"> 
                            <NavItem>Signup</NavItem> 
                        </LinkContainer> : null }

                  {  this.props.token ?  
                      <NavItem onClick={this.props.logout}>Logout</NavItem> 
                        : null }
              </Nav>
            </Navbar.Collapse>
          </Navbar>
            {this.props.children}
      </div>

        );
    },
});

function mapStateToProps(store) {
    return {
        token: store.reducer.get("token"),
    };
};

export const AppContainer = connect(
    mapStateToProps,
    actionCreators
)(App);

