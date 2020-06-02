import React from 'react';

import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import ActionInfo from 'material-ui/svg-icons/action/info';
import IconButton from 'material-ui/IconButton';
import { grey400 } from 'material-ui/styles/colors';

const styles = {
    insetListItem: {
        marginLeft: "50px"
    },
    tooltipContainer: {
        height: 200,
        width: 200,
        fontSize: 10,
        // lineHeight: "1.6"
    },
    tooltipText: {

        whiteSpace: "initial",
    },
    tooltipAvatar: {
        marginTop: 10
    },
    selectAll: {
        color: "rgba(0, 0, 0, 0.54)",
        marginLeft: "50px"
    },
    taskArea: {
        width: "100%"
    },
}
export default class CohortListItemComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    handleOpen = event => {
        event.stopPropagation();

        this.setState({ open: !this.state.open });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    handleClick = event => {
        event.stopPropagation();
        event.preventDefault();
        this.props.onCheck(null, !this.props.value, this.props.cohort)
    }

    render() {
        const { cohort } = this.props;
       
        return (


            <div style={styles.taskArea} 
             onClick={this.handleClick}
            >
                <Subheader style={{ display: "flex", padding: "10px" }}>
                    <div style={{ width: "66%" }}>
                        <span>{cohort.name}</span>
                    </div>
                   
                        <div>

                    <IconButton onClick={this.handleOpen} style={styles.gradeItemEnd}>
                    <ActionInfo color={grey400} />
                    </IconButton>
                        </div>
                </Subheader>
                {this.state.open ?
                    <div key="file-div" style={{lineHeight: "1.4em"}}>                        
                        {/* <div>Info on {cohort.first_name + " " + cohort.last_name}</div> */}
                        {/* <div style={styles.tooltipText}><span><b>Enrolled users: </b></span><span>{cohort.courses.map((c) => { return c.course_details.course_name }).toString()}</span></div> */}
                    </div>                        
                    : null
                }
            </div>
        )

    }
}
