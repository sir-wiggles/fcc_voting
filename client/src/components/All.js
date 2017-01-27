import React from 'react';
import {ListGroup,
    ListGroupItem
} from 'react-bootstrap';
import {
    Link
} from 'react-router';
import { connect } from 'react-redux';

export const All = React.createClass({

    render: function() {

        let polls = this.props.polls.map((d, i) => {
            return (
                <Link 
                    key={i} 
                    to={"view/" + d.get("_id")}>
                    <ListGroupItem>{d.get("title")}</ListGroupItem>
                </Link>);
        });
        return (
            <ListGroup>
                {polls}
            </ListGroup>
        );
    },
});



function mapStateToProps(state) {
    return {
        polls: state.reducer.get('allPolls'),
    };
};

export const AllContainer = connect(
    mapStateToProps,
)(All);

export default AllContainer;
