import React from 'react';
import ReactDOM from 'react-dom';
import {Button, IconButton} from 'react-toolbox/lib/button';
import style from './style';
var DiceIcon = require('babel!svg-react!../src/data/img/DiceIcon.svg?name=DiceIcon');

var VelocityTransitionGroup = require('velocity-react/velocity-transition-group.js');
var VelocityComponent = require('velocity-react/velocity-component.js');
var VelocityHelpers = require('velocity-react/velocity-helpers.js');
require('velocity-animate');
require('velocity-animate/velocity.ui');

// Register animations here so that 'stagger' property can be used with them.
var Animations = {
    In: VelocityHelpers.registerEffect({
        calls: [
            [{
                transformPerspective: [ 800, 800 ],
                transformOriginX: [ '50%', '50%' ],
                transformOriginY: [ '100%', '100%' ],
                marginBottom: 1,
                opacity: 1,
                rotateX: [0, 130],
            }, 1, {
                easing: 'ease-out',
                display: 'block',
            }]
        ],
    }),
    Out: VelocityHelpers.registerEffect({
        calls: [
            [{
                transformPerspective: [ 800, 800 ],
                transformOriginX: [ '50%', '50%' ],
                transformOriginY: [ '0%', '0%' ],
                marginBottom: -30,
                opacity: 0,
                rotateX: [-70],
            }, 1, {
                easing: 'ease-out',
                display: 'block',
            }]
        ],
    })
};

const GithubIcon = () => (
  <svg viewBox="0 0 284 277">
    <g><path d="M141.888675,0.0234927555 C63.5359948,0.0234927555 0,63.5477395 0,141.912168 C0,204.6023 40.6554239,257.788232 97.0321356,276.549924 C104.12328,277.86336 106.726656,273.471926 106.726656,269.724287 C106.726656,266.340838 106.595077,255.16371 106.533987,243.307542 C67.0604204,251.890693 58.7310279,226.56652 58.7310279,226.56652 C52.2766299,210.166193 42.9768456,205.805304 42.9768456,205.805304 C30.1032937,196.998939 43.9472374,197.17986 43.9472374,197.17986 C58.1953153,198.180797 65.6976425,211.801527 65.6976425,211.801527 C78.35268,233.493192 98.8906827,227.222064 106.987463,223.596605 C108.260955,214.426049 111.938106,208.166669 115.995895,204.623447 C84.4804813,201.035582 51.3508808,188.869264 51.3508808,134.501475 C51.3508808,119.01045 56.8936274,106.353063 65.9701981,96.4165325 C64.4969882,92.842765 59.6403297,78.411417 67.3447241,58.8673023 C67.3447241,58.8673023 79.2596322,55.0538738 106.374213,73.4114319 C117.692318,70.2676443 129.83044,68.6910512 141.888675,68.63701 C153.94691,68.6910512 166.09443,70.2676443 177.433682,73.4114319 C204.515368,55.0538738 216.413829,58.8673023 216.413829,58.8673023 C224.13702,78.411417 219.278012,92.842765 217.804802,96.4165325 C226.902519,106.353063 232.407672,119.01045 232.407672,134.501475 C232.407672,188.998493 199.214632,200.997988 167.619331,204.510665 C172.708602,208.913848 177.243363,217.54869 177.243363,230.786433 C177.243363,249.771339 177.078889,265.050898 177.078889,269.724287 C177.078889,273.500121 179.632923,277.92445 186.825101,276.531127 C243.171268,257.748288 283.775,204.581154 283.775,141.912168 C283.775,63.5477395 220.248404,0.0234927555 141.888675,0.0234927555" /></g>
  </svg>
);

var CardSearch = React.createClass({
    getInitialState: function() {
        return { searchString: '' };
    },

    handleImgLoad: function(e) {
        var img = e.target;
        // Needs the dollar sign for some reason.
        $.Velocity(img, {rotateY: [0,90], opacity: [1,0]}, {duration: 500});
    },

    handleChange: function(e) {

        // If you comment out this line, the text box will not change its value.
        // This is because in React, an input cannot change independently of the value
        // that was assigned to it. In our case this is this.state.searchString.

        this.setState({searchString:e.target.value});
        this.setState({lineSelected:false}, this.props.updateCombineState(false));
    },

    handleKeyUp: function(e) {
        //console.log(e);
        // Keypresses are only relevant when there's a search string and a card isn't selected.
        if (this.state.searchString.length !== 0 && this.state.lineSelected == false) {
            if (e.key == "ArrowUp") {

            }
            else if (e.key == "ArrowDown") {

            }
            else if (e.key == "Enter") {

            }
        }
    },

    handleListClick: function(e) {
        // If the list was clicked, use first child's text.
        if(e.target !== undefined) {
            if(e.target.tagName == "LI") {
                this.setState({searchString: e.target.firstChild.textContent}, this.props.updateCard(e.target.firstChild.textContent));
            } // If a span was clicked, use the parent's text (that of the LI item).
            else if(e.target.tagName == "SPAN"){            
                this.setState({searchString: e.target.offsetParent.firstChild.textContent}, this.props.updateCard(e.target.offsetParent.firstChild.textContent));
            } // If it's neither of those, it'll be the random button click.
        }
        else {
            this.setState({searchString: e.name}, this.props.updateCard(e.name));
        }
        this.setState({lineSelected:true}, this.props.updateCombineState(true));
    },

    handleRandomButtonClick: function(e) {
        var cardCollection = this.props.items;
        // Generate random number between 0 and 1, multiply by number of cards, and floor (round) it to an integer.
        var randomCard = cardCollection[Math.floor(Math.random()*cardCollection.length)];
        this.handleListClick(randomCard);
    },

    handleFindButtonClick: function(e) {
        this.props.updateZoomCard(this.state.searchString);
    },

    render: function() {
        var cardCollection = this.props.items; // The items passed to this class are hopefully all the cards.
        var placeholderString = this.props.placeholder;
        var searchString = this.state.searchString.toLowerCase(); // The search string is the thing in the search bar. Surprise!
        var resultCount = 1;

        if(searchString.length > 0 && !this.state.lineSelected) {
            // We are searching. Filter the results. This returns only those cards that match the search string.
            cardCollection = cardCollection.filter(function(card){
            	// I presume the match is expensive, so only do it once and assign the result to a bool.
            	var match = card.name.toLowerCase().match( searchString );
            	if (resultCount <= 10 && match) { // Keep the results list small.
            		resultCount++; // We got a result, so increment this.
	                return (match);
	            }
            });

            // We'd like the resulting list to be alphabetical.
            cardCollection.sort(function(a,b) {
            	if(a.name > b.name) {
            		return 1;
            	}
            	if(a.name < b.name) {
            		return -1;
            	}
            	return 0;
            });

            // Replace the mana cost string with a bunch of image tags.
            for (var i = 0; i < cardCollection.length; i++) {
                if (cardCollection[i].manaCost !== undefined) {
                    cardCollection[i].manaCost = cardCollection[i].manaCost.replace(/\//g,''); // Get rid of / in any costs first.
                    cardCollection[i].tagCost = cardCollection[i].manaCost
                    .match(/\{([0-z]+)\}/g)
                    .map(function (basename, i) {
                        var src = './src/data/img/' + basename.substring(1, basename.length - 1) + '.png';
                        return <img key={i} src={src} height='15px'/>;
                    });
                }
            }

            var animationEnter = {
                duration: 100,
                animation: Animations.In,
                stagger: 50
            };
            var animationLeave = {
                duration: 100,
                animation: Animations.Out,
                stagger: 50,
                backwards: true
            };

            // Still searching, so return the search box and all the remaining filtered cards.
            return <div>
	            <input type="text" value={this.state.searchString} onChange={this.handleChange} onKeyDown={this.handleKeyUp} placeholder={placeholderString} />
                <Button type="button" className="random" accent primary raised onClick={this.handleRandomButtonClick}>Random Card</Button>
                <br />
	            <ul onClick={this.handleListClick}> 
                    <VelocityTransitionGroup enter={animationEnter} leave={animationLeave}>                            
    	                { cardCollection.map(function(card, i){
    	                    return <li key={i}>{card.name} {card.tagCost}</li>;
    	                }) }
                    </VelocityTransitionGroup>
	            </ul>
	        </div>;
        }

        // Either a line has been selected or the search field is blank.
        else {
        	cardCollection = cardCollection.filter(function(card){
                // Use the start and end delimiters; we're searching for exact match only at this point (e.g. 'Shatter', not 'Shatterskull').
                return (card.name.toLowerCase().match( "\^"+searchString+"\$" ));
            });

            // Colour identity colours!
            var borderColour1, borderColour2;
            var gradient = false;
            var isSimic = 0; // These two are needed because WR and UG colour pairs appear out of order, for some reason.
            var isBoros = 0; // So if a pair is one of these, the colours need to be flipped.
            if (cardCollection.length == 1) {
                if (cardCollection[0].colors !== undefined) {
                    if (cardCollection[0].colors.length <= 2) { // Monocoloured cards. Also encode the first colour of dual-coloured cards.
                        var colourCode = cardCollection[0].colors[0];
                        switch (colourCode) {
                            case 'White':
                                borderColour1 = "#f8f9f4";
                                isBoros = 1;
                                break;
                            case 'Blue':
                                borderColour1 = "#0083c5";
                                isSimic = 1;
                                break;
                            case 'Red':
                                borderColour1 = "#ec4b26";
                                break;
                            case 'Black':
                                borderColour1 = "#2b281f";
                                break;
                            case 'Green':
                                borderColour1 = "#008045";
                                break;
                        }

                        if (cardCollection[0].colors.length == 2) { // Gold-but-coloured cards. Encode the second colour.
                            gradient = true;
                            var colourCode = cardCollection[0].colors[1];
                            switch (colourCode) {
                                case 'White':
                                    borderColour2 = "#f8f9f4";
                                    break;
                                case 'Blue':
                                    borderColour2 = "#0083c5";
                                    break;
                                case 'Red':
                                    borderColour2 = "#ec4b26";
                                    isBoros++;
                                    break;
                                case 'Black':
                                    borderColour2 = "#2b281f";
                                    break;
                                case 'Green':
                                    borderColour2 = "#008045";
                                    isSimic++;
                                    break;
                            }
                            
                            // Explicitly set Simic/Boros colours.
                            if (isBoros == 2) {
                                borderColour1 = "#ec4b26";
                                borderColour2 = "#f8f9f4";
                            }
                            if (isSimic == 2) {
                                borderColour1 = "#008045";
                                borderColour2 = "#0083c5";
                            }
                        }
                    }
                    else { // Pure gold cards.
                        borderColour1 = "#f3de7f"
                    }
                }
                else {
                    borderColour1 = "#c1c9c3"; // It's an artifact/land, so grey.
                }
            }
            else {
                borderColour1 = '#88888';
            }

            var borderStyle;
            if (gradient) {
                borderStyle = {
                    borderImageSlice: 1,
                    borderImage: '-webkit-linear-gradient(right, '+borderColour2+' 0%, '+borderColour2+' 40%, '+borderColour1+' 60%, '+borderColour1+' 100%) 1'
                };   
            }
            else {             
                borderStyle = {
                    'borderColor': borderColour1
                };   
            }
            var transparent = {
                opacity: 0
            }
            var small = {
                width: '30px'
            }

        	return <div>
        		<input type="text" style={borderStyle} value={this.state.searchString} onChange={this.handleChange} placeholder={placeholderString} />
        		<Button type="button" className={style.button} onClick={this.handleRandomButtonClick}>Random Card</Button>
                <IconButton primary onClick={this.handleFindButtonClick}><GithubIcon/></IconButton>
                <br />
        		{ cardCollection.map(function(card, i) {
        			// Only return an image if there's only one image (the search result) to return.
        			// If not, don't return this and there will only be the search box.
        			if (cardCollection.length == 1) {
                    	return <img key={i}
                        style={transparent}
                        src={'https://image.deckbrew.com/mtg/multiverseid/'+card.multiverseids[card.multiverseids.length-1].multiverseid+'.jpg'}
                        onLoad={this.handleImgLoad}/>
                    }
                }.bind(this)) }
        	</div>
        }
    }
});

export default CardSearch;