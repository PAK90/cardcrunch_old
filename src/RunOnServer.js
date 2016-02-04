import React from 'react';
import {Button, IconButton} from 'react-toolbox/lib/button';

var VelocityTransitionGroup = require('velocity-react/velocity-transition-group.js');
var VelocityComponent = require('velocity-react/velocity-component.js');
var VelocityHelpers = require('velocity-react/velocity-helpers.js');
require('velocity-animate/');
require('velocity-animate/velocity.js');
require('velocity-animate/velocity.ui.js');

const GithubIcon = () => (
  <svg viewBox="0 0 284 277">
    <g><path d="M141.888675,0.0234927555 C63.5359948,0.0234927555 0,63.5477395 0,141.912168 C0,204.6023 40.6554239,257.788232 97.0321356,276.549924 C104.12328,277.86336 106.726656,273.471926 106.726656,269.724287 C106.726656,266.340838 106.595077,255.16371 106.533987,243.307542 C67.0604204,251.890693 58.7310279,226.56652 58.7310279,226.56652 C52.2766299,210.166193 42.9768456,205.805304 42.9768456,205.805304 C30.1032937,196.998939 43.9472374,197.17986 43.9472374,197.17986 C58.1953153,198.180797 65.6976425,211.801527 65.6976425,211.801527 C78.35268,233.493192 98.8906827,227.222064 106.987463,223.596605 C108.260955,214.426049 111.938106,208.166669 115.995895,204.623447 C84.4804813,201.035582 51.3508808,188.869264 51.3508808,134.501475 C51.3508808,119.01045 56.8936274,106.353063 65.9701981,96.4165325 C64.4969882,92.842765 59.6403297,78.411417 67.3447241,58.8673023 C67.3447241,58.8673023 79.2596322,55.0538738 106.374213,73.4114319 C117.692318,70.2676443 129.83044,68.6910512 141.888675,68.63701 C153.94691,68.6910512 166.09443,70.2676443 177.433682,73.4114319 C204.515368,55.0538738 216.413829,58.8673023 216.413829,58.8673023 C224.13702,78.411417 219.278012,92.842765 217.804802,96.4165325 C226.902519,106.353063 232.407672,119.01045 232.407672,134.501475 C232.407672,188.998493 199.214632,200.997988 167.619331,204.510665 C172.708602,208.913848 177.243363,217.54869 177.243363,230.786433 C177.243363,249.771339 177.078889,265.050898 177.078889,269.724287 C177.078889,273.500121 179.632923,277.92445 186.825101,276.531127 C243.171268,257.748288 283.775,204.581154 283.775,141.912168 C283.775,63.5477395 220.248404,0.0234927555 141.888675,0.0234927555" /></g>
  </svg>
);
const FindIcon = () => (
	<svg id="search-icon-small" className="search-icon" viewBox="0 0 24 24">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
);
const CrosshairIcon = () => (
	<svg id="highlight-icon" className="highlight-icon" viewBox="0 0 480 480">
	    <path fill="#010002;" d="M477.546,228.616h-53.567c-9.827-80.034-74.019-143.608-154.719-153.134V20.321
	        C269.259,9.096,260.155,0,248.938,0c-11.226,0-20.321,9.096-20.321,20.321v54.974c-81.375,8.941-146.257,72.808-156.15,153.313
	        H20.321C9.096,228.608,0,237.704,0,248.929s9.096,20.321,20.321,20.321H72.19c8.99,81.513,74.328,146.428,156.426,155.451v52.844
	        c0,11.226,9.096,20.321,20.321,20.321c11.217,0,20.321-9.096,20.321-20.321v-53.023c81.416-9.608,146.054-74.222,154.996-155.264
	        h53.291c11.226,0,20.321-9.096,20.321-20.321S488.771,228.616,477.546,228.616z M269.259,383.392v-67.028
	        c0-11.226-9.104-20.321-20.321-20.321c-11.226,0-20.321,9.096-20.321,20.321v67.24c-59.607-8.551-106.753-55.299-115.312-114.345
	        h68.207c11.226,0,20.321-9.096,20.321-20.321s-9.096-20.321-20.321-20.321h-67.882c9.38-58.046,56.103-103.761,114.987-112.215
	        v65.11c0,11.226,9.096,20.321,20.321,20.321c11.217,0,20.321-9.096,20.321-20.321v-64.899
	        c58.209,8.982,104.249,54.421,113.556,112.004h-66.459c-11.226,0-20.321,9.096-20.321,20.321s9.096,20.321,20.321,20.321h66.793
	        C374.646,327.842,328.191,374.297,269.259,383.392z"/>
	</svg>
)

var RunOnServer = React.createClass({
	getInitialState: function() {
	    return {combinationData: [], hoveredId: ' ', imageLoaded: false};
	},

	handleHover: function(cardname) {
		// Setting imageLoaded here because it makes the re-rendering of smaller card image at 1 opacity in the squeeze style.
		this.setState({hoveredId: cardname, imageLoaded: true});
	},

	handleImgLoad: function(e) {
		var img = e.target;
		// Needs the dollar sign for some reason.
		$.Velocity(img, {rotateY: [0,90], opacity: [1,0]}, {duration: 750});
	},

    handleFindButtonClick: function(e) {
        this.props.updateZoomCard(e);
    },

    handleHighlightButtonClick: function(e) {
        this.props.updateHighlightCard(e);
    },

    animateAway: function(e) {
    	// Animate away existing cards.
    	var cardDiv = e.target.nextElementSibling.nextElementSibling;
    	if (this.state.data.includes("result")) {
			//$.Velocity(cardDiv, {opacity: [0,1]}, {duration: 750});
		}
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
    		borderRadius: '8px', // Cuts off the white corners.
    		opacity: this.state.imageLoaded ? '1' : '0'
  		};

		var elemInline = {
			display: 'inline'
		};

		var elemInlineBlock = {
			display: 'inline-block',
			textAlign: 'center',
			padding: '3px'
		};

		var elemBlock = {
			display: 'block'
		};

		var spanStyle = {
			color: '#F8F8F8',
		    backgroundColor: '#000000',
		    borderColor: '#000000',
		    padding: '2px',
		    borderTopRightRadius: '5px',
		    borderTopLeftRadius: '5px'
		};

  		// Pre-parse the card array that the python script returns. Ensure it only tries to parse when there's no error.
  		var cardArray;
  		if (this.props.combinationData.length !== 0 && this.props.combinationData != "Processing..." && !this.props.combinationData.includes("Traceback")) {
  			cardArray = JSON.parse(this.props.combinationData);
  		}

  		// After parsing, have to add the 'hovered' property to each card. Get this from the state, which will obtain it from handleHover.
  		if (cardArray !== undefined) {
			for (var i = 0; i < cardArray.resultCards.length; i++) {
				cardArray.resultCards[i].hovered = this.state.hoveredId.includes(cardArray.resultCards[i].cardname);
			}
			// Now generate the card images and their deviations.
		    // The function used to map has a .bind() on it to give it a defined 'this' scope.
		    // This allows for onMouseOver and onMouseOut to be registered on the image.
		    // On mouseOver, it sends the current cardname to the handler, which is used in the array to assign the 'hovering' property properly.
		    // On mouseOUt, it sends a blank string so that the 'hovering' property on that card gets set to false.
		    // If the card's hovering is true, render it fullsize. If false, render it with the squeeze style.
	  		var images = cardArray.resultCards.map(function(card){
	        	if (card.hovered) {
	                return <div style={elemInlineBlock}><span style={spanStyle}>{Math.round(card.deviation * 10000)/10000}</span>
                		<button id="search-button-small" onClick={this.handleFindButtonClick.bind(this, card.cardname)}>
                    		<FindIcon/>
                 		</button>
                 		<button id="highlight-button-small" onClick={this.handleHighlightButtonClick.bind(this, card.cardname)}>
			                <CrosshairIcon/>
		            	</button>
	                	<img style={elemBlock} onMouseOver={this.handleHover.bind(this, card.cardname)}
	                	onMouseOut={this.handleHover.bind(this, '')}
	                	src={'https://image.deckbrew.com/mtg/multiverseid/'+cardObject[card.cardname].multiverseids[cardObject[card.cardname].multiverseids.length-1].multiverseid+'.jpg'}/>
	                </div>;
	            }
	            else {
	                return <div style={elemInlineBlock}><span style={spanStyle}>{Math.round(card.deviation * 10000)/10000}</span>
                		<button id="search-button-small" onClick={this.handleFindButtonClick.bind(this, card.cardname)}>
                    		<FindIcon/>
                 		</button>
                 		<button id="highlight-button-small" onClick={this.handleHighlightButtonClick.bind(this, card.cardname)}>
			                <CrosshairIcon/>
		            	</button>
	                	<img style={squeeze}
	                	onMouseOver={this.handleHover.bind(this, card.cardname)}
	                	onMouseOut={this.handleHover.bind(this, '')}
	                	onLoad={this.handleImgLoad}
	                	src={'https://image.deckbrew.com/mtg/multiverseid/'+cardObject[card.cardname].multiverseids[cardObject[card.cardname].multiverseids.length-1].multiverseid+'.jpg'}/>
	                </div>;
	            }
	        }.bind(this));
		}

		var text; 
		if (this.props.combinationData == "Processing..." || this.props.combinationData.length == 0 || this.props.combinationData.includes("Traceback")) {
			text = this.props.combinationData;
		};

    	return <div >
        	<p>{text}</p>
				<div style={elemBlock}>
			  		<div style={elemInline}>
                		{ images }
					</div>
				</div>
        </div>;
    }
});

export default RunOnServer;
