import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';

function getSuggestionValue(suggestion) {
  return suggestion.nazwa;
}

function renderSuggestion(suggestion) {
  return <span>{suggestion.nazwa}</span>;
}

class Example extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
      isLoading: false
    };

    this.lastRequestId = null;
  }

  loadSuggestions(value) {
    if (this.lastRequestId !== null) {
      clearTimeout(this.lastRequestId);
    }

    this.setState({
      isLoading: true
    });

    this.lastRequestId = setTimeout(() => {
      axios.get(`/api/city/${value}`).then(result => {
        const wyniki = result;
        console.log(wyniki);
        this.setState({
          isLoading: false,
          suggestions: wyniki
        });
      });
    }, 0);
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.loadSuggestions(value);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions, isLoading } = this.state;
    const inputProps = {
      placeholder: "Type 'c'",
      value,
      onChange: this.onChange
    };
    const status = isLoading ? 'Loading...' : 'Type to load suggestions';

    return (
      <div>
        <div className="status">
          <strong>Status:</strong> {status}
        </div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

export default Example;
