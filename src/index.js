import React from 'react';
import ReactDOM from 'react-dom';
import CardSearch from './CardSearch';

var cards = require('json!./data/m10v2.json');

// Render the CardSearch component on the page
ReactDOM.render(
    <table>
        <tr>
            <td><CardSearch items={ cards } /></td>
            <td><CardSearch items={ cards } /></td>
        </tr>
    </table>,
    document.getElementById('root')
);
