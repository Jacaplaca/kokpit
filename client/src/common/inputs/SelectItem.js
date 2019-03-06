import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import InputComponent from "./InputComponent";
// import Fab from "@material-ui/core/Fab";

class SelectItem extends Component {
  state = { open: false };

  openSelect = () => {
    this.setState({ open: true });
  };

  closeSelect = () => {
    this.setState({ open: false });
  };

  handleUpdate = selected => {
    this.props.updateSelected(selected);
    this.closeSelect();
  };

  render() {
    const { select, label, classes, value } = this.props;
    const { open } = this.state;
    console.log("value", value);
    return (
      <React.Fragment>
        <div
          onClick={this.openSelect}
          ref={node => {
            this.anchorEl = node;
          }}
        >
          <InputComponent label={label} value={value} />
        </div>
        {/* <Button
          // variant="contained"
          // size="small"
          buttonRef={node => {
            this.anchorEl = node;
          }}
          aria-owns={open ? "render-props-menu" : undefined}
          aria-haspopup="true"
          onClick={this.openSelect}
        >
          {label}
        </Button> */}

        <Menu
          id="render-props-menu"
          anchorEl={this.anchorEl}
          open={open}
          onClose={this.closeSelect}
        >
          {select.map((x, i) => {
            return (
              <MenuItem key={i} onClick={() => this.handleUpdate(x)}>
                {x}
              </MenuItem>
            );
          })}
        </Menu>
      </React.Fragment>
    );
  }
}

export default withStyles(null, { withTheme: true })(SelectItem);

// export default SelectItem;
