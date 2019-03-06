import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

class ItemsConfig extends Component {
  state = { configs: [] };

  componentWillMount() {
    this.urlToState(this.props.fetchUrl);
  }

  urlToState = async url => {
    const configs = await this.fetch(url);
    this.setState({
      configs
    });
  };

  fetch = async url => {
    const result = await axios.get(url);
    return result.data;
    // return list.data.sort(dynamicSort("name"));
  };

  // componentWillReceiveProps = (nextProps) => {
  //   const {showId} = this.props
  //   const {showId: showIdNext} = nextProps
  //   if (showId !== showIdNext) {
  //
  //   }
  // }

  render() {
    const { showId } = this.props;
    const { configs } = this.state;
    return (
      <div>
        {showId}
        {configs && configs.map(config => <span>{config.bonus}</span>)}
      </div>
    );
  }
}

ItemsConfig.propTypes = {
  name: PropTypes.number
};

export default ItemsConfig;
