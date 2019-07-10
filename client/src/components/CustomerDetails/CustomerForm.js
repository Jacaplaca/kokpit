import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import _ from "lodash";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import StepLabel from "@material-ui/core/StepLabel";
import StepIcon from "@material-ui/core/StepIcon";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AddressForm from "./AddressForm";
import DetailsForm from "./DetailsForm";
import Summary from "./Summary";

const styles = theme => ({
  root: {
    width: "100%",
    padding: 20
  },
  button: {
    marginRight: theme.spacing.unit
  },
  backButton: {
    marginRight: theme.spacing.unit
  },
  completed: {
    display: "inline-block"
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});

function getSteps() {
  return ["Dane konktakowe klienta", "Dane szczegółowe", "Podsumowanie"];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return "1: Dane kontaktowe klienta";
    case 1:
      return "2: Dane szczegółowe";
    case 2:
      return "3: Podsumowanie";
    default:
      return "Unknown step";
  }
}

class CustomerForm extends React.Component {
  state = {
    id: 0,
    activeStep: 0,
    completed: new Set(),
    skipped: new Set(),
    name: "",
    surname: "",
    address: "",
    phone: "",
    tractorBrand: "",
    field: "",
    meadow: "",
    // machines: {}
    tractor: this.props.scheme,
    harvester: this.props.scheme,
    cultivator: this.props.scheme,
    agro: this.props.scheme,
    milk: this.props.scheme,
    tractorFilled: null,
    harvesterFilled: null,
    cultivatorFilled: null,
    agroFilled: null,
    milkFilled: null,
    customer: { id: 0, name: "", kod: "", miejscowosc: "" },
    cows: "",
    pigs: ""
  };

  componentWillReceiveProps(nextProps) {
    const { edited } = nextProps;
    console.log(edited && this.props.edited !== edited);
    if (edited && this.props.edited !== edited) {
      const brands = [];
      console.log("nxp", edited);
      this.handleComplete();
      // this.allStepsCompleted();
      // let tractor, harvester, cultivator, agro;
      const {
        id,
        // name,
        // surname,
        // address,
        phone,
        field,
        cows,
        pigs,
        meadow,
        Tractors,
        Harvesters,
        Cultivators,
        Agros,
        Milks,
        Customer: { id: idCust, name, adr_Kod, adr_Miejscowosc }
      } = edited[0];

      const tractor = this.props.modifyMachine(Tractors);

      const harvester = this.props.modifyMachine(Harvesters);
      const milk = this.props.modifyMachine(Milks);

      const agro = this.props.modifyAgro(Agros);
      const cultivator = this.props.modifyCultivator(Cultivators);

      this.setState({
        id,
        // name,
        // surname,
        // address,
        phone,
        field: field.replace(".", ","),
        meadow: meadow.replace(".", ","),
        cows: cows ? `${cows}` : "0",
        pigs: pigs ? `${pigs}` : "0",
        tractor,
        harvester,
        cultivator,
        agro,
        milk,
        customer: {
          id: idCust,
          name,
          kod: adr_Kod,
          miejscowosc: adr_Miejscowosc
        }
      });
    }
  }

  totalSteps = () => getSteps().length;

  isStepOptional = step => step === 1;

  handleSkip = () => {
    const { activeStep } = this.state;
    if (!this.isStepOptional(activeStep)) {
      // You probably want to guard against something like this
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    this.setState(state => {
      const skipped = new Set(state.skipped.values());
      skipped.add(activeStep);
      return {
        activeStep: state.activeStep + 1,
        skipped
      };
    });
  };

  handleNext = () => {
    let activeStep;

    if (this.isLastStep() && !this.allStepsCompleted()) {
      // It's the last step, but not all steps have been completed
      // find the first step that has been completed
      const steps = getSteps();
      activeStep = steps.findIndex((step, i) => !this.state.completed.has(i));
    } else {
      activeStep = this.state.activeStep + 1;
    }
    this.setState(
      {
        activeStep
      },
      () => this.handleComplete()
    );
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleStep = step => () => {
    if (!this.checkIfPrevComplete(step)) {
      this.setState({
        activeStep: step
      });
    }
  };

  handleSubmit = async () => {
    console.log("handleSubmit()");

    const {
      id,
      name,
      surname,
      address,
      phone,
      field,
      meadow,
      cows,
      pigs,
      // tractorFilled,
      // harvesterFilled,
      // cultivatorFilled,
      // agroFilled,
      tractor,
      harvester,
      cultivator,
      agro,
      milk,
      customer
    } = this.state;
    const url = `/api/customerdetail/`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        id,
        name,
        surname,
        address,
        phone,
        field,
        meadow,
        tractor,
        harvester,
        cultivator,
        agro,
        milk,
        cows,
        pigs,
        customerId: customer.id
        // tractor: tractorFilled,
        // harvester: harvesterFilled,
        // cultivator: cultivatorFilled,
        // agro: agroFilled
      })
    });
    this.handleReset();
    this.props.fetching();
    // await this.props.fetchuj();
    // await this.clearForm();
    // await this.props.submit(false);
  };

  checkIfPrevComplete = step => {
    const isPrevComplete = this.isStepComplete(step - 1);
    const thisComplete = this.isStepComplete(step);
    if (isPrevComplete || thisComplete) {
      return false;
    }
    return true;
  };

  handleComplete = () => {
    // console.log("im in handle complete");
    // eslint-disable-next-line react/no-access-state-in-setstate
    const completed = new Set(this.state.completed);
    completed.add(this.state.activeStep);
    this.setState({
      completed
    });

    /**
     * Sigh... it would be much nicer to replace the following if conditional with
     * `if (!this.allStepsComplete())` however state is not set when we do this,
     * thus we have to resort to not being very DRY.
     */
    // if (completed.size !== this.totalSteps() - this.skippedSteps()) {
    //   this.handleNext();
    // }
  };

  handleReset = () => {
    this.props.cleanEdit();
    this.setState({
      activeStep: 0,
      completed: new Set(),
      skipped: new Set(),
      id: 0,
      name: "",
      surname: "",
      address: "",
      phone: "",
      tractorBrand: "",
      field: "",
      meadow: "",
      cows: "",
      pigs: "",
      tractor: this.props.scheme,
      harvester: this.props.scheme,
      cultivator: this.props.scheme,
      agro: this.props.scheme,
      milk: this.props.scheme,
      tractorFilled: null,
      harvesterFilled: null,
      cultivatorFilled: null,
      agroFilled: null,
      milkFilled: null,
      customer: { id: 0, name: "", kod: "", miejscowosc: "" }
    });
  };

  clearCustomer = () => {
    this.setState({ customer: { id: 0, name: "", kod: "", miejscowosc: "" } });
  };

  skippedSteps() {
    return this.state.skipped.size;
  }

  isStepSkipped(step) {
    return this.state.skipped.has(step);
  }

  isStepComplete(step) {
    return this.state.completed.has(step);
  }

  completedSteps() {
    return this.state.completed.size;
  }

  allStepsCompleted() {
    return this.completedSteps() === this.totalSteps() - this.skippedSteps();
  }

  isLastStep() {
    return this.state.activeStep === this.totalSteps() - 1;
  }

  handleChange = (field, value) => {
    console.log("handleChange()", field, value);
    this.setState({ [field]: value }, () => {
      this.checkIfCompleted();
    });
  };

  handleChangeMachines = (machine, field, value, i) => {
    // const { tractor, harvester, cultivator, agro } = this.state;
    // console.log("this.state", this.state);
    const stateString = JSON.stringify(this.state);
    const stateParse = JSON.parse(stateString);
    // const stateClone = _.clone(this.state);
    const machineState = stateParse[machine];
    const tools = machineState;
    // console.log("machines clone from state", tools[0]);
    // console.log("mfvi", machine, field, value, i);
    // const editedMachine = machines[i]
    tools[i][field] = value;
    // console.log("machines after change", tools[0]);
    // console.log("machines after change state", this.state[machine][0]);
    // console.log("handleChangeMachines()", machine, field, value, i, machines);

    this.setState({ [machine]: tools });
  };

  addMachine = machine => {
    console.log("add machine");
    // const { machines: machinesState } = this.state;
    const machines = _.clone(this.state[machine]);
    const newMachine = this.props.scheme[0];
    machines.push(newMachine);
    // console.log("machines", machines);
    this.setState({ [machine]: machines, addAllowed: false });
  };

  // filledMachines = (group, machines) => {
  //   console.log("filledMachines", group, machines);
  //   const machinesClean = _.clone(machines).map(x =>
  //     Object.assign(x, {
  //       otherBrand: x.otherBrand === "" ? x.brand : x.otherBrand
  //     })
  //   );
  //   this.setState({ [group]: machinesClean });
  // };

  removeMachine = (machine, i) => {
    // console.log("remove machine", i);
    // const { machines: machinesState } = this.state;
    let machines = _.clone(this.state[machine]);
    // console.log("machines", machines);
    machines.splice(i, 1);
    // console.log("machines", machines);

    // var index = machines.indexOf(i);
    // const newMachine = { type: "", brand: "", otherBrand: "", howMany: 1 };
    // machines.push(newMachine);
    this.setState({ [machine]: machines });
  };

  checkIfCompleted = () => {
    const { activeStep } = this.state;
    if (activeStep === 0) {
      this.validateAddressForm();
    }
  };

  validateAddressForm = () => {
    // console.log("validate AddressForm");
    const {
      activeStep,
      phone,
      customer: { id, name }
    } = this.state;
    if (id > 0 && name !== "" && phone !== "") {
      // console.log("full");
      // this.setState({acti})
      this.handleComplete();
    } else {
      // console.log("not full");
      const completed = new Set(this.state.completed);
      completed.delete(activeStep);
      // completed.add("asdfsadfsadf");
      this.setState({
        completed
      });
    }
  };

  render() {
    const {
      classes,
      edited,
      filledCustomers,
      tractorBrands,
      milkMaidBrands,
      milkMaidTypes
    } = this.props;
    const steps = getSteps();
    const {
      activeStep,
      name,
      surname,
      address,
      phone,
      tractorBrand,
      tractor,
      harvester,
      cultivator,
      agro,
      field,
      meadow,
      milk,
      // tractorFilled,
      // harvesterFilled,
      // agroFilled,
      // cultivatorFilled,
      // milkFilled,
      customer,
      cows,
      pigs
    } = this.state;

    return (
      <div className={classes.root}>
        <Stepper alternativeLabel nonLinear activeStep={activeStep}>
          {steps.map((label, index) => {
            const props = {};
            const buttonProps = {};
            const labelProps = {};
            // if (this.isStepOptional(index)) {
            //   buttonProps.optional = (
            //     <Typography variant="caption">Optional</Typography>
            //   );
            // }
            if (this.isStepSkipped(index)) {
              props.completed = false;
            }
            // labelProps.disabled = true;

            props.disabled = this.checkIfPrevComplete(index);
            return (
              <Step key={label} {...props}>
                <StepButton
                  onClick={this.handleStep(index)}
                  completed={this.isStepComplete(index)}
                  {...buttonProps}
                >
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === 0 && (
          <AddressForm
            change={this.handleChange}
            // name={name}
            // surname={surname}
            // address={address}
            phone={phone}
            customer={customer}
            clearCustomer={this.clearCustomer}
            filledCustomers={filledCustomers}
          />
        )}
        {activeStep === 1 && (
          <DetailsForm
            brands={tractorBrands}
            milkMaidBrands={milkMaidBrands}
            milkMaidTypes={milkMaidTypes}
            change={this.handleChange}
            name={customer.name}
            surname={surname}
            address={`${customer.kod} ${customer.miejscowosc}`}
            phone={phone}
            tractorBrand={tractorBrand}
            changeMachines={this.handleChangeMachines}
            data={{ tractor, harvester, agro, cultivator, milk }}
            addMachine={this.addMachine}
            removeMachine={this.removeMachine}
            field={field}
            meadow={meadow}
            cows={cows}
            pigs={pigs}
            changeSimple={this.handleChange}
            filledMachines={this.filledMachines}
          />
        )}
        {activeStep === 2 && (
          <Summary
            data={{
              name: customer.name,
              surname,
              address: `${customer.kod} ${customer.miejscowosc}`,
              phone,
              tractorBrand,
              field,
              meadow,
              cows,
              pigs,
              tractor,
              harvester,
              cultivator,
              agro,
              milk
            }}
          />
        )}
        <div style={{ marginTop: 10 }}>
          {this.allStepsCompleted() ? (
            <div>
              {/* <Typography className={classes.instructions}>
                  All steps completed - you&apos;re finished
                </Typography> */}

              <Button
                disabled={activeStep === 0}
                onClick={this.handleBack}
                className={classes.button}
              >
                Wróć
              </Button>
              {activeStep !== 2 && (
                <Button
                  disabled={
                    !this.isStepComplete(activeStep) || activeStep === 2
                  }
                  variant="contained"
                  color="primary"
                  onClick={this.handleNext}
                  className={classes.button}
                >
                  {activeStep === 1 && "Dalej"}
                  {activeStep === 0 && "Dalej"}
                  {activeStep === 2 && "Następny krok"}
                </Button>
              )}
              {activeStep === 2 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleSubmit}
                  className={classes.button}
                >
                  {edited ? "Zapisz dane klienta" : "Dodaj dane klienta"}
                </Button>
              )}
            </div>
          ) : (
            <div>
              <Typography className={classes.instructions}>
                {/* {getStepContent(activeStep)} */}
              </Typography>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                  className={classes.button}
                >
                  Wróć
                </Button>
                <Button
                  disabled={!this.isStepComplete(activeStep)}
                  variant="contained"
                  color="primary"
                  onClick={this.handleNext}
                  className={classes.button}
                >
                  {activeStep === 1 && "Dalej"}
                  {activeStep === 0 && "Dalej"}
                  {activeStep === 2 && "Następny krok"}
                </Button>
                <Button onClick={this.handleReset}>Resetuj formularz</Button>
                {/* {this.isStepOptional(activeStep) &&
                  !this.state.completed.has(this.state.activeStep) && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleSkip}
                      className={classes.button}
                    >
                      Skip
                    </Button>
                  )} */}

                {/* {activeStep !== steps.length &&
                    (this.state.completed.has(this.state.activeStep) ? (
                      <Typography
                        variant="caption"
                        className={classes.completed}
                      >
                        Step {activeStep + 1} already completed
                      </Typography>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleComplete}
                      >
                        {this.completedSteps() === this.totalSteps() - 1
                          ? "Finish"
                          : "Complete Step"}
                      </Button>
                    ))} */}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

CustomerForm.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(CustomerForm);
