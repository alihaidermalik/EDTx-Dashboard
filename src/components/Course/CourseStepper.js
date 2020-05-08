import React from 'react';
import {
    Step,
    Stepper,
    StepButton,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

const getStyles = () => {
    return {
        root: {
            width: '100%',
            maxWidth: 800,
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

class CourseStepper extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
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

    handleNext = () => {
        const {stepIndex} = this.state;
        if (stepIndex < 3) {
            this.setState({stepIndex: stepIndex + 1});
        }
    };

    handlePrev = () => {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    };

    getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return this.props.form1.content;
            case 1:
                return this.props.form2.content;
            case 2:
                return this.props.form3.content;
            case 3:
                return this.props.form4.content;
            default:
                return 'Click a step to get started.';
        }
    }

    render() {
        const {stepIndex} = this.state;
        const styles = getStyles();

        return (
            <div style={styles.root}>
                <Stepper linear={false} activeStep={stepIndex}>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: 0})}>
                            {this.props.form1.name}
                        </StepButton>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: 1})}>
                            {this.props.form2.name}
                        </StepButton>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: 2})}>
                            {this.props.form3.name}
                        </StepButton>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: 3})}>
                            {this.props.form4.name}
                        </StepButton>
                    </Step>
                </Stepper>
                <div style={styles.content}>
                    <div>{this.getStepContent(stepIndex)}</div>
                    {stepIndex !== null && (
                        <div style={styles.actions}>
                            <br/>
                            <div className="step-navigation">
                                <RaisedButton
                                    label="Back"
                                    disabled={stepIndex === 0}
                                    onClick={this.handlePrev}
                                    style={styles.backButton}
                                />
                                <RaisedButton
                                    label="Next"
                                    disabled={stepIndex === 3}
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
                                    style={{marginRight: 16}}
                                />
                                <RaisedButton
                                    label={this.props.type === "Edit" ? "Update" : "Submit"}
                                    primary={true}
                                    disabled={this.props.submitDisabled}
                                    
                                    onClick={this.props.submit}
                                />
                            </div>
                        </div>
                    )}

                </div>
            </div>
        );
    }
}

export default CourseStepper;