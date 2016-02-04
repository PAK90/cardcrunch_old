import React from 'react';
import ReactDOM from 'react-dom';
import CardSearch from './CardSearch';
import CardSearch2 from './CardSearch2';
import RunOnServer from './RunOnServer';
import WeightScale from './WeightScale';
import CosinePlot from './CosinePlot';
import Button from 'react-toolbox/lib/button';
import style from './style';
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
    var keyLowerDash = keyLower.replace("-", "~").replace("æ","ae").replace('û','u').replace('!','').replace('ú','u').replace('â','a').replace('ö','o').replace("-", "~").replace("á","a").replace("é","e");
    if (keyLowerDash !== key) {
        var temp = cards[key];
        delete cards[key];
        cards[keyLowerDash] = temp;
    }
}

var Parent = React.createClass({
    getInitialState: function(){
        return {card1: "", 
                card2: "", 
                zoomCard: "", 
                highlightCard: "",
                slider: 0.5, 
                combine1Ready: false, 
                combine2Ready: false, 
                combinationData: '', 
                switch: false};
    },
    runOnServer: function() {
        $.ajax({
            url: "py/comparecards",
            dataType: 'text',
            cache: false,
            // The card names are stored in the python script sources in lowercase and with ~ instead of -, as well as many other letter replacements.
            data: {card1: this.state.card1.toLowerCase().replace("-","~").replace("æ","ae").replace('û','u').replace('!','').replace('ú','u').replace('â','a').replace('ö','o').replace("-", "~").replace("á","a").replace("é","e"),
                   card2: this.state.card2.toLowerCase().replace("-","~").replace("æ","ae").replace('û','u').replace('!','').replace('ú','u').replace('â','a').replace('ö','o').replace("-", "~").replace("á","a").replace("é","e"),
                   slider: this.state.slider},
            success: function(data) {
                this.setState({combinationData: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("py/comparecards", status, err.toString());
            }.bind(this)
        });
    },
    handleClick: function(e) {
        this.runOnServer();
        // When clicked, run this. Should replace with a spinny circle at some point.
        this.setState({combinationData: "Processing..."});        
    },
    handleSwitch: function(e) {
        if (e.target.checked) {
            this.setState({switch: true});
        }
        else
        {
            this.setState({switch: false});
        }
    },
    updateCard1: function(card){
        this.setState({card1: card});
    },
    updateCard2: function(card){
        this.setState({card2: card});
    },
    updateZoomCard: function(card){
        this.setState({zoomCard: card});
    },
    updateHighlightCard: function(card){
        this.setState({highlightCard: card});
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
        var inline = {
            width: '70%',
            margin: '0 auto'
        };

        return (<div><table>
        <tbody>
            <tr>
                <td>
                <CardSearch2
                    placeholder="Card 1 here" 
                    card={this.state.card1} 
                    updateCard={this.updateCard1} 
                    updateCombineState={this.updateCombineState1}
                    updateZoomCard={this.updateZoomCard}
                    updateHighlightCard={this.updateHighlightCard}
                    searchWordFirst={this.state.switch}/>
                </td>
                <td>
                <div style={inline}>
                    <div className="onoffswitch">
                        <input 
                            type="checkbox" 
                            name="onoffswitch" 
                            onChange={this.handleSwitch}  
                            className="onoffswitch-checkbox" 
                            id="myonoffswitch" 
                            checked={this.state.switch}/>
                        <label className="onoffswitch-label" htmlFor="myonoffswitch">
                            <span className="onoffswitch-inner"></span>
                            <span className="onoffswitch-switch"></span>
                        </label>
                    </div>
                </div>
                <p width='100px !important'>Name search start position</p>
                <br/>
                <Button 
                    label="Combine Cards" 
                    className="button2"
                    disabled={!(this.state.combine1Ready && this.state.combine2Ready)} 
                    onClick={this.handleClick} />
                </td>
                <td>
                <CardSearch 
                    items={ cardArray } 
                    placeholder="Card 2 here" 
                    card={this.state.card2} 
                    updateCard={this.updateCard2} 
                    updateCombineState={this.updateCombineState2}
                    updateZoomCard={this.updateZoomCard}/>
                </td>
                <td>
                    <CosinePlot zoomString={this.state.zoomCard} highlightString={this.state.highlightCard}/>
                </td>
            </tr>
            <tr>
                <td colSpan = "3">
                    <WeightScale updateSlider={this.updateSlider}/>
                </td>
            </tr>
        </tbody>
        </table>
        <table><tbody>        
            <tr>
                <td colSpan="3">
                <RunOnServer 
                    updateZoomCard={this.updateZoomCard}
                    updateHighlightCard={this.updateHighlightCard}
                    combinationData={this.state.combinationData}
                    items={cards}/>
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
