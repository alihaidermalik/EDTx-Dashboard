import Chip from 'material-ui/Chip';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavLink, withRouter} from 'react-router-dom';

import {questsActions} from '../../actions';
import DeleteDialog from '../DeleteDialog';
import moment from "moment";
import FlatButton from 'material-ui/FlatButton';


const styles = theme => ({
    submitButton: {
        margin: 12,
    },
    alignItems: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    chip: {
        margin: 4,
    },
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
});


class Quest extends Component {
    constructor() {
        super();
        this.state = {};
    }

    componentWillMount() {
        const {dispatch, location} = this.props;
        this.questID = location.pathname.split('/')[2];

        dispatch(questsActions.getQuestDetails(this.questID));
    }


    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    handleDelete = () => {
        this.props.dispatch(
            questsActions.deleteQuest(this.questID)
        );
    }


    renderCohorts() {
        return (
            <div style={{display: 'flex', flexWrap: 'wrap',}}>
                {this.props.quest.cohort
                    ?
                    this.props.quest.cohort.users.map((user) => ([
                            <Chip
                                key={user.id}
                                style={{margin: 4}}
                            >
                                {user.name}
                            </Chip>
                        ]
                    ))
                    :
                    null
                }
            </div>
        )


    }

    renderTasks(homework = false) {
        return (
            <div style={{display: 'flex', flexWrap: 'wrap',}}>
                {this.props.quest.group
                    ?
                    this.props.quest.group.tasks.map((task, i) => {
                        if(task.homework === homework){                        
                            return ([
                                <Chip
                                    key={"chip-task-" + i}
                                    style={{margin: 4}}
                                >
                                    {task.title}
                                </Chip>,
                                <br/>
                            ] )
                        }
                        else{
                            return null;
                        }
                    })
                    :
                    null
                }

            </div>
        )
    }
    goBack = () => {
        this.props.history.goBack();
    }
    render() {
        const {fetching} = this.props;
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <br/>
                <Paper className={"edtx-paper"} style={{paddingLeft: "5%", zDepth: 2}}>
                    <div style={{display: "flex", width: "100%", alignItems: "center"}}>
                        <div style={{ flex: 1 }}>                           
                            <FlatButton label="Go Back" onClick={this.goBack}/>
                        </div>
                        <div key="grade-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                        <h2 style={{
                            width: "100%",
                            fontSize: "2em",
                            padding: "0 0.3em 0.3em 0.3em"
                        }}>Activity Details</h2>
                        <NavLink to={"/edit_quest/" + this.questID} key={this.questID}>
                            <IconButton><EditIcon/></IconButton>
                        </NavLink>
                        <DeleteDialog
                            deleteAction={this.handleDelete}
                            id={this.questID}
                            style={{cursor: 'pointer'}}
                        >
                            <DeleteIcon/>
                        </DeleteDialog>
                        </div>
                        <div style={{ flex: 1 }}></div>

                    </div>
                    {fetching ?
                        <div>
                            <CircularProgress size={60} thickness={7}/>
                        </div>
                        :

                        <div style={{
                            display: "flex",
                            flexWrap: 'wrap',
                            justifyContent: 'space-around',
                            width: "100%"
                        }}>

                            <Table>
                                <TableHeader
                                    displaySelectAll={false}
                                    adjustForCheckbox={true}
                                >
                                    <TableRow>
                                        <TableHeaderColumn>Setting</TableHeaderColumn>
                                        <TableHeaderColumn>Value</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody displayRowCheckbox={false} onCellClick>
                                    {this.props.quest ? [
                                            <TableRow selectable={false}>
                                                <TableRowColumn>Activity Name</TableRowColumn>
                                                <TableRowColumn>{this.props.quest.name ? this.props.quest.name: this.props.quest.comment}</TableRowColumn>
                                            </TableRow>,
                                            <TableRow selectable={false}>
                                                <TableRowColumn>Time Start</TableRowColumn>
                                                <TableRowColumn>{moment(this.props.quest.date).format('YYYY-MM-DD HH:mm')}</TableRowColumn>
                                            </TableRow>,
                                            <TableRow selectable={false}>
                                                <TableRowColumn>Time End</TableRowColumn>
                                                <TableRowColumn>{moment(this.props.quest.end_date).format('YYYY-MM-DD HH:mm')}</TableRowColumn>
                                            </TableRow>,
                                            <TableRow selectable={false}>
                                                <TableRowColumn>Training Center</TableRowColumn>
                                                <TableRowColumn>{this.props.quest.center ? this.props.quest.center.name : ""}</TableRowColumn>
                                            </TableRow>,
                                            <TableRow selectable={false}>
                                                <TableRowColumn>Training Center Resources</TableRowColumn>
                                                <TableRowColumn>
                                                {this.props.quest.traning_center_resources ? 
                                                this.props.quest.traning_center_resources.map((r) => {return r.facilitie + ", "})
                                                : null
                                                }
                                            </TableRowColumn>
                                            </TableRow>,
                                            //TODO: If they want this to be displayed lookup the name instead of the id
                                            
                                            
                                            
                                            
                                            <TableRow selectable={false}>
                                                <TableRowColumn>Participants</TableRowColumn>
                                                <TableRowColumn>
                                                    {this.renderCohorts()}
                                                </TableRowColumn>
                                            </TableRow>,
                                            <TableRow selectable={false}>
                                                <TableRowColumn>Tasks</TableRowColumn>
                                                <TableRowColumn style={styles.wrapper}>
                                                    {this.renderTasks(false)}
                                                </TableRowColumn>
                                            </TableRow>,
                                            <TableRow selectable={false}>
                                            <TableRowColumn>Homework</TableRowColumn>
                                                <TableRowColumn style={styles.wrapper}>
                                                    {this.renderTasks(true)}
                                                </TableRowColumn>
                                             </TableRow>
                                        ]
                                        :
                                        <TableRow selectable={false}>
                                            <TableRowColumn>No activity data in database.</TableRowColumn>
                                        </TableRow>
                                    }

                                </TableBody>
                            </Table>
                        </div>
                    }
                </Paper>
            </div>
        )
    }

}

function mapStateToProps(state) {
    const {fetching, quest} = state.questDetails;

    return {
        fetching,
        quest,
    };
}

const connectedQuest = connect(mapStateToProps)(Quest);
const QuestRouter = withRouter(connectedQuest);

export {QuestRouter as Quest};
