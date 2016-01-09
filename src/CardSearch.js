import React from 'react';
import ReactDOM from 'react-dom';

var CardSearch = React.createClass({
    getInitialState: function() {
        return { searchString: '' };
    },

    handleChange: function(e) {

        // If you comment out this line, the text box will not change its value.
        // This is because in React, an input cannot change independently of the value
        // that was assigned to it. In our case this is this.state.searchString.

        this.setState({searchString:e.target.value});
        this.setState({lineSelected:false});
    },

    handleListClick: function(e) {
    	this.setState({searchString:e.target.textContent});
        this.setState({lineSelected:true});
    },

    render: function() {
        var cardCollection = this.props.items; // The items passed to this class are hopefully all the cards.
        var placeholderString = this.props.placeholder;
        var searchString = this.state.searchString.toLowerCase(); // The search string is the thing in the search bar. Surprise!
        var resultCount = 1;

        if(searchString.length > 0 && !this.state.lineSelected) {
            // We are searching. Filter the results. This returns only those cards that match the search string.
            cardCollection = cardCollection.cards.filter(function(card){
            	// I presume the match is expensive, so only do it once and assign the result to a bool.
            	var match = card.name.toLowerCase().match( searchString );
            	if (resultCount <= 10 && match) { // Keep the results list small.
            		resultCount++; // We got a result, so increment this.
	                return (match);
	            }
            });

            // We'd like the resulting list to be alphabetical.
            cardCollection.sort(function(a,b) {
            	if(a.name > b.name) {
            		return 1;
            	}
            	if(a.name < b.name) {
            		return -1;
            	}
            	return 0;
            });

            // Still searching, so return the search box and all the remaining filtered cards.
            return <div>
	            <input type="text" value={this.state.searchString} onChange={this.handleChange} placeholder={placeholderString} />
	            <ul onClick={this.handleListClick}> 
	                { cardCollection.map(function(card){
	                    //return [<li><p>{card.name}</p><p id="manacost">{card.manaCost.replace(/\W/g, '')}</p></li>]; 
	                    if (card.manaCost != undefined) {
	                    	return <li key={card.name}>{card.name} {card.manaCost.replace(/\W/g, '')}</li>; 
                            // Regex magic to remove non-alphanumerical values.
	                    }
	                    else {
	                    	return <li key={card.name}>{card.name}</li>;
	                    }
	                }) }
	            </ul>
	        </div>;
        }

        // Either a line has been selected or the search field is blank.
        else {
        	cardCollection = cardCollection.cards.filter(function(card){
                return (card.name.toLowerCase().match( searchString ));
            });

        	return <div>
        		<input type="text" value={this.state.searchString} onChange={this.handleChange} placeholder={placeholderString} />
        		<br/>
        		{ cardCollection.map(function(card){
        			// Only return an image if there's only one image (the search result) to return.
        			// If not, don't return this and there will only be the search box.
        			if (cardCollection.length == 1) {
                    	return <img src={'https://image.deckbrew.com/mtg/multiverseid/'+card.multiverseid+'.jpg'}/>
                    }
                }) }
        	</div>
        }
    }
});

export default CardSearch;