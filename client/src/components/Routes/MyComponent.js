import React, { Component } from "react";
// import Users from "./Users";

const MyComponent = ({ component: TagName, title, channel }) => (
  <TagName title={title} channel={channel} />
);

// class MyComponent extends Component {
//   render() {
//     const TagName = this.props.component;
//     return <TagName title={this.props.title} channel={this.props.channel} />;
//   }
// }

export default MyComponent;
