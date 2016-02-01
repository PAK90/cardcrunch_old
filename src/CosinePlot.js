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
	        height: 450,
	        animation: false,
	        backgroundColor: null // Transparent.
	    },
	    events: {
	    	click: function(e) {
	    		if (e.target) {
	    			console.log(e);
	    		}
	    	}.bind(this),
	    },
	    title: {
	        text: 't-SNE',
	        style: {"color": '#F8F8F8', 'fontSize': '18px'}
	    },
	    subtitle: {
	        text: 'Drag mouse to area zoom. Scroll mousewheel to zoom into centre or selected point. Hold shift to pan. Click colour to hide/show.',
	        style: {"color": '#F8F8F8', 'fontSize': '10px', 'width': '400px !important'}
	    },
	    xAxis: {
	        gridLineColor: null,
	        lineColor: null,
	        tickColor: null
		},
	    yAxis: {
	        gridLineColor: null,
	        lineColor: null,
	        title: {
	        	text: null
	        }
		},
	    legend: {
	        layout: 'vertical',
	        align: 'left',
	        verticalAlign: 'top',
	        x: 30,
	        y: 0,
	        floating: true,
	        backgroundColor: 'rgba(200,200,200,0.7)',
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
	                radius: 3,
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
		return {zoomString: '', zoomRatio: 1};
	},

	scroller: function(e) {
		let chart = this.refs.chart.getChart();
		// Get the min/max values from the chart.
		var xMin = chart.xAxis[0].getExtremes().dataMin;
	    var xMax = chart.xAxis[0].getExtremes().dataMax;
	    var yMin = chart.yAxis[0].getExtremes().dataMin;
	    var yMax = chart.yAxis[0].getExtremes().dataMax;

	    // If we're all the way zoomed out, set the ratio to 1.
	    if (xMin == chart.xAxis[0].min && xMax == chart.xAxis[0].max && yMin == chart.yAxis[0].min && yMax == chart.yAxis[0].max) {
	    	this.setState({zoomRatio: 1});
	    }

		if (e.wheelDelta > 0) { // Scrolling/zooming in.
			if (this.state.zoomRatio > 0.1) {
				this.setState({zoomRatio: this.state.zoomRatio - 0.1});
			}
		}
		else { // Scrolling/zooming out.
			this.setState({zoomRatio: this.state.zoomRatio + 0.1});
		}

		// If there's a selected point (there can only be one), get its x/y coords.
		var selectedPoint = chart.getSelectedPoints();
		var xOffset = 0;
		var yOffset = 0;
		if (selectedPoint.length !== 0) {
			xOffset = selectedPoint[0].x;
			yOffset = selectedPoint[0].y;
		}

		// Apply the zoom. If there's a selected point, this will zoom in/out of that point.
		chart.xAxis[0].zoom((xMin + (1 - this.state.zoomRatio) * xMax) + xOffset, (xMax * this.state.zoomRatio) + xOffset);
		chart.yAxis[0].zoom((yMin + (1 - this.state.zoomRatio) * yMax) + yOffset, (yMax * this.state.zoomRatio) + yOffset);
		chart.redraw();
		chart.showResetZoom();
	},

	componentDidMount: function() {
		// Create a new event listener for the div that holds the chart. This enables scroll zooming.
		var chartDiv = document.getElementById("chartDiv");
		chartDiv.addEventListener('mousewheel', this.scroller.bind(this) ); // Use .bind to pass it the event.
	},

	// This is what listens to all state/prop changes in this component.
	componentWillUpdate: function(nextProps, nextState) {
		if (nextProps.zoomString != this.state.zoomString) {
			let chart = this.refs.chart.getChart();
			// First we need to sanitize the string. Probably could do this in index.js at this point.
			var correctedString = nextProps.zoomString.toLowerCase().replace("-","~").replace("æ","ae").replace('û','u').replace('!','').replace('ú','u').replace('â','a').replace('ö','o').replace("-", "~").replace("á","a").replace("é","e");
			// Then get the x/y coordinates of the point.
			var point = chart.get(correctedString);
			if (point !== null) {
				var targetX = point.x;
				var targetY = point.y;
				// Then zoom into that area. Redraw the chart and show the reset button.
				chart.xAxis[0].zoom(targetX - 0.5, targetX + 0.5);
				chart.yAxis[0].zoom(targetY - 0.5, targetY + 0.5);
				chart.redraw();
				chart.showResetZoom();
				point.select(true, false); // Select the point (true) and unselect all others (cumulative = false).
				// Set the state of the zoomString to the current string (which annoyingly calls this whole function again), and the zoomRatio to 0.1.
				this.setState({zoomString: nextProps.zoomString, zoomRatio: 0.2});
			}
		}
	},

	render: function() {
		// isPureConfig means that any time any page element changes, the graph DOESN'T try to redraw and paint 15k points all over again.
		// This only works if the config is outside the CosinePlot class, unfortunately.
		return <div id="chartDiv"><ReactHighcharts config={plotConfig} isPureConfig={true} ref="chart"/></div>;
	}
});

export default CosinePlot;
