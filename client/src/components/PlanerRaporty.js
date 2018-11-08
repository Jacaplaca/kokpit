import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import * as actions from "../actions";
import {
  dataToString,
  podzielUnikalnymi,
  dynamicSort,
  defineds
} from "../common/functions";
import MainFrameHOC from "../common/MainFrameHOC";
import PlanerRaportyForm from "./PlanerRaportyForm";
import PlanerLista from "./PlanerLista";
import ModalWindow from "./ModalWindow";

import DateRangePickerMy from "../common/DateRangePickerMy";

const styles = theme => ({
  input: {
    display: "flex",
    padding: 0
  }
});

class PlanerRaporty extends Component {
  state = {
    aktywnosci: [],
    id: "",
    editedId: "",
    rangeselection: {
      startDate: defineds.startOfMonth,
      endDate: defineds.endOfMonth,
      key: "rangeselection"
    },
    openModal: false,
    expanded: "",
    kiedy: ""
  };

  componentWillMount() {
    this.fetchRaporty();
  }

  fetchRaporty = async range => {
    this.props.loading(true);
    this.props.loadingSent(true);
    const { startDate, endDate } = this.state.rangeselection;

    const poczatek = range ? range.rangeselection.startDate : startDate;
    const koniec = range ? range.rangeselection.endDate : endDate;
    const fetch = await axios.get(
      `/api/table/planerRaporty/${dataToString(poczatek)}_${dataToString(
        koniec
      )}`
    );
    await this.addFetchToState(fetch);
    await this.props.fetchSentDays();
    await this.props.loading(false);
    this.props.loadingSent(false);
  };

  addFetchToState = fetch => {
    const podzielone = podzielUnikalnymi(fetch.data, "kiedy");
    this.setState({
      aktywnosci: []
    });
    this.setState({
      aktywnosci: podzielone.sort(dynamicSort("kiedy")).reverse()
    });
  };

  handleClose = () => {
    this.setState({ openModal: false });
  };

  handleSelect = ranges => {
    this.setState({
      ...ranges
    });
    this.fetchRaporty(ranges);
  };

  render() {
    return (
      <div>
        <PlanerRaportyForm
          editedId={this.state.editedId}
          expanded={expanded => this.setState({ expanded })}
          fetchuj={() => this.fetchRaporty()}
          edytuj={kiedy => this.setState({ kiedy })}
          kiedy={this.state.kiedy}
        />
        <DateRangePickerMy
          range={[this.state.rangeselection]}
          onChange={this.handleSelect}
        />
        <Paper>
          <PlanerLista
            dodajDoDnia={kiedy => this.setState({ openModal: true, kiedy })}
            aktywnosci={this.state.aktywnosci}
            edit={id => {
              this.setState({ openModal: true });
              this.setState({ editedId: id });
            }}
            fetchuj={() => this.fetchRaporty()}
            expanded={this.state.expanded}
            wyslanoDoPlanu={expanded => this.setState({ expanded })}
            component="planerRaporty"
          />
        </Paper>
        <ModalWindow
          open={this.state.openModal}
          close={this.handleClose}
          maxWidth={900}
        >
          <PlanerRaportyForm
            modal
            editedId={this.state.editedId}
            closeModal={() => this.setState({ openModal: false })}
            fetchuj={() => this.fetchRaporty()}
            expanded={expanded => this.setState({ expanded })}
            edytuj={kiedy => this.setState({ kiedy })}
            kiedy={this.state.kiedy}
          />
        </ModalWindow>
      </div>
    );
  }
}

PlanerRaporty.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    actions
  ),
  MainFrameHOC
)(PlanerRaporty);
