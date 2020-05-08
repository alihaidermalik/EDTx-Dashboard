/* eslint-disable */
import React, {Component} from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import { Dropdown, DropdownButton, Container, Row, Col, NavDropdown, Form, Button, Badge, Alert, ButtonToolbar, Table, Modal,Tab, Tabs,Image  } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
import CKEditor from 'ckeditor4-react';
import { connect } from 'react-redux';
// import { alertActions } from '../../actions';
import {certificateFilterActions} from '../../actions/certificateFilters.actions';
import swal from 'sweetalert';

import {
    ExcelExport,
    ExcelExportColumn,
} from '@progress/kendo-react-excel-export';

class CertificatesData extends Component {
    constructor(props) {
        super(props);
        this.goAddNewCourse = this.goAddNewCourse.bind(this);
        this.addCertificateToRole = this.addCertificateToRole.bind(this);
        this.addCertificateToUser = this.addCertificateToUser.bind(this);
        this.exportData = this.exportData.bind(this);
        this.addCertificateToInternalCourse = this.addCertificateToInternalCourse.bind(this);
        this.addCertificateToExternalCourse = this.addCertificateToExternalCourse.bind(this);
        this.addExternalCourse = this.addExternalCourse.bind(this);
        this.state = {
            activePage: 1,
            perPageLimit: 10,
            default_perPageLimit: "No of pages",
            rows_count: 0,
            isDesc: false,
            column: '',
            dropdown_default_connect_user_filter:"Select User",
            dropdown_default_connect_role_filter:"Select Role",
            dropdown_default_connect_internal_course_filter:"Select Internal Course",
            dropdown_default_connect_external_course_filter:"Select External Course",
            dropdown_default_certificate:"Select Certificate",
            dropdown_default_role:"Select Role",
            dropdown_default_status:"Select Status",
            dropdown_default_type:"Select Type",
            dropdown_default_version:"Select Version",
            dropdown_default_profession:"Select Profession",
            certificates:"",
            certificates_rows: [],
            temp_certificates_rows: [],
            certificates_list : "",
            certificate_type_list : "",
            type_name : "",
            course_details : "",
            comments : "",
            profession_name : "",
            profession_list : "",
            version_name : "",
            version_list : "",
            roles_list : "",
            certificate_name : "",
            temp: "",
            filter_result : "",
            internal_course_list : "",
            internal_course_id: "",
            external_course_list : "",
            external_course_id : "",
            ext_course_name : "",
            ext_course_url : "",
            ext_course_vendor : "",
            ext_course_cost : "",
            filterationObj : {
                "role_name": "",
                "certificate_name": "",
                "status": "",
                "string": "",
                "type_name": "",
                "profession_name": "",
                "version": "",
            },
            role_id : "",
            openConnectUser : false,
            openConnectRole : false,
            openConnectInternalCourse : false,
            openConnectExternalCourse : false,
            openAddExternalCourse : false,
            user_list : "",
            user_id : "",
            element: ""
        };
    }

    componentDidMount() {
        this.reAssignFiltersFromState();
        this.getCertificateList();
        this.getCertificateListFilter();
        this.getRolesList();
        this.getCertificateTypeList();
        this.getProfessionList();
        this.getUsersList();
        this.getInternalCourseList();
        this.getExternalCourseList();
    }
    exportData() {
        var inputs = document.getElementsByTagName("input");
        var certificate_ids = [];
        for (let k = 0; k < inputs.length; k++) {
            if (inputs[k].type == "checkbox"&&inputs[k].value!=-1&&inputs[k].checked) {
                certificate_ids.push(inputs[k].value);
            }
        }

        /*let allCertificatesData = this.state.certificates;
        let certificateRows = [];
        for(let l=0;l<certificate_ids.length;l++) {
            for (let i = 0; i < allCertificatesData.length; i++) {
                if(allCertificatesData[i].id == certificate_ids[l]) {
                    for (let j = 0; j < allCertificatesData[i].certificate_rows.length; j++) {
                        certificateRows.push(allCertificatesData[i].certificate_rows[j]);
                    }
                }
            }
        }*/

        // let certificateRows = this.state.certificates_rows;

        let allCertificates = this.state.certificates;
        let certificatesRows = [];
        if(allCertificates.length>0) {
            allCertificates.forEach(function (certificate) {
                certificate.certificate_rows.forEach(function (row) {
                    certificatesRows.push(row);
                });
            });
        }

        const exportElement = [
            <ExcelExport
                data={certificatesRows}
                // group={group}
                fileName="Certificates.xlsx"
                ref={(exporter) => { this._exporter = exporter; }}
            >
                <ExcelExportColumn field="id" title="Certificate ID" locked={true} width={150} />
                <ExcelExportColumn field="name" title="Certificate Name" width={300} />
                <ExcelExportColumn field="role" title="Role" width={300} />
                <ExcelExportColumn field="type" title="Type" width={350} />
                <ExcelExportColumn field="profession" title="Profession" width={350} />
                <ExcelExportColumn field="version" title="Version" width={350} />
                <ExcelExportColumn field="status" title="Status" width={350} />
                <ExcelExportColumn field="valid_months" title="Valid Months" width={350} />
                <ExcelExportColumn field="expiration_days" title="Exiration Days" width={350} />
                <ExcelExportColumn field="training_hours" title="Training Hours" width={350} />
                <ExcelExportColumn field="external_course" title="External Courses" width={350} />
                <ExcelExportColumn field="internal_course" title="Internal Courses" width={350} />
            </ExcelExport>
        ]
        this.setState({
            element:exportElement
        })
        setTimeout(this.export,1);
    }
    storeState = () => {
        const {dispatch} = this.props;
        dispatch(certificateFilterActions.setFiltersValues(this.state.filterationObj, "certificates"));
    };
    reAssignFiltersFromState =()=>{
        const {filterationObj} = this.props;
        if(filterationObj) {
            let newObj = this.state.filterationObj;
            let keys = Object.keys(filterationObj);
            for (let i = 0; i < keys.length; i++) {
                if (newObj[keys[i]] != undefined) {
                    newObj[keys[i]] = filterationObj[keys[i]];
                    if (filterationObj[keys[i]] != "" && filterationObj[keys[i]] != null) {
                        if (keys[i] == "certificate_name") {
                            this.setState({
                                dropdown_default_certificate: filterationObj[keys[i]]
                            })
                        }
                        else if (keys[i] == "role_name") {
                            this.setState({
                                dropdown_default_role: filterationObj[keys[i]]
                            })
                        }
                        else if (keys[i] == "status") {
                            this.setState({
                                dropdown_default_status: filterationObj[keys[i]]
                            })
                        }
                        else if (keys[i] == "type_name") {
                            this.setState({
                                dropdown_default_type: filterationObj[keys[i]]
                            })
                        }
                        else if (keys[i] == "profession_name") {
                            this.setState({
                                dropdown_default_profession: filterationObj[keys[i]]
                            })
                        }
                        else if (keys[i] == "version") {
                            this.setState({
                                dropdown_default_version: filterationObj[keys[i]]
                            })
                        }
                        else if (keys[i] == "string") {
                            this.setState({
                                searchList: filterationObj[keys[i]]
                            })
                        }
                    }
                }
            }

            this.setState({
                filterationObj: newObj
            });
        }
    }

    getCertificateListFilter(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_certificate_list", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.length>0){
                      this.setState({ certificates_list: result });
                    }
                    
            },

            (error) => {

            }
        )
    }
    getCertificateTypeList() {
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_certificate_type_list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({certificate_type_list: result});
                },

                (error) => {

                }
            )
    }

    getCertificateList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_certificate_list_main", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    let allCertificates = result;
                    let allCertificatesRows = [];
                    let certificatesRows = [];
                    let perPageLimit = this.state.perPageLimit;
                    let rows_count= 0;
                    if(allCertificates.length>0) {
                        allCertificates.forEach(function (certificate) {
                            certificate.certificate_rows.forEach(function (row) {
                                rows_count = rows_count + 1;
                                allCertificatesRows.push(row);
                                if(rows_count <= perPageLimit) {
                                    certificatesRows.push(row);
                                }
                            });
                        });
                    }
                    this.setState({
                        certificates: result,
                        certificates_rows: certificatesRows,
                        temp_certificates_rows: allCertificatesRows,
                        rows_count: rows_count,
                        temp :  result
                    });
                    this.filterResult();
            },

            (error) => {

            }
        )
    }
    getRolesList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_roles", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ roles_list: result });
                },

                (error) => {

                }
            )
    }
    getVersionsList(name){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_certificate_version_list/"+name, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ version_list: result });
                },
                (error) => {

                }
            )
    }
    getProfessionList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_profession_list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ profession_list: result });
                },

                (error) => {

                }
            )
    }
    getUsersList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ user_list: result});
                },

                (error) => {

                }
            )
    }
    getInternalCourseList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_internal_course_list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ internal_course_list: result });
                },

                (error) => {

                }
            )
    }

    getExternalCourseList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_external_course_list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ external_course_list: result });
                },

                (error) => {

                }
            )
    }
    addCertificateToUser(){
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        var inputs = document.getElementsByTagName("input");
        var certificate_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                certificate_ids.push(inputs[i].value);
            }
        }
        if(this.state.user_id =="" || this.state.user_id==null){
            // dispatch(alertActions.error("Select Users To Be Connected"));
            /*this.setState({
                openConnectUser: false,
                user_id: "",
            });*/
            swal({
                title: "Error!",
                text: "Select Users To Be Connected!",
                icon: "error",
            });
            return;
        }
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/connect_certificates_user", {
            method: "POST",
            body:JSON.stringify({
                'certificate_id': certificate_ids,
                'user_id': this.state.user_id
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        openConnectUser: false,
                        activePage: 1
                    });
                    // dispatch(alertActions.success("User Connected Successfully"));
                    this.getCertificateList();
                    swal({
                        title: "Success!",
                        text: "User Connected Successfully!",
                        icon: "success",
                    });
                },

                (error) => {
                    this.setState({ openConnectUser: false });
                    // dispatch(alertActions.error("Unable To Connect User"));
                    swal({
                        title: "Error!",
                        text: "Unable To Connect User!",
                        icon: "error",
                    });
                }
            )
    }
    addCertificateToRole(){
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        var inputs = document.getElementsByTagName("input");
        var certificate_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                certificate_ids.push(inputs[i].value);
            }
        }
        if(this.state.role_id =="" || this.state.role_id==null){
            // dispatch(alertActions.error("Select Roles To Be Connected"));
            /*this.setState({
                openConnectRole: false,
                role_id: "",
            });*/
            swal({
                title: "Error!",
                text: "Select Roles To Be Connected!",
                icon: "error",
            });
            return;
        }
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/connect_certificate_role", {
            method: "POST",
            body:JSON.stringify({
                'certificate_id': certificate_ids,
                'role_id': this.state.role_id,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        openConnectRole: false,
                        activePage: 1
                    });
                    // dispatch(alertActions.success("Role Connected Successfully"));
                    this.getCertificateList();
                    swal({
                        title: "Success!",
                        text: "Role Connected Successfully!",
                        icon: "success",
                    });
                },

                (error) => {
                    this.setState({ openConnectRole: false });
                    // dispatch(alertActions.error("Unable To Connect Role"));
                    swal({
                        title: "Error!",
                        text: "Unable To Connect Role!",
                        icon: "error",
                    });
                }
            )
    }
    addCertificateToInternalCourse(){
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        var inputs = document.getElementsByTagName("input");
        var certificate_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                certificate_ids.push(inputs[i].value);
            }
        }
        if(this.state.internal_course_id =="" || this.state.internal_course_id==null){
            // dispatch(alertActions.error("Select Internal Courses To Be Connected"));
            /*this.setState({
                openConnectInternalCourse: false,
                internal_course_id: "",
            });*/
            swal({
                title: "Error!",
                text: "Select Internal Courses To Be Connected!",
                icon: "error",
            });
            return;
        }
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/connect_certificates_internal_course", {
            method: "POST",
            body:JSON.stringify({
                'certificate_id': certificate_ids,
                'internal_course_id': this.state.internal_course_id,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        openConnectInternalCourse: false,
                        activePage: 1
                    });
                    // dispatch(alertActions.success("Internal Course Connected Successfully"));
                    this.getCertificateList();
                    swal({
                        title: "Success!",
                        text: "Internal Course Connected Successfully!",
                        icon: "success",
                    });
                },

                (error) => {
                    this.setState({ openConnectInternalCourse: false });
                    // dispatch(alertActions.error("Unable To Connect Internal Course"));
                    swal({
                        title: "Error!",
                        text: "Unable To Connect Internal Course!",
                        icon: "error",
                    });
                }
            )
    }
    addCertificateToExternalCourse(){
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        var inputs = document.getElementsByTagName("input");
        var certificate_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                certificate_ids.push(inputs[i].value);
            }
        }
        if(this.state.external_course_id =="" || this.state.external_course_id==null){
            // dispatch(alertActions.error("Select External Courses To Be Connected"));
            /*this.setState({
                openConnectExternalCourse: false,
                external_course_id: "",
            });*/
            swal({
                title: "Error!",
                text: "Select External Courses To Be Connected!",
                icon: "error",
            });
            return;
        }
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/connect_certificates_external_course", {
            method: "POST",
            body:JSON.stringify({
                'certificate_id': certificate_ids,
                'external_course_id': this.state.external_course_id,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        openConnectExternalCourse: false,
                        activePage: 1
                    });
                    // dispatch(alertActions.success("External Course Connected Successfully"));
                    this.getCertificateList();
                    swal({
                        title: "Success!",
                        text: "External Course Connected Successfully!",
                        icon: "success",
                    });
                },

                (error) => {
                    this.setState({ openConnectExternalCourse: false });
                    // dispatch(alertActions.error("Unable To External Course"));
                    swal({
                        title: "Error!",
                        text: "Unable To External Course!",
                        icon: "error",
                    });
                }
            )
    }
    addExternalCourseQuerry(image){
        var inputs = document.getElementsByTagName("input");
        var certificate_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                certificate_ids.push(inputs[i].value);
            }
        }
        /*'description' : document.getElementById("course_details").value,
            'comments' : document.getElementById("comments").value*/
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_certificate_external_course", {
            method: "POST",
            body:JSON.stringify({
                'certificate_id': certificate_ids,
                'image': image,
                'name' : this.state.ext_course_name,
                'description' : this.state.course_details,
                'vendor' : this.state.ext_course_vendor,
                'course_url' : this.state.ext_course_url,
                'cost' : this.state.ext_course_cost,
                'comments' : this.state.comments
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ external_course_list: result, openAddExternalCourse: false  });
                },

                (error) => {

                }
            )
    }
    openConnectUser = () => {
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        var inputs = document.getElementsByTagName("input");
        var certificate_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                certificate_ids.push(inputs[i].value);
            }
        }
        if(certificate_ids.length<1){
            // dispatch(alertActions.error("Select At Least One Certificate"));
            // this.setState({openConnectUser: false});
            swal({
                title: "Error!",
                text: "Select At Least One Certificate!",
                icon: "error",
            });
            return;
        }
        this.setState({ openConnectUser: true });
    };

    closeConnectUser = () => {
        this.setState({ openConnectUser: false,user_id: "" });
    };
    handleChangeUser = (id,name) => {
        this.setState({
            user_id: id,
            dropdown_default_connect_user_filter: name
        });
    };

    openConnectRole = () => {
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        var inputs = document.getElementsByTagName("input");
        var certificate_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                certificate_ids.push(inputs[i].value);
            }
        }
        if(certificate_ids.length<1){
            // dispatch(alertActions.error("Select At Least One Certificate"));
            swal({
                title: "Error!",
                text: "Select At Least One Certificate!",
                icon: "error",
            });
            // this.setState({openConnectRole: false});
            return;
        }
        this.setState({ openConnectRole: true });
    };

    closeConnectRole = () => {
        this.setState({ openConnectRole: false,role_id: "" });
    };
    handleChangeConnectRole = (id,name) => {
        this.setState({
            role_id: id,
            dropdown_default_connect_role_filter: name
        });
    };

    openConnectInternalCourse = () => {
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        var inputs = document.getElementsByTagName("input");
        var certificate_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                certificate_ids.push(inputs[i].value);
            }
        }
        if(certificate_ids.length<1){
            // dispatch(alertActions.error("Select At Least One Certificate"));
            swal({
                title: "Error!",
                text: "Select At Least One Certificate!",
                icon: "error",
            });
            // this.setState({openConnectInternalCourse: false});
            return;
        }
        this.setState({ openConnectInternalCourse: true });
    };

    closeConnectInternalCourse = () => {
        this.setState({ openConnectInternalCourse: false,internal_course_id: "" });
    };
    handleChangeInternalCourse = (id,name) => {
        this.setState({
            internal_course_id: id,
            dropdown_default_connect_internal_course_filter: name
        });
    };

    openConnectExternalCourse = () => {
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        var inputs = document.getElementsByTagName("input");
        var certificate_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                certificate_ids.push(inputs[i].value);
            }
        }
        if(certificate_ids.length<1){
            // dispatch(alertActions.error("Select At Least One Certificate"));
            swal({
                title: "Error!",
                text: "Select At Least One Certificate!",
                icon: "error",
            });
            // this.setState({openConnectExternalCourse: false});
            return;
        }
        this.setState({ openConnectExternalCourse: true });
    };

    closeConnectExternalCourse = () => {
        this.setState({ openConnectExternalCourse: false,external_course_id: "" });
    };
    handleChangeExternalCourse = (id,name) => {
        this.setState({
            external_course_id: id,
            dropdown_default_connect_external_course_filter: name
        });
    };
    handleClickOpenExternalCourse = () => {
        this.setState({ openAddExternalCourse: true });
    };

    handleCloseExternalCourse = () => {
        this.setState({ openAddExternalCourse: false });
    };

    addExternalCourse(){
        this.readURLCourse(document.getElementById("course_image"))
    }

    readURLCourse(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                this.addExternalCourseQuerry(e.target.result);
            }.bind(this);
            reader.readAsDataURL(input.files[0]);
        }
    }



    handleChangeCertificate(id,name) {
        this.setState({
            certificate_name: name,
            dropdown_default_certificate: name
        });
        let filterationObj = this.state.filterationObj;
        filterationObj.certificate_name = name;
        this.setState({
            filterationObj: filterationObj
        })
        this.filterResult();
        this.getVersionsList(name);
    };
    handleRoleChange(id,name) {
        this.setState({
            role_name: name,
            dropdown_default_role: name
        });
        let filterationObj = this.state.filterationObj;
        filterationObj.role_name = name;
        this.setState({
            filterationObj: filterationObj
        })
        this.filterResult();
    };
    handleChangeStatus (value,defaultVal) {
        this.setState({
            status_name: value,
            dropdown_default_status: defaultVal,
        });
        let filterationObj = this.state.filterationObj;
        filterationObj.status = value;
        this.setState({
            filterationObj: filterationObj
        })
        this.filterResult();

    };
    handleTypeChange (id,name) {
        this.setState({
            type_name: name,
            dropdown_default_type: name
        });
        let filterationObj = this.state.filterationObj;
        filterationObj.type_name = name;
        this.setState({
            filterationObj: filterationObj
        })
        this.filterResult();

    };
    handleVersionChange(value) {
        this.setState({
            version_name: value,
            dropdown_default_version: value
        });
        let filterationObj = this.state.filterationObj;
        filterationObj.version = value;
        this.setState({
            filterationObj: filterationObj
        })
        this.filterResult();

    };
    handleProfessionChange(name) {
        this.setState({
            profession_name: name,
            dropdown_default_profession: name
        });
        let filterationObj = this.state.filterationObj;
        filterationObj.profession_name = name;
        this.setState({
            filterationObj: filterationObj
        })
        this.filterResult();

    };
    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.searchList();
        }
    }
    handleChangeSearchList = (event) => {
        this.setState({
            searchList: event.target.value,
        });
        if(event.target.value==""){
            this.setState({
                filter_result: "",
            });
        }
    }

    searchClear = () => {
        let filterationObj = this.state.filterationObj;
        filterationObj.role_name = "";
        filterationObj.certificate_name = "";
        filterationObj.status = "";
        filterationObj.string = "";
        filterationObj.version = "";
        filterationObj.profession_name = "";
        filterationObj.type_name = "";

        /*let allCertificates = this.state.temp;
        let certificatesRows = [];
        allCertificates.forEach(function (certificate) {
            certificate.certificate_rows.forEach(function (row) {
                certificatesRows.push(row);
            });
        });*/
        let allCertificates = this.state.temp;
        let certificatesRows = [];
        let allCertificatesRows = [];
        let perPageLimit = this.state.perPageLimit;
        let rows_count= 0;
        allCertificates.forEach(function (certificate) {
            certificate.certificate_rows.forEach(function (row) {
                rows_count = rows_count + 1;
                allCertificatesRows.push(row);
                if(rows_count <= perPageLimit) {
                    certificatesRows.push(row);
                }
            });
        });
        this.setState({
            certificates_rows: certificatesRows,
            temp_certificates_rows: allCertificatesRows,
            activePage: 1,
            rows_count: rows_count,
            certificates: this.state.temp,
            searchList : "",
            filter_result : "",
            role_name : "",
            certificate_name : "",
            status_name : "",
            profession_name : "",
            version_name : "",
            version_list : "",
            type_name : "",
            dropdown_default_certificate:"Select Certificate",
            dropdown_default_role:"Select Role",
            dropdown_default_status:"Select Status",
            dropdown_default_type:"Select Type",
            dropdown_default_version:"Select Version",
            dropdown_default_profession:"Select Profession",
            filterationObj: filterationObj
        })
    }
    searchList = () => {
        var searchValue = this.state.searchList.toString().toLowerCase();
        let filterationObj = this.state.filterationObj;
        filterationObj.string = searchValue;
        this.setState({
            filterationObj: filterationObj
        })
        this.filterResult();
    }
    filterResult=()=> {
        this.storeState();
        let filterationObj = this.state.filterationObj;
        let filterdBefore = 0;
        var data = this.state.temp;
        var filter_result = [];

        if(filterationObj.certificate_name!=null && filterationObj.certificate_name!="") {
            filterdBefore = 1;
            for (let i = 0; i < data.length; i++) {
                if (data[i].data.name == filterationObj.certificate_name) {
                    filter_result.push(data[i]);
                }
            }
        }
        if(filterationObj.type_name!=null && filterationObj.type_name!="") {
            let innerData = filter_result;
            let inner_filter_result = [];
            if(filterdBefore == 0){
                filterdBefore = 1;
                innerData = data;
            }
            for (let i = 0; i < innerData.length; i++) {
                if (innerData[i].data.type_name == filterationObj.type_name) {
                    inner_filter_result.push(innerData[i]);
                }
            }
            filter_result = inner_filter_result;
        }
        if(filterationObj.version!=null && filterationObj.version!="") {
            let innerData = filter_result;
            let inner_filter_result = [];
            if(filterdBefore == 0){
                filterdBefore = 1;
                innerData = data;
            }
            for (let i = 0; i < innerData.length; i++) {
                if (innerData[i].data.version == filterationObj.version) {
                    inner_filter_result.push(innerData[i]);
                }
            }
            filter_result = inner_filter_result;
        }
        if(filterationObj.profession_name!=null && filterationObj.profession_name!="") {
            let innerData = filter_result;
            let inner_filter_result = [];
            if(filterdBefore == 0){
                filterdBefore = 1;
                innerData = data;
            }
            for (let i = 0; i < innerData.length; i++) {
                if (innerData[i].data.profession_name == filterationObj.profession_name) {
                    inner_filter_result.push(innerData[i]);
                }
            }
            filter_result = inner_filter_result;
        }
        if(filterationObj.role_name!=null && filterationObj.role_name!="") {
            let innerData = filter_result;
            let inner_filter_result = [];
            if(filterdBefore == 0){
                filterdBefore = 1;
                innerData = data;
            }
            for (let i = 0; i < innerData.length; i++) {
                if (innerData[i].roles.length > 0) {
                    for (let j = 0; j < innerData[i].roles.length; j++) {
                        if (innerData[i].roles[j].name == filterationObj.role_name) {
                            inner_filter_result.push(innerData[i]);
                            break;
                        }
                    }
                }
            }
            filter_result = inner_filter_result;
        }
        if(filterationObj.status!=null && filterationObj.status!="") {
            let innerData = filter_result;
            let inner_filter_result = [];
            if(filterdBefore == 0){
                innerData = data;
            }
            if(filterationObj.status == "active") {
                filterdBefore = 1;
                for (let i = 0; i < innerData.length; i++) {
                    if (innerData[i].data.status == 1) {
                        inner_filter_result.push(innerData[i]);
                    }
                }
            }
            else if(filterationObj.status == "notActive") {
                filterdBefore = 1;
                for (let i = 0; i< innerData.length ; i++){
                    if(innerData[i].data.status == 0){
                        inner_filter_result.push(innerData[i]);
                    }
                }
            }
            else{
                if(filterdBefore == 0){
                    filterdBefore = 1;
                    inner_filter_result = data;
                }
                else{
                    inner_filter_result = filter_result;
                }
            }
            filter_result = inner_filter_result;
        }
        if(filterationObj.string!="" && filterationObj.string!=null) {
            let innerData = filter_result;
            let inner_filter_result = [];
            if(filterdBefore == 0){
                filterdBefore = 1;
                innerData = data;
            }
            let searchValue = filterationObj.string;
            for (let i = 0; i< innerData.length ; i++){
                if(innerData[i].data.name!=null&&(innerData[i].data.name.toLowerCase().includes(searchValue))){
                    inner_filter_result.push(innerData[i]);
                }else if(innerData[i].data.description!=null&&(innerData[i].data.description.toLowerCase().includes(searchValue))){
                    inner_filter_result.push(innerData[i]);
                }else if(innerData[i].data.work_description!=null&&(innerData[i].data.work_description.toLowerCase().includes(searchValue))){
                    inner_filter_result.push(innerData[i]);
                }else if(innerData[i].roles.length>0){
                    for(var j = 0; j< innerData[i].roles.length; j++){
                        if(innerData[i].roles[j].name.toLowerCase().includes(searchValue)){
                            inner_filter_result.push(innerData[i]);
                            break;
                        }
                    }
                }
            }
            filter_result = inner_filter_result;
        }
        if(filterdBefore == 0){
            filter_result = data;
        }


        /*let allCertificates = filter_result;
        let certificatesRows = [];
        allCertificates.forEach(function (certificate) {
            certificate.certificate_rows.forEach(function (row) {
                certificatesRows.push(row);
            });
        });*/
        let allCertificates = filter_result;
        let allCertificatesRows = [];
        let certificatesRows = [];
        let perPageLimit = this.state.perPageLimit;
        let rows_count= 0;
        if(allCertificates.length>0) {
            allCertificates.forEach(function (certificate) {
                certificate.certificate_rows.forEach(function (row) {
                    rows_count = rows_count + 1;
                    allCertificatesRows.push(row);
                    if (rows_count <= perPageLimit) {
                        certificatesRows.push(row);
                    }
                });
            });
        }

        this.setState({
            certificates: filter_result,
            certificates_rows: certificatesRows,
            temp_certificates_rows: allCertificatesRows,
            rows_count: rows_count,
            filter_result : filter_result,
            activePage: 1
        });
    }
    handleChangeAll(e){
        var inputs = document.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1) {
                inputs[i].checked = e.target.checked;
                // This way it won't flip flop them and will set them all to the same value which is passed into the function
            }
        }
    }


    goAddNewCourse = () => {
        const redirectTo = "/add_new_certificate"
        this.props.props.props.history.push(redirectTo);
    }

    sortByColoumn =(property)=> {
        let isDesc = !this.state.isDesc;
        this.setState({
            isDesc: !this.state.isDesc,
            column: property,
            default_perPageLimit: "All",
            activePage: 1
        })

        let direction = this.state.isDesc ? 1 : -1;

        let savedRrecords = this.state.temp_certificates_rows;
        // console.log(savedRrecords);
        let records = [];
        savedRrecords.forEach(function (rec) {
            if(records.length>0){
                let chk = 0;
                for(let i=0;i<records.length;i++){
                    if(rec["object_id"] == records[i].object_id){
                        chk = 1;
                    }
                    else if(i == records.length-1 && chk == 0){
                        records.push(rec);
                    }
                }
            }
            else{
                records.push(rec);
            }
        });
        if (property == "id" || property == "valid_months" || property == "expiration_days" || property == "training_hours") {
            records.sort(function (a, b) {
                if (a[property] < b[property]) {
                    return -1 * direction;
                }
                else if (a[property] > b[property]) {
                    return 1 * direction;
                }
                else {
                    return 0;
                }
            });
        }
        else {
            records.sort(function (a, b) {
                if(a[property] == null){
                    a[property] = "";
                }
                if(b[property] == null){
                    b[property] = "";
                }
                if ((a[property].toString().toLowerCase()) < (b[property].toString().toLowerCase())) {
                    return -1 * direction;
                }
                else if ((a[property].toString().toLowerCase()) > (b[property].toString().toLowerCase())) {
                    return 1 * direction;
                }
                else {
                    return 0;
                }
            });
        }

        let newRecords = [];
        records.forEach(function (record) {
            savedRrecords.forEach(function (record2) {
                if (record["object_id"] == record2["object_id"]) {
                    newRecords.push(record2);
                }
            });
        });

        this.setState({
            certificates_rows: newRecords,
            temp_certificates_rows: newRecords,
            rows_count: newRecords.length, // to hide pagination control
            perPageLimit: newRecords.length, // to hide pagination control
            default_perPageLimit: "All",
            activePage: 1
        });
    }
    handlePageChange = (pageNumber) => {
        let allCertificateRows = this.state.temp_certificates_rows;
        let newCertificatesRows = [];
        let startIndex= 0;
        let endIndex= this.state.perPageLimit - 1;
        let perPageLimit = this.state.perPageLimit;
        if(pageNumber != 1){
            startIndex = (pageNumber * perPageLimit) - perPageLimit;
            endIndex = (pageNumber * perPageLimit) - 1;
        }
        let rows_count = 0;
        for(let i=0;i<allCertificateRows.length;i++){
                if(rows_count>=startIndex && rows_count<=endIndex){
                    newCertificatesRows.push(allCertificateRows[i]);
                }
                rows_count = rows_count + 1;
        }

        this.setState({
            activePage: pageNumber,
            certificates_rows: newCertificatesRows
        });
    }
    handlePerPageLimit = (noOfLinesLimit) => {
        let allCertificateRows = this.state.temp_certificates_rows;
        let newCertificatesRows = [];
        let startIndex= 0;
        let endIndex= noOfLinesLimit;
        let perPageLimit = noOfLinesLimit;
        let default_perPageLimit = noOfLinesLimit;
        let rows_count = 0;
        for(let i=0;i<allCertificateRows.length;i++){

                rows_count = rows_count + 1;
                if(noOfLinesLimit == 0){
                    newCertificatesRows.push(allCertificateRows[i]);
                }
                else{
                    if(rows_count>=startIndex && rows_count<=endIndex){
                        newCertificatesRows.push(allCertificateRows[i]);
                    }
                }
        }
        if(noOfLinesLimit == 0){  // all lines
            perPageLimit = rows_count;
            default_perPageLimit = "All";
        }
        this.setState({
            default_perPageLimit: default_perPageLimit,
            perPageLimit: perPageLimit,
            activePage: 1,
            certificates_rows: newCertificatesRows,
            rows_count: rows_count
        });
    }


    _exporter;
    export = () => {
        this._exporter.save();
    }

    render() {

      const FreeTextSearch = [
          <div>
              <form className="" style={{width: '80%'}}>
                  <Form.Row style={{paddingLeft: 0, paddingBottom: 0}}>
                      <Form.Group as={Col}>
                          <Dropdown>
                              <Dropdown.Toggle>
                                  {this.state.dropdown_default_certificate}
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                  {this.state.certificates_list ? this.state.certificates_list.map(certificate => (
                                          <Dropdown.Item value={certificate.name} onClick={(id,name) => {this.handleChangeCertificate(certificate.id,certificate.name)}}>{certificate.name}</Dropdown.Item>
                                      ))

                                      :
                                      <Dropdown.Item value="">No Certificate</Dropdown.Item>
                                  }
                            </Dropdown.Menu>
                          </Dropdown>
                      </Form.Group>

                      <Form.Group as={Col}>
                          <Dropdown>
                              <Dropdown.Toggle>
                                  {this.state.dropdown_default_role}
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                  {this.state.roles_list ? this.state.roles_list.map(role => (
                                          <Dropdown.Item value={role.name} onClick={(id,name) => {this.handleRoleChange(role.id,role.name)}}>{role.name}</Dropdown.Item>
                                      ))

                                      :
                                      <Dropdown.Item value="">No Role</Dropdown.Item>
                                  }
                              </Dropdown.Menu>
                          </Dropdown>
                      </Form.Group>

                      <Form.Group as={Col}>
                          <Dropdown>
                              <Dropdown.Toggle>
                                  {this.state.dropdown_default_status}
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                  <Dropdown.Item value="all" onClick={(event) => {this.handleChangeStatus("all","All")}}>All</Dropdown.Item>
                                  <Dropdown.Item value="active" onClick={(event) => {this.handleChangeStatus("active","Active")}}>Active</Dropdown.Item>
                                  <Dropdown.Item value="notActive" onClick={(event) => {this.handleChangeStatus("notActive","Not Active")}}>Not Active</Dropdown.Item>
                              </Dropdown.Menu>
                          </Dropdown>
                      </Form.Group>

                      <Form.Group as={Col}>
                          <Dropdown>
                              <Dropdown.Toggle>
                                  {this.state.dropdown_default_type}
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                  {this.state.certificate_type_list ? this.state.certificate_type_list.map(type => (
                                          <Dropdown.Item value={type.name} onClick={(id,name) => {this.handleTypeChange(type.id,type.name)}}>{type.name}</Dropdown.Item>
                                      ))

                                      :
                                      <Dropdown.Item value="">No Type</Dropdown.Item>
                                  }
                              </Dropdown.Menu>
                          </Dropdown>
                      </Form.Group>
                  </Form.Row>


                  <Form.Row style={{paddingLeft: 0, paddingTop: 0}}>
                      <Form.Group as={Col}>
                          <Dropdown style={{marginTop: 0}}>
                              <Dropdown.Toggle>
                                  {this.state.dropdown_default_version}
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                  {this.state.version_list ? this.state.version_list.map(version => (
                                          <Dropdown.Item value={version.version} onClick={(event) => {this.handleVersionChange(version.version)}}>{version.version}</Dropdown.Item>
                                      ))

                                      :
                                      <Dropdown.Item value="">No Version</Dropdown.Item>
                                  }
                              </Dropdown.Menu>
                          </Dropdown>
                      </Form.Group>

                      <Form.Group as={Col}>
                          <Dropdown  style={{marginTop: 0}}>
                              <Dropdown.Toggle>
                                  {this.state.dropdown_default_profession}
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                  {this.state.profession_list ? this.state.profession_list.map(profession => (
                                          <Dropdown.Item value={profession.name} onClick={(name) => {this.handleProfessionChange(profession.name)}}>{profession.name}</Dropdown.Item>
                                      ))

                                      :
                                      <Dropdown.Item value="">No Profession</Dropdown.Item>
                                  }
                              </Dropdown.Menu>
                          </Dropdown>
                      </Form.Group>

                      <Form.Group as={Col}>
                          <Form.Control type="text" placeholder="Enter Search String" value={this.state.searchList}
                                        onChange={(event) => {this.handleChangeSearchList(event)}} onKeyPress={this.handleKeyPress}
                          />
                      </Form.Group>

                      <Form.Group as={Col}>
                          <div>
                              <Button variant="outline-primary" onClick={this.searchList} style={{marginRight: 10}}>
                                  <i class="fa fa-search" aria-hidden="true"></i>Search
                              </Button>
                              <Button variant="outline-primary" onClick={this.searchClear}>
                                  <i class="fa fa-times" aria-hidden="true"></i>Clear
                              </Button>
                          </div>

                      </Form.Group>
                  </Form.Row>

              </form>
          </div>

        ]

        return (
            <div style={{width: '99%', marginLeft:15}}>
            {FreeTextSearch}
              <ButtonToolbar style={{marginBottom: 15}}>
                  <Button variant="outline-primary" onClick={this.goAddNewCourse} style={{marginRight : 10, marginBottom: 10}}>
                    Add New Certificate
                  </Button>
                  <Button variant="outline-primary" onClick={this.openConnectUser} style={{marginRight : 10, marginBottom: 10}}>
                      Connect User
                  </Button>
                  <Button variant="outline-primary" onClick={this.openConnectRole} style={{marginRight : 10, marginBottom: 10}}>
                      Connect Role
                  </Button>
                  <Button variant="outline-primary" onClick={this.openConnectInternalCourse} style={{marginRight : 10, marginBottom: 10}}>
                      Connect Internal Course
                  </Button>
                  <Button variant="outline-primary" onClick={this.openConnectExternalCourse} style={{marginRight : 10, marginBottom: 10}}>
                      Connect External Course
                  </Button>
                  <Button variant="outline-primary" onClick={this.handleClickOpenExternalCourse} style={{marginRight : 10, marginBottom: 10}}>
                      Add New External Course
                  </Button>
                  <Button variant="outline-primary" onClick={this.exportData} style={{marginBottom: 10}}>
                      Export Data
                  </Button>
                  {this.state.element}
              </ButtonToolbar>

                {this.state.rows_count > 10 ?
                    <Row style={{justifyContent: 'flex-end', width: '100%', margin: 0, marginBottom: 10}}>
                        <Dropdown style={{marginTop: 0, width: '15%'}}>
                            <Dropdown.Toggle>
                                {this.state.default_perPageLimit}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item value="10" onClick={(lines) => {
                                    this.handlePerPageLimit(10)
                                }}>10</Dropdown.Item>
                                <Dropdown.Item value="20" onClick={(lines) => {
                                    this.handlePerPageLimit(20)
                                }}>20</Dropdown.Item>
                                <Dropdown.Item value="30" onClick={(lines) => {
                                    this.handlePerPageLimit(30)
                                }}>30</Dropdown.Item>
                                <Dropdown.Item value="40" onClick={(lines) => {
                                    this.handlePerPageLimit(40)
                                }}>40</Dropdown.Item>
                                <Dropdown.Item value="50" onClick={(lines) => {
                                    this.handlePerPageLimit(50)
                                }}>50</Dropdown.Item>
                                <Dropdown.Item value="all" onClick={(lines) => {
                                    this.handlePerPageLimit(0)
                                }}>All</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                    </Row> :
                    ''
                }
                <Table striped hover size="sm" bordered>
                    <thead>
                    <tr>
                        <th style={{width:'3%', padding: '1%', paddingTop: '1.3%'}}> <input type="checkbox" value="-1" onChange={e => this.handleChangeAll(e)} /></th>
                        <th style={{width:'5%', textAlign: 'left'}} onClick={()=>{this.sortByColoumn('id')}}>ID
                            <i className={this.state.column!='id'?
                                "fa fa-sort": (this.state.column == 'id' && !this.state.isDesc)?
                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                               aria-hidden="true" style={{marginLeft: 5}}></i>
                        </th>
                        <th style={{width:'6%'}} onClick={()=>{this.sortByColoumn('version')}}>Version
                            <i className={this.state.column!='version'?
                                "fa fa-sort": (this.state.column == 'version' && !this.state.isDesc)?
                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                               aria-hidden="true" style={{marginLeft: 5}}></i>
                        </th>
                        <th style={{width:'11%'}} onClick={()=>{this.sortByColoumn('name')}}>Name
                            <i className={this.state.column!='name'?
                                "fa fa-sort": (this.state.column == 'name' && !this.state.isDesc)?
                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                               aria-hidden="true" style={{marginLeft: 5}}></i>
                        </th>
                        <th style={{width:'6%'}} onClick={()=>{this.sortByColoumn('type')}}>Type
                            <i className={this.state.column!='type'?
                                "fa fa-sort": (this.state.column == 'type' && !this.state.isDesc)?
                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                               aria-hidden="true" style={{marginLeft: 5}}></i>
                        </th>
                        <th style={{width:'7%'}} onClick={()=>{this.sortByColoumn('profession')}}>Profession
                            <i className={this.state.column!='profession'?
                                "fa fa-sort": (this.state.column == 'profession' && !this.state.isDesc)?
                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                               aria-hidden="true" style={{marginLeft: 5}}></i>
                        </th>
                        <th style={{width:'12'}} onClick={()=>{this.sortByColoumn('description')}}>Description
                            <i className={this.state.column!='description'?
                                "fa fa-sort": (this.state.column == 'description' && !this.state.isDesc)?
                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                               aria-hidden="true" style={{marginLeft: 5}}></i>
                        </th>
                        <th style={{width:'5%'}} onClick={()=>{this.sortByColoumn('status')}}>Status
                            <i className={this.state.column!='status'?
                                "fa fa-sort": (this.state.column == 'status' && !this.state.isDesc)?
                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                               aria-hidden="true" style={{marginLeft: 5}}></i>
                        </th>
                        <th style={{width:'5%'}} onClick={()=>{this.sortByColoumn('valid_months')}}>Valid Time
                            <i className={this.state.column!='valid_months'?
                                "fa fa-sort": (this.state.column == 'valid_months' && !this.state.isDesc)?
                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                               aria-hidden="true" style={{marginLeft: 5}}></i>
                        </th>
                        <th style={{width:'5%'}} onClick={()=>{this.sortByColoumn('expiration_days')}}>Expiration Notice
                            <i className={this.state.column!='expiration_days'?
                                "fa fa-sort": (this.state.column == 'expiration_days' && !this.state.isDesc)?
                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                               aria-hidden="true" style={{marginLeft: 5}}></i>
                        </th>
                        <th style={{width:'5%'}} onClick={()=>{this.sortByColoumn('training_hours')}}>Training Minimum
                            <i className={this.state.column!='training_hours'?
                                "fa fa-sort": (this.state.column == 'training_hours' && !this.state.isDesc)?
                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                               aria-hidden="true" style={{marginLeft: 5}}></i>
                        </th>
                        <th style={{width:'10%'}} onClick={()=>{this.sortByColoumn('role')}}>Connected Roles
                            <i className={this.state.column!='role'?
                                "fa fa-sort": (this.state.column == 'role' && !this.state.isDesc)?
                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                               aria-hidden="true" style={{marginLeft: 5}}></i>
                        </th>
                        <th style={{width:'10%'}} onClick={()=>{this.sortByColoumn('internal_course')}}>Internal Courses
                            <i className={this.state.column!='internal_course'?
                                "fa fa-sort": (this.state.column == 'internal_course' && !this.state.isDesc)?
                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                               aria-hidden="true" style={{marginLeft: 5}}></i>
                        </th>
                        <th style={{width:'10%'}} onClick={()=>{this.sortByColoumn('external_course')}}>External Courses
                            <i className={this.state.column!='external_course'?
                                "fa fa-sort": (this.state.column == 'external_course' && !this.state.isDesc)?
                                    'fa fa-sort-asc':'fa fa-sort-desc'}
                               aria-hidden="true" style={{marginLeft: 5}}></i>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.certificates_rows.map(certificate_row => (
                        <tr>
                            <td>
                                {certificate_row.checkbox && <input type="checkbox" value={certificate_row.object_id} />}
                            </td>
                            <td style={{textAlign: 'left'}}>{certificate_row.id}</td>
                            <td>{certificate_row.version}</td>
                            <td>
                                <Link to={{pathname: '/view_certificate/'+certificate_row.object_id}}>{certificate_row.name}</Link>
                            </td>
                            <td>{certificate_row.type}</td>
                            <td>{certificate_row.profession}</td>
                            <td dangerouslySetInnerHTML={{__html: certificate_row.description}}></td>
                            {certificate_row.status =="" && <td>{certificate_row.status}</td>}
                            {certificate_row.status =="Active" && <td style={{background:'#66BB6A'}}>{certificate_row.status}</td>}
                            {certificate_row.status =="Not Active" && <td style={{background:'#EF5350'}}>{certificate_row.status}</td>}
                            <td>{certificate_row.valid_months}</td>
                            <td>{certificate_row.expiration_days}</td>
                            <td>{certificate_row.training_hours}</td>
                            {certificate_row.role!=""&&
                            <td>
                                <ul style={{textAlign: 'left', margin: 0}}>
                                    <li>{certificate_row.role}</li>
                                </ul>
                            </td>}
                            {certificate_row.role==""&&<td>{certificate_row.role}</td>}
                            {certificate_row.internal_course!=""&&
                            <td>
                                <ul style={{textAlign: 'left', margin: 0}}>
                                    <li>{certificate_row.internal_course}</li>
                                </ul>
                            </td>}
                            {certificate_row.internal_course==""&&<td>{certificate_row.internal_course}</td>}
                            {certificate_row.external_course!=""&&
                            <td>
                                <ul style={{textAlign: 'left', margin: 0}}>
                                    <li>{certificate_row.external_course}</li>
                                </ul>
                            </td>}
                            {certificate_row.external_course==""&&<td>{certificate_row.external_course}</td>}
                        </tr>))}
                    </tbody>
                </Table>
                {this.state.rows_count > this.state.perPageLimit ?
                    <div style={{float: 'right'}}>
                        <Pagination
                            prevPageText=' < '
                            nextPageText=' > '
                            firstPageText='First'
                            lastPageText='Last'
                            activePage={this.state.activePage}
                            itemsCountPerPage={this.state.perPageLimit}
                            totalItemsCount={this.state.rows_count}
                            pageRangeDisplayed={5}
                            onChange={this.handlePageChange}
                            breakClassName={'break-me'}
                            marginPagesDisplayed={2}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                        />
                    </div> :
                    ''
                }


                {/* CONNECT USER MODAL*/}
                <Modal show={this.state.openConnectUser} onHide={this.closeConnectUser}
                       aria-labelledby="contained-modal-title-vcenter" size="sm"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Connect User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>
                                    <Dropdown style={{marginTop: 0}}>
                                        <Dropdown.Toggle>
                                            {this.state.dropdown_default_connect_user_filter}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="customScrollToDropDowns">
                                            {this.state.user_list ? this.state.user_list.map(user => (
                                                    <Dropdown.Item value={user.id} onClick={(id,name) => {this.handleChangeUser(user.id,user.username)}}>{user.username}</Dropdown.Item>
                                                ))

                                                :
                                                <Dropdown.Item value="">No User</Dropdown.Item>
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                            </Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeConnectUser}>
                                    Cancel
                                </Button>
                                {this.state.showLoadingConnectUser ?
                                    <div style={{position: 'relative', margin: '-45px 20px -10px 90px'}}>
                                        <CircularProgress size={40} thickness={7}
                                                          style={{marginLeft: '17%'}}/>
                                    </div> :
                                    <Button variant="outline-primary" onClick={this.addCertificateToUser} style={{marginLeft: 5}}>
                                        Connect
                                    </Button>
                                }
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* CONNECT ROLE MODAL*/}
                <Modal show={this.state.openConnectRole} onHide={this.closeConnectRole}
                       aria-labelledby="contained-modal-title-vcenter" size="sm"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Connect Role</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>
                                    <Dropdown style={{marginTop: 0}}>
                                        <Dropdown.Toggle>
                                            {this.state.dropdown_default_connect_role_filter}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="customScrollToDropDowns">
                                            {this.state.roles_list ? this.state.roles_list.map(role => (
                                                    <Dropdown.Item value={role.id} onClick={(id,name) => {this.handleChangeConnectRole(role.id,role.name)}}>{role.name}</Dropdown.Item>
                                                ))

                                                :
                                                <Dropdown.Item value="">No Role</Dropdown.Item>
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                            </Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeConnectRole}>
                                    Cancel
                                </Button>
                                {this.state.showLoadingConnectUser ?
                                    <div style={{position: 'relative', margin: '-45px 20px -10px 90px'}}>
                                        <CircularProgress size={40} thickness={7}
                                                          style={{marginLeft: '17%'}}/>
                                    </div> :
                                    <Button variant="outline-primary" onClick={this.addCertificateToRole} style={{marginLeft: 5}}>
                                        Connect
                                    </Button>
                                }
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* CONNECT INTERNAL COURSE MODAL*/}
                <Modal show={this.state.openConnectInternalCourse} onHide={this.closeConnectInternalCourse}
                       aria-labelledby="contained-modal-title-vcenter" size="sm"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Connect Internal Course</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>
                                    <Dropdown style={{marginTop: 0}}>
                                        <Dropdown.Toggle>
                                            {this.state.dropdown_default_connect_internal_course_filter}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="customScrollToDropDowns">
                                            {this.state.internal_course_list ? this.state.internal_course_list.map(internal_course => (
                                                    <Dropdown.Item value={internal_course.id} onClick={(id,name) => {this.handleChangeInternalCourse(internal_course.id,internal_course.name)}}>{internal_course.name}</Dropdown.Item>
                                                ))

                                                :
                                                <Dropdown.Item value="">No Internal Course</Dropdown.Item>
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                            </Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeConnectInternalCourse}>
                                    Cancel
                                </Button>
                                {this.state.showLoadingConnectUser ?
                                    <div style={{position: 'relative', margin: '-45px 20px -10px 90px'}}>
                                        <CircularProgress size={40} thickness={7}
                                                          style={{marginLeft: '17%'}}/>
                                    </div> :
                                    <Button variant="outline-primary" onClick={this.addCertificateToInternalCourse} style={{marginLeft: 5}}>
                                        Connect
                                    </Button>
                                }
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>


                {/* CONNECT EXTERNAL COURSE MODAL*/}
                <Modal show={this.state.openConnectExternalCourse} onHide={this.closeConnectExternalCourse}
                       aria-labelledby="contained-modal-title-vcenter" size="sm"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Connect External Course</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>
                                    <Dropdown style={{marginTop: 0}}>
                                        <Dropdown.Toggle>
                                            {this.state.dropdown_default_connect_external_course_filter}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="customScrollToDropDowns">
                                            {this.state.external_course_list ? this.state.external_course_list.map(external_course => (
                                                    <Dropdown.Item value={external_course.id} onClick={(id,name) => {this.handleChangeExternalCourse(external_course.id,external_course.name)}}>{external_course.name}</Dropdown.Item>
                                                ))

                                                :
                                                <Dropdown.Item value="">No External Course</Dropdown.Item>
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                            </Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeConnectExternalCourse}>
                                    Cancel
                                </Button>
                                {this.state.showLoadingConnectUser ?
                                    <div style={{position: 'relative', margin: '-45px 20px -10px 90px'}}>
                                        <CircularProgress size={40} thickness={7}
                                                          style={{marginLeft: '17%'}}/>
                                    </div> :
                                    <Button variant="outline-primary" onClick={this.addCertificateToExternalCourse} style={{marginLeft: 5}}>
                                        Connect
                                    </Button>
                                }
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>


                {/* ADD EXTERNAL COURSE MODAL*/}
                <Modal show={this.state.openAddExternalCourse} onHide={this.handleCloseExternalCourse}
                       aria-labelledby="contained-modal-title-vcenter" size="lg"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New External Course</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{maxHeight: 'calc(100vh - 300px)', overflowY: 'auto'}}>
                        <form ref="addNewArchiveForm">
                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Course Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Course Name"
                                                      onChange={(event) => this.setState({ext_course_name: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Course Vendor</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Course Vendor"
                                                      onChange={(event) => this.setState({ext_course_vendor: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Course URL</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Course URL"
                                                      onChange={(event) => this.setState({ext_course_url: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Course Cost</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Course Cost"
                                                      onChange={(event) => this.setState({ext_course_cost: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Course Image</Form.Label>
                                        <Button className="logoBtn" variant="outline-primary" onClick={this.addNewFolder} style={{marginLeft: 5}}>
                                            <input className="publishFile" type="file" id="course_image" />
                                        </Button>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Course Details </Form.Label>
                                        <CKEditor name="course_details" id="course_details"
                                                  activeClass="p10"
                                                  content={this.state.course_details}
                                                  onFocus={(event) => this.setState({course_details: event.editor.getData()})}
                                                  onBlur={(event) => this.setState({course_details: event.editor.getData()})}
                                                  onChange={(event) => this.setState({course_details: event.editor.getData()})}
                                                  onSelectionChange={(event) => this.setState({course_details: event.editor.getData()})}
                                        />
                                        {/*<Form.Control id="course_details" controlId="course_details" as="textarea" ref="course_details" rows="3" className="textArea"
                                                      placeholder="Enter Course Details"
                                        />*/}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Comments</Form.Label>
                                        <CKEditor name="comments" id="comments"
                                                  activeClass="p10"
                                                  content={this.state.comments}
                                                  onFocus={(event) => this.setState({comments: event.editor.getData()})}
                                                  onBlur={(event) => this.setState({comments: event.editor.getData()})}
                                                  onChange={(event) => this.setState({comments: event.editor.getData()})}
                                                  onSelectionChange={(event) => this.setState({comments: event.editor.getData()})}
                                        />
                                        {/*<Form.Control id="comments" controlId="comments" as="textarea" ref="comments" rows="3" className="textArea"
                                                      placeholder="Enter Comments"
                                        />*/}
                                    </Form.Group>
                                </Col>
                            </Row>

                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.handleCloseExternalCourse}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.addExternalCourse} style={{marginLeft: 5}}>
                                    Add
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>
                
            </div>
        )
    }

}

function mapStateToProps(state) {
    const {filterationObj} = state.filteration;
    return {
        filterationObj
    };
}

export default connect(mapStateToProps) (CertificatesData);
// export default CertificatesData;
