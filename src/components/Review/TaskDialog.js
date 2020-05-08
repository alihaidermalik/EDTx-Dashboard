import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import { coursesActions } from '../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import Subheader from 'material-ui/Subheader';
import ComponentItem from './ComponentItem';
import { Divider } from 'material-ui';
import { gradeConstants} from '../../constants';

const customContentStyle = {
    width: '80%',
    maxWidth: 'none',
};
const styles = {
    headline: {
        padding: 10,
        fontWeight: 400,
    }
}
class TaskDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            mappedChildren: [],
            gradeableAssignments: []
        };
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.xblockinfo) {
            let xblockinfoArray = nextProps.xblockinfo.constructor === Array ? nextProps.xblockinfo : [nextProps.xblockinfo]
            var mappedChildren = this.props.taskChildren.filter(c => c.type !== "edx_sga").map((c) => {
                var foundHomeworkTask = xblockinfoArray.find((h) => h.id === c.task);
                if (foundHomeworkTask) {
                    return { ...c, ...foundHomeworkTask };
                }
                return c;
            });
            var gradeableAssignments = this.props.taskChildren.filter(c => c.type === "edx_sga");

            if (mappedChildren.length > 1) {
                //Merge html blocks into their previous block
                var htmlBlocks = mappedChildren.filter(c => c.type === "html");
                htmlBlocks.map(b => {
                    var index = mappedChildren.indexOf(b);
                    if (index > 0) {
                        var prevIndex = this.findPrevNonHtmlIndex(index, mappedChildren);
                        if (!!b.data) {
                            mappedChildren[prevIndex].extraHtml += b.data;
                        } else {
                            mappedChildren[prevIndex].extraHtml = ""
                        }                        
                    }
                    return b;
                })
            }
        }
        this.setState({
            mappedChildren: mappedChildren.filter(c => c.type !== "html"),
            gradeableAssignments: gradeableAssignments

        })
    }
    findPrevNonHtmlIndex = (index, mappedChildren) => {
        for (var i = index; i > 0; --i) {
            if (mappedChildren[i].type !== "html") {
                return i;
            }
        }
        return 0;
    }
    handleOpenDialog = (e) => {
        const { dispatch } = this.props;
        e.preventDefault();
        e.stopPropagation();
        this.setState({ open: true });
        dispatch(coursesActions.getXBlockInfo(this.props.componentBlockId));
    };
    handleClose = () => {
        this.setState({ open: false });
    };
    renderTaskView() {
        const { fetchingXBlockInfo, xblockinfo } = this.props;
        return (
            <div style={{ marginLeft: 50 }}>
                {fetchingXBlockInfo ?
                    <CircularProgress size={60} thickness={7} style={{ paddingLeft: "50%" }} />
                    :
                    <div>
                        {(xblockinfo === undefined || xblockinfo[0] === undefined || xblockinfo.length === 0) ?
                            null :
                            <div dangerouslySetInnerHTML={{ __html: xblockinfo[0]['data'] }}></div>
                        }
                       
                        <div>
                            <Divider></Divider>
                            <Subheader>Components on current task</Subheader>
                            {
                                this.state.mappedChildren.map((xblockinfo_sub, i) => (
                                    <ComponentItem xblockinfo={xblockinfo} xblockinfo_sub={xblockinfo_sub} num={i + 1} />
                                )
                                )
                            }
                        </div>
                        {(this.state.gradeableAssignments === undefined || this.state.gradeableAssignments.length === 0) ?
                            null :
                            <div>
                                <Divider></Divider>
                                <Subheader>Gradeable assignments on current task</Subheader>

                                {this.state.gradeableAssignments.map((assignment, i) => (
                                    [
                                        <h3 style={styles.headline}>{i + 1 + ". "} {assignment['title'].trim() ? assignment['title'] : "[No name specified]"}</h3>,

                                    ]
                                ))
                                }
                            </div>
                        }
                    </div>
                }
            </div>
        )
    }
    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Approve"
                primary={true}
                onClick={() => {
                    this.props.handleDialog(gradeConstants.ACCEPT);
                    this.handleClose();
                }}
            />,
            <FlatButton
                label="Reject"
                primary={true}
                onClick={() => {
                    this.props.handleDialog(gradeConstants.REJECT)
                    this.handleClose();
                }
                }
            />,
            <FlatButton
                label="Comment"
                primary={true}
                onClick={() => {
                    this.props.handleDialog(gradeConstants.ACCEPT_COMMENT)
                    this.handleClose();
                }
                }
            />
        ];
        return [
            <div className={this.props.className} onClick={this.handleOpenDialog}
                style={this.props.style ? this.props.style : null}>{this.props.children}
            </div>
            ,
            <Dialog
                title={"Task: " + this.props.title}
                actions={actions}
                modal={false}
                contentStyle={customContentStyle}
                open={this.state.open}
                onRequestClose={this.handleClose}
                autoScrollBodyContent={true}
                key={this.props.title + "-dialog"}
            >
                {this.renderTaskView()}
            </Dialog>
        ]
    }
}
function mapStateToProps(state) {
    const { fetchingXBlockInfo, xblockinfo } = state.xblockinfos;
    const { homework } = state.getHomework;
    return {
        fetchingXBlockInfo,
        xblockinfo,
        homework
    }
}
const connectedTaskDialog = connect(mapStateToProps)(TaskDialog);
const connectedTaskDialogWithRouter = withRouter(connectedTaskDialog);
export { connectedTaskDialogWithRouter as TaskDialog };