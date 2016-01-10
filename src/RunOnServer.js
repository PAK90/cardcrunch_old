import React from 'react';
import Button from 'react-toolbox/lib/button';

var RunOnServer = React.createClass({
	getInitialState: function() {
	    return {data: []};
	},
    runOnServer: function() {
	    $.ajax({
		    url: this.props.url,
		    dataType: 'text',
		    cache: false,
		    success: function(data) {
		        this.setState({data: data});
		    }.bind(this),
		    error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		    }.bind(this)
	    });
    },
    handleClick: function(event) {
    	this.runOnServer();
    },
  	render: function() {
        return <div>
        	<Button label="Do it" onClick={this.handleClick} accent primary raised />
        	<p>{this.state.data}</p>
        </div>;
    }
});

export default RunOnServer;
