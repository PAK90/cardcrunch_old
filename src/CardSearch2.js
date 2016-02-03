import React from 'react';
import ReactDOM from 'react-dom';
import {Button, IconButton} from 'react-toolbox/lib/button';
import style from './style';
import Autosuggest from 'react-autosuggest';
var DiceIcon = require('babel!svg-react!../src/data/img/DiceIcon.svg?name=DiceIcon');

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
        <span>{suggestion.name} {suggestion.tagCost}</span>
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

        // Return a cardImage with actual image if selected, empty tag if not.
        var cardImage;
        if (this.state.cardSelected) {
            cardImage = <img
                        style={transparent} 
                        src={'https://image.deckbrew.com/mtg/multiverseid/'+this.state.selectedCard.multiverseids[this.state.selectedCard.multiverseids.length-1].multiverseid+'.jpg'}
                        onLoad={this.handleImgLoad}/>
        }
        else {
            cardImage = <img/>
        }
        
        // Animations
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

        var borderColour1, borderColour2;
        var gradient = false;
        var isSimic = 0; // These two are needed because WR and UG colour pairs appear out of order, for some reason.
        var isBoros = 0; // So if a pair is one of these, the colours need to be flipped.
        if (this.state.selectedCard !== null) {
            if (this.state.selectedCard.colors !== undefined) {
                if (this.state.selectedCard.colors.length <= 2) { // Monocoloured cards. Also encode the first colour of dual-coloured cards.
                    var colourCode = this.state.selectedCard.colors[0];
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
            borderColour1 = '#888888';
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
        var theme = {
            container: 'react-autosuggest__container',
            containerOpen: 'react-autosuggest__container--open',
            input: borderStyle,
            suggestionsContainer: 'react-autosuggest__suggestions-container',
            suggestion: 'react-autosuggest__suggestion',
            suggestionFocused: 'react-autosuggest__suggestion--focused',
            sectionContainer: 'react-autosuggest__section-container',
            sectionTitle: 'react-autosuggest__section-title',
            sectionSuggestionsContainer: 'react-autosuggest__section-suggestions-container'
        };

        return (
            <div>
            <VelocityTransitionGroup enter={animationEnter} leave={animationLeave}> 
                <Autosuggest suggestions={suggestions}
                    theme={theme}
                    onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    ref={this.saveInput}
                    onSuggestionSelected={this.selectCard} />
            </VelocityTransitionGroup>
            <Button type="button" className="button" onClick={this.handleRandomButtonClick}>Random Card</Button>
            <button id="search-button" onClick={this.handleFindButtonClick}>
                <svg id="search-icon" className="search-icon" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
            </button>
            <br/>
            {cardImage}
            </div>
        );
    }
});

export default CardSearch2;