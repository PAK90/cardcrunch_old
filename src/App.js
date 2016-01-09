import React, { Component } from 'react';
import CustomButton from './CustomButton';
import Autocomplete from 'react-toolbox/lib/autocomplete';

const cardSource = [
  'Force of Will',
  'Tormenting Voice',
  'Hand of Silumgar',
  'Silumgar Spell-Eater'
]
export default class App extends Component {
  state = {
  	value: []
  };

  handleChange = (value) => {
    this.setState({value: value});
  };

  render() {
    return (
      <h1>Hello, world.<br/>
      <CustomButton /><CustomButton /><br/>
      <Autocomplete 
      	label='Search for a card' 
      	//label={this.props.name}
      	source={cardSource} 
      	onChange={this.handleChange} 
      	value={this.state.value}
      /></h1>
    );
  }
}
