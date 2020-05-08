/* eslint-disable */
import React, {Component} from 'react';
import { messageActions } from '../../actions';
import { connect } from 'react-redux';
// import { alertActions } from '../../actions';
import { history } from '../../helpers';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import { Dropdown, DropdownButton, Container, Row, Col, NavDropdown, Form, Button, Badge, Alert, ButtonToolbar, Modal,Table  } from 'react-bootstrap';
import Pagination from "react-js-pagination";
import {certificateFilterActions} from '../../actions/certificateFilters.actions';
import {
    ExcelExport,
    ExcelExportColumn,
} from '@progress/kendo-react-excel-export';
import moment from "moment";
import swal from 'sweetalert';
import axios from "axios/index";

const expandColumn = {
    flexBasis: '25%',
}

const styles = {
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
    cutText: {
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        width: "33%"
    }
}
class UsersData extends Component {
    constructor(args) {
        super(args);
        this.handleChange = this.handleChange.bind(this);
        this.exportData = this.exportData.bind(this);
        this.connectUsersToRole = this.connectUsersToRole.bind(this);
        this.connectUsersToCertificate = this.connectUsersToCertificate.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.state = {
            validated: false,
            maxYear: new Date().getFullYear(),
            activePage: 1,
            perPageLimit: 10,
            default_perPageLimit: "No of pages",
            rows_count: 0,
            isDesc: false,
            column: '',
            dropdown_default_certificate:"Select Certificate",
            dropdown_default_role:"Select Role",
            dropdown_default_status:"User Status",
            dropdown_default_cert_status:"Certificate Status",
            dropdown_default_cert_action_status:"Certificate Action",
            dropdown_default_type:"Select Type",
            dropdown_default_version:"Select Version",
            dropdown_default_profession:"Select Profession",
            dropdown_default_location:"Select Location",
            users:"",
            user_rows:[],
            temp_user_rows:[],
            checked_ids: [],
            temp: "",
            searchList : "",
            certificate_type_list : "",
            certificates_list : "",
            connect_temp_certificates_list : [],
            certificate_name : "",
            type_name : "",
            profession_name : "",
            profession_list : "",
            version_name : "",
            version_list : "",
            roles_list : "",
            connect_temp_roles_list : [],
            role_name : "",
            locations_list : "",
            location_name : "",
            filter_result : "",
            filterationObj : {
                "role_name": "",
                "certificate_name": "",
                "status": "",
                "cert_status": "",
                "cert_action_status": "",
                "string": "",
                "type_name": "",
                "profession_name": "",
                "version": "",
                "location_name": "",
            },
            element: "",
            role_id: "",
            start_date: "",
            end_date: "",
            certificate_id: "",
            openCompleteCertificate : false,
            complete_certificate_name : "",
            complete_certificate_id : "",
            complete_certificate_valid_months : "",
            complete_certificate_user_id : "",
            complete_certificate_accreditor : "",
            complete_certificate_start_date : "",
            complete_certificate_end_date : "",
            complete_certificate_assessor_id : "",
            complete_certificate_assessor_firstname : "",
            complete_certificate_assessor_lastname : "",
            complete_certificate_comments : "",
            complete_certificate_files : [],

            openCreateUser: false,
            openConnectRole: false,
            openConnectCertificate: false,
            openExternalCourse: false,
            openSendMessage: false,
            openSendEmail: false,
            emailSubject: '',
            emailRecipient: [],
            emailBody: '',
            messageBody: null,
            recipient: "",

            user_name: "",
            email: "",
            first_name: "",
            last_name: "",
            password: "",
            phone: "",
            honor_code: true,
            get_username: 1,
            terms_of_service: true,
            user_number: 1,
            name: "",
            gender: "",
            yearOfBirth: "",
            levelOfEducation: "",
            goals: "",
            dropdown_default_select_gender: "Select Gender",
            dropdown_default_select_level_of_education: "Select Level Of Education",
            external_course_list: [],
            external_course_ids: []
        };
    }

    componentDidMount() {
        this.reAssignFiltersFromState();
        this.props.dispatch(messageActions.clearPostMessage());
        this.getUsersList();
        this.getRolesList();
        this.getCertificateList();
        this.getProfessionList();
        this.getCertificateTypeList();
        this.getUserLocationsList();
        this.getExternalCourseList();
    }
    exportData() {
        var inputs = document.getElementsByTagName("input");
        var user_ids = [];
        for (var k = 0; k < inputs.length; k++) {
            if (inputs[k].type == "checkbox"&&inputs[k].value!=-1&&inputs[k].checked) {
                user_ids.push(inputs[k].value);
            }
        }

        // let userRows = this.state.user_rows;

        let allUsers = this.state.users;
        let userRows = [];
        if(allUsers.length>0) {
            allUsers.forEach(function (user) {
                user.user_rows.forEach(function (row) {
                    userRows.push(row);
                });
            });
        }
        //deprecated
        /*let usersRows = [];
        for(let l=0;l<user_ids.length;l++) {
            for (let i = 0; i < allUsersData.length; i++) {
                if(allUsersData[i].id == user_ids[l]) {
                    for (let j = 0; j < allUsersData[i].user_rows.length; j++) {
                        usersRows.push(allUsersData[i].user_rows[j]);
                    }
                }
            }
        }*/
        const exportElement = [
            <ExcelExport
                data={userRows}
                // group={group}
                fileName="Users.xlsx"
                ref={(exporter) => { this._exporter = exporter; }}
            >
                <ExcelExportColumn field="id" title="User ID" locked={true} width={150} />
                <ExcelExportColumn field="name" title="User Name" width={300} />
                <ExcelExportColumn field="email" title="User Email" width={350} />
                <ExcelExportColumn field="role" title="User Roles" width={350} />
                <ExcelExportColumn field="role_status" title="Role Status" width={350} />
                <ExcelExportColumn field="certificate" title="Certificates" width={150} />
                <ExcelExportColumn field="certificate_action" title="Certificate Action" width={150} />
                <ExcelExportColumn field="certificate_status" title="Certificate Status" width={150} />
            </ExcelExport>
        ]
        this.setState({
            element:exportElement
        })
        setTimeout(this.export,1);
    }

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
                        else if (keys[i] == "cert_status") {
                            this.setState({
                                dropdown_default_cert_status: filterationObj[keys[i]]
                            })
                        }
                        else if (keys[i] == "cert_action_status") {
                            this.setState({
                                dropdown_default_cert_action_status: filterationObj[keys[i]]
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
                        else if (keys[i] == "location_name") {
                            this.setState({
                                dropdown_default_location: filterationObj[keys[i]]
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
    getUsersList =()=>{
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    let allUsers = result;
                    let userRows = [];
                    let allUserRows = [];
                    let rows_count = 0;
                    let perPageLimit = this.state.perPageLimit;
                    if(allUsers.length>0) {
                        allUsers.forEach(function (user) {
                            user.user_rows.forEach(function (row) {
                                rows_count = rows_count + 1;
                                allUserRows.push(row);
                                if(rows_count <= perPageLimit) {
                                    userRows.push(row);
                                }
                            });
                        });
                    }

                    this.setState({
                        users: result,
                        temp: result,
                        user_rows: userRows,
                        temp_user_rows: allUserRows,
                        rows_count: rows_count
                    });
                    this.filterResult();
                },
                (error) => {
                    swal({
                        title: "Error!",
                        text: "Server Not Responding!",
                        icon: "error",
                    });
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
                    result.forEach(function (role) {
                        role.label = role.name;
                        role.value = role.id;
                    })
                    this.setState({
                        roles_list: result,
                        connect_temp_roles_list: result
                    });
                },

                (error) => {

                }
            )
    }
    getCertificateList(){
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
                        result.forEach(function (certificate) {
                            certificate.label = certificate.name;
                            certificate.value = certificate.id;
                        })
                        this.setState({
                            connect_temp_certificates_list: result,
                            certificates_list: result
                        });
                    }

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
    getUserLocationsList() {
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_location_list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({locations_list: result});
                },

                (error) => {

                }
            )
    }
    completeCertifcateUser=()=>{
        const {dispatch} = this.props;
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/complete_certificate_user", {
            method: "POST",
            body:JSON.stringify({
                'id': this.state.complete_certificate_id,
                'user_certificate_id': this.state.complete_certificate_user_id,
                'accreditor': this.state.complete_certificate_accreditor,
                'start_date': this.state.complete_certificate_start_date,
                'end_date': this.state.complete_certificate_end_date,
                'assessor_id': this.state.complete_certificate_assessor_id,
                'assessor_first_name': this.state.complete_certificate_assessor_firstname,
                'assessor_last_name': this.state.complete_certificate_assessor_lastname,
                'comments': this.state.complete_certificate_comments,
                'user_id': this.state.user_id,
                'files': this.state.complete_certificate_files,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        openCompleteCertificate: false,
                        activePage: 1
                    });

                    // dispatch(alertActions.success("Certificate Updated Successfully"));
                    this.getUsersList();
                    swal({
                        title: "Success!",
                        text: "Certificate Updated Successfully!",
                        icon: "success",
                    });
                },

                (error) => {
                    this.setState({
                        openCompleteCertificate: false
                    });
                    swal({
                        title: "Error!",
                        text: "Error While Completing Certificate Status!",
                        icon: "error",
                    });
                    // dispatch(alertActions.error("Error While Completing Certificate Status"));
                }
            )
    }
    openCompleteCertificate = (id,name,validMonth) => {
        this.setState({ openCompleteCertificate: true,complete_certificate_name : name ,
            complete_certificate_id : id, complete_certificate_valid_months: validMonth });
    };

    closeCompleteCertificate = (id) => {
        this.setState({ openCompleteCertificate: false });
    };
    changeCompleteCertificateDates = (startDate) => {
        let endDate = new Date(startDate);
        endDate.setMonth( endDate.getMonth() + parseInt(this.state.complete_certificate_valid_months));
        endDate = moment(endDate).format('MM-DD-YYYY');
        this.setState({
            complete_certificate_start_date: startDate,
            complete_certificate_end_date: endDate
        })
    };
    addCompleteCertificateFile=()=> {
        var files = document.getElementById("files");
        if (files.files && files.files[0]) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                var arr = this.state.complete_certificate_files;
                var fileBase64 = e.target.result.split("base64,")
                var data = {name: files.files[0].name, file: fileBase64[1]}
                arr.push(data);
                this.setState({
                    complete_certificate_files: arr
                });
                files.value = "";
            }.bind(this);
            reader.readAsDataURL(files.files[0]);
        }
    }
    removeCompleteCertificateFile=(name)=> {
        var data = this.state.complete_certificate_files;
        for (var i = 0; i < data.length; i++) {
            if (data[i].name == name) {
                data.splice(i, 1);
                break;
            }
        }
        this.setState({
            complete_certificate_files: data
        });
    }
    createNewUser=()=>{
        /*if(this.state.user_name =="" || this.state.user_name==null ||
            this.state.email =="" || this.state.email==null ||
            this.state.first_name =="" || this.state.first_name==null ||
            this.state.last_name =="" || this.state.last_name==null ||
            this.state.password =="" || this.state.password==null ||
            this.state.phone =="" || this.state.phone==null ||
            this.state.name =="" || this.state.name==null ||
            this.state.gender =="" || this.state.gender==null ||
            this.state.yearOfBirth =="" || this.state.yearOfBirth==null ||
            this.state.levelOfEducation =="" || this.state.levelOfEducation==null ||
            this.state.goals =="" || this.state.goals==null
        ){
            swal({
                title: "Error!",
                text: "All Fields Are Mandatory!",
                icon: "error",
            });
            return;
        }*/

        /*axios.post(process.env.REACT_APP_API_URL + "/api/auth/edtxlogin",
            {
                "username": "afaa",
                "password": "asdasdas",
            })
            .then(res => {
                console.log("then");
                console.log(res)
            })
            .then(user => {
                console.log("user")
                console.log(user);
            });*/
       /* axios.post("http://ec2-34-251-213-118.eu-west-1.compute.amazonaws.com/user_api/v1/account/registration/",
            {
                'username': this.state.username,
                'email': this.state.email,
                'first_name' : this.state.first_name,
                'last_name' : this.state.last_name,
                'password' : this.state.password,
                'phone' : this.state.phone,
                'honor_code' : this.state.honor_code,
                'get_username' : this.state.get_username,
                'terms_of_service' : this.state.terms_of_service,
                'user_number' : this.state.user_number,
                'name' : this.state.name,
                'gender' : this.state.gender,
                'yearOfBirth' : this.state.yearOfBirth,
                'levelOfEducation' : this.state.levelOfEducation,
                'goals' : this.state.goals
            })
            .then(res => {
                console.log(res);
            })
            .then(user => {
                console.log(user);
            });
*/

        // form validation
        const form = this.refs.createUserModalForm;
        this.setState({ validated: true });
        if (form.checkValidity() === false) {
            return;
        }

        let user = JSON.parse(localStorage.getItem('user'));
        // var authHeader = "Token " + user["access_token"];
        fetch("http://ec2-34-251-213-118.eu-west-1.compute.amazonaws.com/user_api/v1/account/registration/", {
            method: "POST",
           /* dataType:'JSON',*/
            body:JSON.stringify({
                'username': this.state.username,
                'email': this.state.email,
                'first_name' : this.state.first_name,
                'last_name' : this.state.last_name,
                'password' : this.state.password,
                'phone' : this.state.phone,
                'honor_code' : this.state.honor_code,
                'get_username' : this.state.get_username,
                'terms_of_service' : this.state.terms_of_service,
                'user_number' : this.state.user_number,
                'name' : this.state.name,
                'gender' : this.state.gender,
                'yearOfBirth' : this.state.yearOfBirth,
                'levelOfEducation' : this.state.levelOfEducation,
                'goals' : this.state.goals
            }),
            /*headers : {
                'Content-Type': 'application/json',
                "X-Authorization": "Token " + user["access_token"],
                // "Access-Control-Allow-Origin": "*"

            }*/
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        openCreateUser: false,
                        activePage: 1,
                        validated: false
                    });
                    this.getUsersList();
                    swal({
                        title: "Success!",
                        text: "User Created Successfully!",
                        icon: "success",
                    });
                },

                (error) => {
                    console.log(error);
                    swal({
                        title: "Error!",
                        text: "Unable To Create User!",
                        icon: "error",
                    });
                }
            )
    }
    connectUsersToRole(){
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        var inputs = document.getElementsByTagName("input");
        var user_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                user_ids.push(inputs[i].value);
            }
        }
        if(this.state.role_id =="" || this.state.role_id==null){
            // dispatch(alertActions.error("Select Roles To Be Connected"));
            /*this.setState({
                openConnectRole: false,
                role_id: "",
                start_date: ""
            });*/
            swal({
                title: "Error!",
                text: "Select Roles To Be Connected!",
                icon: "error",
            });
            return;
        }
        if(this.state.start_date =="" || this.state.start_date==null){
            // dispatch(alertActions.error("Select Start Date"));
            /*this.setState({
                openConnectRole: false,
                role_id: "",
                start_date: ""
            });*/
            swal({
                title: "Error!",
                text: "Select Start Date!",
                icon: "error",
            });
            return;
        }
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/connect_user_role", {
            method: "POST",
            body:JSON.stringify({
                'user_id': user_ids,
                'role_id': this.state.role_id,
                'start_date' : this.state.start_date,
                'end_date' : this.state.start_date
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
                    this.getUsersList();
                    swal({
                        title: "Success!",
                        text: "Role Connected Successfully!",
                        icon: "success",
                    });
                },

                (error) => {
                    // dispatch(alertActions.error("Unable To Connect Role"));
                    swal({
                        title: "Error!",
                        text: "Unable To Connect Role!",
                        icon: "error",
                    });
                }
            )
    }
    connectUsersToCertificate(){
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        var inputs = document.getElementsByTagName("input");
        var user_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                user_ids.push(inputs[i].value);
            }
        }
        if(this.state.certificate_id =="" || this.state.certificate_id==null){
            // dispatch(alertActions.error("Select Certificates To Be Connected"));
            /*this.setState({
                openConnectCertificate: false,
                certificate_id: ""
            });*/
            swal({
                title: "Error!",
                text: "Select Certificates To Be Connected!",
                icon: "error",
            });
            return;
        }
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/connect_users_certificates", {
            method: "POST",
            body:JSON.stringify({
                'user_id': user_ids,
                'certificate_id': this.state.certificate_id
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        openConnectCertificate: false,
                        activePage: 1
                    });
                    // dispatch(alertActions.success("Certificate Connected Successfully"));
                    this.getUsersList();
                    swal({
                        title: "Success!",
                        text: "Certificate Connected Successfully!",
                        icon: "success",
                    });
                },

                (error) => {
                    swal({
                        title: "Error!",
                        text: "Unable To Connect Certificate!",
                        icon: "error",
                    });
                    // dispatch(alertActions.error("Unable To Connect Certificate"));
                }
            )
    }
    getExternalCourseList=()=>{
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_external_course_list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    result.forEach(function (course) {
                        course.label = course.name;
                        course.value = course.id;
                    })
                    this.setState({ external_course_list: result });
                },

                (error) => {

                }
            )
    }
    openCreateUser = () => {
        this.setState({ openCreateUser: true });
    };

    closeCreateUser = () => {
        this.setState({
            openCreateUser: false
        });
    };

    openConnectRole = () => {
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        var inputs = document.getElementsByTagName("input");
        var user_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                user_ids.push(inputs[i].value);
            }
        }
        if(user_ids.length<1){
            // dispatch(alertActions.error("Select At Least One User"));
            // this.setState({openConnectRole: false});
            swal({
                title: "Error!",
                text: "Select At Least One User!",
                icon: "error",
            });
            return;
        }
        this.setState({ openConnectRole: true });
    };

    closeConnectRole = () => {
        this.setState({
            openConnectRole: false,
            role_id: "",
            start_date: ""
        });
    };

    openConnectCertificate = () => {
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        var inputs = document.getElementsByTagName("input");
        var user_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                user_ids.push(inputs[i].value);
            }
        }
        if(user_ids.length<1){
            // dispatch(alertActions.error("Select At Least One User"));
            swal({
                title: "Error!",
                text: "Select At Least One User!",
                icon: "error",
            });
            // this.setState({openConnectCertificate: false});
            return;
        }
        this.setState({ openConnectCertificate: true });
    };

    closeConnectCertificate = () => {
        this.setState({ openConnectCertificate: false,certificate_id: "" });
    };

    openExternalCourse = () => {
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        var inputs = document.getElementsByTagName("input");
        var user_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                user_ids.push(inputs[i].value);
            }
        }
        if(user_ids.length<1){
            // dispatch(alertActions.error("Select At Least One User"));
            swal({
                title: "Error!",
                text: "Select At Least One User!",
                icon: "error",
            });
            // this.setState({openConnectCertificate: false});
            return;
        }
        this.setState({ openExternalCourse: true });
    };

    closeExternalCourse = () => {
        this.setState({ openExternalCourse: false});
    };
    handleChangeExternalCourse = (value) => {
        console.log(value);
        let externalCourseIds = [];
        value.forEach(function (course) {
            externalCourseIds.push(course.id);
        });
        this.setState({
            external_course_ids: externalCourseIds
        });
    };
    connectExternalCourse = () => {
        var inputs = document.getElementsByTagName("input");
        var user_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                user_ids.push(inputs[i].value);
            }
        }
        if(this.state.external_course_ids.length<1){
            swal({
                title: "Error!",
                text: "Select External Courses First!",
                icon: "error",
            });
            return;
        }
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/user_external_course", {
            method: "POST",
            body:JSON.stringify({
                'user_id': user_ids,
                'course_id': this.state.external_course_ids
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        openExternalCourse: false,
                        activePage: 1
                    });
                    this.getUsersList();
                    swal({
                        title: "Success!",
                        text: "External Course Connected Successfully!",
                        icon: "success",
                    });
                },

                (error) => {
                    swal({
                        title: "Error!",
                        text: "Unable To Connect External Course!",
                        icon: "error",
                    });
                }
            )
    };

    handleChangeConnectRole = (value) => {
        let roleIds = [];
        value.forEach(function (role) {
            roleIds.push(role.id);
        });
        this.setState({
            role_id: roleIds
        });
    };

    handleChangeConnectCertificate = (value) => {
        let certificateIds = [];
        value.forEach(function (certificate) {
            certificateIds.push(certificate.id);
        });
        this.setState({
            certificate_id: certificateIds,
        });
    };
    /*handleChangeConnectCertificate = (id,name) => {
        this.setState({
            certificate_id: id,
            default_dropdown_certificate_name: name
        });
    };*/

    openSendMessage = () => {
        const { dispatch } = this.props;
        var inputs = document.getElementsByTagName("input");
        var user_ids = [];
        for (var k = 0; k < inputs.length; k++) {
            if (inputs[k].type == "checkbox"&&inputs[k].value!=-1&&inputs[k].checked) {
                user_ids.push(inputs[k].value);
            }
        }
        if(user_ids.length>0) {
            // dispatch(alertActions.clear());
            this.setState({
                recipient: user_ids,
                openSendMessage: true
            });
        }
        else{
            swal({
                title: "Error!",
                text: "Select At Least One User!",
                icon: "error",
            });
            // dispatch(alertActions.error("Select At Least One User"));
        }
    };

    closeSendMessage = () => {
        this.setState({ openSendMessage: false });
    };
    openSendEmail = () => {
        var inputs = document.getElementsByTagName("input");
        var user_ids = [];
        for (var k = 0; k < inputs.length; k++) {
            if (inputs[k].type == "checkbox"&&inputs[k].value!=-1&&inputs[k].checked) {
                user_ids.push(inputs[k].value);
            }
        }
        if(user_ids.length>0) {
            const userEmails = [];
            const allUserRows = this.state.temp_user_rows;
            for(let i=0;i<user_ids.length;i++) {
                for (let j = 0; j < allUserRows.length; j++) {
                    if (user_ids[i] == allUserRows[j].id){
                        userEmails.push(allUserRows[j].email);
                    }
                }
            }
            this.setState({
                emailRecipient : userEmails,
                openSendEmail: true
            });
        }
        else{
            swal({
                title: "Error!",
                text: "Select At Least One User!",
                icon: "error",
            });
        }
    };

    closeSendEmail = () => {
        this.setState({ openSendEmail: false });
    };

    handleChangeMessageBody = (e, value) => {
        this.setState({
            messageBody: value
        })
    }
    handleChangeReceiver = (e, value) => {
        this.setState({
            recipient: value
        })
    }
    sendMessage = (e) => {
        e.preventDefault();
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        if(this.state.messageBody==null || this.state.messageBody==undefined){
            swal({
                title: "Error!",
                text: "Message Body Is Mandatory!",
                icon: "error",
            });
            // dispatch(alertActions.error("Message Body Is Mandatory"));
        }
        else {
            var messageData = {
                recipient: this.state.recipient,
                text: this.state.messageBody
            }
            dispatch(messageActions.postMessageMulti(messageData));
            this.setState({
                openSendMessage: false
            });
        }
    };
    sendEmail = () => {
        const form = this.refs.sendEmailForm;
        if (form.checkValidity() === false) {
            this.setState({ validated: true});
            return;
        }
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/email_users", {
            method: "POST",
            body:JSON.stringify({
                'email': this.state.emailRecipient,
                'subject': this.state.emailSubject,
                'message': this.state.emailBody
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    swal({
                        title: "Success!",
                        text: "Email Sent Successfully!",
                        icon: "success",
                    });
                    this.setState({
                        openSendEmail: false,
                        emailSubject: '',
                        emailBody: '',
                        emailRecipient: [],
                        validated: false
                    });
                },

                (error) => {
                    swal({
                        title: "Error!",
                        text: "Unable To Send Email!",
                        icon: "error",
                    });
                }
            )
    };

    openCreateActivity = () => {
        history.push({path :'/new_quest/'+1, state: { fromDashboard: true }});
    };

    storeStateForFilters = () => {
        const {dispatch} = this.props;
        dispatch(certificateFilterActions.setFiltersValues(this.state.filterationObj, "users"));
    };

    handleChangeCertificate = (id,name) => {
        this.setState({
            certificate_name: name,
            dropdown_default_certificate: name,
        });
        let filterationObj = this.state.filterationObj;
        filterationObj.certificate_name = name;
        this.setState({
            filterationObj: filterationObj
        });
        this.filterResult();
        this.getVersionsList(name);
    };
    handleRoleChange = (id,name) => {
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
    handleChangeStatus = (value,capValue) => {
        this.setState({
            dropdown_default_status: capValue
        });
        let filterationObj = this.state.filterationObj;
        filterationObj.status = value;
        this.setState({
            filterationObj: filterationObj
        })
        this.filterResult();

    };
    handleChangeCertStatus = (value,capValue) => {
        this.setState({
            dropdown_default_cert_status: capValue
        });
        let filterationObj = this.state.filterationObj;
        filterationObj.cert_status = value;
        this.setState({
            filterationObj: filterationObj
        })
        this.filterResult();

    };
    handleChangeCertActionStatus = (value,capValue) => {
        this.setState({
            dropdown_default_cert_action_status: capValue
        });
        let filterationObj = this.state.filterationObj;
        filterationObj.cert_action_status = value;
        this.setState({
            filterationObj: filterationObj
        })
        this.filterResult();

    };
    handleLocationChange = (locationCode) => {
        this.setState({
            location_name: locationCode,
            dropdown_default_location: locationCode
        });
        let filterationObj = this.state.filterationObj;
        filterationObj.location_name = locationCode;
        this.setState({
            filterationObj: filterationObj
        })
        this.filterResult();

    };
    handleTypeChange = (id,name) => {
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
    handleVersionChange = (version) => {
        this.setState({
            version_name: version,
            dropdown_default_version: version
        });
        let filterationObj = this.state.filterationObj;
        filterationObj.version = version;
        this.setState({
            filterationObj: filterationObj
        })
        this.filterResult();

    };
    handleProfessionChange = (name) => {
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

    searchClear = () => {
        let filterationObj = this.state.filterationObj;
        let temp = this.state.temp;
        filterationObj.role_name = "";
        filterationObj.certificate_name = "";
        filterationObj.status = "";
        filterationObj.string = "";
        filterationObj.version = "";
        filterationObj.profession_name = "";
        filterationObj.type_name = "";
        filterationObj.location_name = "";

        /*let allUsers = temp;
        let userRows = [];
        allUsers.forEach(function (user) {
            user.user_rows.forEach(function (row) {
                userRows.push(row);
            });
        });*/

        let allUsers = temp;
        let allUserRows = [];
        let userRows = [];
        let rows_count = 0;
        let perPageLimit = this.state.perPageLimit;
        allUsers.forEach(function (user) {
            user.user_rows.forEach(function (row) {
                rows_count = rows_count + 1;
                allUserRows.push(row)
                if(rows_count <= perPageLimit) {
                    userRows.push(row);
                }
            });
        });

        this.setState({
            user_rows: userRows,
            temp_user_rows: allUserRows,
            activePage: 1,
            rows_count: rows_count,
            users: temp,
            searchList : "",
            filter_result : "",
            role_name : "",
            certificate_name : "",
            profession_name : "",
            version_name : "",
            version_list : "",
            type_name : "",
            location_name : "",
            dropdown_default_certificate:"Select Certificate",
            dropdown_default_role:"Select Role",
            dropdown_default_status:"User Status",
            dropdown_default_cert_status:"Certificate Status",
            dropdown_default_cert_action_status:"Certificate Action",
            dropdown_default_type:"Select Type",
            dropdown_default_version:"Select Version",
            dropdown_default_profession:"Select Profession",
            dropdown_default_location:"Select Location",
            default_perPageLimit: "No of pages",
            filterationObj: filterationObj
        })
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.searchList();
        }
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
    filterResult =()=> {
        let filterationObj = this.state.filterationObj;
        let filterdBefore = 0;
        var data = this.state.temp;
        var filter_result = [];
        console.log(filterationObj);
        if(filterationObj.certificate_name!=null && filterationObj.certificate_name!="") {
            filterdBefore = 1;
            for (let i = 0; i < data.length; i++) {
                for(let j=0; j<data[i].roles.length;j++){
                    for(let k=0; k<data[i].roles[j].certificates.length;k++){
                        if (data[i].roles[j].certificates[k].name == filterationObj.certificate_name) {
                            if(filter_result.length>0) {
                                let chk = 0;
                                for (let m = 0; m < filter_result.length; m++) {
                                    if (filter_result[m].id == data[i].id) {
                                        chk = 1;
                                    }
                                    else if (m == filter_result.length - 1 && chk == 0) {
                                        filter_result.push(data[i]);
                                    }
                                }
                            }
                            else{
                                filter_result.push(data[i]);
                            }
                        }
                    }
                }
                for(let l=0; l<data[i].certificates.length;l++){
                    if (data[i].certificates[l].name == filterationObj.certificate_name) {
                        if(filter_result.length>0) {
                            let chk = 0;
                            for (let m = 0; m < filter_result.length; m++) {
                                if (filter_result[m].id == data[i].id) {
                                    chk = 1;
                                }
                                else if (m == filter_result.length - 1 && chk == 0) {
                                    filter_result.push(data[i]);
                                }
                            }
                        }
                        else{
                            filter_result.push(data[i]);
                        }
                    }
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
                for(let j=0; j<innerData[i].roles.length;j++){
                    for(let k=0; k<innerData[i].roles[j].certificates.length;k++){
                        if (innerData[i].roles[j].certificates[k].type == filterationObj.type_name) {
                            if(inner_filter_result.length>0) {
                                let chk = 0;
                                for (let m = 0; m < inner_filter_result.length; m++) {
                                    if (inner_filter_result[m].id == innerData[i].id) {
                                        chk = 1;
                                    }
                                    else if (m == inner_filter_result.length - 1 && chk == 0) {
                                        inner_filter_result.push(innerData[i]);
                                    }
                                }
                            }
                            else{
                                inner_filter_result.push(innerData[i]);
                            }
                        }
                    }
                }
                for(let l=0; l<innerData[i].certificates.length;l++){
                    if (innerData[i].certificates[l].type == filterationObj.type_name) {
                        if(inner_filter_result.length>0) {
                            let chk = 0;
                            for (let m = 0; m < inner_filter_result.length; m++) {
                                if (inner_filter_result[m].id == innerData[i].id) {
                                    chk = 1;
                                }
                                else if (m == inner_filter_result.length - 1 && chk == 0) {
                                    inner_filter_result.push(innerData[i]);
                                }
                            }
                        }
                        else{
                            inner_filter_result.push(innerData[i]);
                        }
                    }
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
                for(let j=0; j<innerData[i].roles.length;j++){
                    for(let k=0; k<innerData[i].roles[j].certificates.length;k++){
                        if (innerData[i].roles[j].certificates[k].version == filterationObj.version) {
                            if(inner_filter_result.length>0) {
                                let chk = 0;
                                for (let m = 0; m < inner_filter_result.length; m++) {
                                    if (inner_filter_result[m].id == innerData[i].id) {
                                        chk = 1;
                                    }
                                    else if (m == inner_filter_result.length - 1 && chk == 0) {
                                        inner_filter_result.push(innerData[i]);
                                    }
                                }
                            }
                            else{
                                inner_filter_result.push(innerData[i]);
                            }
                        }
                    }
                }
                for(let l=0; l<innerData[i].certificates.length;l++){
                    if (innerData[i].certificates[l].version == filterationObj.version) {
                        if(inner_filter_result.length>0) {
                            let chk = 0;
                            for (let m = 0; m < inner_filter_result.length; m++) {
                                if (inner_filter_result[m].id == innerData[i].id) {
                                    chk = 1;
                                }
                                else if (m == inner_filter_result.length - 1 && chk == 0) {
                                    inner_filter_result.push(innerData[i]);
                                }
                            }
                        }
                        else{
                            inner_filter_result.push(innerData[i]);
                        }
                    }
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
                for(let j=0; j<innerData[i].roles.length;j++){
                    for(let k=0; k<innerData[i].roles[j].certificates.length;k++){
                        if (innerData[i].roles[j].certificates[k].profession == filterationObj.profession_name) {
                            if(inner_filter_result.length>0) {
                                let chk = 0;
                                for (let m = 0; m < inner_filter_result.length; m++) {
                                    if (inner_filter_result[m].id == innerData[i].id) {
                                        chk = 1;
                                    }
                                    else if (m == inner_filter_result.length - 1 && chk == 0) {
                                        inner_filter_result.push(innerData[i]);
                                    }
                                }
                            }
                            else{
                                inner_filter_result.push(innerData[i]);
                            }
                        }
                    }
                }
                for(let l=0; l<innerData[i].certificates.length;l++){
                    if (innerData[i].certificates[l].profession == filterationObj.profession_name) {
                        if(inner_filter_result.length>0) {
                            let chk = 0;
                            for (let m = 0; m < inner_filter_result.length; m++) {
                                if (inner_filter_result[m].id == innerData[i].id) {
                                    chk = 1;
                                }
                                else if (m == inner_filter_result.length - 1 && chk == 0) {
                                    inner_filter_result.push(innerData[i]);
                                }
                            }
                        }
                        else{
                            inner_filter_result.push(innerData[i]);
                        }
                    }
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
                    if(innerData[i].is_active_user == 1){
                        inner_filter_result.push(innerData[i]);
                    }
                }
            }
            else if(filterationObj.status == "notActive") {
                filterdBefore = 1;
                for (let i = 0; i< innerData.length ; i++){
                    if(innerData[i].is_active_user == 0){
                        inner_filter_result.push(innerData[i]);
                    }
                }
            }
            else {
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
        if(filterationObj.cert_status!=null && filterationObj.cert_status!="") {
            let innerData = filter_result;
            let inner_filter_result = [];
            if(filterdBefore == 0){
                innerData = data;
            }
            if(filterationObj.cert_status != "All") {
                filterdBefore = 1;
                for (let i = 0; i < innerData.length; i++) {
                    for (let j = 0; j < innerData[i].user_rows.length; j++) {
                        if (innerData[i].user_rows[j].certificate_status == filterationObj.cert_status) {
                            if (inner_filter_result.length > 0) {
                                let chk = 0;
                                for (let m = 0; m < inner_filter_result.length; m++) {
                                    if (inner_filter_result[m].id == innerData[i].id) {
                                        chk = 1;
                                    }
                                    else if (m == inner_filter_result.length - 1 && chk == 0) {
                                        inner_filter_result.push(innerData[i]);
                                    }
                                }
                            }
                            else {
                                inner_filter_result.push(innerData[i]);
                            }
                        }
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
        if(filterationObj.cert_action_status!=null && filterationObj.cert_action_status!="") {
            let innerData = filter_result;
            let inner_filter_result = [];
            if(filterdBefore == 0){
                innerData = data;
            }
            if(filterationObj.cert_action_status != "All") {
                filterdBefore = 1;
                for (let i = 0; i < innerData.length; i++) {
                    for (let j = 0; j < innerData[i].user_rows.length; j++) {
                        if (innerData[i].user_rows[j].certificate_action == filterationObj.cert_action_status) {
                            if (inner_filter_result.length > 0) {
                                let chk = 0;
                                for (let m = 0; m < inner_filter_result.length; m++) {
                                    if (inner_filter_result[m].id == innerData[i].id) {
                                        chk = 1;
                                    }
                                    else if (m == inner_filter_result.length - 1 && chk == 0) {
                                        inner_filter_result.push(innerData[i]);
                                    }
                                }
                            }
                            else {
                                inner_filter_result.push(innerData[i]);
                            }
                        }
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
        if(filterationObj.location_name!=null && filterationObj.location_name!="") {
            let innerData = filter_result;
            let inner_filter_result = [];
            if(filterdBefore == 0){
                filterdBefore = 1;
                innerData = data;
            }
            for (let i = 0; i < innerData.length; i++) {
                if(innerData[i].location == filterationObj.location_name){
                    inner_filter_result.push(innerData[i]);
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

            for (var i = 0; i< innerData.length ; i++){
                if(innerData[i].username!=null&&(innerData[i].username.toLowerCase().includes(searchValue)||innerData[i].email.toLowerCase().includes(searchValue))){
                    inner_filter_result.push(innerData[i]);
                }else if(innerData[i].certificates.length>0 &&innerData[i].roles.length==0){
                    for(var j = 0; j< innerData[i].certificates.length; j++){
                        if(innerData[i].certificates[j].name.toLowerCase().includes(searchValue)){
                            inner_filter_result.push(innerData[i]);
                            break;
                        }
                    }
                }else if(innerData[i].roles.length>0 &&innerData[i].certificates.length==0){
                    for(var j = 0; j< innerData[i].roles.length; j++){
                        if(innerData[i].roles[j].name.toLowerCase().includes(searchValue)){
                            inner_filter_result.push(innerData[i]);
                            break;
                        }else{
                            if(innerData[i].roles[j].certificates.length>0){
                                for (var k = 0 ; k<innerData[i].roles[j].certificates.length; k++){
                                    if(innerData[i].roles[j].certificates[k].name.toLowerCase().includes(searchValue)){
                                        inner_filter_result.push(innerData[i]);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }else if (innerData[i].roles.length>0 && innerData[i].certificates.length>0){
                    for(var j = 0; j< innerData[i].roles.length; j++){
                        if(innerData[i].roles[j].name.toLowerCase().includes(searchValue)){
                            inner_filter_result.push(innerData[i]);
                            break;
                        }else{
                            if(innerData[i].roles[j].certificates.length>0){
                                for (var k = 0 ; k<innerData[i].roles[j].certificates.length; k++){
                                    if(innerData[i].roles[j].certificates[k].name.toLowerCase().includes(searchValue)){
                                        inner_filter_result.push(innerData[i]);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if(!this.containsObject(innerData[i] , inner_filter_result)){
                        for(var j = 0; j< innerData[i].certificates.length; j++){
                            if(innerData[i].certificates[j].name.toLowerCase().includes(searchValue)){
                                inner_filter_result.push(innerData[i]);
                                break;
                            }
                        }
                    }
                }
            }
            filter_result = inner_filter_result;
        }
        if(filterdBefore == 0){
            filter_result = data;
        }
        // console.log(filter_result.length);

        /*let allUsers = filter_result;
        let userRows = [];
        allUsers.forEach(function (user) {
            user.user_rows.forEach(function (row) {
                userRows.push(row);
            });
        });*/

        let allUsers = filter_result;
        let allUserRows = [];
        let userRows = [];
        let perPageLimit = this.state.perPageLimit;
        let rows_count = 0;
        if(allUsers.length>0) {
            allUsers.forEach(function (user) {
                user.user_rows.forEach(function (row) {
                    rows_count = rows_count + 1;
                    allUserRows.push(row);
                    if (rows_count <= perPageLimit) {
                        userRows.push(row);
                    }
                });
            });
        }

        this.setState({
            users: filter_result,
            user_rows: userRows,
            rows_count: rows_count,
            temp_user_rows: allUserRows,
            filter_result : filter_result,
            activePage: 1
        });
        this.storeStateForFilters();
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

    containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }

        return false;
    }

    handleChange = event => {
        this.setState({ role_name: event.target.value });

        var data = this.state.temp;


        var filter_result = [];
        for (var i = 0; i< data.length ; i++){
            if(data[i].roles.length>0){
                for(var j = 0; j< data[i].roles.length; j++){
                    if(data[i].roles[j].name == event.target.value){
                        filter_result.push(data[i]);
                        break;
                    }
                }
            }
        }
        this.setState({ users: filter_result ,filter_result : filter_result });
    };
    handleChangeAll(e){
        let checked_ids = [];
        var inputs = document.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1) {
                inputs[i].checked = e.target.checked;
                if(e.target.checked == true){
                    checked_ids.push(inputs[i].value);
                }
                // This way it won't flip flop them and will set them all to the same value which is passed into the function
            }
        }
        if(e.target.checked == false){
            checked_ids = [];
        }
        this.setState({
            checked_ids : checked_ids
        });
    }
    handleChangeCheckBox(e){
        let previous_checked_ids = this.state.checked_ids;
        let checked_ids = previous_checked_ids;
        if(e.target.checked == true){
            checked_ids.push(e.target.value);
        }
        else {
            checked_ids = [];
            for(let i=0;i<previous_checked_ids.length;i++){
                if(previous_checked_ids[i] != e.target.value){
                    checked_ids.push(previous_checked_ids[i]);
                }
            }
        }
        this.setState({
            checked_ids : checked_ids
        });
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
        let savedRrecords = this.state.temp_user_rows;
        let records = [];
        savedRrecords.forEach(function (rec) {
            if (rec["id"] != "") {
                records.push(rec);
            }
        });
        if (property == "id") {
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
                if (a[property] == null) {
                    a[property] = "";
                }
                if (b[property] == null) {
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
                if (record["id"] == record2["object_id"]) {
                    newRecords.push(record2);
                }
            });
        });
        this.setState({
            user_rows: newRecords,
            temp_user_rows: newRecords,
            rows_count: newRecords.length, // to hide pagination control
            perPageLimit: newRecords.length, // to hide pagination control
            default_perPageLimit: "All",
            activePage: 1
        });
        // this.handlePerPageLimit(10,newRecords);
    }
    /*sortByColoumn =(property)=> {
        let isDesc = !this.state.isDesc;
        this.setState({
            isDesc: !this.state.isDesc,
            column: property
        })

        let direction = this.state.isDesc ? 1 : -1;

        let savedRrecords = this.state.user_rows;
        let records = [];
        savedRrecords.forEach(function (rec) {
            if (rec["id"] != "") {
                records.push(rec);
            }
        });
        if (property == "id") {
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
                if (record["id"] == record2["object_id"]) {
                    newRecords.push(record2);
                }
            });
        });
        this.setState({
            user_rows: newRecords
        });
    }*/
    handlePageChange = (pageNumber) => {
        let userRows = this.state.temp_user_rows;
        let newUserRows = [];
        let startIndex= 0;
        let endIndex= this.state.perPageLimit -1;
        let perPageLimit = this.state.perPageLimit;
        if(pageNumber != 1){
            startIndex = (pageNumber * perPageLimit) - perPageLimit;
            endIndex = (pageNumber * perPageLimit) - 1;
        }
        let rows_count = 0;
            for(let i=0;i<userRows.length;i++){
                if(rows_count>=startIndex && rows_count<=endIndex){
                    newUserRows.push(userRows[i]);
                }
                rows_count = rows_count + 1;
            }


        this.setState({
            activePage: pageNumber,
            user_rows: newUserRows
        });

    }
    handlePerPageLimit = (noOfLinesLimit, temp_user_rows = 0) => {
        let userRows = this.state.temp_user_rows;
        /*if(temp_user_rows != 0){
            userRows = temp_user_rows;
        }*/
        let newUserRows = [];
        let startIndex= 0;
        let endIndex= noOfLinesLimit;
        let perPageLimit = noOfLinesLimit;
        let default_perPageLimit = noOfLinesLimit;
        let rows_count = 0;
        for(let i=0;i<userRows.length;i++){
                rows_count = rows_count + 1;
                if(noOfLinesLimit == 0){
                    newUserRows.push(userRows[i]);
                }
                else{
                    if(rows_count>=startIndex && rows_count<=endIndex){
                        newUserRows.push(userRows[i]);
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
            user_rows: newUserRows,
            rows_count: rows_count
        });
    }


    _exporter;
    export = () => {
        this._exporter.save();
    }

    render() {
        const { validated } = this.state;
        const FreeTextSearch = [
            <div style={{/* paddingBottom: 10*/}}>
                <form className="">
                    <Form.Row style={{paddingLeft: 0, paddingBottom: 0}}>
                        <Form.Group as={Col}>
                            <Dropdown>
                                <Dropdown.Toggle>
                                    {this.state.dropdown_default_certificate}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="customScrollToDropDowns">
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

                                <Dropdown.Menu className="customScrollToDropDowns">
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
                                    <Dropdown.Item value="all" onClick={(event,value) => {this.handleChangeStatus("all","All")}}>All</Dropdown.Item>
                                    <Dropdown.Item value="active" onClick={(event,value) => {this.handleChangeStatus("active","Active")}}>Active</Dropdown.Item>
                                    <Dropdown.Item value="notActive" onClick={(event,value) => {this.handleChangeStatus("notActive","Not Active")}}>Not Active</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Dropdown>
                                <Dropdown.Toggle>
                                    {this.state.dropdown_default_location}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="customScrollToDropDowns">
                                    {this.state.locations_list ? this.state.locations_list.map(location => (
                                            <Dropdown.Item value={location.country_code} onClick={(code) => {this.handleLocationChange(location.country_code)}}>{location.country_code}</Dropdown.Item>
                                        ))

                                        :
                                        <Dropdown.Item value="">No Location</Dropdown.Item>
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Dropdown>
                                <Dropdown.Toggle>
                                    {this.state.dropdown_default_type}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="customScrollToDropDowns">
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


                    <Form.Row style={{paddingLeft: 0, paddingTop: 0, paddingBottom: 0}}>
                        <Form.Group as={Col}>
                            <Dropdown style={{marginTop: 0}}>
                                <Dropdown.Toggle>
                                    {this.state.dropdown_default_version}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="customScrollToDropDowns">
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
                            <Dropdown style={{marginTop: 0}}>
                                <Dropdown.Toggle>
                                    {this.state.dropdown_default_profession}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="customScrollToDropDowns">
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
                            <Dropdown style={{marginTop: 0}}>
                                <Dropdown.Toggle>
                                    {this.state.dropdown_default_cert_status}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item value="All" onClick={(event,value) => {this.handleChangeCertStatus("All","All")}}>All</Dropdown.Item>
                                    <Dropdown.Item value="Yes" onClick={(event,value) => {this.handleChangeCertStatus("Yes","Yes")}}>Yes</Dropdown.Item>
                                    <Dropdown.Item value="No" onClick={(event,value) => {this.handleChangeCertStatus("No","No")}}>No</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Dropdown style={{marginTop: 0}}>
                                <Dropdown.Toggle>
                                    {this.state.dropdown_default_cert_action_status}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item value="All" onClick={(event,value) => {this.handleChangeCertActionStatus("All","All")}}>All</Dropdown.Item>
                                    <Dropdown.Item value="None" onClick={(event,value) => {this.handleChangeCertActionStatus("None","None")}}>None</Dropdown.Item>
                                    <Dropdown.Item value="Incomplete" onClick={(event,value) => {this.handleChangeCertActionStatus("Incomplete","Incomplete")}}>Incomplete</Dropdown.Item>
                                    <Dropdown.Item value="Expire Soon" onClick={(event,value) => {this.handleChangeCertActionStatus("Expire Soon","Expire Soon")}}>Expire Soon</Dropdown.Item>
                                    <Dropdown.Item value="Expired" onClick={(event,value) => {this.handleChangeCertActionStatus("Expired","Expired")}}>Expired</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Control type="text" placeholder="Enter Search String" value={this.state.searchList}
                                          onChange={(event) => {this.handleChangeSearchList(event)}} onKeyPress={this.handleKeyPress}
                            />
                        </Form.Group>
                    </Form.Row>

                    {/*<Form.Row>
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
                    </Form.Row>*/}

                </form>
            </div>
        ]

        return (
            <div style={{marginLeft: 15, width: '99%'}}>

                {FreeTextSearch}
                <Row>
                    <Col xs={8} sm={8} md={8} lg={8}>
                        <Button variant="outline-primary" onClick={this.openCreateUser} style={{marginRight : 10, marginBottom: 10}}>
                            Create User
                        </Button>
                        <Button variant="outline-primary" onClick={this.openConnectRole} style={{marginRight : 10, marginBottom: 10}}>
                            Connect Role
                        </Button>
                        <Button variant="outline-primary" onClick={this.openConnectCertificate} style={{marginRight : 10, marginBottom: 10}}>
                            Connect Certificate
                        </Button>
                        <Button variant="outline-primary" onClick={this.openExternalCourse} style={{marginRight : 10, marginBottom: 10}}>
                            External Course
                        </Button>
                        <Button variant="outline-primary" onClick={this.openSendMessage} style={{marginRight : 10, marginBottom: 10}}>
                            Send Message
                        </Button>
                        <Button variant="outline-primary" onClick={this.openSendEmail} style={{marginRight : 10, marginBottom: 10}}>
                            Send Email
                        </Button>

                        <Link className="linkCreateActivity" to={{
                            pathname: '/new_quest/'+1,
                            state: { user_ids: this.state.checked_ids }
                        }}>
                            <Button variant="outline-primary" className="changeLinkOnHover" style={{marginRight : 10, marginBottom: 10}}>Create Activity</Button>
                        </Link>

                        <Button variant="outline-primary" onClick={this.exportData} style={{marginBottom: 10}}>
                            Export Data
                        </Button>
                        {this.state.element}
                    </Col>

                    <Col xs={4} sm={4} md={4} lg={4} style={{textAlign: 'right', right: '0.8%'}}>
                        <Button variant="outline-primary" onClick={this.searchList} style={{marginRight: 10}}>
                            <i class="fa fa-search" aria-hidden="true"></i>Search
                        </Button>
                        <Button variant="outline-primary" onClick={this.searchClear}>
                            <i class="fa fa-times" aria-hidden="true"></i>Clear
                        </Button>
                    </Col>
                </Row>
                {this.state.rows_count > 10 ?
                    <Row style={{marginTop: 15, justifyContent: 'flex-end', margin: 0, marginRight: 2, marginBottom: 10}}>
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
                            <th style={{width:'3%', padding: '1%', paddingTop: '1.3%'}}><input type="checkbox" value="-1" onChange={e => this.handleChangeAll(e)} /></th>
                            <th style={{width:'7%',textAlign: 'left'}} onClick={()=>{this.sortByColoumn('id')}}>ID
                                <i className={this.state.column!='id'?
                                    "fa fa-sort": (this.state.column == 'id' && !this.state.isDesc)?
                                        'fa fa-sort-asc':'fa fa-sort-desc'}
                                   aria-hidden="true" style={{marginLeft: 5}}></i>
                            </th>
                            <th style={{width:'15%'}} onClick={()=>{this.sortByColoumn('name')}}>Name
                                <i className={this.state.column!='name'?
                                    "fa fa-sort": (this.state.column == 'name' && !this.state.isDesc)?
                                        'fa fa-sort-asc':'fa fa-sort-desc'}
                                   aria-hidden="true" style={{marginLeft: 5}}></i>
                            </th>
                            <th style={{width:'10%'}} onClick={()=>{this.sortByColoumn('role')}}>Roles
                                <i className={this.state.column!='role'?
                                    "fa fa-sort": (this.state.column == 'role' && !this.state.isDesc)?
                                        'fa fa-sort-asc':'fa fa-sort-desc'}
                                   aria-hidden="true" style={{marginLeft: 5}}></i>
                            </th>
                            <th style={{width:'10%'}} onClick={()=>{this.sortByColoumn('role_status')}}>Roles Status
                                <i className={this.state.column!='role_status'?
                                    "fa fa-sort": (this.state.column == 'role_status' && !this.state.isDesc)?
                                        'fa fa-sort-asc':'fa fa-sort-desc'}
                                   aria-hidden="true" style={{marginLeft: 5}}></i>
                            </th>
                            <th style={{width:'15%'}} onClick={()=>{this.sortByColoumn('certificate')}}>Certificates
                                <i className={this.state.column!='certificate'?
                                    "fa fa-sort": (this.state.column == 'certificate' && !this.state.isDesc)?
                                        'fa fa-sort-asc':'fa fa-sort-desc'}
                                   aria-hidden="true" style={{marginLeft: 5}}></i>
                            </th>
                            <th style={{width:'10%'}} onClick={()=>{this.sortByColoumn('certificate_status')}}>Certificates Status
                                <i className={this.state.column!='certificate_status'?
                                    "fa fa-sort": (this.state.column == 'certificate_status' && !this.state.isDesc)?
                                        'fa fa-sort-asc':'fa fa-sort-desc'}
                                   aria-hidden="true" style={{marginLeft: 5}}></i>
                            </th>
                            <th style={{width:'10%'}} onClick={()=>{this.sortByColoumn('certificate_action')}}>Action
                                <i className={this.state.column!='certificate_action'?
                                    "fa fa-sort": (this.state.column == 'certificate_action' && !this.state.isDesc)?
                                        'fa fa-sort-asc':'fa fa-sort-desc'}
                                   aria-hidden="true" style={{marginLeft: 5}}></i>
                            </th>
                            <th style={{width:'20%'}} onClick={()=>{this.sortByColoumn('comments')}}>Comments
                                <i className={this.state.column!='comments'?
                                    "fa fa-sort": (this.state.column == 'comments' && !this.state.isDesc)?
                                        'fa fa-sort-asc':'fa fa-sort-desc'}
                                   aria-hidden="true" style={{marginLeft: 5}}></i>
                            </th>
                        </tr>
                    </thead>
                            <tbody>
                                {this.state.user_rows.map(user_row => (
                                    <tr>
                                        <td>
                                            {user_row.checkbox && <input type="checkbox" value={user_row.id} onChange={e => this.handleChangeCheckBox(e)} />}
                                        </td>

                                        <td style={{textAlign: 'left'}}>{user_row.id}</td>

                                        <td>
                                            <Link to={{pathname: '/userProfile/'+user_row.id}}>{user_row.name}</Link>
                                        </td>

                                        <td>{user_row.role}</td>

                                        {user_row.role_status =="" && <td>{user_row.role_status}</td>}
                                        {user_row.role_status =="Active" && <td style={{background:'#66BB6A'}}>{user_row.role_status}</td>}
                                        {user_row.role_status =="Not Active" && <td style={{background:'#EF5350'}}>{user_row.role_status}</td>}

                                        {user_row.certificate!=""&&
                                        <td>
                                            <ul style={{textAlign: 'left',margin: 0}}>{/*<ul style={{textAlign: 'left',margin: 0}}>&#x2756; &nbsp;*/}
                                                <li>{user_row.certificate}</li>
                                            </ul>
                                        </td>}
                                        {user_row.certificate==""&&<td>{user_row.certificate}</td>}

                                        {user_row.certificate_status =="" && <td>{user_row.certificate_status}</td>}
                                        {user_row.certificate_status =="Yes" && <td style={{background:'#66BB6A'}}>{user_row.certificate_status}</td>}
                                        {user_row.certificate_status =="No" && <td style={{background:'#EF5350'}}>{user_row.certificate_status}</td>}

                                        {user_row.certificate_action =="" && <td>{user_row.certificate_action}</td>}
                                        {user_row.certificate_action =="None" && <td style={{background:'#66BB6A'}}>{user_row.certificate_action}</td>}
                                        {user_row.certificate_action =="Incomplete" && <td style={{background:'#FFCA28'}} onClick={() =>
                                            this.openCompleteCertificate(user_row.certificate_id,user_row.certificate,user_row.valid_months)}>{user_row.certificate_action}
                                            </td>
                                        }
                                        {user_row.certificate_action =="Expire Soon" && <td style={{background:'#9500c6'}}>{user_row.certificate_action}</td>}
                                        {user_row.certificate_action =="Expired" && <td style={{background:'#EF5350'}}>{user_row.certificate_action}</td>}

                                        <td>{user_row.comments}</td>
                                    </tr>
                                ))}
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


                {/* COMPLETE CERTIFICATE MODAL*/}
                <Modal show={this.state.openCompleteCertificate} onHide={this.closeCompleteCertificate}
                       aria-labelledby="contained-modal-title-vcenter" size="lg"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Complete Certificate: &nbsp;<span style={{fontWeight: 'normal'}}>{this.state.complete_certificate_name}</span></Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{maxHeight: 'calc(100vh - 300px)', overflowY: 'auto'}}>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Personal Certificate ID</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Certificate ID"
                                                      onChange={(event) => this.setState({complete_certificate_user_id: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Personal Certificate Accreditor</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Certificate Accreditor"
                                                      onChange={(event) => this.setState({complete_certificate_accreditor: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control type="date"
                                                      onChange={(event) => this.changeCompleteCertificateDates(event.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Valid Months</Form.Label>
                                        <Form.Control type="text" value={this.state.complete_certificate_valid_months} disabled
                                                      onChange={(event) => console.log("")}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control type="text" value={this.state.complete_certificate_end_date} disabled
                                                      onChange={(event) => console.log("")}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Assessor ID</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Certificate Assessor ID"
                                                      onChange={(event) => this.setState({complete_certificate_assessor_id: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Assessor First Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Assessor First Name"
                                                      onChange={(event) => this.setState({complete_certificate_assessor_firstname: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6} sm={6} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Assessor Last Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Assessor Last Name"
                                                      onChange={(event) => this.setState({complete_certificate_assessor_lastname: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Comments</Form.Label>
                                        <Form.Control as="textarea" ref="complete_certificate_comments" rows="3" className="textArea" placeholder="Enter Comments"
                                                      onChange={(event) => this.setState({complete_certificate_comments: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Row style={{marginLeft: 0}}>
                                <Form.Group as={Col}>
                                    <Form.Label>File List :</Form.Label>
                                    <div className="heightMarginLeftScrollAuto">
                                        <Form.Group className="addNewExternalCourceBtn">
                                            <input type="file" id="files" onChange={this.addCompleteCertificateFile} style={{float : 'right'}}/>
                                        </Form.Group>
                                        {this.state.complete_certificate_files ?  this.state.complete_certificate_files.map(file => (
                                                <span>
                                                <Col xs={2} sm={2} md={2} lg={2} className="displayInlineBlock">
                                                    <label className="textOut">{file.name} </label>
                                                </Col>
                                                <Col xs={1} sm={1} md={1} lg={1} className="displayInlineBlock">
                                                    <Button className="btn removeFileBtn deleteBtn" onClick={() => this.removeCompleteCertificateFile(file.name)}><i className="fa fa-trash"></i></Button>
                                                </Col>
                                               <br/>
                                        </span>
                                            )):
                                            <label> No Files Selected</label>
                                        }
                                    </div>
                                </Form.Group>
                            </Form.Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeCompleteCertificate}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.completeCertifcateUser} style={{marginLeft: 5}}>
                                    Submit
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>



                {/* CREATE USER MODAL*/}
                <Modal show={this.state.openCreateUser} onHide={this.closeCreateUser}
                       aria-labelledby="contained-modal-title-vcenter" size="lg"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Create New User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{maxHeight: 'calc(100vh - 300px)', overflowY: 'auto'}}>
                        <Form ref="createUserModalForm"
                              noValidate
                              validated={validated}>
                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Username" required
                                                      onChange={(event) => this.setState({user_name: event.target.value})}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            Enter valid username.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" placeholder="Enter Email" required
                                                      onChange={(event) => this.setState({email: event.target.value})}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            Enter valid email.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter First Name" required
                                                      onChange={(event) => this.setState({first_name: event.target.value})}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            Enter valid first name.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Last Name" required
                                                      onChange={(event) => this.setState({last_name: event.target.value})}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            Enter valid last name.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Enter Password" required
                                                      onChange={(event) => this.setState({password: event.target.value})}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            Enter valid password.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Phone</Form.Label>
                                        {/*
                                        ^([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9A-Z \.\-]{1,32})((x|ext|extension)?[0-9]{1,4}?)$
                                        */}
                                        <Form.Control type="text" placeholder="Enter Phone Number" required pattern="(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})"
                                                      onChange={(event) => this.setState({phone: event.target.value})}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            Enter valid phone.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Name" required
                                                      onChange={(event) => this.setState({name: event.target.value})}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            Enter valid name.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Gender</Form.Label>
                                        <Dropdown style={{margin: 0}} required feedback="You must agree before submitting.">
                                            <Dropdown.Toggle required feedback="You must agree before submitting.">
                                                {this.state.dropdown_default_select_gender}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="customScrollToDropDowns" required feedback="You must agree before submitting.">
                                                <Dropdown.Item value="Male" required feedback="You must agree before submitting."
                                                               onClick={(gender) => {this.setState({gender: "Male",dropdown_default_select_gender: "Male"})}}>
                                                    Male
                                                </Dropdown.Item>
                                                <Dropdown.Item value="Female"
                                                               onClick={(gender) => {this.setState({gender: "Female",dropdown_default_select_gender: "Female"})}}>
                                                    Female
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Birth Year</Form.Label>
                                        <Form.Control type="number" placeholder="Enter Birth Year" min="1900" max={this.state.maxYear} required
                                                      onChange={(event) => this.setState({yearOfBirth: event.target.value})}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            Enter valid birth year (1900 to {this.state.maxYear}).
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Level Of Education</Form.Label>
                                        <Dropdown style={{margin: 0}}>
                                            <Dropdown.Toggle>
                                                {this.state.dropdown_default_select_level_of_education}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="customScrollToDropDowns">
                                                <Dropdown.Item value="Matric"
                                                               onClick={(gender) => {this.setState({levelOfEducation: "Matric",
                                                                   dropdown_default_select_level_of_education: "Matric"})}}>
                                                    Matric
                                                </Dropdown.Item>
                                                <Dropdown.Item value="Inter"
                                                               onClick={(gender) => {this.setState({levelOfEducation: "Inter",
                                                                   dropdown_default_select_level_of_education: "Inter"})}}>
                                                    Inter
                                                </Dropdown.Item>
                                                <Dropdown.Item value="Bachelor"
                                                               onClick={(gender) => {this.setState({levelOfEducation: "Bachelor",
                                                                   dropdown_default_select_level_of_education: "Bachelor"})}}>
                                                    Bachelor
                                                </Dropdown.Item>
                                                <Dropdown.Item value="Master"
                                                               onClick={(gender) => {this.setState({levelOfEducation: "Master",
                                                                   dropdown_default_select_level_of_education: "Master"})}}>
                                                    Master
                                                </Dropdown.Item>
                                                <Dropdown.Item value="Doctoral"
                                                               onClick={(gender) => {this.setState({levelOfEducation: "Doctoral",
                                                                   dropdown_default_select_level_of_education: "Doctoral"})}}>
                                                    Doctoral
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Goals</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Goals" required
                                                      onChange={(event) => this.setState({goals: event.target.value})}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            Enter valid goals seperated by comma(,).
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            {/*<Button type="submit">Submit form</Button>*/}
                        </Form>

                       {/* <Form ref="addNewArchiveForm">
                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Username"
                                                      onChange={(event) => this.setState({user_name: event.target.value})}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" placeholder="Enter Email"
                                                      onChange={(event) => this.setState({email: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter First Name"
                                                      onChange={(event) => this.setState({first_name: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Last Name"
                                                      onChange={(event) => this.setState({last_name: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Enter Password"
                                                      onChange={(event) => this.setState({password: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Phone Number"
                                                      onChange={(event) => this.setState({phone: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Name"
                                                      onChange={(event) => this.setState({name: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Gender</Form.Label>
                                        <Dropdown style={{margin: 0}}>
                                            <Dropdown.Toggle>
                                                {this.state.dropdown_default_select_gender}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="customScrollToDropDowns">
                                                <Dropdown.Item value="Male"
                                                               onClick={(gender) => {this.setState({gender: "Male",dropdown_default_select_gender: "Male"})}}>
                                                    Male
                                                </Dropdown.Item>
                                                <Dropdown.Item value="Female"
                                                               onClick={(gender) => {this.setState({gender: "Female",dropdown_default_select_gender: "Female"})}}>
                                                    Female
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Birth Year</Form.Label>
                                        <Form.Control type="number" placeholder="Enter Birth Year" maxLength="4"
                                                      onChange={(event) => this.setState({yearOfBirth: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Level Of Education</Form.Label>
                                        <Dropdown style={{margin: 0}}>
                                            <Dropdown.Toggle>
                                                {this.state.dropdown_default_select_level_of_education}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="customScrollToDropDowns">
                                                <Dropdown.Item value="Matric"
                                                               onClick={(gender) => {this.setState({levelOfEducation: "Matric",
                                                                   dropdown_default_select_level_of_education: "Matric"})}}>
                                                    Matric
                                                </Dropdown.Item>
                                                <Dropdown.Item value="Inter"
                                                               onClick={(gender) => {this.setState({levelOfEducation: "Inter",
                                                                   dropdown_default_select_level_of_education: "Inter"})}}>
                                                    Inter
                                                </Dropdown.Item>
                                                <Dropdown.Item value="Bachelor"
                                                               onClick={(gender) => {this.setState({levelOfEducation: "Bachelor",
                                                                   dropdown_default_select_level_of_education: "Bachelor"})}}>
                                                    Bachelor
                                                </Dropdown.Item>
                                                <Dropdown.Item value="Master"
                                                               onClick={(gender) => {this.setState({levelOfEducation: "Master",
                                                                   dropdown_default_select_level_of_education: "Master"})}}>
                                                    Master
                                                </Dropdown.Item>
                                                <Dropdown.Item value="Doctoral"
                                                               onClick={(gender) => {this.setState({levelOfEducation: "Doctoral",
                                                                   dropdown_default_select_level_of_education: "Doctoral"})}}>
                                                    Doctoral
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} sm={12} md={6} lg={6}>
                                    <Form.Group as={Col}>
                                        <Form.Label>Goals</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Goals"
                                                      onChange={(event) => this.setState({goals: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>*/}
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeCreateUser}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.createNewUser}
                                        style={{marginLeft: 5}}>
                                    Create
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>



                {/* CONNECT ROLE MODAL*/}
                <Modal show={this.state.openConnectRole} onHide={this.closeConnectRole}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Connect Role</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>
                                    <Select
                                        closeMenuOnSelect={false}
                                        isMulti
                                        name="connectUser"
                                        components={makeAnimated()}
                                        options={this.state.connect_temp_roles_list}
                                        placeholder="Search Role..."
                                        onChange={this.handleChangeConnectRole}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                    {/*<Dropdown className="addNewArchiveModalDropDowns">
                                        <Dropdown.Toggle>
                                            {this.state.default_dropdown_role_name}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="customScrollToDropDowns">
                                            {this.state.roles_list ? this.state.roles_list.map(role => (
                                                    <Dropdown.Item value={role.id} onClick={(id,name) => {this.handleChangeConnectRole(role.id,role.name)}}>{role.name}</Dropdown.Item>
                                                ))

                                                :
                                                <Dropdown.Item value="">No Roles</Dropdown.Item>
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>*/}
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date"
                                                  onChange={(event) => this.setState({start_date: event.target.value})}
                                    />
                                </Form.Group>
                            </Row>
                            {/*<Row>
                                <Form.Group as={Col}>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="date"
                                                  onChange={(event) => this.setState({end_date: event.target.value})}
                                    />
                                </Form.Group>
                            </Row>*/}
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeConnectRole}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.connectUsersToRole}
                                        style={{marginLeft: 5}}>
                                    Connect
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* CONNECT CERTIFICATE MODAL*/}
                <Modal show={this.state.openConnectCertificate} onHide={this.closeConnectCertificate}
                       aria-labelledby="contained-modal-title-vcenter"

                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Connect Certificate</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>
                                    <Select
                                        closeMenuOnSelect={false}
                                        isMulti
                                        name="connectUser"
                                        components={makeAnimated()}
                                        options={this.state.connect_temp_certificates_list}
                                        placeholder="Search Certificate..."
                                        onChange={this.handleChangeConnectCertificate}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                    {/*<Dropdown className="addNewArchiveModalDropDowns">
                                        <Dropdown.Toggle>
                                            {this.state.default_dropdown_certificate_name}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="customScrollToDropDowns">
                                            {this.state.certificates_list ? this.state.certificates_list.map(certificate => (
                                                    <Dropdown.Item value={certificate.id} onClick={(id,name) => {this.handleChangeConnectCertificate(certificate.id,certificate.name)}}>{certificate.name}</Dropdown.Item>
                                                ))

                                                :
                                                <Dropdown.Item value="">No Certificates</Dropdown.Item>
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>*/}
                                </Form.Group>
                            </Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeConnectCertificate}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.connectUsersToCertificate} style={{marginLeft: 5}}>
                                    Connect
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* EXTERNAL MODAL*/}
                <Modal show={this.state.openExternalCourse} onHide={this.closeExternalCourse}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Exterenal Course</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>
                                    <Select
                                        closeMenuOnSelect={false}
                                        isMulti
                                        name="connectUser"
                                        components={makeAnimated()}
                                        options={this.state.external_course_list}
                                        placeholder="Search External Course..."
                                        onChange={this.handleChangeExternalCourse}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                </Form.Group>
                            </Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeExternalCourse}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.connectExternalCourse}
                                        style={{marginLeft: 5}}>
                                    Connect
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>



                {/* SEND MESSAGE MODAL*/}
                <Modal show={this.state.openSendMessage} onHide={this.closeSendMessage}
                       aria-labelledby="contained-modal-title-vcenter" size="lg"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Message</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Enter Text</Form.Label>
                                    <Form.Control as="textarea" placeholder="Message body" value={this.state.messageBody} rows="3" style={{resize: 'none'}}
                                                  onChange={(event) => this.setState({messageBody: event.target.value})}
                                    />
                                </Form.Group>
                            </Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeSendMessage}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.sendMessage} style={{marginLeft: 5}}>
                                    Send
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>


                {/* SEND EMAIL MODAL*/}
                <Modal show={this.state.openSendEmail} onHide={this.closeSendEmail}
                       aria-labelledby="contained-modal-title-vcenter" size="lg"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Message</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form ref="sendEmailForm"
                              noValidate
                              validated={validated}>
                            <Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Enter Subject</Form.Label>
                                    <Form.Control type="text" placeholder="Eamil subject" required
                                                  onChange={(event) => this.setState({emailSubject: event.target.value})}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        Subject is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Enter Text</Form.Label>
                                    <Form.Control as="textarea" placeholder="Email body" value={this.state.emailBody} required
                                                  rows="3" style={{resize: 'none'}}
                                                  onChange={(event) => this.setState({emailBody: event.target.value})}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        Body can not be empty required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.closeSendEmail}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.sendEmail} style={{marginLeft: 5}}>
                                    Send
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
    const { messageResponse, status } = state.postMessage;
    const {filterationObj} = state.filteration;
    return {
        messageResponse, status ,filterationObj
    };
}

export default connect(mapStateToProps) (UsersData);

/*
function mapDispatchToProps(dispatch) {
    return bindActionCreators({getBlogList: getBlogList}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps) (BlogList);
*/


// export default UsersData;
