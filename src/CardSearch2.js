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

function getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());
  
    if (escapedValue === '') {
        return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    var filteredArray = cardArray.filter(cardArray => regex.test(cardArray.name));
    if (filteredArray.length > 10) {
        filteredArray.length = 10;
    }
    return filteredArray;
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
            suggestions: getSuggestions(''),
            cardSelected: false
        };
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
            suggestions: getSuggestions(value),
            cardSelected: false
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

    render: function() {        
        var placeholderString = this.props.placeholder;

        const { value, suggestions, cardSelected, selectedCard } = this.state;

        const inputProps = {
            placeholder: placeholderString,
            value,
            onChange: this.onChange
        };

        var transparent = {
            opacity: 0
        };

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

        return (
            <div>
            <VelocityTransitionGroup enter={animationEnter} leave={animationLeave}> 
                <Autosuggest suggestions={suggestions}
                   onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}
                   inputProps={inputProps}
                   ref={this.saveInput}
                   onSuggestionSelected={this.selectCard} />
                </VelocityTransitionGroup>
            <Button type="button" className="button" onClick={this.handleRandomButtonClick}>Random Card</Button>
            <br/>
            {cardImage}
            </div>
        );
    }
});

export default CardSearch2;