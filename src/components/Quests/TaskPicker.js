import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { coursesActions } from '../../actions';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';
import Chip from 'material-ui/Chip';
import CircularProgress from 'material-ui/CircularProgress';
import { namingConstants } from '../../constants';
import { Divider } from 'material-ui';
import moment from 'moment';
const styles = {
    menuItem: {
        width: "100%"
    },
    DropDownMenu: {
        display: 'flex',
        width: "100%",
        alignContent: 'center',
        alignItems: 'center'
    },
    chip: {
        margin: 4
    },
    homeworkChip:
    {
        backgroundColor: "#f9ef0d",
        margin: 4,
    },
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap'
    }
}
class TaskPicker extends React.Component {
    state = {
        open: true,
        value: 1,
        values: []
    };
    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(coursesActions.getCourses());
        if (this.props.course_id && this.props.course_id !== 1) {
            //Loads the list with the releated course, ignore if 1
            this.props.handleChangeCourse(this.props.course_id);
            dispatch(coursesActions.getCourseTasktree(this.props.course_id));
        }
    }
    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    handleChangeCourses = (event, index, value) => {
        const { dispatch } = this.props;
        this.props.handleChangeCourse(value);
        dispatch(coursesActions.getCourseTasktree(value));
    }
    typeToText = (type) => {
        switch (type) {
            case 'chapter':
                return namingConstants.SECTION;
            case 'sequential':
                return namingConstants.SUBSECTION;
            case 'vertical':
                return namingConstants.UNITS;
            case 'html':
                return namingConstants.COMPONENTS;
            default:
                return namingConstants.COMPONENTS;
        }
    }
    getBGColor = (type) => {
        switch (type) {
            case 1:
                return "#aaaaaa";
            case 2:
                return "#cccccc";
            case 3:
                return "#a8b8d0";
            default:
                return "#aaaaaa";
        }
    }
    renderListItems(tasks, depth = 1) {
        const bgColor = this.getBGColor(depth)
        return tasks.map((task) => (
            <div>
                <Divider />
                <ListItem
                    style={{
                        height: task.type !== 'vertical' ? "70px" : "100px", backgroundColor: this.props.selectedHomework.map((e) => {
                            return e.section_url ? e.section_url : e.task
                        }).indexOf(task.section_url ? task.section_url : task.task) > -1 ? "#f9ef0d" : bgColor
                    }}
                    key={task.section_url ? task.section_url : task.task}
                    leftCheckbox={
                        task.type === 'vertical' ?
                            <div>
                                <Checkbox
                                    onCheck={(evt, checked) => {
                                        this.props.handleChange(evt, checked, task);
                                        this.forceUpdate()
                                    }}
                                    defaultChecked={this.props.selectedTasks && //this.props.selectedTasks.find((e) => e.id == task.id) }
                                        this.props.selectedTasks.map((e) => {
                                            return e.section_url ? e.section_url : e.task
                                        }).indexOf(task.section_url ? task.section_url : task.task) > -1}
                                />
                                {/* {this.props.selectedTasks && (
                                    this.props.selectedTasks.map((e) => {
                                        return e.section_url ? e.section_url : e.task
                                    }).indexOf(task.section_url ? task.section_url : task.task) > -1
                                    ||
                                    this.props.selectedHomework.map((e) => {
                                        return e.section_url ? e.section_url : e.task
                                    }).indexOf(task.section_url ? task.section_url : task.task) > -1)
                                    ? */}
                                <div>
                                    <br />
                                    <Checkbox
                                        label="Homework"
                                        labelPosition="right"
                                        labelStyle={{ fontSize: 14, paddingLeft: "20px" }}
                                        onCheck={(evt, checked) => {
                                            this.props.handleChangeHomework(evt, checked, task);
                                            this.forceUpdate()
                                        }}
                                        defaultChecked={this.props.selectedHomework &&
                                            this.props.selectedHomework.map((e) => {
                                                return e.section_url ? e.section_url : e.task
                                            }).indexOf(task.section_url ? task.section_url : task.task) > -1}
                                    />
                                </div>
                                {/*
                                     : null}
                                    */}
                            </div>
                            : null
                    }
                    primaryTogglesNestedList={task.type !== 'vertical'}
                    primaryText={task.section_name}
                    secondaryText={"Type: " + this.typeToText(task.type)}
                    nestedItems={task.children && task.type !== 'vertical' ? this.renderListItems(task.children, depth + 1) : undefined}
                />
                <br />
            </div>
        ));
    }
    renderTaskChip(task) {
        return (
            <Chip
                key={task.id}
                onRequestDelete={() => {
                    this.props.handleChip(task);
                    this.forceUpdate()
                }}
                style={styles.chip}
            >
                <div style={{ width: "100px", overflow: "hidden" }}>
                    {task.section_name ? task.section_name : task.title}
                </div>
            </Chip>
        );
    }
    renderHomeworkChip(task) {
        return (
            <Chip
                key={task.id}
                onRequestDelete={() => {
                    this.props.handleHomeworkChip(task);
                    this.forceUpdate()
                }}
                style={styles.homeworkChip}
            >
                <div style={{ width: "100px", overflow: "hidden" }}>
                    {task.section_name ? task.section_name : task.title}
                </div>
            </Chip>
        );
    }
    render() {
        const { fetching, courses, fetchingTasktree } = this.props;
        return [
            fetching ?
                <CircularProgress size={60} thickness={7} />
                :
                <DropDownMenu
                    value={this.props.course_id}
                    onChange={this.handleChangeCourses}
                    style={styles.DropDownMenu}
                    autoWidth={false}
                >
                    <MenuItem style={styles.menuItem} disabled={true} value={1}
                        primaryText={"Select " + namingConstants.COURSE}
                        secondaryText={"Start date"}
                    />
                    {courses.map((course, i) => (
                        <MenuItem
                            key={course.id}
                            style={styles.menuItem}
                            value={course.id}
                            primaryText={course.name}
                            secondaryText={course.start ? moment(course.start).format('YYYY-MM-DD') : "No date set."}
                        />
                    ))
                    }
                </DropDownMenu>,
            <br />,
            <List>
                {this.props.tasktree.children && this.props.course_id !== 1
                    ?
                    <Subheader>Select Tasks</Subheader>
                    :
                    null
                }
                {!this.isEmpty(this.props.selectedTasks)
                    ?
                    <div style={styles.wrapper}>
                        <span className="pagination-span">Chosen tasks: </span>
                        {this.props.selectedTasks.map(this.renderTaskChip, this)}
                    </div>
                    : null
                }
                {!this.isEmpty(this.props.selectedHomework)
                    ?
                    <div style={styles.wrapper}>
                        <span className="pagination-span">Chosen tasks with homework: </span>
                        {this.props.selectedHomework.map(this.renderHomeworkChip, this)}
                    </div>
                    : null
                }
                {fetchingTasktree && this.props.course_id !== 1//&& this.isEmpty(this.props.tasktree.children )
                    ?
                    <CircularProgress size={60} thickness={7} />
                    :
                    this.props.tasktree.children && this.props.course_id !== 1
                        ?
                        this.renderListItems(this.props.tasktree.children)
                        :
                        <Subheader>No tasks on current {namingConstants.COURSE}.</Subheader>
                }
            </List>,
        ]
    }
}
function mapStateToProps(state) {
    const { fetchingTasktree, tasktree } = state.tasktrees;
    const { fetching, courses } = state.courses;
    return {
        fetchingTasktree,
        tasktree,
        fetching,
        courses
    };
}
const connectedTaskPicker = connect(mapStateToProps)(TaskPicker);
const connectedTaskPickerWithRouter = withRouter(connectedTaskPicker);
export { connectedTaskPickerWithRouter as TaskPicker };