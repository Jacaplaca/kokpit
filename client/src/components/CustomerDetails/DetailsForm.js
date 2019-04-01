import React from "react";
// import FormButtons from "../../common/FormButtons";
// import _ from "lodash";
import Button from "@material-ui/core/Button";

import InputComponent from "../../common/inputs/InputComponent";
import InputSelectBaza from "../../common/inputs/InputSelectBaza";
import Machines from "./Machines";

const tractorBrands = [
  // { id: 0, name: "Inna" },
  { id: 1, name: "Case" },
  { id: 2, name: "Deutz-Fahr" },
  { id: 3, name: "New Holland" },
  { id: 4, name: "Fendt" },
  { id: 5, name: "Massey Ferguson" },
  { id: 6, name: "Fiat" },
  { id: 7, name: "Lamborghini" },
  { id: 8, name: "Landini" },
  { id: 9, name: "Renault" },
  { id: 10, name: "SAME" },
  { id: 11, name: "Zetor" },
  { id: 12, name: "John Deere" },
  { id: 13, name: "Kubota" },
  { id: 14, name: "McCormick" },
  { id: 15, name: "Ursus" },
  { id: 16, name: "Valtra" }
];

const DetailsForm = ({
  changeMachines,
  data: { tractor, harvester, agro, cultivator },
  addMachine,
  removeMachine,
  field,
  meadow,
  changeSimple,
  filledMachines
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridGap: "1rem"
        // gridTemplateColumns: `1fr 1fr 1fr`,
        // padding: "1.3rem"
      }}
    >
      <div
        style={{
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: `150px 150px`
          // padding: "1.3rem"
        }}
      >
        <InputComponent
          // disabled={disabled}
          // key={i}
          name="channel"
          label="Ile hektarów pola"
          type="text"
          edytuj={v => changeSimple("field", v)}
          // edytuj={value => change("name", value, "adding")}
          value={field || ""}
          format="number"
          suffix={"ha"}
          // disabled={field2disabled}
        />
        <InputComponent
          // disabled={disabled}
          // key={i}
          name="channel"
          label="Ile hektarów łąk"
          type="text"
          edytuj={v => changeSimple("meadow", v)}
          // edytuj={value => change("name", value, "adding")}
          value={meadow || ""}
          format="number"
          suffix={"ha"}
          // disabled={field2disabled}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridGap: "1rem",
          gridTemplateColumns: `1fr auto`
          // gridTemplateColumns: `1fr minmax(300px, 1fr)`
          // padding: "1.3rem"
        }}
      >
        <Machines
          showBrand
          showType
          label={"Traktory"}
          brands={tractorBrands}
          addLabel={"Dodaj traktor"}
          removeLabel={"Usuń traktor"}
          group="tractor"
          change={changeMachines}
          values={tractor}
          addMachine={addMachine}
          removeMachine={removeMachine}
          filledMachines={filledMachines}
        />
        <Machines
          showType
          label={"Maszyny uprawowe"}
          brands={tractorBrands}
          addLabel={"Dodaj maszynę uprawową"}
          removeLabel={"Usuń maszynę uprawową"}
          group="cultivator"
          change={changeMachines}
          values={cultivator}
          addMachine={addMachine}
          removeMachine={removeMachine}
          filledMachines={filledMachines}
        />
        <Machines
          showBrand
          showType
          label={"Kombajny"}
          brands={tractorBrands}
          addLabel={"Dodaj kombajn"}
          removeLabel={"Usuń kombajn"}
          group="harvester"
          change={changeMachines}
          values={harvester}
          addMachine={addMachine}
          removeMachine={removeMachine}
          filledMachines={filledMachines}
        />
        <Machines
          label={"Inne maszyny rolnicze"}
          brands={tractorBrands}
          addLabel={"Dodaj inną maszynę rolniczą"}
          removeLabel={"Usuń inną maszynę rolniczą"}
          group="agro"
          change={changeMachines}
          values={agro}
          addMachine={addMachine}
          removeMachine={removeMachine}
          filledMachines={filledMachines}
        />
      </div>
    </div>
  );
};

export default DetailsForm;
