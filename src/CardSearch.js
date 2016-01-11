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
                this.setState({searchString: e.target.firstChild.textContent});
            } // If a span was clicked, use the parent's text (that of the LI item).
            else if(e.target.tagName == "SPAN"){            
                this.setState({searchString: e.target.offsetParent.firstChild.textContent});
            } // If it's neither of those, it'll be the random button click.
        }
        else {
            this.setState({searchString: e.name});
        }
        this.setState({lineSelected:true});
    },

    handleRandomButtonClick: function(e) {
        var cardCollection = this.props.items;
        // Generate random number between 0 and 1, multiply by number of cards, and floor (round) it to an integer.
        var randomCard = cardCollection.cards[Math.floor(Math.random()*cardCollection.cards.length)];
        this.handleListClick(randomCard);
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
        	cardCollection = cardCollection.cards.filter(function(card){
                // Use the start and end delimiters; we're searching for exact match only at this point (e.g. 'Shatter', not 'Shatterskull').
                return (card.name.toLowerCase().match( "\^"+searchString+"\$" ));
            });

            // Colour identity colours!
            var borderColour;
            var gradient = false;
            if (cardCollection.length == 1) {
                if (cardCollection[0].colorIdentity !== undefined) {
                    if (cardCollection[0].colorIdentity.length == 1) { // Monocoloured cards.
                        var colourCode = cardCollection[0].colorIdentity[0];
                        switch (colourCode) {
                            case 'W':
                                borderColour = "#f8f9f4";
                                break;
                            case 'U':
                                borderColour = "#0083c5";
                                break;
                            case 'R':
                                borderColour = "#ec4b26";
                                break;
                            case 'B':
                                borderColour = "#2b281f";
                                break;
                            case 'G':
                                borderColour = "#008045";
                                break;
                        }
                    }
                    else if (cardCollection[0].colorIdentity.length == 2) { // Gold-but-coloured cards.
                        //gradient!
                        gradient = true;
                        borderColour = "linear-gradient(0083c5,ec4b26)";
                    }
                    else { // Pure gold cards.
                        borderColour = "#f3de7f"
                    }
                }
                else {
                    borderColour = "#c1c9c3"; // It's an artifact/land, so grey.
                }
            }
            else {
                borderColour = '#88888';
            }

            var borderStyle;
            if (gradient) {
                borderStyle = {
                    borderImageSlice: 1,
                    borderImage: '-webkit-linear-gradient(right, #FC913A 0%, #FC913A 44%, #FF4E50 55%, #FF4E50 100%) 1'
                };   
            }
            else {             
                borderStyle = {
                    'borderColor': borderColour
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