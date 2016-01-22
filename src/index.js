import React from 'react';
import ReactDOM from 'react-dom';
import CardSearch from './CardSearch';
import RunOnServer from './RunOnServer';
import WeightScale from './WeightScale';
import CosinePlot from './CosinePlot';
require('./style.scss');

// This used to be 'json!.data/allCards.json' until I put it in webpack.config.js. Confusing stuff...
var cards = require('./data/allCardsMod.json');

// 'cards' is an object full of objects, so instead turn it into an array.
// Works by creating a new property called 'cardName' in the object, attaching the rest of the object with && and returning the lot into a new var.
var cardArray = Object.keys(cards).map(function(cardName) {
    return (cards[cardName].cardName = cardName) && cards[cardName];
});

// Turn cards object keys into the format returned by the python script.
// Just go in and create a new key, and replace each object's key with the new key.
for (var key in cards) {
    var keyLower = key.toLowerCase();
    var keyLowerDash = keyLower.replace("-", "~").replace("æ","ae").replace('û','u').replace('!','').replace('ú','u').replace('â','a').replace('ö','o').replace("-", "~");
    if (keyLowerDash !== key) {
        var temp = cards[key];
        delete cards[key];
        cards[keyLowerDash] = temp;
    }
}

var Parent = React.createClass({
    getInitialState: function(){
        return {card1: "", card2: "", slider: 0.5, combine1Ready: false, combine2Ready: false};
    },
    updateCard1: function(card){
        this.setState({card1: card});
    },
    updateCard2: function(card){
        this.setState({card2: card});
    },
    updateSlider: function(value){
        this.setState({slider: value});
    },
    updateCombineState1: function(state){
        this.setState({combine1Ready: state});
    },
    updateCombineState2: function(state){
        this.setState({combine2Ready: state});
    },
    render: function() {
        return (<div><table>
        <tbody>
            <tr>
                <td>
                <CardSearch 
                    items={ cardArray } 
                    placeholder="Card 1 here" 
                    card={this.state.card1} 
                    updateCard={this.updateCard1} 
                    updateCombineState={this.updateCombineState1}/>
                </td>
                <td>
                <CardSearch 
                    items={ cardArray } 
                    placeholder="Card 2 here" 
                    card={this.state.card2} 
                    updateCard={this.updateCard2} 
                    updateCombineState={this.updateCombineState2}/>
                </td>
            </tr>
            <tr>
                <td colSpan = "2">
                    <WeightScale updateSlider={this.updateSlider}/>
                </td>
            </tr>
        </tbody>
        </table>
        <table><tbody>        
            <tr>
                <td colSpan="2">
                <RunOnServer 
                    url="py/comparecards" 
                    card1={this.state.card1} 
                    card2={this.state.card2} 
                    sliderValue={this.state.slider}
                    combine1Ready={this.state.combine1Ready}
                    combine2Ready={this.state.combine2Ready}
                    items={ cards }/>
                </td>
            </tr>
        </tbody></table></div>
        );
    }
});

ReactDOM.render(
    <Parent/>,
    document.getElementById('root')
);
