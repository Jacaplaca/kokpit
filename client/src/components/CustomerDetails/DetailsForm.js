import React from "react";
// import FormButtons from "../../common/FormButtons";
// import _ from "lodash";
import Button from "@material-ui/core/Button";

import InputComponent from "../../common/inputs/InputComponent";
import InputSelectBaza from "../../common/inputs/InputSelectBaza";
import Machines from "./Machines";

const DetailsForm = ({
  changeMachines,
  data: { tractor, harvester, agro, cultivator },
  addMachine,
  removeMachine,
  field,
  meadow,
  changeSimple,
  filledMachines,
  brands
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
          // gridGap: "1rem",
          // gridTemplateColumns: `150px 150px`,
          justifyContent: "center"
          // padding: "1.3rem"
        }}
      >
        <div
          style={{
            padding: 10,
            backgroundColor: "rgba(232, 232, 232, 0.4)",
            display: "grid",
            gridGap: "1rem",
            gridTemplateColumns: `150px 150px`
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
          brands={brands}
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
          brands={brands}
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
          brands={brands}
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
          brands={brands}
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
