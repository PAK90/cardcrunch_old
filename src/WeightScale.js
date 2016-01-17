import React from 'react';
import ReactDOM from 'react-dom';

var WeightScale = React.createClass({
	getInitialState: function() {
		return {scale: 0.5};
	},

	onSliderChange: function(e) {
		this.setState({scale: e.target.valueAsNumber}, this.props.updateSlider(e.target.valueAsNumber));
	},

	render: function() {
		var inline = {
			display: 'inline-block'
		};

		return <div style={inline}>
			<span>{Math.round((1-this.state.scale)*10)/10}</span>
			<input type="range" min={0} max={1} step={0.1} value={this.state.scale} onChange={this.onSliderChange}/>
			<span>{Math.round(this.state.scale*10)/10}</span>
		</div>;
	}
});

export default WeightScale;