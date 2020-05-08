/* eslint-disable */
import React, {Component} from 'react';
import { Dropdown, DropdownButton, Container, Row, Col, NavDropdown, Form, Button, Badge, Alert, ButtonToolbar, Table,Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import CircularProgress from 'material-ui/CircularProgress';
import Pagination from "react-js-pagination";
import { connect } from 'react-redux';
// import { alertActions } from '../../actions';
import {certificateFilterActions} from '../../actions/certificateFilters.actions';
import swal from 'sweetalert';

import {
    ExcelExport,
    ExcelExportColumn,
} from '@progress/kendo-react-excel-export';
const colourOptions = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', disabled: true },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'silver', label: 'Silver', color: '#666666' },
];

class RolesData extends Component {
    constructor(props) {
        super(props);
        this.goAddNewRole = this.goAddNewRole.bind(this);
        this.addRoleToUser = this.addRoleToUser.bind(this);
        this.exportData = this.exportData.bind(this);
        this.addCertificateToRole = this.addCertificateToRole.bind(this);
        this.state = {
            activePage: 1,
            perPageLimit: 10,
            default_perPageLimit: "No of pages",
            rows_count: 0,
            showLoadingConnectUser: false,
            isDesc: false,
            column: '',
            roles:"",
            roles_rows:[],
            temp_roles_rows: [],
            temp: "",
            searchList : "",
            filter_result : "",
            role_name : "",
            dropdown_default_role : "Select Role",
            dropdown_default_connect_user_certificate_filter : "Filter By Certificate",
            dropdown_default_connect_user_role_filter : "Filter By Role",
            certificates_list : "",
            connect_temp_certificates_list: [],
            certificate_name : "",
            dropdown_default_certificate : "Select Certificate",
            status_name : "",
            dropdown_default_status : "Select Status",
            certificate_id : "",
            openConnectUser : false,
            openConnectCertificate : false,
            user_id : "",
            temp_user_list : [],
            user_list : [],
            start_date : "",
            end_date : "",
            filterationObj : {
                "role_name": "",
                "certificate_name": "",
                "status": "",
                "string": "",
            },
            element: ""
        };
    }

    componentDidMount() {
        this.reAssignFiltersFromState();
        this.getRolesList();
        this.getCertificateList();
        this.getUsersList();
    }
    exportData() {
        var inputs = document.getElementsByTagName("input");
        var role_ids = [];
        for (var k = 0; k < inputs.length; k++) {
            if (inputs[k].type == "checkbox"&&inputs[k].value!=-1&&inputs[k].checked) {
                role_ids.push(inputs[k].value);
            }
        }
        // let rolesRows = this.state.roles_rows;
        let allRoles = this.state.roles;
        let rolesRows = [];
        if(allRoles.length>0) {
            allRoles.forEach(function (role) {
                role.roles_rows.forEach(function (row) {
                    rolesRows.push(row);
                });
            });
        }
        /*let allRolesData = this.state.roles;
        let rolesRows = [];
        for(let l=0;l<role_ids.length;l++) {
            for (let i = 0; i < allRolesData.length; i++) {
                if(allRolesData[i].id == role_ids[l]) {
                    for (let j = 0; j < allRolesData[i].roles_rows.length; j++) {
                        rolesRows.push(allRolesData[i].roles_rows[j]);
                    }
                }
            }
        }*/
        const exportElement = [
            <ExcelExport
                data={rolesRows}
                // group={group}
                fileName="Roles.xlsx"
                ref={(exporter) => { this._exporter = exporter; }}
            >
                <ExcelExportColumn field="id" title="Role ID" locked={true} width={150} />
                <ExcelExportColumn field="name" title="Role Name" width={300} />
                <ExcelExportColumn field="description" title="Description" width={350} />
                <ExcelExportColumn field="work_description" title="Work Description" width={350} />
                <ExcelExportColumn field="certificates" title="Certificates" width={350} />
                <ExcelExportColumn field="status" title="Status" width={150} />
            </ExcelExport>
        ]
        this.setState({
            element:exportElement
        })
        setTimeout(this.export,1);
    }
    storeState = () => {
        const {dispatch} = this.props;
        dispatch(certificateFilterActions.setFiltersValues(this.state.filterationObj, "roles"));
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
                    }
                }
            }

            this.setState({
                filterationObj: newObj
            });
        }
    }
    getRolesList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_roles_list_main",  {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    let allRoles = result;
                    let allRolesRows = [];
                    let rolesRows = [];
                    let perPageLimit = this.state.perPageLimit;
                    let rows_count= 0;
                    if(allRoles.length>0) {
                        allRoles.forEach(function (role) {
                            role.roles_rows.forEach(function (row) {
                                rows_count = rows_count + 1;
                                allRolesRows.push(row);
                                if(rows_count <= perPageLimit) {
                                    rolesRows.push(row);
                                }
                            });
                        });
                    }

                    this.setState({
                        roles: result,
                        temp: result,
                        roles_rows: rolesRows,
                        temp_roles_rows: allRolesRows,
                        rows_count: rows_count
                    });
                    this.filterResult();
                },
                (error) => {

                }
            )
    }

    getUsersList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_users",  {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    result.forEach(function (user) {
                        user.value = user.id;
                        user.label = user.username;
                    })
                    this.setState({
                        temp_user_list: result,
                        user_list: result
                    });
                },

                (error) => {

                }
            )
    }

    goAddNewRole = () => {
        const redirectTo = "/add_new_role"
        this.props.props.props.history.push(redirectTo);
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

        let allRoles = this.state.temp;
        let allRolesRows = [];
        let rolesRows = [];
        let perPageLimit = this.state.perPageLimit;
        let rows_count= 0;
        if(allRoles.length>0) {
            allRoles.forEach(function (role) {
                role.roles_rows.forEach(function (row) {
                    rows_count = rows_count + 1;
                    allRolesRows.push(row);
                    if(rows_count <= perPageLimit) {
                        rolesRows.push(row);
                    }
                });
            });
        }

        this.setState({
            roles_rows: rolesRows,
            temp_roles_rows: allRolesRows,
            activePage: 1,
            rows_count: rows_count,
            roles: this.state.temp,
            searchList : "",
            filter_result : "",
            role_name : "",
            dropdown_default_role : "Select Role",
            certificate_name : "",
            dropdown_default_certificate : "Select Certificate",
            status_name : "",
            dropdown_default_status : "Select Status",
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

    containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }

        return false;
    }

    handleChange = (id,name) => {
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
    filterResult() {
        this.storeState();
        let filterationObj = this.state.filterationObj;
        let filterdBefore = 0;
        var data = this.state.temp;
        var filter_result = [];
        if(filterationObj.role_name!=null && filterationObj.role_name!="") {
            filterdBefore = 1;
            for (let i = 0; i < data.length; i++) {
                if (data[i].data.name == filterationObj.role_name) {
                    filter_result.push(data[i]);
                }
            }
        }
        if(filterationObj.certificate_name!=null && filterationObj.certificate_name!="") {
            let innerData = filter_result;
            let inner_filter_result = [];
            if(filterdBefore == 0){
                filterdBefore = 1;
                innerData = data;
            }
            for (let i = 0; i < innerData.length; i++) {
                if (innerData[i].certificates.length > 0) {
                    for (let j = 0; j < innerData[i].certificates.length; j++) {
                        if (innerData[i].certificates[j].name == filterationObj.certificate_name) {
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
                }else if(innerData[i].certificates.length>0 &&innerData[i].files.length==0){
                    for(var j = 0; j< innerData[i].certificates.length; j++){
                        if(innerData[i].certificates[j].name.toLowerCase().includes(searchValue)){
                            inner_filter_result.push(innerData[i]);
                            break;
                        }
                    }
                }else if(innerData[i].files.length>0 &&innerData[i].certificates.length==0){
                    for(var j = 0; j< innerData[i].files.length; j++){
                        if(innerData[i].files[j].file_name.toLowerCase().includes(searchValue)){
                            inner_filter_result.push(innerData[i]);
                            break;
                        }
                    }
                }else if(innerData[i].files.length>0 &&data[i].certificates.length>0){
                    for(var j = 0; j< innerData[i].certificates.length; j++){
                        if(innerData[i].certificates[j].name.toLowerCase().includes(searchValue)){
                            inner_filter_result.push(innerData[i]);
                            break;
                        }
                    }
                    if(!this.containsObject(innerData[i] , inner_filter_result)){
                        for (var j = 0; j< innerData[i].files.length; j++){
                            if(innerData[i].files[j].file_name.toLowerCase().includes(searchValue)){
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

        let allRoles = filter_result;
        let allRolesRows = [];
        let rolesRows = [];

        let perPageLimit = this.state.perPageLimit;
        let rows_count= 0;
        if(allRoles.length>0) {
            allRoles.forEach(function (role) {
                role.roles_rows.forEach(function (row) {
                    rows_count = rows_count + 1;
                    allRolesRows.push(row);
                    if (rows_count <= perPageLimit) {
                        rolesRows.push(row);
                    }
                });
            });
        }

        this.setState({
            roles: filter_result,
            roles_rows: rolesRows,
            temp_roles_rows: allRolesRows,
            rows_count: rows_count,
            filter_result : filter_result,
            activePage: 1
        });
    }

    getCertificateList(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_certificate_list",  {
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
                            certificates_list: result,
                            connect_temp_certificates_list: result,
                        });
                    }

                },

                (error) => {

                }
            )
    }

    handleChangeCertificate = (id,name) => {
        this.setState({
            certificate_name: name,
            dropdown_default_certificate: name,
        });
        let filterationObj = this.state.filterationObj;
        filterationObj.certificate_name = name;
        this.setState({
            filterationObj: filterationObj
        })
        this.filterResult();
    };

    handleChangeStatus = (name,capName) => {
        this.setState({
            status_name: name,
            dropdown_default_status: capName
        });
        let filterationObj = this.state.filterationObj;
        filterationObj.status = name;
        this.setState({
            filterationObj: filterationObj
        })
        this.filterResult();

    };
    handleChangeAll(e){
        var inputs = document.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1) {
                inputs[i].checked = e.target.checked;
                // This way it won't flip flop them and will set them all to the same value which is passed into the function
            }
        }
    }

    openConnectUser = () => {
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        var inputs = document.getElementsByTagName("input");
        var role_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                role_ids.push(inputs[i].value);
            }
        }
        if(role_ids.length<1){
            swal({
                title: "Error!",
                text: "Select At Least One Role!",
                icon: "error",
            });
            // dispatch(alertActions.error("Select At Least One Role"));
            // this.setState({openConnectUser: false});
            return;
        }
        this.setState({ openConnectUser: true });
    };

    closeConnectUser = () => {
        this.setState({
            openConnectUser: false,
            user_list: this.state.temp_user_list,
            user_id: "",
            start_date: "",
            dropdown_default_connect_user_role_filter: "Filter By Role",
            dropdown_default_connect_user_certificate_filter: "Filter By Certificate"
        });
    };
    handleChangeUser = (values) => {
        let userIds = [];
        values.forEach(function (user) {
            userIds.push(user.id);
        })
        this.setState({
            user_id: userIds
        });
    };
    /*handleChangeUser = (id,name) => {
        this.setState({
            user_id: id,
            default_dropdown_user_name: name
        });
    };*/
    filterUserListByCertificate = (name) => {
        if(name == null)
            name = "";
        let prevUsers = this.state.temp_user_list;
        let newUsers = [];
        prevUsers.forEach(function (user) {
            user.certificates.forEach(function (certificate) {
                if(certificate.name == null)
                    certificate.name = "";
                if(certificate.name.toString().toLowerCase() == name.toString().toLowerCase()){
                    newUsers.push(user);
                }
            });
        });
        this.setState({
            dropdown_default_connect_user_certificate_filter: name,
            user_list: newUsers
        })
    };
    filterUserListByRole = (name) => {
        if(name == null)
            name = "";
        let prevUsers = this.state.temp_user_list;
        let newUsers = [];
        prevUsers.forEach(function (user) {
            user.roles.forEach(function (role) {
                if(role.name == null)
                    role.name = "";
                if(role.name.toString().toLowerCase() == name.toString().toLowerCase()){
                    newUsers.push(user);
                }
            });
        });
        this.setState({
            dropdown_default_connect_user_role_filter: name,
            user_list: newUsers
        })
    };
    clearUserListFilters = () => {
        this.setState({
            dropdown_default_connect_user_role_filter: "Filter By Role",
            dropdown_default_connect_user_certificate_filter: "Filter By Certificate",
            user_list: this.state.temp_user_list
        })
    };


    openConnectCertificate = () => {
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        var inputs = document.getElementsByTagName("input");
        var role_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                role_ids.push(inputs[i].value);
            }
        }
        if(role_ids.length<1){
            // dispatch(alertActions.error("Select At Least One Role"));
            swal({
                title: "Error!",
                text: "Select At Least One Role!",
                icon: "error",
            });
            // this.setState({openConnectCertificate: false});
            return;
        }
        this.setState({ openConnectCertificate: true });
    };

    closeConnectCertificate = () => {
        this.setState({ openConnectCertificate: false, certificate_id: "", });
    };
    handleChangeConnectCertificate = (value) => {
        let certificateIds = [];
        value.forEach(function (certificate) {
            certificateIds.push(certificate.id);
        });
        this.setState({
            certificate_id: certificateIds
        });
    };

    addRoleToUser(){
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        this.setState({
            showLoadingConnectUser: true
        })
        var inputs = document.getElementsByTagName("input");
        var role_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                role_ids.push(inputs[i].value);
            }
        }
        if(this.state.user_id =="" || this.state.user_id==null){
            // dispatch(alertActions.error("Select Users To Be Connected"));
            /*this.setState({
                openConnectUser: false,
                showLoadingConnectUser: false,
                user_id: "",
                start_date: ""
            });*/
            swal({
                title: "Error!",
                text: "Select Users To Be Connected!",
                icon: "error",
            });
            return;
        }
        if(this.state.start_date =="" || this.state.start_date==null){
            // dispatch(alertActions.error("Select Start Date"));
            /*this.setState({
                openConnectUser: false,
                showLoadingConnectUser: false,
                user_id: "",
                start_date: ""
            });*/
            swal({
                title: "Error!",
                text: "Select Start Date!",
                icon: "error",
            });
            return;
        }
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/connect_role_user", {
            method: "POST",
            body:JSON.stringify({
                'role_id': role_ids,
                'user_id': this.state.user_id,
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
                        showLoadingConnectUser: false,
                        openConnectUser: false,
                        user_list: this.state.temp_user_list,
                        dropdown_default_connect_user_role_filter: "Filter By Role",
                        dropdown_default_connect_user_certificate_filter: "Filter By Certificate",
                        activePage: 1
                    });
                    // dispatch(alertActions.success("User Connected Successfully"));
                    this.getRolesList();
                    swal({
                        title: "Success!",
                        text: "User Connected Successfully!",
                        icon: "success",
                    });
                },

                (error) => {
                    this.setState({
                        showLoadingConnectUser: false
                    })
                    swal({
                        title: "Error!",
                        text: "Unable To Connect User!",
                        icon: "error",
                    });
                    // dispatch(alertActions.error("Unable To Connect User"));
                }
            )
    }
    addCertificateToRole(){
        const { dispatch } = this.props;
        // dispatch(alertActions.clear());
        var inputs = document.getElementsByTagName("input");
        var role_ids = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "checkbox"&&inputs[i].value!=-1&&inputs[i].checked) {
                role_ids.push(inputs[i].value);
            }
        }
        if(this.state.certificate_id =="" || this.state.certificate_id==null){
            // dispatch(alertActions.error("Select Certificates To Be Connected"));
            /*this.setState({
                openConnectCertificate: false,
                certificate_id: "",
            });*/
            swal({
                title: "Error!",
                text: "Select Certificates To Be Connected!",
                icon: "error",
            });
            return;
        }
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/connect_role_certificate", {
            method: "POST",
            body:JSON.stringify({
                'role_id': role_ids,
                'certificate_id': this.state.certificate_id,
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
                    this.getRolesList();
                    swal({
                        title: "Success!",
                        text: "Certificate Connected Successfully!",
                        icon: "success",
                    });
                },
                (error) => {
                    this.setState({ openConnectCertificate: false });
                    // dispatch(alertActions.error("Unable To Connect Certificate"));
                    swal({
                        title: "Error!",
                        text: "Unable To Connect Certificate!",
                        icon: "error",
                    });
                }
            )
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

        let savedRrecords = this.state.temp_roles_rows;
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
                if (record["object_id"] == record2["object_id"]) {
                    newRecords.push(record2);
                }
            });
        });
        this.setState({
            roles_rows: newRecords,
            temp_roles_rows: newRecords,
            rows_count: newRecords.length, // to hide pagination control
            perPageLimit: newRecords.length, // to hide pagination control
            default_perPageLimit: "All",
            activePage: 1
        });
    }
    handlePageChange = (pageNumber) => {
        let rolesRows = this.state.temp_roles_rows;
        let newRolesRows = [];
        let startIndex= 0;
        let endIndex= this.state.perPageLimit - 1;
        let perPageLimit = this.state.perPageLimit;
        if(pageNumber != 1){
            startIndex = (pageNumber * perPageLimit) - perPageLimit;
            endIndex = (pageNumber * perPageLimit) - 1;
        }
        let rows_count = 0;
        for(let i=0;i<rolesRows.length;i++){
                if(rows_count>=startIndex && rows_count<=endIndex){
                    newRolesRows.push(rolesRows[i]);
                }
            rows_count = rows_count + 1;

        }

        this.setState({
            activePage: pageNumber,
            roles_rows: newRolesRows
        });
    }
    handlePerPageLimit = (noOfLinesLimit) => {
        let rolesRows = this.state.temp_roles_rows;
        let newRolesRows = [];
        let startIndex= 0;
        let endIndex= noOfLinesLimit;
        let perPageLimit = noOfLinesLimit;
        let default_perPageLimit = noOfLinesLimit;
        let rows_count = 0;
        for(let i=0;i<rolesRows.length;i++){

                rows_count = rows_count + 1;
                if(noOfLinesLimit == 0){
                    newRolesRows.push(rolesRows[i]);
                }
                else{
                    if(rows_count>=startIndex && rows_count<=endIndex){
                        newRolesRows.push(rolesRows[i]);
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
            roles_rows: newRolesRows,
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
                                    {this.state.temp ? this.state.temp.map(role => (
                                            <Dropdown.Item value={role.data.name} onClick={(id,name) => {this.handleChange(role.data.id,role.data.name)}}>{role.data.name}</Dropdown.Item>
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

                        <Form.Group as={Col} style={{marginTop: '2.35%'}}>
                            <Form.Control type="text" placeholder="Enter Search String" value={this.state.searchList}
                                          onChange={(event) => {this.handleChangeSearchList(event)}} onKeyPress={this.handleKeyPress}
                            />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <div style={{ marginTop: '12.2%'}}>
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

            <div style={{marginLeft:15, marginBottom: 15}}>
                {FreeTextSearch}
                <ButtonToolbar style={{marginBottom: 15}}>
                    <Button variant="outline-primary" onClick={this.goAddNewRole} style={{marginRight: 10, marginBottom: 10}}>
                        Add New Role
                    </Button>
                    <Button variant="outline-primary" onClick={this.openConnectUser} style={{marginRight: 10, marginBottom: 10}}>
                        Connect User
                    </Button>
                    <Button variant="outline-primary" onClick={this.openConnectCertificate} style={{marginRight: 10, marginBottom: 10}}>
                        Connect Certificate
                    </Button>
                    <Button variant="outline-primary" onClick={this.exportData} style={{marginBottom: 10}}>
                        Export Data
                    </Button>
                    {this.state.element}

                </ButtonToolbar>
                {this.state.rows_count > 10 ?
                    <Row style={{justifyContent: 'flex-end', margin: 0, marginRight: 2, marginBottom: 10}}>
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
                            <th style={{width:'3%', padding: '1%', paddingTop: '1.3%'}}><input type="checkbox" value="-1" onChange={e => this.handleChangeAll(e)}/></th>
                            <th style={{width:'7%', textAlign: 'left'}} onClick={()=>{this.sortByColoumn('id')}}>ID
                                <i className={this.state.column!='id'?
                                    "fa fa-sort": (this.state.column == 'id' && !this.state.isDesc)?
                                        'fa fa-sort-asc':'fa fa-sort-desc'}
                                   aria-hidden="true" style={{marginLeft: 5}}></i>
                            </th>
                            <th style={{width:'10%'}} onClick={()=>{this.sortByColoumn('name')}}>Name
                                <i className={this.state.column!='name'?
                                    "fa fa-sort": (this.state.column == 'name' && !this.state.isDesc)?
                                        'fa fa-sort-asc':'fa fa-sort-desc'}
                                   aria-hidden="true" style={{marginLeft: 5}}></i>
                            </th>
                            <th style={{width:'15%'}} onClick={()=>{this.sortByColoumn('description')}}>Description
                                <i className={this.state.column!='description'?
                                    "fa fa-sort": (this.state.column == 'description' && !this.state.isDesc)?
                                        'fa fa-sort-asc':'fa fa-sort-desc'}
                                   aria-hidden="true" style={{marginLeft: 5}}></i>
                            </th>
                            <th style={{width:'15%'}} onClick={()=>{this.sortByColoumn('work_description')}}>Work Description
                                <i className={this.state.column!='work_description'?
                                    "fa fa-sort": (this.state.column == 'work_description' && !this.state.isDesc)?
                                        'fa fa-sort-asc':'fa fa-sort-desc'}
                                   aria-hidden="true" style={{marginLeft: 5}}></i>
                            </th>
                            <th style={{width:'10%'}} onClick={()=>{this.sortByColoumn('status')}}>Status
                                <i className={this.state.column!='status'?
                                    "fa fa-sort": (this.state.column == 'status' && !this.state.isDesc)?
                                        'fa fa-sort-asc':'fa fa-sort-desc'}
                                   aria-hidden="true" style={{marginLeft: 5}}></i>
                            </th>
                            <th style={{width:'20%'}} onClick={()=>{this.sortByColoumn('certificates')}}>Certificates
                                <i className={this.state.column!='certificates'?
                                    "fa fa-sort": (this.state.column == 'certificates' && !this.state.isDesc)?
                                        'fa fa-sort-asc':'fa fa-sort-desc'}
                                   aria-hidden="true" style={{marginLeft: 5}}></i>
                            </th>
                            <th style={{width:'20%'}} onClick={()=>{this.sortByColoumn('files')}}>Files
                                <i className={this.state.column!='files'?
                                    "fa fa-sort": (this.state.column == 'files' && !this.state.isDesc)?
                                        'fa fa-sort-asc':'fa fa-sort-desc'}
                                   aria-hidden="true" style={{marginLeft: 5}}></i>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.roles_rows.map(roles_row => (
                        <tr>
                            <td>
                                {roles_row.checkbox && <input type="checkbox" value={roles_row.object_id}/>}
                            </td>
                            <td style={{textAlign: 'left'}}>{roles_row.id}</td>
                            <td>
                                <Link to={{pathname: '/get_role/'+roles_row.object_id}}>{roles_row.name}</Link>
                            </td>
                            <td dangerouslySetInnerHTML={{__html: roles_row.description}}></td>
                            <td dangerouslySetInnerHTML={{__html: roles_row.work_description}}></td>
                            {roles_row.status =="" && <td>{roles_row.status}</td>}
                            {roles_row.status =="Active" && <td style={{background:'#66BB6A'}}>{roles_row.status}</td>}
                            {roles_row.status =="Not Active" && <td style={{background:'#EF5350'}}>{roles_row.status}</td>}
                            {roles_row.certificates!=""&&<td><ul style={{textAlign: 'left', margin : 0}}><li>{roles_row.certificates}</li></ul></td>}
                            {roles_row.certificates==""&&<td>{roles_row.certificates}</td>}
                            {roles_row.files!=""&&<td><ul style={{textAlign: 'left', margin : 0}}><li>{roles_row.files}</li></ul></td>}
                            {roles_row.files==""&&<td>{roles_row.files}</td>}
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


                {/* CONNECT USER MODAL*/}
                <Modal show={this.state.openConnectUser} onHide={this.closeConnectUser}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Connect User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>
                                <h5 style={{fontSize: 17, paddingTop: 10}}>Filters User List :</h5>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    {this.state.dropdown_default_connect_user_certificate_filter != "Filter By Certificate" || this.state.dropdown_default_connect_user_role_filter != "Filter By Role"?
                                        <Button variant="outline-primary" style={{float: 'right'}} onClick={this.clearUserListFilters}>
                                            <i class="fa fa-times" aria-hidden="true"></i>Clear Filters
                                        </Button>: <span></span>
                                    }
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col}>
                                    <Dropdown style={{marginTop: 0}}>
                                        <Dropdown.Toggle>
                                            {this.state.dropdown_default_connect_user_certificate_filter}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="customScrollToDropDowns">
                                            {this.state.certificates_list ? this.state.certificates_list.map(certificate => (
                                                    <Dropdown.Item value={certificate.name} onClick={(name) => {this.filterUserListByCertificate(certificate.name)}}>{certificate.name}</Dropdown.Item>
                                                ))

                                                :
                                                <Dropdown.Item value="">No Certificate</Dropdown.Item>
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Dropdown style={{marginTop: 0}}>
                                        <Dropdown.Toggle>
                                            {this.state.dropdown_default_connect_user_role_filter}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="customScrollToDropDowns">
                                            {this.state.temp ? this.state.temp.map(role => (
                                                    <Dropdown.Item value={role.data.name} onClick={(name) => {this.filterUserListByRole(role.data.name)}}>{role.data.name}</Dropdown.Item>
                                                ))

                                                :
                                                <Dropdown.Item value="">No Role</Dropdown.Item>
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col}>
                                    <Select
                                        closeMenuOnSelect={false}
                                        isMulti
                                        name="connectUser"
                                        components={makeAnimated()}
                                        options={this.state.user_list}
                                        placeholder="Search Users..."
                                        onChange={this.handleChangeUser}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                    {/*<Dropdown className="addNewArchiveModalDropDowns">
                                        <Dropdown.Toggle>
                                            {this.state.default_dropdown_user_name}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="customScrollToDropDowns">
                                            {this.state.user_list ? this.state.user_list.map(user => (
                                                    <Dropdown.Item value={user.id} onClick={(id,name) => {this.handleChangeUser(user.id,user.username)}}>{user.username}</Dropdown.Item>
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
                                <Button variant="outline-secondary" onClick={this.closeConnectUser}>
                                    Cancel
                                </Button>
                                {this.state.showLoadingConnectUser ?
                                    <div style={{position: 'relative', margin: '-45px 20px -10px 90px'}}>
                                        <CircularProgress size={40} thickness={7}
                                                          style={{marginLeft: '17%'}}/>
                                    </div> :
                                    <Button variant="outline-primary" onClick={this.addRoleToUser} style={{marginLeft: 5}}>
                                        Connect
                                    </Button>
                                }
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
                                            {this.state.default_dropdown_connect_certificate_name}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="customScrollToDropDowns">
                                            {this.state.certificates_list ? this.state.certificates_list.map(certificate => (
                                                    <Dropdown.Item value={certificate.id} onClick={(id,name) => {this.handleChangeConnectCertificate(certificate.id,certificate.name)}}>{certificate.name}</Dropdown.Item>
                                                ))

                                                :
                                                <Dropdown.Item value="">No Roles</Dropdown.Item>
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
                                <Button variant="outline-primary" onClick={this.addCertificateToRole} style={{marginLeft: 5}}>
                                    Connect
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

export default connect(mapStateToProps) (RolesData);

// export default RolesData;

