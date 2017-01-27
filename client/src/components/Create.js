import React from 'react';
import {
    Form,
    Control
} from 'react-redux-form';
import {
    hashHistory
} from 'react-router';

import { connect } from 'react-redux';
import * as actionCreators from '../action_creators';


export const Create = React.createClass({

    handleSubmit: function() {
        let choices = this.props.form.choices;
        let title   = this.props.form.title;
        if (!choices || !title) {
            return;
        };

        choices = choices.split(',');

        this.props.create(
            this.props.token,
            title,
            choices
        );
        hashHistory.push("my");
    },

    render: function() {
        return (
            <Form model="create" onSubmit={this.handleSubmit}>
                <label>
                    Title: 
                    <Control.text model=".title" />
                </label>
                <label>
                    Choices: 
                    <Control.text model=".choices" />
                </label>
                <input type="submit" value="Create" />
            </Form>
        );
    }
});

function mapStateToProps(state) {
    return {
        form: state.forms.create,
        token: state.reducer.get('token'),
    };
};

export const CreateForm = connect(
    mapStateToProps,
    actionCreators
)(Create);
