import React from 'react';

import { Control, Form } from 'react-redux-form';
import { connect } from 'react-redux';
import * as actionCreators from '../action_creators';


export const Signup = React.createClass({

    handleSubmit: function() {
        let username = this.props.form.username;
        let password = this.props.form.password;
        this.props.signup(username, password);
    },

    render: function() {
        return (
            <Form model="signup" onSubmit={this.handleSubmit}>
                <label> Username: </label>
                <Control.text model=".username" />
                <label> Password: </label>
                <Control type="password" model=".password" />
                <input type="submit" value="Signup" />
            </Form>
        );
    },
});

function mapStateToProps(state) {
    return {
        form: state.forms.signup,
    };
};

export const SignupForm = connect(
    mapStateToProps,
    actionCreators
)(Signup);
