
import { TextField } from 'material-ui';
import { Card, CardHeader, CardMedia,CardTitle } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { homeworkActions } from '../../actions';
import { ReplanComponent } from './ReplanComponent';
import { TaskDialog } from './TaskDialog';
import CircularProgress from 'material-ui/CircularProgress';
import { gradeConstants } from '../../constants';
import { messageActions } from '../../actions';

import PlayArrowIcon from 'material-ui/svg-icons/av/play-arrow';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';

const styles = {
    gridKey: {
        paddingRight: "38px",
        overflow: "hidden",
        alignItems: 'center',
        display: 'flex'
    },
    menuItem: {
        width: "100%"
    },
    customWidth: {
        width: "100%"
    },
    DropDownMenu: {
        display: 'flex',
        width: "100%",
        alignContent: 'center',
        alignItems: 'center'
    },
    taskArea: {
        width: "100%"
    },
    moreIcon: {
        display: 'flex',
        flex: 1,
        justifyContent: "flex-end",
    },
    radioButton: {
        marginBottom: 5,
    },
    dontShowComment: { height: "170px" },
    showComment: { height: "250px" },
    gradeTaskComponentContainer: {
        display: "flex",
        justifyContent: "space-around"
    },
    gradeTaskComponentFirst:
    {
        top: "0px !important",
        marginTop: "10px",
        textAlign: "left",
        flex: 2
    },
    gradeTaskComponentMid:
    {
        top: "0px !important",
        marginTop: "20px",
        flex: 1
    },
    gradeTaskComponentEnd:
    {
        top: "0px !important",
        marginTop: "20px",
        paddingRight: "38px",
        textAlign: "right",
        flex: 1
    }
}
class GradeTaskComponent extends React.Component {
    state = {
        open: false,
        commentOpen: false,
        selectedOption: null,
        color: "white",
        hidden: false,
        replanOpen: false,
        time_start: undefined,
        submitting: false,
        comment: "",
        approvedText: "",
        gradeText: "",
        loaded: false,
        specificFile: null,
        specificFileOpen: false

    };
    componentWillMount() {
        this.activityId = this.props.location.pathname.split('/')[2]
        this.props.dispatch(homeworkActions.getHomeworkOnBlockByStudentId(this.activityId, this.props.task.task, this.props.student.id))
    }
    componentWillReceiveProps(nextProps) {
        if (!this.isEmpty(nextProps.homework)) {
            if (!!nextProps.homework.grade && this.state.loaded === false) {
                this.handleTask(nextProps.homework.grade)
            }
        }
        if (!this.isEmpty(nextProps.setHomeworkResponse)) {
            // this.forceUpdate();
            // this.setState({ state: this.state }); //TODO: Remove?
            this.setState({ submitting: false })
        }
        //
    }
    handleCommentChange = (event, value) => {
        event.stopPropagation();
        //
        this.setState({ comment: value });
    }
    handleExpand = () => {
        //
        this.setState({ open: !this.state.open });
    }
    handleDialog = (value) => {
        this.handleTask(value);
    }
    handleChangeRadio = (event, value) => {
        event.stopPropagation();
        event.preventDefault();
        this.handleTask(value);
    }
    handleTask = (value) => {
        if (value === gradeConstants.ACCEPT) {
            this.setState({
                selectedOption: gradeConstants.ACCEPT,
                color: "#C0D890",
                commentOpen: false,
                approvedText: "True",
                gradeText: "Accepted",
                loaded: true
            })
        } else if (value === gradeConstants.REJECT) {
            this.setState({
                selectedOption: gradeConstants.REJECT,
                color: "#ED4337",
                commentOpen: false,
                approvedText: "True",
                gradeText: "Rejected"
                ,loaded: true
            })
        } else if (value === gradeConstants.ACCEPT_COMMENT) {
            this.setState({
                selectedOption: gradeConstants.ACCEPT_COMMENT,
                color: "#f9ef0d",
                commentOpen: true,
                approvedText: "True",
                gradeText: "Accepted with comments"
                ,loaded: true
            })
        }
        else {
            this.setState({
                selectedOption: null,
                color: "white",
                commentOpen: false,
                approvedText: "False",
                gradeText: "Ungraded"
                ,loaded: true
            })
        }
    }
    isEmptyOrSpaces(str) {
        return str === null || str.match(/^ *$/) !== null;
    }
    handleSubmit = (e) => {
        this.setState({ submitting: true })
        e.stopPropagation()
        this.Submit();
    }
    Submit() {
        // this.setState({ submitting: true })
        const { dispatch } = this.props;
        var gradeObject = {
            grade: this.state.selectedOption,
            approved: true
        }
        this.activityId = this.props.location.pathname.split('/')[2]
        
        console.log("======================================")
        console.log(this.props.task.children[0].task)
        //Use this when Dawid fixes api
        
        for(let i=0; i<this.props.task.children.length; i++){
            dispatch(homeworkActions.setHomeworkOnBlockByStudentId(this.activityId, this.props.task.children[i].task, this.props.student.id, gradeObject))
        }

        dispatch(homeworkActions.setHomeworkOnBlockByStudentId(this.activityId, this.props.task.children[0].task, this.props.student.id, gradeObject))
       
        if (this.state.selectedOption === gradeConstants.ACCEPT_COMMENT) {
            //TODO: borde inte göra det här förrens setHomework fått ok respons
            var messageData = {
                recipient: this.props.student.username,
                text: "[Activity approved with comment id: " + this.activityId + "] " + this.state.comment
            }
            dispatch(messageActions.postMessage(messageData));
        }
        // else if(this.state.selectedOption === gradeConstants.REJECT) {
        //     //TODO: borde inte göra det här förrens setHomework fått ok respons
        //     var messageData = {
        //         recipient: this.props.student.username,
        //         text: "[Activity approved with comment id: " + this.activityId + "] " + this.state.comment
        //     }
        //     dispatch(messageActions.postMessage(messageData));
        // }
        
        // setTimeout(() =>{
        //     //TODO: refresh component instead
        //     //Old
        //     // dispatch(homeworkActions.getHomeworkByStudentId(this.activityId, student.id))
        //     //use this
        //     // dispatch(homeworkActions.getHomeworkOnBlockByStudentId(this.activityId, this.props.task.task, this.props.student.id))
            
        //     // this.setState({submitting: false})
        // }, 2000);
        // dispatch(homeworkActions.getHomeworkOnBlockByStudentId(this.activityId, this.props.task.task, this.props.student.id))
        // this.setState({submitting: false})
        // this.props.handleTaskSubmit();
    }
    handleOpenReplan = (e) => {
        e.stopPropagation()
        this.setState({ replanOpen: true });
    }
    handleClosePlanning = (status) => {
        var isSuccess = status === "success";
        if (isSuccess) {
            this.Submit();
        }
        this.setState({ replanOpen: false, hidden: isSuccess });
    };
    handleOpenFiles = (e) => {
        e.stopPropagation()
        this.setState({ filesOpen: true });
    }
    handleCloseFiles = (status) => {
        this.setState({ filesOpen: false });
    };
    handleDateStart = (event, date) => {
        this.setState({
            time_start: date,
        })
    }
    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    capitalizeFirstLetter(text) {
        var string = text.toString()
        return string.toString().charAt(0).toUpperCase() + string.slice(1);
    }
    handleOpenSpecificFile = (e, file) => {
        e.stopPropagation()
        this.setState({ 
            specificFile: file,
            specificFileOpen: true });
    }
    handleCloseSpecificFile = (status) => {
        this.setState({ specificFileOpen: false });
    };
    render() {
        const { task, student } = this.props
        const radios = [
            <RadioButton
                key={"approved-rbtn" + student.id}
                value={gradeConstants.ACCEPT}
                label={"Approved"}
                style={styles.radioButton}
                onClick={(e) => { e.stopPropagation() }}
            />,
            <RadioButton
                key={"rejected-rbtn" + student.id}
                value={gradeConstants.REJECT}
                label={"Rejected"}
                style={styles.radioButton}
                onClick={(e) => { e.stopPropagation() }}
            />,
            <RadioButton
                key={"homework-rbtn" + student.id}
                value={gradeConstants.ACCEPT_COMMENT}
                label={"Approved with comments"}
                style={styles.radioButton}
                onClick={(e) => { e.stopPropagation() }}
            />
        ];
        const task_display_name = this.isEmptyOrSpaces(task.title) ? "[No title]" : task.title;
        const style = {
            containerStyle: {
                backgroundColor: this.state.color,
            }
        };
        const { containerStyle } = style;
        const specificFilesActions = [
            <FlatButton
                label="Close"
                primary={true}
                onClick={this.handleCloseSpecificFile}
            />
        ]
        const RenderFileMiniatures = [
            <div style={{display: "flex", alignItems: "center", width: "100%", flexFlow: "row wrap"}}>
            <Dialog
                    title="Uploaded File"
                    actions={specificFilesActions}
                    modal={false}
                    open={this.state.specificFileOpen}
                    onRequestClose={this.handleCloseSpecificFile}
                    autoScrollBodyContent={true}
                >
                    <Subheader>File uploaded by user.</Subheader>
                    <br />
                    <Card>
                        <div>
                        {this.state.specificFile !== null ?                     
                                    <div>
                                        <Card>
                                            <CardTitle
                                                title={this.state.specificFile.datafile.split('/').pop()}
                                            />
                                            <CardMedia>
                                                {this.state.specificFile.datafile.split('.').pop() === "mp4" ?
                                                    <video controls>
                                                        <source src={this.state.specificFile.datafile} type="video/mp4" />
                                                    </video>
                                                    :
                                                    <img src={this.state.specificFile.datafile} alt="" />
                                                }
                                            </CardMedia>
                                            <br />
                                        </Card>
                                    </div>
                            //     )
                            // }
                            : null}
                            </div>
                    </Card>
                </Dialog>
            <span>Files: </span>
            {!this.isEmpty(this.props.task.files) ?
                this.props.task.files.map((f, i) => {
                    var fileName = f.datafile.split('/').pop();
                    var fileEnd = f.datafile.split('.').pop();
                    return (
                        <div key={fileName}>
                            <Card style={{width: 30, height: 30, marginLeft: 5, marginTop: 5, overflow: "hidden"}} onClick={(e) => {this.handleOpenSpecificFile(e,f)}}>                                
                                <CardMedia>
                                    {fileEnd === "mp4" ?
                                        // <video controls>
                                        //     <source src={f.datafile} type="video/mp4" />
                                        // </video>
                                        
                                        <PlayArrowIcon 
                                        // color="black"
                                        
                                        />
                                        :
                                        <img src={f.datafile} alt="" />
                                     }
                                </CardMedia>
                                <br />
                            </Card>
                        </div>
                    )
                })
                : <span style={{marginLeft: 5}}>None</span>}
                </div>
        ]
        return (
            <div>
                <div>
                    <ReplanComponent
                        replanOpen={this.state.replanOpen}
                        taskId={task.task}
                        task_display_name={task_display_name}
                        handleClosePlanning={this.handleClosePlanning}
                        student={this.props.student}
                        quest={this.props.quest}
                    />
                </div>
                    <TaskDialog
                        key={"task-dialog-" + student.id}
                        handleDialog={this.handleDialog}
                        color="white"
                        id={"task-dialog-" + student.id}
                        redirect={""}
                        title={task_display_name}
                        componentBlockId={task.task}
                        taskChildren={task.children}
                    >
                        <Card
                            style={containerStyle}
                            key={"task-listitem-" + student.id}
                        >
                            <div style={styles.gradeTaskComponentContainer} onClick={(e) => e.preventDefault}>
                                <div key={task.task + "first"} style={styles.gradeTaskComponentFirst}>
                                    <CardHeader
                                        title={task_display_name}
                                        subtitle={
                                        <div style={{ marginTop: 10 }}>     
                                                                              
                                            {"Approved: " + this.state.approvedText}
                                            <br />
                                            {"Grade: " + this.state.gradeText}
                                            <br /> 
                                            {RenderFileMiniatures}
                                        </div>
                                        }
                                    />
                                </div>
                                {this.props.task.homework === true ?
                                    <div key={task.task} style={styles.gradeTaskComponentMid}>
                                        <RadioButtonGroup
                                            key={"rbg-task-component" + student.id}
                                            name={"rbg-task-component" + student.id}
                                            valueSelected={this.state.selectedOption}
                                            onChange={this.handleChangeRadio}
                                            style={{ width: "250px" }}
                                        >
                                            {radios}
                                        </RadioButtonGroup>
                                        {
                                            this.state.commentOpen ?
                                                <div>
                                                    <TextField
                                                        name={"comment-" + student.id}
                                                        onClick={(e) => { e.stopPropagation() }}
                                                        floatingLabelText={"Comment on task."}
                                                        onChange={this.handleCommentChange} />
                                                </div>
                                                :
                                                null
                                        }
                                        <br />
                                    </div>
                                    :
                                    null
                                }
                                <div style={styles.gradeTaskComponentEnd}>
                                    {this.state.selectedOption ?
                                        this.state.selectedOption === gradeConstants.REJECT ?
                                            <RaisedButton
                                                label="Replan"
                                                labelPosition="before"
                                                style={styles.button}
                                                disabled={this.state.submitting}
                                                onClick={this.handleOpenReplan}
                                            /> :
                                            <RaisedButton
                                                label="Submit"
                                                labelPosition="before"
                                                style={styles.button}
                                                disabled={this.state.submitting}
                                                onClick={this.handleSubmit}
                                            />
                                        :
                                        null
                                    }
                                    {this.state.submitting === true ?
                                        <CircularProgress style={{ marginLeft: 10 }} size={30} thickness={3} />
                                        : null}
                                </div>
                            </div>
                        </Card>
                        <Divider />
                        <br />
                    </TaskDialog>            
            </div>
        )
    }
}
function mapStateToProps(state, props) {
    const { homework } = state.getHomeworkOnBlockById;
    const { setHomeworkResponse } = state.setHomework;
    const { homeworkFiles } = state.getHomeworkFiles;
    const studentHomework = homework[props.student.id];
    const taskHomework = studentHomework ? studentHomework.tasks[props.task.task] : null;
    return {
        setHomeworkResponse,
        // homework,
        homework: taskHomework,
        homeworkFiles
    }
}
const connectedGradeTaskComponent = connect(mapStateToProps)(GradeTaskComponent);
const GradeTaskComponentRouter = withRouter(connectedGradeTaskComponent);
export { GradeTaskComponentRouter as GradeTaskComponent };
