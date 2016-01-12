import React from 'react';
import ReactDOM from 'react-dom';
import CardSearch from './CardSearch';
import RunOnServer from './RunOnServer';
require('./style.scss');

var cards = require('json!./data/m10v2.json');

var Parent = React.createClass({
    getInitialState: function(){
        return {card1: "", card2: ""};
    },
    updateShared1: function(card){
        this.setState({card1: card});
    },
    updateShared2: function(card){
        this.setState({card2: card});
    },
    render: function() {
        return (<table>
        <tbody>
            <tr>
                <td><CardSearch items={ cards } placeholder="Card 1 here" card={this.state.card1} updateShared={this.updateShared1} /></td>
                <td><RunOnServer url="py/comparecards" card1={this.state.card1} card2={this.state.card2}/></td>
                <td><CardSearch items={ cards } placeholder="Card 2 here" card={this.state.card2} updateShared={this.updateShared2} /></td>
            </tr>
        </tbody>
        </table>);
    }
});

ReactDOM.render(
    <Parent/>,
    document.getElementById('root')
);
