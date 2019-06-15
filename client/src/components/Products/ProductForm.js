import React from "react";
import FormButtons from "../../common/FormButtons";
import { connect } from "react-redux";
import SelectItem from "../../common/inputs/SelectItem";
import { DatePicker } from "material-ui-pickers";
import InputComponent from "../../common/inputs/InputComponent";
import { YMtoDate, dateToYM } from "../../common/functions";
import { getString } from "../../translate";

// const child = React.createRef();

class ProductForm extends React.Component {
  state = { nameFocus: false };

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    this.nameField._focus();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = event => {
    const { disableSubmit, submit } = this.props;
    // console.log("event", event.keyCode);
    switch (event.keyCode) {
      case 13:
        disableSubmit || submit(event);
        this.nameField._focus();
        break;
      default:
        break;
    }
  };

  render() {
    const {
      change,
      // value,
      handleAdd,
      action,
      addLabel,
      addFields,
      disableSubmit,
      // suffix,
      // adding,
      validate,
      values,
      submit,
      language
    } = this.props;

    return (
      <div
        style={{
          display: "grid",
          gridGap: "2rem",
          gridTemplateColumns: `2fr 1fr 400px`,
          padding: "1.3rem"
        }}
      >
        <InputComponent
          onRef={ref => (this.nameField = ref)}
          autoFocus
          name="channel"
          label={getString("ITEM", this.props.language)}
          type="text"
          edytuj={value => change("name", value, "adding")}
          value={values.name || ""}
        />
        <InputComponent
          name="unit"
          label={getString("UNIT", this.props.language)}
          type="text"
          edytuj={value => change("unit", value, "adding")}
          value={values.unit || ""}
        />

        <FormButtons
          subDisable={disableSubmit}
          subLabel={addLabel}
          subAction={e => {
            submit(e);
            this.nameField._focus();
          }}
          cancelLabel={getString("CANCEL", this.props.language)}
          cancelAction={() => {
            console.log("clear");
          }}
        />
      </div>
    );
  }
}

function mapStateToProps({ language }) {
  return { language };
}

export default connect(
  mapStateToProps,
  null
)(ProductForm);
