import React, { Component } from "react";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import ButtonMy from "./ButtonMy";
import ModalWindow from "../components/ModalWindow";
import DateRangePickerMy from "./DateRangePickerMy";
import { durationLabel } from "./functions";
import { getString } from "../translate";

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
    const { range, onChange, language } = this.props;
    return (
      <React.Fragment>
        <ButtonMy onClick={this.handleOpenDuration}>
          {getString("DURATION", language)} {durationLabel([range], language)}
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

function mapStateToProps({ language }) {
  return { language };
}

export default connect(
  mapStateToProps,
  null
)(DurationWithButton);
