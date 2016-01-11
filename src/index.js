import React from 'react';
import ReactDOM from 'react-dom';
import CardSearch from './CardSearch';
import RunOnServer from './RunOnServer';
require('./style.scss');

var cards = require('json!./data/m10v2.json');

var data1, data2;

// Render the CardSearch component on the page
ReactDOM.render(
    <table>
    <tbody>
        <tr>
            <td><CardSearch items={ cards } placeholder="Card 1 here" cardName={data1}/></td>
            <td><RunOnServer url="py/comparecards" card1={data1} card2={data2}/></td>
            <td><CardSearch items={ cards } placeholder="Card 2 here" cardName={data2}/></td>
        </tr>
    </tbody>
    </table>,
    document.getElementById('root')
);
