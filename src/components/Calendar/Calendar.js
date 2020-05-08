import Paper from 'material-ui/Paper';
import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { connect } from 'react-redux';
import { questsActions } from '../../actions';
import { withRouter } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import { TrainingCenterDropDown } from './TrainingCenterDropDown';
import CircularProgress from 'material-ui/CircularProgress';
import { NavLink } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
const styles = {
  calendarContainer: { height: 550, width: "100%" },
  createEventDates: {
    padding: "5px",
    lineHeight: "20px",
    fontSize: "0.9em",
  }
}
class Calendar extends Component {
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
      mappedCalendarData: [
      ],
      filteredCalendarData: [],
      //Alternate color scheme
      // bgColor:  ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']
      bgColor: ["#3174ad", "#29327D", "#25316D", " #1E2657", "#4C87C2", "#70A4D4", "#0C5C7D", "#1B6161", "#0E4347", "#238BA8", "#4AB5C9", "#0E825D", "#15664B", "#063F2C", "#1FA374", "#47BB94", "#F05624", "#B24929", "#6B381C", "#F67937", "#FAA054"],
      training_center_id: 1,
      searchCalendar: "",
      selectedAsset: 1,
      eventStart: null,
      eventEnd: null,
      cacheLoaded: false
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    let calendarCache = JSON.parse(localStorage.getItem('calendar_cache'));
    if (calendarCache !== null && !this.isEmpty(calendarCache)) {
      this.setState({
        mappedCalendarData: calendarCache,
        filteredCalendarData: calendarCache,
        cacheLoaded: true
      })
    }
    dispatch(questsActions.getQuests());
  }
  componentWillReceiveProps(nextProps) {
    if (!this.isEmpty(nextProps.quests)) {
      var mappedCalendarData = this.mapQuestsToCalendarData(nextProps.quests.results);
      this.setState({
        quests: nextProps.quests,
        mappedCalendarData: mappedCalendarData,
        filteredCalendarData: mappedCalendarData,
        next_page: nextProps.quests.next ? this.state.page + 1 : null,
        prev_page: nextProps.quests.previous ? this.state.page - 1 : null,
      })
      localStorage.setItem('calendar_cache', JSON.stringify(mappedCalendarData));
    }
  }
  getBackGroundColor = (i) => {
    if (i > this.state.bgColor.length) {
      i = i % this.state.bgColor.length
    }
    return this.state.bgColor[i];
  }
  mapQuestsToCalendarData = (quests) => {
    var t = quests.map((quest, i) => {
      var bgColor = this.getBackGroundColor(i);
      return {
        id: quest.id,//i,
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
  selectEvent = (event, e) => {
    const { history } = this.props;
    const redirectTo = "/quests/" + event.id
    history.push(redirectTo);
  }
  goToListView = () => {
    const redirectTo = "/planning"
    this.props.history.push(redirectTo);
  }
  eventStyleGetter = (event, start, end, isSelected) => {
    var backgroundColor = event.color;
    var style = {
      color: "white !important",
      backgroundColor: backgroundColor,
      borderRadius: '0px',
      opacity: 0.8,
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  }
  handleChangeTrainingCenter = (centerID) => {
    var newFilteredCalendarData = this.state.mappedCalendarData.filter(data => {
      return data.center === centerID;
    })
    this.setState({
      filteredCalendarData: newFilteredCalendarData,
      searchCalendar: "",
      training_center_id: centerID,
      selectedAsset: 1,
    });
  }
  handleChangeAsset = (e, x, assetID) => {
    var newFilteredCalendarData = this.state.mappedCalendarData.filter(data => {
      var x = data.assets.map(a => { return a.id })
      return x.includes(assetID)
    })
    this.setState({
      filteredCalendarData: newFilteredCalendarData,
      searchCalendar: "",
      selectedAsset: assetID,
    });
  }
  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.searchCalendar();
    }
  }
  searchCalendar = () => {
    var searchValue = this.state.searchCalendar.toString().toLowerCase();
    var newFilteredCalendarData = this.state.mappedCalendarData.filter(data => {
      var course_name = data.course_name.toString().toLowerCase()
      var title = data.title.toString().toLowerCase()
      return course_name.includes(searchValue) || title.includes(searchValue);
    })
    this.setState({ filteredCalendarData: newFilteredCalendarData });
  }
  handleChangeSearchCalendar = (event, value) => {
    this.setState({
      searchCalendar: value,
    });
  }
  searchClear = () => {
    this.setState({
      filteredCalendarData: this.state.mappedCalendarData,
      searchCalendar: "",
      training_center_id: 1,
      selectedAsset: 1,
      eventStart: null,
      eventEnd: null
    })
  }
  handleSelect = ({ start, end }) => {
    this.setState({
      eventStart: moment(start),
      eventEnd: moment(end),
    })
  }
  dateSelectionVisibility = (date) => {
    if (this.state.eventStart && this.state.eventEnd) {
      var formatDate = moment(date)
      var statement = formatDate.isBetween(this.state.eventStart, this.state.eventEnd, 'days', '[]')
      if (statement) {
        return {
          className: "rbc-selected",
          // style: {
          // backgroundColor:
          // // "rgb(54, 77, 124)"
          // "#eaf6ff"
          // }
        }
      }
    }
  }
  render() {
    const localizer = BigCalendar.momentLocalizer(moment)
    const MyCalendar = props => (
      <div style={styles.calendarContainer}>
        <BigCalendar
          localizer={localizer}
          events={this.state.filteredCalendarData}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={this.selectEvent}
          popup={true}
          showMultiDayTimes={true}
          eventPropGetter={(this.eventStyleGetter)}
          selectable
          onSelectSlot={this.handleSelect}
          dayPropGetter={this.dateSelectionVisibility}
        />
      </div>
    )
    const FreeTextSearch = [
      <div style={{ paddingBottom: 10, textAlign: "end" }}>
        <TextField name="name" onChange={this.handleChangeSearchCalendar}
          floatingLabelText={"Search Course name, Activity title"}
          value={this.state.searchCalendar}
          onKeyPress={this.handleKeyPress}
          style={{ paddingBottom: 10 }}
        />
        <FlatButton label="Search" onClick={this.searchCalendar} />
        <FlatButton label="Clear" onClick={this.searchClear} />
      </div>
    ]
    const FilterArea = [
      <div style={{ display: "flex", width: "100%", alignItems: "center", marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <TrainingCenterDropDown
            handleChangeTrainingCenter={this.handleChangeTrainingCenter}
            selectedTrainingCenter={this.state.training_center_id}
            disabled={!this.state.cacheLoaded && this.props.fetching}
            selectedAsset={this.state.selectedAsset}
            handleChangeAsset={this.handleChangeAsset}
          />
        </div>
        <div style={{ flex: 1 }}>
          {FreeTextSearch}
        </div>
      </div>
    ]
    const eventStartFormatted = this.state.eventStart ? moment(this.state.eventStart).format() : null
    const eventEndFormatted = this.state.eventEnd ? moment(this.state.eventEnd).format() : null;
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <br />
        <Paper className={"edtx-paper"} style={{ zDepth: 2 }}>
          <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <NavLink
                style={{
                  width: "100%",
                  marginRight: 3,
                  display: "flex",
                  justifyContent: "flex-start"
                }}
                to={{
                  pathname: "/new_quest",
                  state: {
                    eventStart: eventStartFormatted,
                    eventEnd: eventEndFormatted
                  }
                }}
              >
                <RaisedButton label="Create a new Activity" backgroundColor={'#364D7C'}
                  labelColor='#fff' />
              </NavLink>
              {this.state.eventStart ?
                <div style={styles.createEventDates}>
                  <span>Start date: </span>
                  <span>{this.state.eventStart ? moment(this.state.eventStart).format('YYYY-MM-DD HH:mm') : null}</span>
                  <br />
                  <span style={{ paddingRight: "5px" }}>End date:  </span>
                  <span>{this.state.eventEnd ? moment(this.state.eventEnd).format('YYYY-MM-DD HH:mm') : null}</span>
                </div>
                : null}
            </div>
            <div key="grade-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <h2 style={{
                width: "100%",
                fontSize: "2em",
                padding: "0 0.3em 0.3em 0.3em"
              }}>Calendar view of Activities</h2>
              {this.props.fetching ?
                <div style={{ marginLeft: 5 }}>
                  <CircularProgress size={60} thickness={7} />
                </div>
                :
                null
              }
            </div>
            <div style={{ flex: 1, textAlign: "end" }}>
              <FlatButton label="List view" onClick={this.goToListView} />
            </div>
          </div>
          {FilterArea}
          {MyCalendar()}
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
const connectedCalendar = connect(mapStateToProps)(Calendar);
const CalendarRouter = withRouter(connectedCalendar);
export { CalendarRouter as Calendar };