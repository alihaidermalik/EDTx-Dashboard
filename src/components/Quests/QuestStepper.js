import React from 'react';
import {
    Step,
    Stepper,
    StepButton,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
const getStyles = () => {
    return {
        root: {
            width: '100%',
            maxWidth: 1000,
            margin: 'auto',
        },
        content: {
            margin: '0 16px',
        },
        actions: {
            marginTop: 12,
        },
        backButton: {
            marginRight: 12
        },
    };
};
class QuestStepper extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false,
      finished: false,
      stepIndex: 0,
      visited: [],
  };
  }
  componentWillMount() {
    const {stepIndex, visited} = this.state;
    this.setState({visited: visited.concat(stepIndex)});
  }
  componentWillUpdate(nextProps, nextState) {
    const {stepIndex, visited} = nextState;
    if (visited.indexOf(stepIndex) === -1) {
      this.setState({visited: visited.concat(stepIndex)});
    }
  }
  dummyAsync = (cb) => {
    this.setState({loading: true}, () => {
      this.asyncTimer = setTimeout(cb, 500);
    });
  };
    handleNext = () => {
        const {stepIndex} = this.state;
        if (stepIndex < 4) {
        if (!this.state.loading) {
            this.dummyAsync(() => this.setState({
              loading: false,
              stepIndex: stepIndex + 1,
              finished: stepIndex >= 3,
            }));
          }
        }
    };
    handlePrev = () => {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            // this.setState({stepIndex: stepIndex - 1});
            if (!this.state.loading) {
              this.dummyAsync(() => this.setState({
                loading: false,
                stepIndex: stepIndex - 1,
              }));
            }
        }
    };
  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return this.props.form1;
      case 1:
        return this.props.form2;
      case 2:
        return this.props.form3;
      case 3:
        return this.props.form4;
      case 4:
        return this.props.form5;
      default:
        return 'Click a step to get started.';
    }
  }
  renderContent() {
    const {stepIndex} = this.state;
        const styles = getStyles();
        return(
    <div key={"quest-stepper-container"} style={styles.content}>
          <div key={"quest-stepper-sub-container"}>{this.getStepContent(stepIndex)}</div>
          {stepIndex !== null && (
            <div style={styles.actions}>
            <br />
              <div className="step-navigation">
                <RaisedButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onClick={this.handlePrev}
                  style={styles.backButton}
                />
                <RaisedButton
                  label="Next"
                  disabled={stepIndex === 4}
                  primary={true}
                  onClick={this.handleNext}
                />
              </div>
              <div className="step-actions">
                <FlatButton
                    label="Reset"
                    disabled={this.props.resetDisabled}
                    onClick={(event) => {
                      event.preventDefault();
                      this.props.reset();
                      this.setState({stepIndex: 0, visited: []});
                    }}
                    style={{ marginRight: 16}}
                />
                <RaisedButton
                  label={this.props.type === "Edit" ? "Update" : "Submit"}
                  primary={true}
                  disabled={this.props.submitDisabled}
                  onClick={this.props.submit}
                />
                {this.props.status === "request" ?
                //  <div style={{display: "flex"}}>
                <CircularProgress style={{marginLeft: "5px"}}size={60} thickness={7}/>
                //  </div>
                : null }
              </div>
            </div>
          )}
        </div>
        )
  }
    render() {
        const {loading, stepIndex} = this.state;
        const styles = getStyles();
    return (
      //TODO: send this as props instead
        <div style={styles.root}>
        <Stepper linear={false} activeStep={stepIndex}>
          <Step >
            <StepButton onClick={() => this.setState({stepIndex: 0})}>
              Select Activity settings
            </StepButton>
          </Step>
          <Step >
            <StepButton onClick={() => this.setState({stepIndex: 1})}>
              Select Tasks
            </StepButton>
          </Step>
          <Step >
            <StepButton onClick={() => this.setState({stepIndex: 2})}>
              Select Students
            </StepButton>
          </Step>
          <Step >
            <StepButton onClick={() => this.setState({stepIndex: 3})}>
              Select Training Center
            </StepButton>
          </Step>
          <Step >
            <StepButton onClick={() => this.setState({stepIndex: 4})}>
              Notifications
            </StepButton>
          </Step>
        </Stepper>
        <ExpandTransition loading={loading} open={true}>
        {this.renderContent()}
        </ExpandTransition>
      </div>
    );
  }
}
export default QuestStepper;