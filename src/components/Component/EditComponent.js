import Paper from 'material-ui/Paper';
import {TableRow, TableRowColumn} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';
import {NavLink} from 'react-router-dom';
import sanitizeHtml from 'sanitize-html';

import {coursesActions, sectionActions} from '../../actions';
import {namingConstants} from '../../constants';
import ErrorBoundary from '../ErrorBoundary';
import {HTMLEditor} from '../HTMLEditor';
import SyncValidationForm from '../SyncValidationForm';

class EditComponent extends Component {
    constructor(props) {
        super(props)
        this.courseID = null;

        this.state = {
            TypeText: namingConstants.COMPONENTS,
            category: 'video',
            display_name: "",
            data: "1",
            hasError: false
        };
        this.TableRowData = this.TableRowData.bind(this);
        this.courseID = null;
        this.sectionID = null;
    }

    componentWillMount() {
        const { dispatch } = this.props;

        this.courseID = this.props.location.pathname.split('/')[2];
        this.sectionID = this.props.location.pathname.split('/')[3];

        dispatch(coursesActions.getXBlockInfo(this.sectionID));

        this.setState({
            TypeText: this.typeToText()
        })
    }
    componentDidCatch(error, info) {
        
        
        this.setState({
            hasError: true,
            errorData: {
                error: error,
                info: info
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        
        
        if (!this.isEmpty(nextProps.xblockinfo)) {
            this.setState({
                display_name: nextProps.xblockinfo.display_name,
                data: nextProps.xblockinfo.data,
            })
        }
    }

    typeToText = () => {
        switch (this.props.Type) {
            case 'sections':
                return namingConstants.SECTION;
            case 'subsections':
                return namingConstants.SUBSECTION;
            case 'units':
                return namingConstants.UNITS;
            case 'components':
                return namingConstants.COMPONENTS;
            default:
                return 'Section';
        }
    };

    handleSubmitTemp = () => {
        this.props.history.goBack();
    };
    handleSubmit = (e) => {
        const { dispatch } = this.props;

        var sectionData = {
            section_id: this.sectionID,
            metadata: {
                display_name: e.section_name,
            },
            data: this.state.data,
            publish: "make_public"
        }

        dispatch(sectionActions.updateSectionById(this.sectionID, sectionData));

    }
    handleCancel = () => {
        this.props.history.goBack();
    }
    handleChange = (event, index, value) => this.setState({ value });
    handleSelectChange = (event, index, values) => this.setState({ values });

    //TODO: 2 methods if they use different fields in the fututre.
    handleVideoChange = (value) => {
        this.setState(
            {
                data: value
            }
        )
    }
    handleTextChange = (value) => {
        var result = sanitizeHtml(value, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
        });
        this.setState(
            {
                data: result
            }
        )
    }

    TableRowData = (props) => {
        return (
            <TableRow>
                <TableRowColumn><strong>{props.text}</strong></TableRowColumn>
                <TableRowColumn>
                    <TextField name={props.name} floatingLabelText={props.value} onChange={props.method} />
                </TableRowColumn>
            </TableRow>
        )
    };

    handleInputChange = (event) => {
        const target = event.target;

        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }


    render() {
        const {
            status,
            updateSectionResponse,
            fetchingXBlockInfo,
            xblockinfo,
            dispatch
        } = this.props;

        var xblockinfoData = xblockinfo.data === undefined ? null : xblockinfo.data;

        const showTextOrVideo = xblockinfo.category === 'video' ? (
            [
                <HTMLEditor handleChange={this.handleVideoChange} text={xblockinfoData} toolbar={{ options: ['link'] }} />]

        ) : (<HTMLEditor handleChange={this.handleTextChange} text={xblockinfoData} toolbar={{ options: ['inline', 'fontSize', 'fontFamily', 'colorPicker', 'image'] }} />)


        if (status === "success" && updateSectionResponse !== null) {
            
            var redirectTo = "/courses";
            if (this.courseID !== undefined && this.sectionID !== undefined) {
                
                redirectTo = "/" + this.props.Type + "/" + this.courseID + "/" + this.sectionID;
            }
            dispatch(sectionActions.clearUpdateSection());
            return (
                <Redirect to={redirectTo} />
            )
        }
        else {
            return (
                <ErrorBoundary>
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
                                            to={"/sections/" + this.courseID + "/" + xblockinfo.ancestor_info.ancestors[2].ident}
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
                                        <NavLink
                                            to={"/units/" + this.courseID + "/" + xblockinfo.ancestor_info.ancestors[0].id}
                                            className={'breadcrumb-navlink'}>
                                            {xblockinfo.ancestor_info.ancestors[0].display_name}
                                        </NavLink>
                                    </ul>
                                    <ul className={'breadcrumb'}>{xblockinfo['display_name'].trim() ? xblockinfo['display_name'] : "This component"}</ul>
                                </ol>
                            }
                        </div>

                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Paper className={"edtx-paper"} style={{ zDepth: 2 }}>
                                <h2>Edit {this.state.TypeText}</h2>
                                {xblockinfo && xblockinfo.display_name ?
                                    <SyncValidationForm onSubmit={this.handleSubmit} onCancel={this.handleCancel} fields={
                                        [

                                            { name: "display_name", label: this.state.TypeText + " Name", floatLabel: "Edit text", defaultValue: xblockinfo.display_name }
                                        ]

                                    } extras={[showTextOrVideo]}
                                    />
                                    : <br />}
                            </Paper>
                        </div>

                    </div>
                </ErrorBoundary>
            )
        }
    }
}


function mapStateToProps(state) {
    const {status, updateSectionResponse} = state.updateSection;
    const {section} = state.section;
    const {alert} = state;
    const {fetchingXBlockInfo, xblockinfo} = state.xblockinfos;

    return {
        alert,
        status,
        updateSectionResponse,
        section,
        fetchingXBlockInfo,
        xblockinfo
    };
}

const connectedEditComponent = connect(mapStateToProps)(EditComponent);
export {connectedEditComponent as EditComponent};
