import React, { Component } from "react";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import InputComponent from "../../common/inputs/InputComponent";
import InputData from "../../common/inputs/InputData";
import FormButtons from "../../common/FormButtons";
import KlienciSearch from "../KlienciSearch";
import { getString } from "../../translate";

class DocumentTransactionForm extends Component {
  state = {
    customer: { id: 0, name: "", kod: "", miejscowosc: "" },
    doc: "",
    date: "",
    ammount: "",
    disableSubmit: true
  };

  componentWillReceiveProps(nextProps) {
    const { edited } = nextProps;
    const { auth } = this.props;
    if (edited.id !== this.props.edited.id && edited.id !== 0) {
      const { id, ammount_netto, date, documents_nr, customerId } = edited;
      this.setState({
        customer: { id: customerId, name: "", kod: "", miejscowosc: "" },
        doc: documents_nr,
        date: date,
        ammount:
          auth.Company.language === "pl"
            ? ammount_netto.replace(".", ",")
            : ammount_netto
      });
    }
  }

  handleChange = async (field, value) => {
    console.log("handleChange()", field, value);
    await this.setAsyncState({ [field]: value });
    this.validate();
  };

  validate = () => {
    const { customer, doc, date, ammount } = this.state;
    if (customer.id !== 0 && doc !== "" && date !== "" && ammount !== "") {
      this.setState({ disableSubmit: false });
    } else this.setState({ disableSubmit: true });
  };

  clearCustomer = async () => {
    await this.setAsyncState({
      customer: { id: 0, name: "", kod: "", miejscowosc: "" }
    });
  };

  clearForm = async () => {
    await this.clearCustomer();
    await this.setAsyncState({
      date: "",
      doc: "",
      ammount: ""
    });
    this.props.clear();
  };

  handleSubmit = async () => {
    const { customer, doc, date, ammount } = this.state;
    const { edited } = this.props;

    let url = `/api/documentstransactions/`;
    if (edited.id !== 0) {
      url = `/api/documentstransactions/${edited.id}`;
    }

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        doc,
        date,
        ammount,
        customer: customer.id
        // tractor: tractorFilled,
        // harvester: harvesterFilled,
        // cultivator: cultivatorFilled,
        // agro: agroFilled
      })
    });
    // this.handleReset();
    await this.clearForm();
    await this.props.fetching();
    const data = await resp.json();
    await this.props.changeRange(data);
    // await this.props.fetchuj();
    // await this.clearForm();
    // await this.props.submit(false);
  };

  setAsyncState = newState =>
    new Promise(resolve => this.setState(newState, () => resolve()));

  render() {
    const { modal, edited, language, auth } = this.props;
    const { customer, doc, date, ammount, disableSubmit } = this.state;
    return (
      <Paper style={{ padding: 20 }}>
        <div
          style={{
            display: "grid",
            gridGap: "1rem",
            gridTemplateColumns: `1fr 1fr 2fr 1fr`
            // padding: "1.3rem"
          }}
        >
          <InputData
            id="date"
            name="date"
            label={getString("DOC_TRANS_FORM_LABEL_DATE", language)}
            type="date"
            value={date}
            edytuj={value => {
              this.handleChange("date", value);
            }}
            error={""}
          />

          <InputComponent
            // disabled={disabled}
            // key={i}
            name="document"
            label={getString("DOC_TRANS_FORM_LABEL_NO", language)}
            type="text"
            edytuj={value => this.handleChange("doc", value)}
            // edytuj={value => change("name", value, "adding")}
            value={doc || ""}
            // disabled={field2disabled}
          />
          <KlienciSearch
            // flags={filledCustomers}
            //miejsceLabel={this.state.miejsceLabel.slice(0, 6)}
            miejsceLabel={""}
            klientLabel={""}
            clearLabel={this.clearCustomer}
            // miejsceLabel="lublin"
            edytuj={(id, name, kod, miejscowosc) =>
              this.handleChange("customer", {
                id,
                name,
                kod,
                miejscowosc
              })
            }
            // edytuj={this.editCustomer}
            value={customer.id}
            //cancelLabel={() => this.setState({ miejsceLabel: "" })}
            label={getString("DOC_TRANS_FORM_LABEL_CUSTOMER", language)}
            placeholder={getString(
              "DOC_TRANS_FORM_LABEL_CUSTOMER_INPUT",
              language
            )}
          />
          <InputComponent
            // disabled={bonusType !== "% marży"}
            format="number"
            suffix={auth.Company.currency}
            name="buy"
            error={""}
            label={getString("DOC_TRANS_FORM_LABEL_AMMOUNT", language)}
            type="text"
            edytuj={value => {
              this.handleChange("ammount", value);
            }}
            value={ammount}
          />
        </div>
        <FormButtons
          subDisable={disableSubmit}
          subLabel={
            edited.id !== 0
              ? getString("DOC_TRANS_FORM_BUTTON_CONFIRM_EDIT", language)
              : getString("DOC_TRANS_FORM_BUTTON_ADD_TRANS", language)
          }
          subAction={this.handleSubmit}
          // cancelLabel={"Anuluj"}
          cancelAction={this.clearForm}
        />
      </Paper>
    );
  }
}

function mapStateToProps({ language, auth }) {
  return { language, auth };
}

export default connect(
  mapStateToProps,
  null
)(DocumentTransactionForm);
