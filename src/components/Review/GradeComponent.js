
import React from 'react';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';
import { GradeTaskComponent } from './GradeTaskComponent';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { homeworkActions } from '../../actions';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

// import PlayArrowIcon from 'material-ui/svg-icons/av/play-arrow';

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
    gradeItemMiddle: {
        display: 'flex',
        flex: 1,
        justifyContent: "flex-end",
        width: "15%"
    },
    gradeItemEnd: {
        display: 'flex',
        flex: 1,
        justifyContent: "flex-end",
    },
    radioButton: {
        marginBottom: 5,
    },
    dontShowComment: { height: "120px" },
    showComment: { height: "200px" },
    showFilesButton: {
        // height: "36px",
        width:"120px"
    }
}
class GradeComponent extends React.Component {
    constructor(props) {
        super(props);
        //deep copy
        var obj1 = JSON.parse(JSON.stringify(this.props.tasks))
        let verticalTasks = obj1.filter((task, i) => {
            if (task.type === "vertical") {
                task.status = "Ungraded";
                task.color = "False";
            }
            return task;
        });
        this.state = {
            open: false,
            value: 1,
            commentOpen: false,
            verticalTasks: verticalTasks,
            mappedTasks: [],
            filesOpen: false,
            refresh: false,
            specificFile: null,

        };
        this.handleTaskSubmit = this.handleTaskSubmit.bind(this)
    };
    componentWillMount() {
        this.activityId = this.props.location.pathname.split('/')[2]
    }
    componentWillReceiveProps(nextProps)
    {
        if(!this.isEmpty(nextProps.homeworkFiles)){         
            this.state.verticalTasks.map(vt => {
                
                var result = nextProps.homeworkFiles.filter(obj => {
                    return obj.block_key === vt.task
                  })
                  vt.files = result;
                  return vt;
            })
        }
    }
    
    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    
    handleExpand = () => {
        this.setState({ open: !this.state.open });
        this.props.dispatch(homeworkActions.getHomeworkFiles(this.activityId, this.props.student.id))
    }
    handleTaskSubmit(){
        // this.setState({refresh: !this.state.refresh})
    }
    handleStatusUpdate = (task_id, value) => {
        var tasks = this.state.verticalTasks;
        var foundIndex = tasks.findIndex(x => x.task === task_id);
        if (!!tasks[foundIndex]) {
            tasks[foundIndex].status = value;
            this.setState({ verticalTasks: tasks });
        }
    }
    handleOpenFiles = (e) => {
        e.stopPropagation()
        this.setState({ filesOpen: true });
    }
    handleOpenSpecificFile = (e, file) => {
        e.stopPropagation()
        this.setState({ 
            specificFile: file,
            specificFileOpen: true });
    }
    handleCloseFiles = (status) => {
        this.setState({ filesOpen: false });
    };
    handleCloseSpecificFile = (status) => {
        this.setState({ specificFileOpen: false });
    };
    render() {
        const { student } = this.props;
        const filesActions = [
            <FlatButton
                label="Close"
                primary={true}
                onClick={this.handleCloseFiles}
            />
        ]
        const specificFilesActions = [
            <FlatButton
                label="Close"
                primary={true}
                onClick={this.handleCloseSpecificFile}
            />
        ]
        // const RenderFileMiniatures = [
        //     <div style={{display: "flex", alignItems: "center", marginLeft: 10, width: "100%", flexFlow: "row wrap", marginTop: "-5px"}}>
        //     {!this.isEmpty(this.props.homeworkFiles) ?
        //         this.props.homeworkFiles.map((f, i) => {
        //             var fileName = f.datafile.split('/').pop();
        //             var fileEnd = f.datafile.split('.').pop();
        //             return (
        //                 <div>
        //                     <Card style={{width: 30, height: 30, marginLeft: 5, marginTop: 5, overflow: "hidden"}} onClick={(e) => {this.handleOpenSpecificFile(e,f)}}>                                
        //                         <CardMedia>
        //                             {fileEnd === "mp4" ?
        //                                 // <video controls>
        //                                 //     <source src={f.datafile} type="video/mp4" />
        //                                 // </video>
                                        
        //                                 <PlayArrowIcon 
        //                                 // color="black"
                                        
        //                                 />
        //                                 :
        //                                 <img src={f.datafile} alt="" />
        //                              }
        //                         </CardMedia>
        //                         <br />
        //                     </Card>
        //                 </div>
        //             )
        //         })
        //         : null}
        //         </div>
        // ]
        return (
            <div>
                <Dialog
                    title="Uploaded Files"
                    actions={filesActions}
                    modal={false}
                    open={this.state.filesOpen}
                    onRequestClose={this.handleCloseFiles}
                    autoScrollBodyContent={true}
                >
                    <Subheader>Files uploaded by user.</Subheader>
                    <br />
                    <Card>
                        {!this.isEmpty(this.props.homeworkFiles) ?
                            this.props.homeworkFiles.map((f, i) => {
                                var fileName = f.datafile.split('/').pop();
                                var fileEnd = f.datafile.split('.').pop();
                                return (
                                    <div>
                                        <Card>
                                            <CardTitle
                                                title={fileName}
                                                // subtitle={"For block: " + f.block_key}
                                            />
                                            <CardMedia>
                                                {fileEnd === "mp4" ?
                                                    <video controls>
                                                        <source src={f.datafile} type="video/mp4" />
                                                    </video>
                                                    :
                                                    <img src={f.datafile} alt="" />
                                                }
                                            </CardMedia>
                                            <br />
                                        </Card>
                                    </div>
                                )
                            })
                            : null}
                    </Card>
                </Dialog>
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
                <div style={styles.taskArea} onClick={() => this.handleExpand()}>
                    <Subheader style={{ display: "flex", padding: "10px" }}>
                        <Avatar src={student.profile_image.image_url_small} style={{ marginRight: "10px" }} />
                        <div style={{ width: "33%" }}>
                            <span>{student.name}</span>
                        </div>                       
                        <IconButton onClick={this.handleOpen} style={styles.gradeItemEnd}>
                            <MoreVertIcon color="black" />
                        </IconButton>
                    </Subheader>
                    {this.state.open ?
                        [<div key="file-div">
                            <div style={{ padding: "16px" }}>
                                {this.props.status === "request" ?
                                    <CircularProgress size={30} thickness={3} />
                                    :
                                    !this.isEmpty(this.props.homeworkFiles) ?
                                    <div style={{display: "flex"}}>
                                    <div style={{height: 36}}>
                                        <RaisedButton
                                            label="Show files"
                                            labelPosition="before"
                                            style={styles.showFilesButton}
                                            onClick={this.handleOpenFiles}
                                        />
                                        </div>
                                        {/* {RenderFileMiniatures} */}
                                        </ div>
                                        :
                                        "No uploaded files."
                                }
                            </div>
                        </div>,
                        this.state.verticalTasks.map((task, i) =>
                            task.homework === true ? //&& task.status === "Ungraded" ?
                                <GradeTaskComponent
                                    task={task}
                                    student={student}
                                    handleStatusUpdate={this.handleStatusUpdate}
                                    handleTaskSubmit={this.handleTaskSubmit}
                                    quest={this.props.quest}
                                />
                                :
                                [
                                    // <Card style={{ backgroundColor: task.homework === false ? "#cccccc" : task.color }} onClick={(e) => { e.stopPropagation() }}
                                    // >
                                    //     <CardHeader
                                    //         title={task.title}
                                    //         subtitle={
                                    //             <div style={{ marginTop: 10 }}>
                                    //                 {"Homework: " + task.homework}
                                    //                 <br />
                                    //                 Status: {task.homework === false ? "Ungradeable" : task.status}
                                    //             </div>
                                    //         }
                                    //     />
                                    // </Card>
                                    // ,
                                    // <br />
                                ]
                        )]
                        : null
                    }
                </div>
            </div>
        )
    }
}
function mapStateToProps(state, props) {
    const { homework } = state.getHomework;
    const { homeworkFiles, status } = state.getHomeworkFiles;
    return {
        status,
        homeworkFiles: homeworkFiles[props.student.id],
        homework: homework[props.student.id],
    }
}
const connectedGradeComponent = connect(mapStateToProps)(GradeComponent);
const GradeComponentRouter = withRouter(connectedGradeComponent);
export { GradeComponentRouter as GradeComponent };
