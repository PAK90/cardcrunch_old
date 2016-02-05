import React from 'react';
import ReactDOM from 'react-dom';

var WeightScale = React.createClass({
	getInitialState: function() {
		return {scale: 0.5};
	},

	onSliderChange: function(e) {
		// Update state with new value, also send the value to index.js to be sent to RunOnServer.js.
		this.setState({scale: e.target.valueAsNumber}, this.props.updateSlider(e.target.valueAsNumber));
	},

	render: function() {
		// Makes this appear in the middle. Not sure how.
		var inline = {
			width: '46%',
			margin: '0 auto'
		};

		// Return two spans rounded to 0.1, and a slider with 0.1 size steps.
		return <div style={inline}>
			<span>{Math.round((1-this.state.scale)*10)/10}</span>
			<input type="range" min={0} max={1} step={0.1} value={this.state.scale} onChange={this.onSliderChange}/>
			<span>{Math.round(this.state.scale*10)/10}</span>
		</div>;
	}
});

export default WeightScale;