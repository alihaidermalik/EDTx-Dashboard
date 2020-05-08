import Paper from 'material-ui/Paper';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { questsActions } from '../../actions';
import { NavLink } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import { QuestListItemComponent } from './QuestListItemComponent'
import { GridList } from 'material-ui/GridList';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { TrainingCenterDropDown } from '../Calendar/TrainingCenterDropDown';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import EditIcon from 'material-ui-icons/Edit';
import DeleteDialog from '../DeleteDialog';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import moment from 'moment'

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
    verticalAlign:"top",

}

const expandColumn = {
    flexBasis: '33.33%',
}

class Planning extends Component {
    constructor(props) {
        super(props)
        this.state = {
            quests: [
                {
                    "name": "No quests found.",
                    "cohort": [
                        "student_id_1",
                        "student_id_2"
                    ],
                    "time_start": "2018-05-11T09:19:24.167271",
                    "time_end": "2018-05-13T12:00:00.000000",
                    "tasks": [
                        "task_id_1",
                        "task_id_2"
                    ],
                    "location": "Where activity takes place"
                },
            ],
            course_id: 1,
            page_size: 15,
            page: 1,
            next_page: null,
            prev_page: null,
            training_center_id: 1,
            searchList: "",
            selectedAsset: 1,
            mappedListData: [
            ],
            filteredListData: [],
            cacheLoaded: false
        };
    }
    componentDidMount() {
        const { dispatch } = this.props;
        // dispatch(questsActions.getQuests(false, this.state.page, this.state.page_size));
        let calendarCache = JSON.parse(localStorage.getItem('list_cache'));
        if (calendarCache !== null && !this.isEmpty(calendarCache)) {
            this.setState({
                // mappedCalendarData: calendarCache,
                // filteredCalendarData: calendarCache,
                mappedListData: calendarCache,
                filteredListData: calendarCache,
                cacheLoaded: true
            })
        }
        dispatch(questsActions.getQuests());
    }
    componentWillReceiveProps(nextProps) {
        if (!this.isEmpty(nextProps.quests)) {
            var mappedListData = nextProps.quests.results
            this.setState({
                quests: nextProps.quests,
                mappedListData: mappedListData,
                filteredListData: mappedListData,
                next_page: nextProps.quests.next ? this.state.page + 1 : null,
                prev_page: nextProps.quests.previous ? this.state.page - 1 : null,
                cacheLoaded: true
            })
            localStorage.setItem('list_cache', JSON.stringify(mappedListData));
        } else {
        }
    }
    getBackGroundColor = (i) => {
        if (i > this.state.bgColor.length) {
            i = i % this.state.bgColor.length
        }
        return this.state.bgColor[i];
    }
    mapQuestsToListData = (quests) => {
        var t = quests.map((quest, i) => {
            var bgColor = this.getBackGroundColor(i);
            return {
                id: quest.id,
                title: quest.comment ? quest.comment : "",
                allDay: false,
                start: new Date(quest.date),
                end: new Date(quest.end_date),
                color: bgColor,
                center: quest.center ? quest.center.id : null,
                course_name: quest.group ? quest.group.course_name : "",
                assets: quest.traning_center_resources ? quest.traning_center_resources : []
            }
        })
        return t;
    }
    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };
    handleGoPrev = () => {
        this.setState({
            page: this.state.prev_page
        })
        this.props.dispatch(questsActions.getQuests(false, this.state.prev_page, this.state.page_size));
    }
    handleGoNext = () => {
        this.setState({
            page: this.state.next_page
        })
        this.props.dispatch(questsActions.getQuests(false, this.state.next_page, this.state.page_size));
    }
    goToCalendarView = () => {
        const redirectTo = "/calendar"
        this.props.history.push(redirectTo);
    }
    handleChangeTrainingCenter = (centerID) => {
        var newFilteredListData = this.state.mappedListData.filter(quest => {
            var questCenterId = quest.center ? quest.center.id : null
            return questCenterId === centerID;
        })
        this.setState({
            filteredListData: newFilteredListData,
            searchList: "",
            training_center_id: centerID,
            selectedAsset: 1,
        });
    }
    handleChangeAsset = (e, x, assetID) => {
        var newFilteredListData = this.state.mappedListData.filter(quest => {
            var x = quest.traning_center_resources ? quest.traning_center_resources.map(a => { return a.id }) : []
            // var x = data.assets.map(a => { return a.id })
            return x.includes(assetID)
        })
        this.setState({
            filteredListData: newFilteredListData,
            searchList: "",
            selectedAsset: assetID,
        });
    }
    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.searchList();
        }
    }
    searchList = () => {
        var searchValue = this.state.searchList.toString().toLowerCase();
        var newFilteredListData = this.state.mappedListData.filter(quest => {
            var course_name = quest.group ? quest.group.course_name.toString().toLowerCase() : ""
            var title = quest.comment ? quest.comment.toString().toLowerCase() : ""
            return course_name.includes(searchValue) || title.includes(searchValue);
        })
        this.setState({ filteredListData: newFilteredListData });
    }
    handleChangeSearchList = (event, value) => {
        this.setState({
            searchList: value,
        });
    }
    searchClear = () => {
        this.setState({
            filteredListData: this.state.mappedListData,
            searchList: "",
            training_center_id: 1,
            selectedAsset: 1,
        })
    }
    reverseList = () => {        
        var newFilteredListData = this.state.filteredListData.slice(0).reverse();

        this.setState({ filteredListData: newFilteredListData });
    }
    orderByName = () => {        
        var newFilteredListData = this.state.filteredListData.slice(0).sort(function(a, b) {            
            var textA = a.comment ? a.comment.toUpperCase() : "";
            var textB = b.comment ? b.comment.toUpperCase() : "";
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        this.setState({ filteredListData: newFilteredListData });
    }
    parseDate = (date) => {
        return moment(date).format('DD-MM-YYYY');     
    }
    handleChangeCourse = (value) => {
        this.setState({
            course_id: value,
            resetDisabled: false,
            submitDisabled: false,
        })
    }

    render() {
        const { fetching } = this.props;
        // const Header = [
        //     <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
        //         <div style={{ flex: 1 }}>
        //             {this.state.prev_page ?
        //                 <FlatButton label="Previous Page" onClick={this.handleGoPrev} />
        //                 :
        //                 null}
        //         </div>
        //         <div key="grade-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        //             {/* Page: {this.state.page} */}
        //             {/* <h3 style={{
        //                 width: "100%",
        //                 fontSize: "2em",
        //                 padding: "0 0.3em 0.3em 0.3em"
        //             }}>Page: {this.state.page}</h3> */}
        //         </div>
        //         <div style={{ flex: "intial" }}>
        //             {this.state.next_page ?
        //                 <FlatButton label="Next Page" onClick={this.handleGoNext} />
        //                 :
        //                 null}
        //         </div>
        //     </div>
        // ]
        const FreeTextSearch = [
            <div style={{ paddingBottom: 10, textAlign: "end" }}>
                <TextField name="name" onChange={this.handleChangeSearchList}
                    floatingLabelText={"Search Course name, Activity title"}
                    value={this.state.searchList}
                    onKeyPress={this.handleKeyPress}
                    style={{ paddingBottom: 10 }}
                />
                <FlatButton label="Search" onClick={this.searchList} />
                <FlatButton label="Clear" onClick={this.searchClear} />
            </div>
        ]
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
                <div style={{ flex: 1 }}>
                    {FreeTextSearch}
                </div>
            </div>
        ]
        const HeaderSort = [
            <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                <div style={{ flexBasis: "43.5%"}}>
                        <FlatButton label="Activity Name" onClick={this.orderByName} disabled={fetching}/>                        
                </div>
                <div style={{ flexBasis: "15%"}}>
                        <FlatButton label="Time Start" onClick={this.reverseList} disabled={fetching}/>                        
                </div>
                <div style={{ flex: 1}}>
                        <FlatButton label="Time End" onClick={this.reverseList} disabled={fetching}/>                        
                </div>
                
               
            </div>
        ]
        return (
            <div>
                <br />
                <div style={{width: 285, float: "right"}}>
                <FlatButton label="Create a new Activity" style={style} href={"/new_quest"} hoverColor={"white"} labelStyle={styleLabel}/>
                
                <FlatButton label="Calendar view" style={styleCalendar}  onClick={this.goToCalendarView} hoverColor={"white"} />
                </div>

                <br />
                <div style={{ display: "flex", justifyContent: "center", marginTop: 65 }}>
                <br />

                <Paper className={"edtx-paper"}  style={{ height: "100%", zDepth: 2 }}>
                    <div style={{ display: "flex", width: "80%", alignItems: "center" }}>
                       
                        <div key="grade-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <h3 style={{
                                width: "100%",
                                fontSize: "1em",
                                padding: "0 0.3em 0.3em 0.3em"
                            }}>
                            LIST ACTIVITIES
                            </h3>
                            {fetching ?
                            <div style={{marginLeft: 5}}>
                                <CircularProgress size={30} thickness={4} />
                            </div> : null }
                        </div>
                    </div>
                    {!this.state.cacheLoaded ?
                        <div>
                            <CircularProgress size={60} thickness={7} />
                        </div> :
                        <div style={{
                            display: "flex",
                            flexWrap: 'wrap',
                            justifyContent: 'space-around',
                            width: "80%"
                        }}>
                            {FilterArea}
                            {/* {Header} //TODO: Add this back in if we have pagination enabled on the cache*/}
                            {HeaderSort}
                            
                            {this.state.filteredListData ?
                                    this.state.filteredListData.map((quest, i) => (
                                        <ExpansionPanel style={{ width: "100%" }}>
                                            <ExpansionPanelSummary>
                                            <a style={{textDecoration: "none",color: "inherit",display:"contents"}} href={"/quests/" + quest.id}>
                                                <div style={{ flexBasis: "60%" }}>
                                                    <Typography >{quest.comment}</Typography>
                                                </div>
                                                <div style={{ flexBasis: "20%" }}>
                                                    <Typography >{this.parseDate(quest.date)}</Typography>
                                                </div>
                                                <div style={{ flexBasis: "20%" }}>
                                                    <Typography >{this.parseDate(quest.end_date)}</Typography>
                                                </div>
                                            </a>
                                                <div style={{ flexBasis: "10%" }}>
                                                    <Typography >
                                                        <DeleteDialog
                                                            deleteAction={this.handleDelete}
                                                            color="white"
                                                            id={quest.id}
                                                            title={quest.comment}
                                                            redirect={""}
                                                            className="delete-questbtn"
                                                            style={{
                                                                // backgroundColor: "rgba(0, 0, 0, 0.4)"
                                                            }}
                                                        >
                                                        <DeleteIcon/>
                                                        </DeleteDialog>
                                                        

                                                    </Typography>
                                                </div>
                                                <div style={{ flexBasis: "20%" }}>
                                                    <Typography >
                                                        <IconButton style={{padding: 0}} href={"/edit_quest/" + quest.id}>
                                                            <EditIcon/>
                                                        </IconButton>
                                                    </Typography>
                                                    
                                                </div>
                                            </ExpansionPanelSummary>
                                            
                                        </ExpansionPanel>
                                    ))
                                    :
                                    <span>No activities in database.</span>
                            }
                            
                        </div>
                    }
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
const connectedPlanning = connect(mapStateToProps)(Planning);
export { connectedPlanning as Planning };
