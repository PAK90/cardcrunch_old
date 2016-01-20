import React from 'react';
import Button from 'react-toolbox/lib/button';

var VelocityTransitionGroup = require('velocity-react/velocity-transition-group.js');
var VelocityComponent = require('velocity-react/velocity-component.js');

var RunOnServer = React.createClass({
	getInitialState: function() {
	    return {data: [], hoveredId: ' '};
	},
	handleHover: function(cardname) {
		this.setState({hoveredId: cardname});
	},

    runOnServer: function() {
	    $.ajax({
		    url: this.props.url,
		    dataType: 'text',
		    cache: false,
		    // The card names are stored in the python script sources in lowercase and with ~ instead of -, as well as many other letter replacements.
		    data: {card1: this.props.card1.toLowerCase().replace("-","~").replace("æ","ae").replace('û','u').replace('!','').replace('ú','u').replace('â','a'),
		     	   card2: this.props.card2.toLowerCase().replace("-","~").replace("æ","ae").replace('û','u').replace('!','').replace('ú','u').replace('â','a'),
		     	   slider: this.props.sliderValue},
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
    	// When clicked, run this. Should replace with a spinny circle at some point.
    	this.setState({data: "Processing..."});
    },
  	render: function() {
  		var cardObject = this.props.items;

  		var shrink = {
			transform: 'scale(0.5, 0.5)',
			MsTransform: 'scale(0.5, 0.5)',
			WebkitTransform: 'scale(0.5, 0.5)'
  		};

  		// Half the normal size of a card, on both axes.
  		var squeeze = {
				display: 'block',
  			width: '115px',
   			height: '158px',
    		borderRadius: '8px' // Cuts off the white corners.
  		};

			var elemInline = {
				display: 'inline'
			};

			var elemInlineBlock = {
				display: 'inline-block'
			};

			var elemBlock = {
				display: 'block'
			};

  		// Pre-parse the card array that the python script returns. Ensure it only tries to parse when there's no error.
  		var cardArray;
  		if (this.state.data.length !== 0 && this.state.data != "Processing..." && !this.state.data.includes("Traceback")) {
  			cardArray = JSON.parse(this.state.data);
  		}

  		// After parsing, have to add the 'hovered' property to each card. Get this from the state, which will obtain it from handleHover.
  		if (cardArray !== undefined) {
			for (var i = 0; i < cardArray.resultCards.length; i++) {
				cardArray.resultCards[i].hovered = this.state.hoveredId.includes(cardArray.resultCards[i].cardname);
			}
		}

		// If processing, return the button and the Processing text.
  		if (this.state.data == "Processing..." || this.state.data.length == 0) {
	        return <div>
	        	<Button label="Combine Cards" disabled={!this.props.combineReady} onClick={this.handleClick} accent primary raised />
	        	<p>{this.state.data}</p>
	        </div>;
	    }
	    // If it's an error, it hopefully starts with 'Traceback', so just display that.
	    else if (this.state.data.includes("Traceback")) {
	    	return <div>
	        	<Button label="Combine Cards" disabled={!this.props.combineReady} onClick={this.handleClick} accent primary raised />
	        	<p>{this.state.data}</p>
	        </div>;
	    }
	    // If not either of those, hopefully it's the results.
	    // Render the button, and a table. The table contains one row with 10 <td> elements.
	    // The function used to map has a .bind() on it to give it a defined 'this' scope.
	    // This allows for onMouseOver and onMouseOut to be registered on the image.
	    // On mouseOver, it sends the current cardname to the handler, which is used in the array to assign the 'hovering' property properly.
	    // On mouseOUt, it sends a blank string so that the 'hovering' property on that card gets set to false.
	    // If the card's hovering is true, render it fullsize. If false, render it with the squeeze style.
	    else if (this.state.data.length !== 0) {
	    	return <div >
	        	<Button label="Combine Cards" disabled={!this.props.combineReady} onClick={this.handleClick} accent primary raised />
		        	<VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}} duration={100} stagger={100}>
 								<div style={elemBlock}>
 							  	<div style={elemInline}>
		                { cardArray.resultCards.map(function(card){
		                	if (card.hovered) {
			                    return <div style={elemInlineBlock}>{Math.round(card.deviation * 10000)/10000}
			                    	<img style={elemBlock} onMouseOver={this.handleHover.bind(this,card.cardname)}
			                    	onMouseOut={this.handleHover.bind(this, '')}
			                    	src={'https://image.deckbrew.com/mtg/multiverseid/'+cardObject[card.cardname].multiverseids[cardObject[card.cardname].multiverseids.length-1].multiverseid+'.jpg'}/>
			                    </div>;
		                    }
		                    else {
			                    return <div style={elemInlineBlock}>{Math.round(card.deviation * 10000)/10000}
			                    	<img style={squeeze}
			                    	onMouseOver={this.handleHover.bind(this,card.cardname)}
			                    	onMouseOut={this.handleHover.bind(this, '')}
			                    	src={'https://image.deckbrew.com/mtg/multiverseid/'+cardObject[card.cardname].multiverseids[cardObject[card.cardname].multiverseids.length-1].multiverseid+'.jpg'}/>
			                    </div>;
		                    }
		                }.bind(this)) }
								</div>
							</div>
					  </VelocityTransitionGroup>
	        </div>;
	    }
    }
});

export default RunOnServer;
