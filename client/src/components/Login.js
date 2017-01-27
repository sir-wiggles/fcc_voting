import React from 'react';
import { Control, Form } from 'react-redux-form';
import { connect } from 'react-redux';
import * as actionCreators from '../action_creators';

export const Login = React.createClass({

    handleSubmit: function() {
        this.props.login(
            this.props.form.username,
            this.props.form.password
        );
    },

    render: function() {
        return (
            <Form model="login" onSubmit={this.handleSubmit}>
                <label> Username: </label>
                <Control.text model=".username" />
                <label> Password: </label>
                <Control type="password" model=".password" />
                <input type="submit" value="Login" />
            </Form>
        );
    },
});

function mapStateToProps(state) {
    return {
        form: state.forms.login,
    };
};

export const LoginForm = connect(
    mapStateToProps,
    actionCreators
)(Login);
