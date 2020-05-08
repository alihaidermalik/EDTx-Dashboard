import {Card, CardMedia, CardText, CardTitle} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import TextField from 'material-ui/TextField';
import React, {Component} from 'react';
import {isMobile} from 'react-device-detect';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';

import {coursesActions} from '../../actions';
import {DeleteSectionDialog} from '../DeleteSectionDialog';
import {HTMLEditor} from '../HTMLEditor';


const styles = theme => ({
    submitButton: {
        margin: 12,
    },
    alignItems: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});

class ComponentPage extends Component {
    constructor() {
        super();
        this.courseID = null;
        this.componentBlockId = null;
        this.state = {
            showEdit: false
        }
    }

    componentWillMount() {
        const {dispatch, location} = this.props;

        this.courseID = location.pathname.split('/')[2];
        this.componentBlockId = location.pathname.split('/')[3];

        dispatch(coursesActions.getXBlockInfo(this.componentBlockId));

    }

    handleClick = ({showEdit = this.state.showEdit ? false : true}) => this.setState({showEdit});

    render() {
        const {fetchingXBlockInfo, xblockinfo} = this.props;
        const showEdit = this.state.showEdit;
        
        return (
            <div>
                <div className={"breadcrumbs"}>
                    {fetchingXBlockInfo ?
                        <br/> :
                        <ol className={"breadcrumbs-list"}>
                            <ul className={'breadcrumb'}>
                                <NavLink to={"/courses/" + this.courseID} className={'breadcrumb-navlink'}>
                                    {xblockinfo.ancestor_info.ancestors[3].display_name}
                                </NavLink>
                            </ul>
                            <ul className={'breadcrumb'}>
                                <NavLink
                                    to={"/sections/" + this.courseID + "/" + xblockinfo.ancestor_info.ancestors[2].id}
                                    className={'breadcrumb-navlink'}>
                                    {xblockinfo.ancestor_info.ancestors[2].display_name}
                                </NavLink>
                            </ul>
                            <ul className={'breadcrumb'}>
                                <NavLink
                                    to={"/subsections/" + this.courseID + "/" + xblockinfo.ancestor_info.ancestors[1].id}
                                    className={'breadcrumb-navlink'}>
                                    {xblockinfo.ancestor_info.ancestors[1].display_name}
                                </NavLink>
                            </ul>
                            <ul className={'breadcrumb'}>
                                <NavLink to={"/units/" + this.courseID + "/" + xblockinfo.ancestor_info.ancestors[0].id}
                                         className={'breadcrumb-navlink'}>
                                    {xblockinfo.ancestor_info.ancestors[0].display_name}
                                </NavLink>
                            </ul>
                            <ul className={'breadcrumb'}>{xblockinfo['display_name'].trim() ? xblockinfo['display_name'] : "This component"}</ul>
                        </ol>
                    }
                </div>
                <div className="component-page-wrapper">
                    <br/>
                    <Card className="component-card">
                        {!showEdit ? (
                            <div>
                                {fetchingXBlockInfo ?
                                    <CircularProgress size={60} thickness={7}/>
                                    :
                                    <div>
                                        {xblockinfo['category'] === 'video' ?
                                            <div>
                                                <CardTitle className="component-card-title"
                                                           title={xblockinfo['display_name'].trim() ? xblockinfo['display_name'] : "No Component Name"}
                                                           subtitle={isMobile ? "" : xblockinfo['category'] + ": " + xblockinfo['id']}/>
                                                <NavLink
                                                    to={"/edit_component/" + this.courseID + "/" + this.componentBlockId}
                                                    key={this.componentBlockId}>
                                                    <IconButton onClick={this.handleClick}><EditIcon/></IconButton>
                                                </NavLink>
                                                {fetchingXBlockInfo ? null :
                                                    <DeleteSectionDialog
                                                        courseID={this.courseID}
                                                        sectionID={this.componentBlockId}
                                                        redirect={"/units/" + this.courseID + "/" + xblockinfo.ancestor_info.ancestors[0].section_url}
                                                    />
                                                }
                                                <CardMedia>
                                                    <iframe width="560" height="315"
                                                            src={"https://www.youtube.com/embed/" + xblockinfo['metadata']["youtube_id_1_0"]}
                                                            frameBorder="0"
                                                            allow="autoplay; encrypted-media"
                                                            title={xblockinfo['id']}
                                                            allowFullScreen>
                                                    </iframe>
                                                </CardMedia>
                                            </div>
                                            :
                                            <div>
                                                <div className="component-card-header">
                                                    <CardTitle className="component-card-title"
                                                               title={xblockinfo['display_name'].trim() ? xblockinfo['display_name'] : "No name specified"}
                                                    />
                                                    <NavLink
                                                        to={"/edit_component/" + this.courseID + "/" + this.componentBlockId}
                                                        key={this.componentBlockId}>
                                                        <IconButton onClick={this.handleClick}><EditIcon/></IconButton>
                                                    </NavLink>
                                                    {fetchingXBlockInfo ? null :
                                                        <DeleteSectionDialog
                                                            courseID={this.courseID}
                                                            sectionID={this.componentBlockId}
                                                            redirect={"/units/" + this.courseID + "/" + xblockinfo.ancestor_info.ancestors[0].section_url}
                                                        />
                                                    }
                                                </div>
                                                <CardText>
                                                    <div dangerouslySetInnerHTML={{__html: xblockinfo['data']}}></div>
                                                </CardText>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>) : (
                            <Card style={{maxWidth: "100%"}}>
                                <div style={{padding: "1.2em"}}>
                                    <br/>
                                    <TextField
                                        style={{
                                            height: "3em",
                                            fontSize: "1.6em"
                                        }}
                                        fullWidth={true}
                                        value={xblockinfo['display_name'].trim() ? xblockinfo['display_name'] : "No name specified"}
                                    />
                                    <br/>
                                </div>
                                <HTMLEditor text={(xblockinfo['data'])}/>
                                <RaisedButton label="Submit" style={styles.submitButton} onClick={this.handleSubmit}
                                              backgroundColor={'#364D7C'}
                                              labelColor='#fff'
                                />
                            </Card>
                        )}

                        <br/>
                    </Card>
                </div>
            </div>
        )
    }

}

function mapStateToProps(state) {
    const {fetchingXBlockInfo, xblockinfo} = state.xblockinfos;
    return {
        fetchingXBlockInfo,
        xblockinfo
    };
}

const connectedComponentPage = connect(mapStateToProps)(ComponentPage);
export {connectedComponentPage as ComponentPage};
