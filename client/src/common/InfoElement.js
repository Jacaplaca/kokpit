import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Close from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

class InfoElement extends Component {
  state = {
    open: true
  };

  componentWillMount() {
    const now = new Date().getTime() / 1000;
    const published = new Date(this.props.published).getTime() / 1000;
    const duration = this.props.duration * 24 * 3600;
    console.log(now, published, duration);
    if (now > published + duration) {
      this.setState({ open: false });
    } else {
      this.setState({ open: true });
    }
  }

  render() {
    return (
      <Paper
        style={{
          padding: 10,
          marginBottom: 10,
          display: this.state.open ? "default" : "none"
        }}
      >
        <IconButton
          onClick={() => this.setState({ open: false })}
          style={{
            // lineHeight: 12,
            // width: 18,
            fontSize: 8,
            // marginTop: 30,
            // marginRight: 20,
            position: "absolute",
            top: 90,
            right: 30
          }}
          // className={classes.button}
          aria-label="Delete"
        >
          <Close />
        </IconButton>

        {this.props.children}
      </Paper>
    );
  }
}

export default InfoElement;
