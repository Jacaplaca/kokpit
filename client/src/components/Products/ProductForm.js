import React from "react";
import FormButtons from "../../common/FormButtons";

import SelectItem from "../../common/inputs/SelectItem";
import { DatePicker } from "material-ui-pickers";
import InputComponent from "../../common/inputs/InputComponent";
import { YMtoDate, dateToYM } from "../../common/functions";

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
        submit(event);
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
      submit
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
          // ref={child}
          onRef={ref => (this.nameField = ref)}
          // disabled={disabled}
          // key={i}
          autoFocus
          name="channel"
          label="Nazwa produktu/usługi"
          type="text"
          edytuj={value => change("name", value, "adding")}
          value={values.name || ""}
          // disabled={field2disabled}
        />
        <InputComponent
          // disabled={disabled}
          // key={i}
          name="unit"
          label="Jednostka"
          type="text"
          edytuj={value => change("unit", value, "adding")}
          value={values.unit || ""}
          // disabled={field2disabled}
        />
        {/* <InputComponent
          disabled={disabled}
          name="channel"
          label={addLabel}
          type="text"
          edytuj={value =>
            change(
              addFields[0].dbField,
              `${value.charAt(0).toUpperCase()}${value.slice(1)}`,
              "adding"
            )
          }
          value={value[addFields[0].dbField] || ""}
          // disabled={field2disabled}
        /> */}
        {/* <AdditionalAddFields
          fields={addFields}
          change={change}
          value={value}
          disabled={disabled}
          suffix={suffix}
        /> */}
        <FormButtons
          subDisable={disableSubmit}
          subLabel={
            addLabel
            //   modal && edit
            //     ? "Potwierdź edycję"
            //     : bonus > 0
            //     ? `Dodaj premię ${formatNumber(bonus)} zł`
            //     : "Potwierdź"
          }
          subAction={e => {
            submit(e);
            this.nameField._focus();
          }}
          cancelLabel={"Anuluj"}
          cancelAction={() => {
            console.log("clear");
          }}
        />
        {/* <ButtonMy
          onClick={action}
          variant="contained"
          color="primary"
          disabled={!validateEdit(adding, validate)}
        >
          <Add />
        </ButtonMy> */}
      </div>
    );
  }
}

export default ProductForm;
