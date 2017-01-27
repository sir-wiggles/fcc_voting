import React from 'react';
import { connect } from 'react-redux';
import {Button} from 'react-bootstrap';
import {Chart} from './Chart';
import * as actionCreators from '../action_creators';
import * as d3 from 'd3';

export const View = React.createClass({

    handleVote: function(loc, pid, cid) {
        let _this = this;
        return function(e, i) {
            _this.props.vote(loc, pid, cid);
        }
    },

    render: function() {
        console.log("render");
        let pollLocation = "all";
        let poll = this.props.allPolls.filter(d => { 
            return d.get('_id') === this.props.params.id 
        });
        if (poll.count() === 0) {
            pollLocation = "my"
            poll = this.props.userPolls.filter(d => {
                return d.get('_id') === this.props.params.id 
            });
        };
        if (poll.count() === 0) {
            return null;
        };

        var color = d3.scaleOrdinal(d3.schemeCategory10);
        poll = poll.first();
        let choices = poll.get("choices").map((d, i) => {
            return (
                <Button 
                    style={{background: color(d.get('title'))}} 
                    className="choice" 
                    key={i} 
                    bsStyle="primary" 
                    onClick={this.handleVote(pollLocation, poll.get("_id"), d.get("_id"))}
                >{d.get("title")}</Button>
            );
        });

        let dataset = poll.get("choices").map((d, i) => {
            return {title: d.get("title"), votes: d.get("votes")}
        });

        let havePreviousVotes = dataset.reduce((a, b, i) => {
            let x, y;
            if (i !== 1) {
                x = a;
                y = b.votes;
            } else {
                x = a.votes;
                y = b.votes;
            }
            return !!x || !!y
        })
        if (!havePreviousVotes) {
            dataset = dataset.map(d => {d.votes = 1; return d});
        };
        return (
            <div>
                <div id="view-head">
                    <span><h1>{poll.get("title")}</h1></span>
                    <span>{poll.get("date")}</span>        
                </div>
                <div className="choices">
                    {choices}
                </div>
                <Chart className="chart-container" dataset={dataset}/>
            </div>
        );
    },
});

function mapStateToProps(state) {
    return {
        allPolls: state.reducer.get("allPolls"),
        userPolls: state.reducer.get("userPolls"),
    };
};

export const ViewContainer = connect(
    mapStateToProps,
    actionCreators
)(View);

