import React from 'react';
import ReactDOM from 'react-dom';
import CardSearch from './CardSearch';
import RunOnServer from './RunOnServer';
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
    var keyLowerDash = keyLower.replace("-", "~").replace("æ","ae").replace('û','u').replace('!','').replace('ú','u');
    if (keyLowerDash !== key) {
        var temp = cards[key];
        delete cards[key];
        cards[keyLowerDash] = temp;
    }
}

var Parent = React.createClass({
    getInitialState: function(){
        return {card1: "", card2: ""};
    },
    updateCard1: function(card){
        this.setState({card1: card});
    },
    updateCard2: function(card){
        this.setState({card2: card});
    },
    updateCombineState: function(state){
        this.setState({combineReady: state});
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
                    updateCombineState={this.updateCombineState}/>
                </td>
                <td>
                <CardSearch 
                    items={ cardArray } 
                    placeholder="Card 2 here" 
                    card={this.state.card2} 
                    updateCard={this.updateCard2} 
                    updateCombineState={this.updateCombineState}/>
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
                    combineReady={this.state.combineReady}
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
