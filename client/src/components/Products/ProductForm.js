import React from "react";
import FormButtons from "../../common/FormButtons";

import SelectItem from "../../common/inputs/SelectItem";
import { DatePicker } from "material-ui-pickers";
import InputComponent from "../../common/inputs/InputComponent";
import { YMtoDate, dateToYM } from "../../common/functions";

const ProductForm = ({
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
}) => {
  // console.log("AddToDB", adding, validate);
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
        // disabled={disabled}
        // key={i}
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
        name="channel"
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
          "Dodaj produkt"
          //   modal && edit
          //     ? "Potwierdź edycję"
          //     : bonus > 0
          //     ? `Dodaj premię ${formatNumber(bonus)} zł`
          //     : "Potwierdź"
        }
        subAction={e => submit(e)}
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
};

export default ProductForm;
