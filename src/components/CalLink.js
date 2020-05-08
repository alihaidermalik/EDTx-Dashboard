import Paper from 'material-ui/Paper';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { questsActions } from '../actions';
import { NavLink } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import { QuestListItemComponent } from './Quests/QuestListItemComponent'
import { GridList } from 'material-ui/GridList';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { TrainingCenterDropDown } from './Calendar/TrainingCenterDropDown';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import EditIcon from 'material-ui-icons/Edit';
import DeleteDialog from './DeleteDialog';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment'

const REACT_APP_ICAL_API_URL = "http://35.158.69.214"
const style = {
    border: "2px solid black",
    margin: "0 70px 0 0",
    borderRadius: "30px",
};

const styleCalendar = {
    color: "blue",
    margin: "10px 70px 0px 36px",

}

const styleLabel = {
    verticalAlign: "top",

}

const expandColumn = {
    flexBasis: '33.33%',
}

const widthDiv = {
    padding: 0,
    margin: 0,
    width: '88.5%',
    fontSize: 15,
}

class CalLink extends Component {
    constructor(props) {
        super(props)
        this.state = {
            baseURL: REACT_APP_ICAL_API_URL + "/traning_center/api/asset/feed",
            ICALUserFeedUrl: "",
            ICALUserFeedLocationURL: "",
            ICALALLFeedLocationURL: "",
            training_center_id: 1,
            selectedAsset: 1,
            username: localStorage.username,
            instructorAllStudentURL: REACT_APP_ICAL_API_URL + "/traning_center/api/mystudents/feed/" + localStorage.username,
        };
    }

    componentDidMount() {
        this.setState({
            ICALUserFeedUrl: this.state.baseURL + "/" + localStorage.username,
            ICALUserFeedLocationURL: this.state.baseURL + "/" + localStorage.username,
            ICALALLFeedLocationURL: this.state.baseURL + "/ALL"
        })
    }

    handleChangeTrainingCenter = (centerID) => {
        this.setState({
            training_center_id: centerID,
            ICALUserFeedLocationURL: this.state.baseURL + "/" + localStorage.username + "/" + centerID,
            ICALALLFeedLocationURL: this.state.baseURL + "/ALL/" + centerID,
        });
    }

    handleChangeAsset = (e, x, assetID) => {

        this.setState({
            selectedAsset: assetID,
            ICALUserFeedLocationURL: this.state.baseURL + "/" + localStorage.username + "/" + this.state.training_center_id + "/" + assetID,
            ICALALLFeedLocationURL: this.state.baseURL + "/ALL/" + this.state.training_center_id + "/" + assetID,
        });
    }

    render() {
        const { fetching } = this.props;
        const FilterArea = [
            <div style={{ display: "flex", width: "100%", alignItems: "center", marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                    <TrainingCenterDropDown
                        handleChangeTrainingCenter={this.handleChangeTrainingCenter}
                        selectedTrainingCenter={this.state.training_center_id}
                        disabled={this.props.fetching}
                        selectedAsset={this.state.selectedAsset}
                        handleChangeAsset={this.handleChangeAsset}
                    />
                </div>
            </div>
        ]
        return (
            <div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: 65 }}>
                    <br />

                    <Paper className={"edtx-paper"} zDepth={2} style={{ height: "100%" }}>
                        <div style={{ display: "flex", width: "90%", alignItems: "center" }}>

                            <div key="grade-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <h3 style={{
                                    width: "100%",
                                    fontSize: "1em",
                                    padding: "0 0.3em 0.3em 0.3em"
                                }}>
                                    CALENDAR LINK
                            </h3>
                            </div>
                        </div>
                        <div style={widthDiv}>
                            <label>ICAL User Feed URL : </label>
                            <a href={this.state.ICALUserFeedUrl} style={{ textDecoration: "none" }}><label style={{ fontStyle: 'italic' }}>{this.state.ICALUserFeedUrl}</label></a>
                        </div>
                        <br />
                        <div style={widthDiv}>
                            <label>ICAL All Students Feed URL : </label>
                            <a href={this.state.instructorAllStudentURL} style={{ textDecoration: "none" }}><label style={{ fontStyle: 'italic' }}>{this.state.instructorAllStudentURL}</label></a>
                        </div>
                        <div style={widthDiv}>
                            <div style={{ position: 'relative', right: 21, padding: '20px 0' }}>
                                {FilterArea}
                            </div>
                            <div style={{ padding: '0 0 15px' }}>
                                <label>ICAL User Feed Location URL : </label>
                                <a href={this.state.ICALUserFeedLocationURL} style={{ textDecoration: "none" }}><label style={{ fontStyle: 'italic' }}>{this.state.ICALUserFeedLocationURL}</label></a>
                            </div>
                            <div>
                                <label>ICAL All Feed Location URL : </label>
                                <a href={this.state.ICALALLFeedLocationURL} style={{ textDecoration: "none" }}><label style={{ fontStyle: 'italic' }}>{this.state.ICALALLFeedLocationURL}</label></a>
                            </div>
                        </div>

                    </Paper>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    const { quests, fetching } = state.quests;
    return {
        quests,
        fetching
    };
}
const connectedCalLink = connect(mapStateToProps)(CalLink);
export { connectedCalLink as CalLink };
