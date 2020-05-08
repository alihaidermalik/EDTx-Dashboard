import Chip from 'material-ui/Chip';
import CircularProgress from 'material-ui/CircularProgress';
import { List } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { alertActions, questsActions, studentsActions } from '../../actions';
import { Pagination, PaginationListItems } from '../Quests//Pagination';

import RaisedButton from 'material-ui/RaisedButton';
const styles = {
    root: {
        width: '100%',
        maxWidth: 800,
        margin: 'auto',
    },
    gridKey: {
        textAlign: "right",
        paddingRight: "38px",
        overflow: "hidden"
    },
    cohort: {
        textAlign: "left"
    },
    chip: {
        margin: 4,
    },
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    content: {
        margin: '0 16px',
    },
}

class CreateCohort extends Component {
    //TODO: implement or delete
    constructor(props) {
        super(props);
        this.state = {
            selectedCohorts: []
        }
    }

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(studentsActions.getStudents());

    }

    componentWillReceiveProps(nextProps) {
        if (!this.isEmpty(nextProps.students)) {
            this.setState({ cohorts: nextProps.students })
        }
    }

    submit = values => {
        const {dispatch} = this.props;

        if (this.state.name === undefined || this.state.location === undefined) {
            dispatch(alertActions.error("Not all required fields filled in."));
        } else {
            var questData = {
                cohort: this.state.selectedCohorts.map(e => e.username),
            };
            dispatch(questsActions.createCohort(questData));
        }

    }

    handleChangeCohortCheckbox = (event, checked, cohort) => {
        var currentCohorts = this.state.selectedCohorts;
        if (checked) {
            currentCohorts.push(cohort);
        }
        else {
            var index = currentCohorts.indexOf(cohort);
            if (index > -1) {
                currentCohorts.splice(index, 1);
            }
        }
        this.setState({
            selectedCohorts: currentCohorts,
            resetDisabled: false,
        });
    }
    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    renderCohortChip(data) {
        return (
            <Chip
                key={data.id}
                onRequestDelete={() => {
                    this.handleChangeCohortCheckbox(null, false, data);
                    this.forceUpdate()
                }}
                style={styles.chip}
            >
                {data.first_name + " " + data.last_name}
            </Chip>
        );

    }

    render() {
        const {fetching} = this.props;       

        const Cohorts = [
            !fetching ?
                <div style={styles.root}>

                    <List>
                        <Subheader>Select Cohorts</Subheader>
                        {!this.isEmpty(this.state.selectedCohorts)
                            ?
                            <div style={styles.wrapper}>
                                {
                                    this.state.selectedCohorts.map(cohort => this.renderCohortChip(cohort))
                                }
                            </div>
                            : null
                        }
                        {this.state.cohorts
                            ?
                            <Pagination
                                data={this.state.cohorts}
                            >
                                <PaginationListItems handleChangeCohortCheckbox={this.handleChangeCohortCheckbox}
                                    selectedCohorts={this.state.selectedCohorts} />
                            </Pagination>

                            :
                            <div> No cohorts available.</div>
                        }
                    </List>
                </div>
                :
                <CircularProgress size={60} thickness={7} />
        ]

        
        

        
        
        
        
        
        
        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <br />
                <Paper className={"edtx-paper"} style={{ zDepth: 2 }}>
                    <h2>Create new Cohort</h2>
                    <div style={styles.content}>

                        {Cohorts}
                    </div>
                    <div className="">

                        <RaisedButton
                            label={"Submit"}
                            primary={true}
                            disabled={this.props.submitDisabled}
                            onClick={this.props.submit}
                        />
                    </div>
                </Paper>
            </div>
        )

    }
}

function mapStateToProps(state) {
    const { alert } = state;
    
    const { students, fetching } = state.students;

    return {
        alert,
        
        students, fetching,
    };
}

const connectedCreateCohort = connect(mapStateToProps)(CreateCohort);
export { connectedCreateCohort as CreateCohort };
