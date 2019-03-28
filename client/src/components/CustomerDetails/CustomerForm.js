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
  return ["Select campaign settings", "Create an ad group", "Create an ad"];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return "Step 1: Select campaign settings...";
    case 1:
      return "Step 2: What is an ad group anyways?";
    case 2:
      return "Step 3: This is the bit I really care about!";
    default:
      return "Unknown step";
  }
}

class CustomerForm extends React.Component {
  state = {
    activeStep: 0,
    completed: new Set(),
    skipped: new Set(),
    name: "",
    surname: "",
    address: "",
    phone: "",
    tractorBrand: ""
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
    this.setState({
      activeStep
    });
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

  checkIfCompleted = () => {
    const { activeStep } = this.state;
    if (activeStep === 0) {
      this.validateAddressForm();
    }
  };

  validateAddressForm = () => {
    console.log("validate AddressForm");
    const { activeStep, name, surname, address, phone } = this.state;
    if (name !== "" && surname !== "" && address !== "" && phone !== "") {
      console.log("full");
      // this.setState({acti})
      this.handleComplete();
    } else {
      console.log("not full");
      const completed = new Set(this.state.completed);
      completed.delete(activeStep);
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
      tractorBrand
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
          {activeStep === 0 && (
            <DetailsForm
              change={this.handleChange}
              name={name}
              surname={surname}
              address={address}
              phone={phone}
              tractorBrand={tractorBrand}
            />
          )}
          <div>
            {this.allStepsCompleted() ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button onClick={this.handleReset}>Reset</Button>
              </div>
            ) : (
              <div>
                <Typography className={classes.instructions}>
                  {getStepContent(activeStep)}
                </Typography>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={this.handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleNext}
                    className={classes.button}
                  >
                    Next
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
                  {activeStep !== steps.length &&
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
                    ))}
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
