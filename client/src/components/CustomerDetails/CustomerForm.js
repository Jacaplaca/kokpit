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
    width: "100%"
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
    activeStep: 0,
    completed: new Set(),
    skipped: new Set(),
    name: "Antoni",
    surname: "Tracz",
    address: "Wólka Brzostowiecka Stara",
    phone: "855 555 555",
    tractorBrand: "",
    field: "",
    meadow: "",
    // machines: {}
    tractor: [{ type: "", brand: "", otherBrand: "", howMany: 1 }],
    harvester: [{ type: "", brand: "", otherBrand: "", howMany: 1 }],
    cultivator: [{ type: "", brand: "", otherBrand: "", howMany: 1 }],
    agro: [{ type: "", brand: "", otherBrand: "", howMany: 1 }]
  };

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
    this.setState({
      activeStep: 0,
      completed: new Set(),
      skipped: new Set()
    });
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
    this.setState({ [field]: value }, () => {
      this.checkIfCompleted();
    });
  };

  handleChangeMachines = (machine, field, value, i) => {
    // const { tractor, harvester, cultivator, agro } = this.state;
    const machines = _.clone(this.state[machine]);
    // console.log("mfvi", machine, field, value, i);
    // const editedMachine = machines[i]
    machines[i][field] = value;

    this.setState({ [machine]: machines });
  };

  addMachine = machine => {
    // console.log("add machine");
    // const { machines: machinesState } = this.state;
    const machines = _.clone(this.state[machine]);
    const newMachine = { type: "", brand: "", otherBrand: "", howMany: 1 };
    machines.push(newMachine);
    // console.log("machines", machines);
    this.setState({ [machine]: machines, addAllowed: false });
  };

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
    const { activeStep, name, surname, address, phone } = this.state;
    if (name !== "" && surname !== "" && address !== "" && phone !== "") {
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
    const { classes } = this.props;
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
      meadow
    } = this.state;

    return (
      <div className={classes.root}>
        <Paper style={{ padding: 20 }}>
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
              name={name}
              surname={surname}
              address={address}
              phone={phone}
            />
          )}
          {activeStep === 1 && (
            <DetailsForm
              change={this.handleChange}
              name={name}
              surname={surname}
              address={address}
              phone={phone}
              tractorBrand={tractorBrand}
              changeMachines={this.handleChangeMachines}
              data={{ tractor, harvester, agro, cultivator }}
              addMachine={this.addMachine}
              removeMachine={this.removeMachine}
              field={field}
              meadow={meadow}
              changeSimple={this.handleChange}
            />
          )}
          {activeStep === 0 && (
            <Summary
              data={{
                name,
                surname,
                address,
                phone,
                tractorBrand,
                field,
                meadow,
                tractor,
                harvester,
                cultivator,
                agro
              }}
            />
          )}
          <div>
            {this.allStepsCompleted() ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button onClick={this.handleReset}>Resetuj formularz</Button>
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
                    Następny krok
                  </Button>
                  {this.isStepOptional(activeStep) &&
                    !this.state.completed.has(this.state.activeStep) && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleSkip}
                        className={classes.button}
                      >
                        Skip
                      </Button>
                    )}
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
        </Paper>
      </div>
    );
  }
}

CustomerForm.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(CustomerForm);
