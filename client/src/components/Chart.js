import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

class Pie {

    constructor(element, dataset) {

        var width = 360;
        var height = 360;
        var radius = Math.min(width, height) / 2;

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var svg = d3.select(element)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');

        var arc = d3.arc()
          .innerRadius(radius - 80)
          .outerRadius(radius);

        var pie = d3.pie()
          .value(function(d) { 
              return d.votes; 
          })
          .sort(null);

        svg.selectAll('path')
          .data(pie(dataset))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d) {
            return color(d.data.title);
          });
    };

};


export const Chart = React.createClass({

    render: function() {
        return <div id='chart'></div>
    },

    componentDidMount() {
        this.chart = new Pie(
            ReactDOM.findDOMNode(this),
            this.props.dataset.toJSON()
        );
    },

    shouldComponentUpdate() {
        let children = Array.prototype.slice.call(
            ReactDOM.findDOMNode(this).children
        );
        children.map(d => { d.remove() });

        return true;
    },

    componentDidUpdate() {
        this.chart = new Pie(
            ReactDOM.findDOMNode(this),
            this.props.dataset.toJSON()
        )
    }
});
