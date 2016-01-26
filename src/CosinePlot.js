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
        snap: 1,
        shared: false,
        crosshairs: false
    },
    plotOptions: {
        scatter: {
        	allowPointSelect: true,
        	stickyTracking: false,
        	turboThreshold: 15000,
            marker: {
            	lineWidth: 1,
            	lineColor: '#000000',
                radius: 4,
                states: {
                    hover: {
                        lineColor: 'rgb(100,100,100)'
                    },
                    select: {
                    	radius: 10,
                    	fillColor: null
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
		return {zoomString: ''};
	},

	// This is what listens to all state/prop changes in this component.
	componentWillUpdate: function(nextProps, nextState) {
		if (nextProps.zoomString != this.state.zoomString) {
			let chart = this.refs.chart.getChart();
			// First we need to sanitize the string. Probably could do this in index.js at this point.
			var correctedString = nextProps.zoomString.toLowerCase().replace("-","~").replace("æ","ae").replace('û','u').replace('!','').replace('ú','u').replace('â','a').replace('ö','o').replace("-", "~").replace("á","a").replace("é","e")
			// Then get the x/y coordinates of the point.
			var point = chart.get(correctedString);
			var targetX = point.x;
			var targetY = point.y;
			// Then zoom into that area. Redraw the chart and show the reset button.
			chart.xAxis[0].zoom(targetX - 0.5, targetX + 0.5);
			chart.yAxis[0].zoom(targetY - 0.5, targetY + 0.5);
			chart.redraw();
			chart.showResetZoom();
			point.select(true, false); // Select the point (true) and unselect all others (cumulative = false).
			this.setState({zoomString: nextProps.zoomString});
		}
	},

	render: function() {
		return <ReactHighcharts config={plotConfig} isPureConfig={true} ref="chart"/>;
	}
});

export default CosinePlot;
