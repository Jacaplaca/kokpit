import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import ButtonMy from "./ButtonMy";
import ModalWindow from "../components/ModalWindow";
import DateRangePickerMy from "./DateRangePickerMy";
import { durationLabel } from "./functions";

class DurationWithButton extends Component {
  state = {
    openModalDuration: false
  };

  handleCloseDuration = () => {
    this.setState({ openModalDuration: false });
  };
  handleOpenDuration = () => {
    this.setState({ openModalDuration: true });
  };

  render() {
    const { range, onChange } = this.props;
    return (
      <React.Fragment>
        <ButtonMy onClick={this.handleOpenDuration}>
          Zakres {durationLabel([range])}
        </ButtonMy>
        <ModalWindow
          open={this.state.openModalDuration}
          close={this.handleCloseDuration}
          maxWidth={1000}
        >
          <Paper>
            <DateRangePickerMy
              range={[range]}
              onChange={onChange}
              // nopaper
              defaultExp
            />
          </Paper>
        </ModalWindow>
      </React.Fragment>
    );
  }
}

export default DurationWithButton;
