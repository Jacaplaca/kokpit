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
import PlanerAktywnosciForm from "./PlanerAktywnosciForm";
import PlanerLista from "./PlanerLista";
import ModalWindow from "./ModalWindow";

import DateRangePickerMy from "../common/DateRangePickerMy";

const styles = theme => ({
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  }
});

class Planer extends Component {
  state = {
    // numberformat: '',
    aktywnosci: [],
    id: "",
    nr_dokumentu: "",
    data_wystawienia: "",
    nazwa_pozycji: "",
    kwota_netto: "",

    start: "",
    categoryId: "",
    groupId: "",
    groups: [],
    categories: [],
    costs: [],
    editedId: "",
    city: "",
    rangeselection: {
      startDate: defineds.startOfMonth,
      endDate: defineds.endOfMonth,
      key: "rangeselection"
    },
    edited: false,
    submitIsDisable: true,
    openModal: false,
    expanded: "",

    kiedy: ""
  };

  componentWillMount() {
    this.fetchAktywnosci();
  }

  fetchAktywnosci = async range => {
    this.props.loading(true);
    const { startDate, endDate } = this.state.rangeselection;
    const poczatek = range ? range.rangeselection.startDate : startDate;
    const koniec = range ? range.rangeselection.endDate : endDate;
    const fetch = await axios.get(
      `/api/table/planerAktywnosci/${dataToString(poczatek)}_${dataToString(
        koniec
      )}`
    );
    await this.addFetchToState(fetch);
    await this.props.loading(false);
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
    this.fetchAktywnosci(ranges);
  };

  render() {
    //const { classes } = this.props;

    return (
      <div>
        <PlanerAktywnosciForm
          editedId={this.state.editedId}
          expanded={expanded => this.setState({ expanded })}
          fetchuj={() => this.fetchAktywnosci()}
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
            wyslijDoPlanuButton
            aktywnosci={this.state.aktywnosci}
            edit={id => {
              this.setState({ openModal: true });
              this.setState({ editedId: id });
            }}
            delete={id => console.log(id)}
            fetchuj={() => this.fetchAktywnosci()}
            expanded={this.state.expanded}
            wyslanoDoPlanu={expanded => this.setState({ expanded })}
            component="akt"
            // edit={id => console.log(id)}
          />
        </Paper>
        <ModalWindow
          open={this.state.openModal}
          close={this.handleClose}
          maxWidth={900}
        >
          <PlanerAktywnosciForm
            modal
            editedId={this.state.editedId}
            closeModal={() => this.setState({ openModal: false })}
            fetchuj={() => this.fetchAktywnosci()}
            expanded={expanded => this.setState({ expanded })}
            edytuj={kiedy => this.setState({ kiedy })}
            kiedy={this.state.kiedy}
          />
        </ModalWindow>
      </div>
    );
  }
}

Planer.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

// export default connect(mapStateToProps)(Header);

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    actions
  ),
  MainFrameHOC
)(Planer);
