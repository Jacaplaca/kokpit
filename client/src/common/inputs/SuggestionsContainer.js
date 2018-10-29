import React from "react";

class SuggestionsContainer extends React.Component {
  render() {
    const { children, ...containerProps } = this.props;

    return <div {...containerProps}>{children}</div>;
  }
}

export default SuggestionsContainer;
