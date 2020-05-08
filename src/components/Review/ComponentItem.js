import React from 'react';
import { Card, CardMedia, CardText } from 'material-ui/Card';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';
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
    dontShowComment: { height: "120px" },
    showComment: { height: "200px" },
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
    headline: {        
        fontWeight: 400,
      },
}
export default class ComponentItem extends React.Component {
    state = {
        open: false,
    };
    componentWillMount() {
        if(this.props.num && this.props.num === 1){
            this.setState({
                open: true
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        //
    }
    handleExpand = () => {
        
        //
        this.setState({ open: !this.state.open });
    }
    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    render() {
        const { xblockinfo_sub, num } = this.props;
        
        
        return (
            <div>
                <Card onClick={() => this.handleExpand()}>
                    {/* <CardTitle 
                        className="component-card-title"
                        title={num + ". " + xblockinfo_sub['display_name'].trim() ? xblockinfo_sub['display_name'] : "No name specified"}
                        subtitle={xblockinfo_sub['category'] + ": " + xblockinfo_sub['id']}
                        
                    /> */}
                    <div style={{ display: "flex", padding: "10px", alignItems: "center" }}>
                        <div style={{ width: "33%" }}>
                            <h2 style={styles.headline}>{num + ". "} {xblockinfo_sub['display_name'] ? xblockinfo_sub['display_name'] : "[No name specified]"}</h2>
                        </div>
                        <div style={styles.gradeItemMiddle}>
                            <span >Type: {xblockinfo_sub['type']} </span>
                        </div>
                        <div style={styles.gradeItemMiddle}>
                            <span >Done: {xblockinfo_sub['done'] ? "Yes" : "No"} </span>
                        </div>
                        {/* <div style={styles.gradeItemEnd}>
                            Datafile: {!this.isEmpty(xblockinfo_sub['datafile']) ? "Yes" : "No"}
                        </div> */}
                        <div style={styles.gradeItemMiddle}>
                            <span >Homework: {xblockinfo_sub['homework'] ? "Yes" : "No"} </span>
                        </div>
                        {/* <div style={styles.gradeItemMiddle}>
                            <span >Value/Hours(Budget): {xblockinfo_sub['budget'] ? xblockinfo_sub['budget'] : "No"} </span>
                        </div> */}
                        <IconButton onClick={this.handleOpen} style={styles.gradeItemEnd}>
                            <MoreVertIcon color="black" />
                        </IconButton>
                    </div>
                    {xblockinfo_sub['category'] === 'video' ?
                        <div>
                            {this.state.open ?
                            <div>
                                <CardMedia>
                                    <iframe width="560"  height="315"
                                        src={"https://www.youtube.com/embed/" + xblockinfo_sub['metadata']["youtube_id_1_0"]}
                                        frameBorder="0"
                                        allow="autoplay; encrypted-media"
                                        title={xblockinfo_sub['id']}
                                        allowFullScreen>
                                    </iframe>
                                </CardMedia>
                                <CardText>
                                <div dangerouslySetInnerHTML={{ __html: xblockinfo_sub['extraHtml'] }}></div>
                                </CardText>
                                </div>
                                : null}
                        </div>
                        :
                        <div>
                            {/* <CardTitle 
                                className="component-card-title"
                                title={xblockinfo_sub['display_name'].trim() ? num + ". " +  xblockinfo_sub['display_name'] : num  + ". " + "No name specified"}                                          
                                subtitle={xblockinfo_sub['category'] + ": " + xblockinfo_sub['id']}
                            />                                */}
                            {this.state.open ?
                                <CardText>
                                    <div dangerouslySetInnerHTML={{ __html: xblockinfo_sub['data'] }}></div>
                                </CardText>
                                : null}
                        </div>
                    }
                </Card>
            </div>
        )
    }
}