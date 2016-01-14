import React from 'react';
import ReactDOM from 'react-dom';
import CardSearch from './CardSearch';
import RunOnServer from './RunOnServer';
require('./style.scss');

var under = require('underscore');
// This used to be 'json!.data/m10v2.json' until I put it in webpack.config.js. Confusing stuff...
var cards = require('./data/m10v2.json');

// Remove all duplicates from the cards array with the staggeringly useful uniq function.
var uniqueCards = under.uniq(cards.cards, false, function(x) {
    return x.name;
});

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
        return (<table>
        <tbody>
            <tr>
                <td><CardSearch 
                    items={ uniqueCards } 
                    placeholder="Card 1 here" 
                    card={this.state.card1} 
                    updateCard={this.updateCard1} 
                    updateCombineState={this.updateCombineState}/>
                </td>
                <td><RunOnServer url="py/comparecards" card1={this.state.card1} card2={this.state.card2} combineReady={this.state.combineReady}/></td>
                <td><CardSearch 
                    items={ uniqueCards } 
                    placeholder="Card 2 here" 
                    card={this.state.card2} 
                    updateCard={this.updateCard2} 
                    updateCombineState={this.updateCombineState}/>
                </td>
            </tr>
        </tbody>
        </table>);
    }
});

ReactDOM.render(
    <Parent/>,
    document.getElementById('root')
);
