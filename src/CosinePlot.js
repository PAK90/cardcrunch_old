import React from 'react';
import ReactDOM from 'react-dom';
var R3D = require('react-d3-components');

var cards = require('./data/cardPlotSimple.json');

var cardData = cards.cards;

var ScatterPlot = R3D.ScatterPlot;

var margin = {top: 10, bottom: 50, left: 50, right: 10};

var CosinePlot = React.createClass({
	/*getInitialState: function() {
		
	},
*/
	render: function() {
		return <ScatterPlot 
			data={cardData}
			width={400}
			height={400}
			margin={margin}/>;
	}
});

export default CosinePlot;