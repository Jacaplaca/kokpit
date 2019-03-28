import React from "react";
// import FormButtons from "../../common/FormButtons";
import _ from "lodash";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import ButtonMy from "../../common/ButtonMy";
import InputComponent from "../../common/inputs/InputComponent";
import InputSelectBaza from "../../common/inputs/InputSelectBaza";

class MachinesForm extends React.Component {
  state = {
    machines: [
      { type: "1", brand: "1", otherBrand: "1", howMany: 1 },
      { type: "2", brand: "2", otherBrand: "2", howMany: 2 },
      { type: "3", brand: "3", otherBrand: "3", howMany: 3 },
      { type: "4", brand: "4", otherBrand: "4", howMany: 4 },
      { type: "5", brand: "5", otherBrand: "5", howMany: 5 }
    ],

    addAllowed: false
    // tractorType: "",
    // tractorBran
  };

  handleChange = (field, value, i) => {
    const { machines: machinesState } = this.state;
    const machines = _.clone(machinesState);
    // const editedMachine = machines[i]
    machines[i][field] = value;

    this.setState({ machines }, () => this.validate());
  };

  addMachine = () => {
    console.log("add machine");
    const { machines: machinesState } = this.state;
    const machines = _.clone(machinesState);
    const newMachine = { type: "", brand: "", otherBrand: "", howMany: 1 };
    machines.push(newMachine);
    this.setState({ machines, addAllowed: false });
  };
  removeMachine = i => {
    console.log("remove machine", i);
    const { machines: machinesState } = this.state;
    let machines = _.clone(machinesState);
    console.log("machines", machines);
    machines.splice(i, 1);
    console.log("machines", machines);

    // var index = machines.indexOf(i);
    // const newMachine = { type: "", brand: "", otherBrand: "", howMany: 1 };
    // machines.push(newMachine);
    this.setState({ machines }, () => this.validate());
  };

  // clearForm = () => {
  //
  // }

  validate = i => {
    const { machines } = this.state;
    let validates = [];
    // let index
    for (let machine of machines) {
      // index ++
      if (
        machine.type !== "" &&
        (machine.brand !== "" || machine.otherBrand !== "") &&
        (machine.howMany && machine.howMany > 0)
      ) {
        validates.push(true);
      } else {
        validates.push(false);
      }
    }

    this.setState({ addAllowed: !validates.includes(false) });

    // if (
    //   machines[i].type !== "" &&
    //   (machines[i].brand !== "" || machines[i].otherBrand !== "") &&
    //   (machines[i].howMany && machines[i].howMany > 0)
    // ) {
    //   this.setState({ addAllowed: true });
    // } else {
    //   this.setState({ addAllowed: false });
    // }
  };

  isOtherBrandDisabled = i => {
    return this.state.machines[i].brand !== "";
  };
  isBrandDisabled = i => {
    return this.state.machines[i].otherBrand !== "";
  };

  render() {
    const { brands, addLabel, removeLabel } = this.props;
    const {
      machines,
      type,
      brand,
      howMany,
      otherBrand,
      addAllowed
    } = this.state;

    return machines.map((machine, i) => {
      return (
        <div
          key={i}
          style={{
            display: "grid",
            gridGap: "1rem",
            gridTemplateColumns: `1fr 1fr 1fr 1fr 1fr`
            // padding: "1.3rem"
          }}
        >
          <InputSelectBaza
            daty={datyDoRaportu => this.setState({ datyDoRaportu })}
            wybrano={e => {
              e && this.handleChange("brand", e.name, i);
            }}
            edytuj={value => this.handleChange("brand", value, i)}
            czysc={() => this.handleChange("brand", "", i)}
            value={machines[i].brand}
            label="Marka"
            placeholder="Marka"
            przeszukuje={brands}
            disabled={this.isBrandDisabled(i)}
          />
          <InputComponent
            disabled={this.isOtherBrandDisabled(i)}
            // key={i}
            name="channel"
            label="Inna marka"
            type="text"
            edytuj={value => this.handleChange("otherBrand", value, i)}
            // edytuj={value => change("name", value, "adding")}
            value={machines[i].otherBrand || ""}
            // disabled={field2disabled}
          />
          <InputComponent
            // key={i}
            name="channel"
            label="Typ"
            type="text"
            edytuj={value => this.handleChange("type", value, i)}
            // edytuj={value => change("name", value, "adding")}
            value={machines[i].type || ""}
            // disabled={field2disabled}
          />
          <InputComponent
            // key={i}
            name="channel"
            label="Ilość"
            type="text"
            edytuj={value => this.handleChange("howMany", value, i)}
            // edytuj={value => change("name", value, "adding")}
            value={machines[i].howMany || ""}
            // disabled={field2disabled}
          />
          <AddButton
            removeLabel={removeLabel}
            addLabel={addLabel}
            add={this.addMachine}
            remove={this.removeMachine}
            i={i}
            addAllowed={addAllowed}
            allElements={machines}
          />
        </div>
      );
    });
  }
}

const AddButton = ({
  addLabel,
  add,
  remove,
  i,
  addAllowed,
  allElements,
  removeLabel
}) => {
  if (
    (allElements.length === 1 && i === 0 && addAllowed) ||
    (allElements.length > 1 && i === allElements.length - 1 && addAllowed)
  ) {
    return (
      <ButtonMy
        color="primary"
        aria-label="Add"
        onClick={add}
        // className={classes.fab}
      >
        {addLabel}
        <AddIcon />
      </ButtonMy>
    );
  } else if (
    (allElements.length > 1 && i < allElements.length - 1) ||
    (allElements.length > 1 && i === allElements.length - 1 && !addAllowed)
  ) {
    return (
      <ButtonMy
        color="primary"
        aria-label="Add"
        onClick={() => remove(i)}
        // className={classes.fab}
      >
        {removeLabel}
        <RemoveIcon />
      </ButtonMy>
    );
  } else {
    return <span />;
  }
};

export default MachinesForm;
