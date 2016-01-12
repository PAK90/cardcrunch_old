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
		    data: {card1: this.props.card1.toLowerCase(), card2: this.props.card2.toLowerCase()},
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
    	this.setState({data: "Processing..."});
    },
  	render: function() {
  		if (this.state.data == "Processing..." || this.state.data.length == 0) {
	        return <div>
	        	<Button label="Compare Cards" onClick={this.handleClick} accent primary raised />
	        	<p>{this.state.data}</p>
	        </div>;
	    }
	    else if (this.state.data.length !== 0) {
	    	return <div>
	        	<Button label="Compare Cards" onClick={this.handleClick} accent primary raised />
	        	<br />
	        	<ul > 
	                { JSON.parse(this.state.data).resultCards.map(function(card){
	                    return <li>{card.cardname} {card.deviation}</li>;                     
	                }) }
	            </ul>
	        </div>;
	    }
    }
});

export default RunOnServer;
