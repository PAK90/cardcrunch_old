import React from 'react';
import ReactDOM from 'react-dom';
import CardSearch from './CardSearch';
import RunOnServer from './RunOnServer';
require('./style.scss');

var cards = require('json!./data/m10v2.json');

// Render the CardSearch component on the page
ReactDOM.render(
    <table>
    <tbody>
        <tr>
            <td><CardSearch items={ cards } placeholder="Card 1 here" /></td>
            <td><CardSearch items={ cards } placeholder="Card 2 here"/></td>
            <td><RunOnServer url="src/CustomButton.js" /></td>
        </tr>
    </tbody>
    </table>,
    document.getElementById('root')
);
