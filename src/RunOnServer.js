import React from 'react';
import Button from 'react-toolbox/lib/button';

var RunOnServer = React.createClass({
	getInitialState: function() {
	    return {data: [], hoveredId: ' '};
	},
	handleHover: function(cardname) {
		console.log(cardname);
		this.setState({hoveredId: cardname});
	},

    runOnServer: function() {
	    $.ajax({
		    url: this.props.url,
		    dataType: 'text',
		    cache: false,
		    // The card names are stored in the python script sources in lowercase and with ~ instead of -.
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
    	this.setState({data: "Processing..."});
    },
  	render: function() {
  		var cardObject = this.props.items;

  		var shrink = {
			transform: 'scale(0.5, 0.5)',
			MsTransform: 'scale(0.5, 0.5)',
			WebkitTransform: 'scale(0.5, 0.5)'
  		};

  		var squeeze = {
  			width: '115px',
   			height: '158px'
  		};

  		var cardArray;
  		if (this.state.data.length !== 0 && this.state.data != "Processing..." && !this.state.data.includes("Traceback")) {
  			cardArray = JSON.parse(this.state.data);
  		}

  		if (cardArray !== undefined) {
			for (var i = 0; i < cardArray.resultCards.length; i++) {
				cardArray.resultCards[i].hovered = this.state.hoveredId.includes(cardArray.resultCards[i].cardname);
			}
		}

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
	    	return <div >
	        	<Button label="Combine Cards" disabled={!this.props.combineReady} onClick={this.handleClick} accent primary raised />
	        	<table ><tbody>
		        	<tr /*onMouseOver={this.handleHover}*/> 
		                { cardArray.resultCards.map(function(card){
		                	if (card.hovered) {
			                    return <td>{Math.round(card.deviation * 10000)/10000} 
			                    	<img onMouseOver={this.handleHover.bind(this,card.cardname)}
			                    	onMouseOut={this.handleHover.bind(this, '')}
			                    	src={'https://image.deckbrew.com/mtg/multiverseid/'+cardObject[card.cardname].multiverseids[cardObject[card.cardname].multiverseids.length-1].multiverseid+'.jpg'}/>
			                    </td>;
		                    }
		                    else {
			                    return <td>{Math.round(card.deviation * 10000)/10000} 
			                    	<img style={squeeze} 
			                    	onMouseOver={this.handleHover.bind(this,card.cardname)}
			                    	onMouseOut={this.handleHover.bind(this, '')}
			                    	src={'https://image.deckbrew.com/mtg/multiverseid/'+cardObject[card.cardname].multiverseids[cardObject[card.cardname].multiverseids.length-1].multiverseid+'.jpg'}/>
			                    </td>;
		                    }   
		                }.bind(this)) }
		            </tr>
		        </tbody></table>
	        </div>;
	    }
    }
});

export default RunOnServer;
