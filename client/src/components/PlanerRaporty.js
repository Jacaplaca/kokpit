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
  defineds,
  podzielUnikalnymiPlaner
} from "../common/functions";
import MainFrameHOC from "../common/MainFrameHOC";
import PlanerRaportyForm from "./PlanerRaportyForm";
import PlanerLista from "./PlanerLista";
import ModalWindow from "./ModalWindow";

import DateRangePickerMy from "../common/DateRangePickerMy";
import DurationWithButton from "../common/DurationWithButton";

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

    kiedy: "",
    formKey: 0,
    addToDay: false
  };

  componentWillMount() {
    this.fetchRaporty();
    const date = new Date();
    date.setDate(date.getDate() - 1);
    this.setState({ kiedy: dataToString(date) });
  }

  fetchRaporty = async range => {
    this.props.loading(true);
    const { startDate, endDate } = this.state.rangeselection;

    const poczatek = range ? range.rangeselection.startDate : startDate;
    const koniec = range ? range.rangeselection.endDate : endDate;
    const fetch = await axios.get(
      `/api/table/planerRaporty/${dataToString(poczatek)}_${dataToString(
        koniec
      )}`
    );
    await this.addFetchToState(fetch);
    await this.props.loading(false);
  };

  addFetchToState = fetch => {
    const {
      auth: { role }
    } = this.props;
    const podzielone =
      role === "master"
        ? podzielUnikalnymiPlaner(fetch.data)
        : podzielUnikalnymi(fetch.data, "kiedy", "user");
    this.setState({
      aktywnosci: []
    });
    this.setState({
      aktywnosci: podzielone.sort(dynamicSort("kiedy")).reverse()
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeKwota = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleClose = () => {
    this.setState({ openModal: false });
  };

  handleChangeSelect = name => value => {
    this.setState({
      [name]: value
    });
  };

  handleSelect = ranges => {
    this.setState({
      ...ranges
    });
    this.fetchRaporty(ranges);
  };

  addToDay = kiedy => {
    this.setState({
      openModal: true,
      kiedy,
      addToDay: true,
      formKey: this.state.formKey + 1
    });
  };

  render() {
    const {
      classes,
      auth: { role }
    } = this.props;

    const { addToDay } = this.state;

    return (
      <div>
        {role !== "master" && (
          <PlanerRaportyForm
            editedId={this.state.editedId}
            expanded={expanded => this.setState({ expanded })}
            fetchuj={() => this.fetchRaporty()}
            edytuj={kiedy => this.setState({ kiedy })}
            kiedy={this.state.kiedy}
          />
        )}
        <DurationWithButton
          range={this.state.rangeselection}
          onChange={this.handleSelect}
        />
        <Paper>
          <PlanerLista
            dodajDoDnia={kiedy => this.addToDay(kiedy)}
            aktywnosci={this.state.aktywnosci}
            edit={id => {
              this.setState({ openModal: true });
              this.setState({ editedId: id, addToDay: false });
            }}
            //delete={id => console.log(id)}
            fetchuj={() => this.fetchRaporty()}
            expanded={this.state.expanded}
            wyslanoDoPlanu={expanded => this.setState({ expanded })}
            component="planerRaporty"
            // edit={id => console.log(id)}
          />
        </Paper>
        <ModalWindow
          open={this.state.openModal}
          close={this.handleClose}
          maxWidth={900}
        >
          <PlanerRaportyForm
            // key={this.state.formKey}
            addToDay={addToDay}
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

// export default connect(mapStateToProps)(Header);

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    actions
  ),
  MainFrameHOC
)(PlanerRaporty);
