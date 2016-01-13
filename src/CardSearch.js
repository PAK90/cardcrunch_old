import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-toolbox/lib/button';

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
        // If the list was clicked, use first child's text.
        if(e.target !== undefined) {
            if(e.target.tagName == "LI") {
                this.setState({searchString: e.target.firstChild.textContent}, this.props.updateShared(e.target.firstChild.textContent));
            } // If a span was clicked, use the parent's text (that of the LI item).
            else if(e.target.tagName == "SPAN"){            
                this.setState({searchString: e.target.offsetParent.firstChild.textContent}, this.props.updateShared(e.target.offsetParent.firstChild.textContent));
            } // If it's neither of those, it'll be the random button click.
        }
        else {
            this.setState({searchString: e.name}, this.props.updateShared(e.name));
        }
        this.setState({lineSelected:true});

        // Send the new cardname to the Compare button.
        //this.props.updateShared(this.state.searchString);
    },

    handleRandomButtonClick: function(e) {
        var cardCollection = this.props.items;
        // Generate random number between 0 and 1, multiply by number of cards, and floor (round) it to an integer.
        var randomCard = cardCollection[Math.floor(Math.random()*cardCollection.length)];
        this.handleListClick(randomCard);
    },

    render: function() {
        var cardCollection = this.props.items; // The items passed to this class are hopefully all the cards.
        var placeholderString = this.props.placeholder;
        var searchString = this.state.searchString.toLowerCase(); // The search string is the thing in the search bar. Surprise!
        var resultCount = 1;

        if(searchString.length > 0 && !this.state.lineSelected) {
            // We are searching. Filter the results. This returns only those cards that match the search string.
            cardCollection = cardCollection.filter(function(card){
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
                <Button type="button" className="random" accent primary raised onClick={this.handleRandomButtonClick}>Random Card</Button>
                <br />
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
        	cardCollection = cardCollection.filter(function(card){
                // Use the start and end delimiters; we're searching for exact match only at this point (e.g. 'Shatter', not 'Shatterskull').
                return (card.name.toLowerCase().match( "\^"+searchString+"\$" ));
            });

            // Colour identity colours!
            var borderColour1, borderColour2;
            var gradient = false;
            if (cardCollection.length == 1) {
                if (cardCollection[0].colorIdentity !== undefined) {
                    if (cardCollection[0].colorIdentity.length <= 2) { // Monocoloured cards. Also encode the first colour of dual-coloured cards.
                        var colourCode = cardCollection[0].colorIdentity[0];
                        switch (colourCode) {
                            case 'W':
                                borderColour1 = "#f8f9f4";
                                break;
                            case 'U':
                                borderColour1 = "#0083c5";
                                break;
                            case 'R':
                                borderColour1 = "#ec4b26";
                                break;
                            case 'B':
                                borderColour1 = "#2b281f";
                                break;
                            case 'G':
                                borderColour1 = "#008045";
                                break;
                        }

                        if (cardCollection[0].colorIdentity.length == 2) { // Gold-but-coloured cards. Encode the second colour.
                            //gradient!
                            gradient = true;
                            var colourCode = cardCollection[0].colorIdentity[1];
                            switch (colourCode) {
                                case 'W':
                                    borderColour2 = "#f8f9f4";
                                    break;
                                case 'U':
                                    borderColour2 = "#0083c5";
                                    break;
                                case 'R':
                                    borderColour2 = "#ec4b26";
                                    break;
                                case 'B':
                                    borderColour2 = "#2b281f";
                                    break;
                                case 'G':
                                    borderColour2 = "#008045";
                                    break;
                            }
                        }
                    }
                    else { // Pure gold cards.
                        borderColour1 = "#f3de7f"
                    }
                }
                else {
                    borderColour1 = "#c1c9c3"; // It's an artifact/land, so grey.
                }
            }
            else {
                borderColour1 = '#88888';
            }

            var borderStyle;
            if (gradient) {
                borderStyle = {
                    borderImageSlice: 1,
                    borderImage: '-webkit-linear-gradient(right, '+borderColour2+' 0%, '+borderColour2+' 40%, '+borderColour1+' 60%, '+borderColour1+' 100%) 1'
                };   
            }
            else {             
                borderStyle = {
                    'borderColor': borderColour1
                };   
            }

        	return <div>
        		<input type="text" style={borderStyle} value={this.state.searchString} onChange={this.handleChange} placeholder={placeholderString} />
        		<Button type="button" className="random" accent primary raised onClick={this.handleRandomButtonClick}>Random Card</Button>
                <br />
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