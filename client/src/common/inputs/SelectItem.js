import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import InputComponent from "./InputComponent";
import ButtonMy from "../ButtonMy";
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
    const {
      select,
      label,
      classes,
      value,
      simpleInput,
      short,
      prefix,
      format
    } = this.props;
    const { open } = this.state;
    console.log("value", value);
    return (
      <React.Fragment>
        <div
          style={{ minWidth: 180, textAlign: "center" }}
          onClick={this.openSelect}
          ref={node => {
            this.anchorEl = node;
          }}
        >
          {/* <InputComponent
            format={format}
            prefix={prefix}
            label={label}
            value={value}
            simpleInput={simpleInput}
            short={short}
          /> */}
          <ButtonMy>
            <MenuIcon style={{ fontSize: 17, opacity: 0.8, marginRight: 8 }} />
            {label}
          </ButtonMy>
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
