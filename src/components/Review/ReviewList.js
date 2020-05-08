
import Paper from 'material-ui/Paper';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { questsActions } from '../../actions';
import { NavLink } from 'react-router-dom';
import { ReviewListItemComponent } from './ReviewListItemComponent'
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import { TrainingCenterDropDown } from '../Calendar/TrainingCenterDropDown';

class ReviewList extends Component {
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
            page_size: 15,
            page: 1,
            next_page: null,
            prev_page: null,
            pageCount: null,
            searchList: "",
            mappedListData: [
            ],
            filteredListData: [],
            cacheLoaded: false,
            training_center_id: 1,
            selectedAsset: 1,


        };
    }
    componentDidMount() {
        const { dispatch } = this.props;
        let calendarCache = JSON.parse(localStorage.getItem('list_review_cache'));
        if (calendarCache !== null && !this.isEmpty(calendarCache)) {
            this.setState({
                // mappedCalendarData: calendarCache,
                // filteredCalendarData: calendarCache,
                mappedListData: calendarCache,
                filteredListData: calendarCache,
                cacheLoaded: true
            })
        }
        // dispatch(questsActions.getQuestsSlim(true, this.state.page, this.state.page_size));
        dispatch(questsActions.getQuests(true));

    }
    componentWillReceiveProps(nextProps) {
        if (!this.isEmpty(nextProps.quests)) {
            let pageCount = parseInt(nextProps.quests.count / this.state.page_size, 10);
            if (nextProps.quests.count % this.state.page_size > 0) {
                pageCount++;
            }
            var mappedListData = nextProps.quests.results
            this.setState({
                quests: nextProps.quests,
                next_page: nextProps.quests.next ? this.state.page + 1 : null,
                prev_page: nextProps.quests.previous ? this.state.page - 1 : null,
                pageCount: pageCount,
                mappedListData: mappedListData,
                filteredListData: mappedListData,
                cacheLoaded: true
            })
            localStorage.setItem('list_review_cache', JSON.stringify(mappedListData));
        }
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
            page: this.state.prev_page,
            searchList: "",
        })
        this.props.dispatch(questsActions.getQuests(true, this.state.prev_page, this.state.page_size));
    }
    handleGoNext = () => {
        this.setState({
            page: this.state.next_page,
            searchList: "",
        })
        this.props.dispatch(questsActions.getQuests(true, this.state.next_page, this.state.page_size));
    }
    handlePageDropDownChange = (event, index, selectedPage) => {
        this.setState({
            page: selectedPage,
            searchList: "",
        })
        this.props.dispatch(questsActions.getQuests(true, selectedPage, this.state.page_size));
    }
    PageDropDown = () => {
        if (this.state.pageCount) {
            const items = [];
            for (let i = 1; i <= this.state.pageCount; i++) {
                items.push(<MenuItem value={i} key={i} primaryText={`${i}`} />);
            }
            return (
                [
                    <span style={{ paddingLeft: 15 }}> Go to: </span>,
                    <div style={{ paddingBottom: 3 }}>
                        <DropDownMenu maxHeight={300} value={this.state.page} onChange={this.handlePageDropDownChange}>
                            {items}
                        </DropDownMenu>
                    </div>
                ]
            )
        }
    }
    goToCalendarView = () => {
        const redirectTo = "/review_calendar"
        this.props.history.push(redirectTo);
    }
    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.searchList();
        }
    }
    searchList = () => {
        var searchValue = this.state.searchList.toString().toLowerCase();
        var newFilteredListData = this.state.mappedListData.filter(quest => {
            // var course_name = quest.group ? quest.group.course_name.toString().toLowerCase() : ""
            var title = quest.comment ? quest.comment.toString().toLowerCase() : ""
            return title.includes(searchValue);
        })
        this.setState({ filteredListData: newFilteredListData });
    }
    reverseList = () => {
        var newFilteredListData = this.state.filteredListData.slice(0).reverse();
        this.setState({ filteredListData: newFilteredListData });
    }
    orderByName = () => {
        var newFilteredListData = this.state.filteredListData.slice(0).sort(function (a, b) {
            var textA = a.comment ? a.comment.toUpperCase() : "";
            var textB = b.comment ? b.comment.toUpperCase() : "";
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
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
    render() {
        const { fetching } = this.props;
        const items = [];
        for (let i = 0; i < this.state.pageCount; i++) {
            items.push(<MenuItem value={i} key={i} primaryText={`${i}`} />);
        }
        const Header = [
            <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                    {this.state.prev_page ?
                        <FlatButton label="Previous Page" onClick={this.handleGoPrev} />
                        :
                        null}
                </div>
                <div key="grade-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <span>Page: {this.state.page} out of {this.state.pageCount} </span>
                    {/* <h3 style={{
                        width: "100%",
                        fontSize: "2em",
                        padding: "0 0.3em 0.3em 0.3em"
                    }}>Page: {this.state.page}</h3> */}
                    {this.PageDropDown()}
                </div>
                <div style={{ flex: "intial" }}>
                    {this.state.next_page ?
                        <FlatButton label="Next Page" onClick={this.handleGoNext} />
                        :
                        null}
                </div>
            </div>
        ]
        const HeaderSort = [
            <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                    <FlatButton label="Title" onClick={this.orderByName} />
                </div>
                <div style={{ flex: 1, marginLeft: "2em" }}>
                    <FlatButton label="Date" onClick={this.reverseList} />
                </div>
            </div>
        ]
        const FreeTextSearch = [
            <div style={{ paddingBottom: 10, textAlign: "end" }}>
                <TextField name="name" onChange={this.handleChangeSearchList}
                    floatingLabelText={"Search Activity title"}
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
        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <br />
                <Paper className={"edtx-paper"}  style={{ height: "100%", zDepth: 2 }}>
                    <div style={{ display: "flex", width: "80%", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                        </div>
                        <div key="grade-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <h2 style={{
                                width: "100%",
                                fontSize: "2em",
                                padding: "0 0.3em 0.3em 0.3em"
                            }}>List view of Reviews</h2>
                            {fetching ?
                                <div style={{ marginLeft: 5 }}>
                                    <CircularProgress size={30} thickness={4} />
                                </div> : null}
                        </div>
                        <div style={{ flex: 1, textAlign: "end" }}>
                            <FlatButton label="Calendar view" onClick={this.goToCalendarView} />
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
                            <div style={{ width: "100%" }}>
                                {/* {Header} */}
                                {HeaderSort}
                                {this.state.filteredListData ?
                                    this.state.filteredListData.map((quest, i) => (
                                        [
                                            <ReviewListItemComponent key={quest._id} quest={quest} questID={quest.id} redirectTo={"/grade/" + quest.id} editRedirectTo={"/review/" + quest.id} />
                                            ,
                                            <br />
                                        ]
                                    ))
                                    :
                                    <span>No reviews in database.</span>
                                }
                                {/* {Header} */}
                            </div>
                        </div>
                    }

                </Paper>
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
const connectedReviewList = connect(mapStateToProps)(ReviewList);
export { connectedReviewList as ReviewList };
