import React from 'react';
import ReactDOM from 'react-dom';

var Highcharts = require('highcharts-release/highcharts.src.js');
var ReactHighcharts = require('react-highcharts/bundle/highcharts');
var cards = require('./data/cardPlotSeriesed.json');
var cardsRaw = require('./data/allCardsMod.json');

var plotConfig = {
chart: {
        type: 'scatter',
        zoomType: 'xy',
        panning: true,
        panKey: 'shift',
        height: 600,
        backgroundColor: null // Transparent.
    },
    title: {
        text: 'Cosine Similarity',
        style: {"color": '#F8F8F8', 'fontSize': '18px'}
    },
    subtitle: {
        text: 'Drag mouse to zoom. Hold shift to pan. Click colour to hide/show.',
        style: {"color": '#F8F8F8', 'fontSize': '10px'}
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 0,
        y: 0,
        floating: true,
        backgroundColor: 'rgba(200,200,200,0.3)',
        borderWidth: 1
    },
    tooltip: {
        //headerFormat: '<b>{series.name}</b><br>',
        //pointFormat: '{point.name}',
        useHTML: true,
        formatter: function() {
        	var s = "<img src='https://image.deckbrew.com/mtg/multiverseid/"+cardsRaw[this.point.name].multiverseids[cardsRaw[this.point.name].multiverseids.length-1].multiverseid+".jpg' height='225'/>";
        	return s;
        	//return '<img src="https://image.deckbrew.com/mtg/multiverseid/123456.jpg" title="" alt="" border="0" height="250" width="220"/>';	                    	
        },
        followPointer: false
    },
    plotOptions: {
        scatter: {
        	turboThreshold: 15000,
            marker: {
            	lineWidth: 1,
            	lineColor: '#000000',
                radius: 4,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
            },
            states: {
                hover: {
                    marker: {
                        enabled: false
                    }
                }
            }
        }
    },
    series: cards.series
};

var CosinePlot = React.createClass({
	getInitialState: function() {
		return { ctrlDown: false };
	},

	render: function() {
		return <ReactHighcharts config={plotConfig} isPureConfig={true}/>;
	}
});

export default CosinePlot;
