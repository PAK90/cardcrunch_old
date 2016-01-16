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
		    // The card names are stored in the python script sources in lowercase and with ~ instead of -.
		    data: {card1: this.props.card1.toLowerCase().replace("-","~").replace("æ","ae").replace('û','u').replace('!','').replace('ú','u'),
		     	   card2: this.props.card2.toLowerCase().replace("-","~").replace("æ","ae").replace('û','u').replace('!','').replace('ú','u')},
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
  		var cardObject = this.props.items;
  		if (this.state.data == "Processing..." || this.state.data.length == 0) {
	        return <div>
	        	<Button label="Combine Cards" disabled={!this.props.combineReady} onClick={this.handleClick} accent primary raised />
	        	<p>{this.state.data}</p>
	        </div>;
	    }
	    else if (this.state.data.includes("Traceback")) {
	    	return <div>
	        	<Button label="Combine Cards" disabled={!this.props.combineReady} onClick={this.handleClick} accent primary raised />
	        	<p>{this.state.data}</p>
	        </div>;
	    }
	    else if (this.state.data.length !== 0) {
	    	return <div>
	        	<Button label="Combine Cards" disabled={!this.props.combineReady} onClick={this.handleClick} accent primary raised />
	        	<br />
	        	<ul > 
	                { JSON.parse(this.state.data).resultCards.map(function(card){
	                    return <li id="results">{card.deviation} <img src={'https://image.deckbrew.com/mtg/multiverseid/'+cardObject[card.cardname].multiverseids[cardObject[card.cardname].multiverseids.length-1].multiverseid+'.jpg'}/></li>;                     
	                }) }
	            </ul>
	        </div>;
	    }
    }
});

export default RunOnServer;
