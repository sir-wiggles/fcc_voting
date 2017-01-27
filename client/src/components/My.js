import React from 'react';
import {ListGroup,
    ListGroupItem,
    Button,
} from 'react-bootstrap';
import {
    Link
} from 'react-router';
import { connect } from 'react-redux';

export const My = React.createClass({

    render: function() {

        let polls = this.props.polls.map((d, i) => {
            return (<Link 
                        key={i} 
                        to={"view/" + d.get("_id")}>
                    <ListGroupItem>{d.get("title")}</ListGroupItem></Link>);
        })
        return (
            <div>
                <div className="center-button">
                    <Link id="create-button" to="create"><Button bsStyle="primary">Create Poll</Button></Link>
                </div>
                <ListGroup>
                    {polls}
                </ListGroup>
            </div>
        );
    },
});

function mapStateToProps(state) {
    return {
        polls: state.reducer.get("userPolls"),
        token: state.reducer.get("token")
    };
};

export const MyContainer = connect(
    mapStateToProps
)(My);

export default MyContainer;


