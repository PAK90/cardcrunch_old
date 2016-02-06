import React from 'react';
import ReactDOM from 'react-dom';
import {Button, IconButton} from 'react-toolbox/lib/button';
import style from './style';
import Autosuggest from 'react-autosuggest';

var VelocityTransitionGroup = require('velocity-react/velocity-transition-group.js');
var VelocityComponent = require('velocity-react/velocity-component.js');
var VelocityHelpers = require('velocity-react/velocity-helpers.js');
require('velocity-animate');
require('velocity-animate/velocity.ui');

// This used to be 'json!.data/allCards.json' until I put it in webpack.config.js. Confusing stuff...
var cards = require('./data/allCardsMod.json');

// 'cards' is an object full of objects, so instead turn it into an array.
// Works by creating a new property called 'cardName' in the object, attaching the rest of the object with && and returning the lot into a new var.
var cardArray = Object.keys(cards).map(function(cardName) {
    return (cards[cardName].cardName = cardName) && cards[cardName];
});

cardArray.sort(function(a,b) {
    if(a.name > b.name) {
        return 1;
    }
    if(a.name < b.name) {
        return -1;
    }
    return 0;
});

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

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestionValue(suggestion) {
    return suggestion.name;
}

function renderSuggestion(suggestion) {
    // First take the manacost and return a bunch of img divs.
    if (suggestion.manaCost !== undefined) {
        suggestion.manaCost = suggestion.manaCost.replace(/\//g,''); // Get rid of / in any costs first.
        suggestion.tagCost = suggestion.manaCost
        .match(/\{([0-z]+)\}/g)
        .map(function (basename, i) {
            var src = './src/data/img/' + basename.substring(1, basename.length - 1) + '.png';
            return <img key={i} src={src} height='15px'/>;
        });
    }
    return (
        <VelocityComponent animation={{rotateZ: [-180, 0]}} duration={500}><span>{suggestion.name} {suggestion.tagCost}</span></VelocityComponent>
    );
}

var CardSearch2 = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            suggestions: this.getSuggestions(''),
            cardSelected: false,
            selectedCard: null
        };
    },


    getSuggestions: function(value) {
        const escapedValue = escapeRegexCharacters(value.trim());
      
        if (escapedValue === '') {
            return [];
        }

        const regex = new RegExp('^' + escapedValue, 'i');

        var filteredArray;
        if (this.props.searchWordFirst) { // If the slider is set to 'start', i.e. how this usually behaves.
            filteredArray = cardArray.filter(cardArray => regex.test(cardArray.name));
        }
        else {
            filteredArray = cardArray.filter(function(card) {
                return card.name.toLowerCase().match( escapedValue );
            })
        }
        if (filteredArray.length > 10) {
            filteredArray.length = 10;
        }
        return filteredArray;
    },

    handleImgLoad: function(e) {
        var img = e.target;
        // Needs the dollar sign for some reason.
        $.Velocity(img, {rotateY: [0,90], opacity: [1,0]}, {duration: 500});
    },
  
    componentDidMount: function() {
        this.input.focus();
    },
  
    onChange: function(event, { newValue, method }) {
        this.setState({
            value: newValue
        });
        // This gets called on selecting a card from the list, so ensure this isn't called when that happens.
        if (method != 'click' && method != 'enter') {
            this.props.updateCombineState(false);
        }
    },
    
    onSuggestionsUpdateRequested: function({ value }) {
        this.setState({
            suggestions: this.getSuggestions(value),
            cardSelected: false,
            selectedCard: null
        });
    },
  
    saveInput: function(autosuggest) {
        this.input = autosuggest.input;
    },

    selectCard: function(e, values) {
        // This has method (e.g. click or enter), suggestion (the whole card) and suggestionValue (card name).
        // Update the parent states so that the combine button and script work.
        this.props.updateCombineState(true);
        if (values == false)
        {
            this.props.updateCard(e.name);
            // Set cardSelected to true to render the cardImage, set selectedCard to get the image, and set suggesions to empty to empty the list.
            this.setState({cardSelected: true, selectedCard: e, suggestions: ''}, this.render())
        }
        else {
            this.props.updateCard(values.suggestion.name);
            // Set cardSelected to true to render the cardImage, set selectedCard to get the image, and set suggesions to empty to empty the list.
            this.setState({cardSelected: true, selectedCard: values.suggestion, suggestions: ''}, this.render())
        }
    },

    handleRandomButtonClick: function() {
        // Generate random number between 0 and 1, multiply by number of cards, and floor (round) it to an integer.
        var randomCard = cardArray[Math.floor(Math.random()*cardArray.length)];
        this.setState({value: randomCard.name});
        this.selectCard(randomCard, false);
    },

    handleFindButtonClick: function(e) {
        this.props.updateZoomCard(this.state.selectedCard.name);
    },

    handleHighlightButtonClick: function(e) {
        this.props.updateHighlightCard(this.state.selectedCard.name);
    },

    render: function() {        
        var placeholderString = this.props.placeholder;

        const { value, suggestions, cardSelected, selectedCard } = this.state;

        const inputProps = {
            placeholder: placeholderString,
            value,
            onChange: this.onChange
        };

        // Used on the cards so they don't display before they animate in.
        var transparent = {
            opacity: 0
        };

        var inline = {
            width: '88%',
            margin: '0 auto'
        };

        // Return a cardImage with actual image if selected, empty tag if not.
        var cardImage;
        if (this.state.cardSelected) {
            cardImage = <div style={inline}>
                            <img
                            id="cardImage"
                            style={transparent} 
                            src={'https://image.deckbrew.com/mtg/multiverseid/'+this.state.selectedCard.multiverseids[this.state.selectedCard.multiverseids.length-1].multiverseid+'.jpg'}
                            onLoad={this.handleImgLoad}/>
                        </div>
        }
        else {
            cardImage = <img/>
        }
        
        var borderColour1, borderColour2;
        var gradient = false;
        var isSimic = 0; // These three are needed because UW, WR and UG colour pairs appear out of order, for some reason.
        var isBoros = 0; // So if a pair is one of these, the colours need to be flipped.
        var isSelesnya = 0;
        if (this.state.selectedCard !== null) {
            if (this.state.selectedCard.colors !== undefined) {
                if (this.state.selectedCard.colors.length <= 2) { // Monocoloured cards. Also encode the first colour of dual-coloured cards.
                    var colourCode = this.state.selectedCard.colors[0];
                    switch (colourCode) {
                        case 'White':
                            borderColour1 = "#f8f9f4";
                            isBoros = 1;
                            isSelesnya = 1;
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

                    if (this.state.selectedCard.colors.length == 2) { // Gold-but-coloured cards. Encode the second colour.
                        gradient = true;
                        var colourCode = this.state.selectedCard.colors[1];
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
                                isSelesnya++;
                                break;
                        }
                        
                        // Explicitly set Simic/Boros/Selesnya colours.
                        if (isBoros == 2) {
                            borderColour1 = "#ec4b26";
                            borderColour2 = "#f8f9f4";
                        }
                        else if (isSimic == 2) {
                            borderColour1 = "#008045";
                            borderColour2 = "#0083c5";
                        }
                        else if (isSelesnya == 2) {
                            borderColour1 = "#008045";
                            borderColour2 = "#f8f9f4";
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
            borderColour1 = '#888888';
        }

        // Grab the input, and style the border forcibly.
        var container = document.getElementsByClassName('react-autosuggest__container')
        if (container.length != 0) {
            var input;
            // Of course, since we have two of these components on the page the getElements will return both. Have to distinguish which one to edit via the placeholder.
            if (this.props.placeholder == "Card 1 here") {
                input = container[0].childNodes[0];    
            }
            else if (this.props.placeholder == "Card 2 here") {
                input = container[1].childNodes[0];
            }
            if (gradient) {
                input.style.borderImageSlice = 1;
                input.style.borderImage = '-webkit-linear-gradient(right, '+borderColour2+' 0%, '+borderColour2+' 40%, '+borderColour1+' 60%, '+borderColour1+' 100%) 1';
            }
            else {             
                input.style.borderColor = borderColour1;
                // Also remove the gradient property, otherwise it'll interfere.
                input.style.borderImage = '';
            }
        }

        var inline2 = {
            width: '73%',
            margin: '0 auto'
        };
        return (
            <div>
                <Autosuggest suggestions={suggestions}
                    onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    ref={this.saveInput}
                    onSuggestionSelected={this.selectCard} />
                <div style={inline2}>
                    <button type="button" className="button" onClick={this.handleRandomButtonClick}>Random Card</button>
                    <button id="search-button" onClick={this.handleFindButtonClick}>
                        <svg id="search-icon" className="search-icon" viewBox="0 0 24 24">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                    </button>
                    <button id="highlight-button" onClick={this.handleHighlightButtonClick}>
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
                    </button>
                </div>
                {cardImage}
            </div>
        );
    }
});

export default CardSearch2;