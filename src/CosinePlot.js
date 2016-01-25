import React from 'react';
import ReactDOM from 'react-dom';

var Highcharts = require('highcharts-release/highcharts.src.js');
var ReactHighcharts = require('react-highcharts/bundle/highcharts');
var cards = require('./data/cardPlotSeriesed.json');
var cardsRaw = require('./data/allCardsMod.json');

Highcharts.setOptions({
    chart: {
        style: {
            fontFamily: 'Dosis'
        }
    }
});

var plotConfig = {
chart: {
        type: 'scatter',
        zoomType: 'xy',
        panning: true,
        panKey: 'shift',
        height: 600,
        animation: false,
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
    xAxis: {
	    visible: false
	},
    yAxis: {
	    visible: false
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
        useHTML: true,
        formatter: function() {
        	var s = "<img src='https://image.deckbrew.com/mtg/multiverseid/"+cardsRaw[this.point.name].multiverseids[cardsRaw[this.point.name].multiverseids.length-1].multiverseid+".jpg' height='275' width='200.4'/>";
        	return s;                    	
        },
        followPointer: false,
        style: {"width": '200px', 'lineColor': null, 'color': "rgba(255,255,255,0,5)"},
        snap: 1,
        shared: false,
        crosshairs: false
    },
    plotOptions: {
        scatter: {
        	stickyTracking: false,
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
                },
                symbol: 'circle'
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
