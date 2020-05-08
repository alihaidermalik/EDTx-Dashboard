/* eslint-disable */
import React, {Component} from 'react';
import DatePicker from "react-datepicker";
import CircularProgress from 'material-ui/CircularProgress';
import { Dropdown, DropdownButton, Container, Row, Col, NavDropdown, Form, Button, Badge, Alert, ButtonToolbar, Modal,Table  } from 'react-bootstrap';
import swal from 'sweetalert';
import CKEditor from 'ckeditor4-react';
let previousFields = [];
let newFields = [];

class EditCertificate extends Component {
    constructor() {
        super();
        let path = window.location.pathname.split("/");
        console.log(path);
        this.state = {
            validated: false,
            showLoading: false,
            certificate_id:path[2],
            user_certificate_id: "",
            image: "",
            logo_image: "",
            logo_change: 0,
            name: "",
            type_name : "",
            type_id : "",
            profession_name : "",
            profession_id : "",
            description : "",
            version : "",
            external_course_list : [],
            internal_course_list : [],
            connected_roles : [],
            status : "",
            accreditor : "",
            expiration_days : "",
            training_hours : "",
            valid_months : "",
            files : [],
            additional_fields : [],
            internal_course_list_ids: [],
            external_course_list_ids: [],
            roles_list_ids: [],
            new_additional_fields : [],
            certificate_type_list : [],
            profession_list : [],
            all_internal_course_list : [],
            all_external_course_list : [],
            fields_dropdown : "",
            openSuccessPopup : false,
            openErrorPopup : false,
            message_success : "Your job has been done successfully.",
            message_error : "No record found with provided ID."
        };
        this.deleteCertificateById = this.deleteCertificateById.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangePrfession = this.handleChangePrfession.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.handleChangeInternal = this.handleChangeInternal.bind(this);
        this.handleChangeInternalDefault = this.handleChangeInternalDefault.bind(this);
        this.handleChangeExternal = this.handleChangeExternal.bind(this);
        this.handleChangeExternalDefault = this.handleChangeExternalDefault.bind(this);
        this.handleChangeRole = this.handleChangeRole.bind(this);
        this.handleChangeRoleDefault = this.handleChangeRoleDefault.bind(this);
        this.addFile = this.addFile.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.createNewField = this.createNewField.bind(this);
        this.removeAdditionalFields = this.removeAdditionalFields.bind(this);
        this.removePreviousFields = this.removePreviousFields.bind(this);
        this.handleChangeInLabel = this.handleChangeInLabel.bind(this);
        this.handleChangeInValue = this.handleChangeInValue.bind(this);
        this.handleChangeInValueCheckBox = this.handleChangeInValueCheckBox.bind(this);
        this.updateCertificate = this.updateCertificate.bind(this);
        this.updateLogoImage = this.updateLogoImage.bind(this);
    }

    componentDidMount() {
        this.getCertificateData();
    }
    getCertificateData(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_certificate/"+this.state.certificate_id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.certificates) {
                        let logoUrlChk = "";
                        if(result.certificates[0].logo_url)
                        {
                            logoUrlChk = process.env.REACT_APP_FILES_URL + result.certificates[0].logo_url;
                        }
                        this.setState({
                            image: result.certificates[0].logo_url,
                            logo_image: logoUrlChk,
                            user_certificate_id: result.certificates[0].user_certificate_id,
                            name: result.certificates[0].name,
                            type_name: result.certificates[0].type_name,
                            type_id: result.certificates[0].type_id,
                            profession_name: result.certificates[0].profession_name,
                            profession_id: result.certificates[0].profession_id,
                            description: result.certificates[0].description,
                            version: result.certificates[0].version,
                            connected_roles: result.roles,
                            status: result.certificates[0].status,
                            accreditor: result.certificates[0].accreditor,
                            expiration_days: result.certificates[0].expiration_days,
                            training_hours: result.certificates[0].training_hours,
                            valid_months: result.certificates[0].valid_months,
                            files: result.files,
                            additional_fields: [],
                            new_additional_fields: [],
                        });

                        if (result.internal_courses.length > 0) {
                            var arr = [];
                            for(let i=0;i<result.internal_courses.length;i++){
                                result.internal_courses[i].status = true;
                                arr.push(result.internal_courses[i].id);
                            }
                            this.setState({
                                internal_course_list: result.internal_courses,
                                internal_course_list_ids: arr
                            });
                        }

                        if (result.external_courses.length > 0) {
                            var arr = [];
                            for(let i=0;i<result.external_courses.length;i++){
                                result.external_courses[i].status = true;
                                arr.push(result.external_courses[i].id);
                            }
                            this.setState({
                                external_course_list: result.external_courses,
                                external_course_list_ids: arr
                            });
                        }

                        if (result.roles.length > 0) {
                            var arr = [];
                            for(let i=0;i<result.roles.length;i++){
                                result.roles[i].status = true;
                                arr.push(result.roles[i].id);
                                console.log(result.roles[i]);
                            }
                            this.setState({
                                connected_roles: result.roles,
                                roles_list_ids: arr
                            });
                        }
                        if (result.files.length > 0) {
                            this.setState({
                                files: result.files,
                            });
                        }
                        if (result.additional_fields.length > 0) {
                            this.renderAdditionalFields(result.additional_fields);
                        }
                        this.getCertificateTypeList();
                        this.getProfessionList();
                        this.getInternalCourseList();
                        this.getExternalCourseList();
                        this.getRolesList();
                    }
                    else{
                        this.setState({openErrorPopup: true});
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
                    if(result.length>0) {
                        console.log(result.length);
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].id == this.state.type_id) {
                                result.splice(i,1);
                                console.log(result)
                            }
                        }
                        console.log("out side")
                        this.setState({certificate_type_list: result});
                    }
                    else{
                        this.setState({certificate_type_list: result});
                    }
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
                    if(result.length>0) {
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].id == this.state.profession_id) {
                                result.splice(i, 1);
                            }
                        }
                        this.setState({profession_list: result});
                    }
                    else{
                        this.setState({profession_list: result});
                    }
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
                    if(result.length>0) {
                        for (let i = 0; i < result.length; i++) {
                            for (let j = 0; j < this.state.internal_course_list.length; j++) {
                                if (result[i].id == this.state.internal_course_list[j].id) {
                                    result.splice(i, 1);
                                }
                            }
                        }
                        this.setState({all_internal_course_list: result});
                    }
                    else{
                        this.setState({all_internal_course_list: result});
                    }
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
                    if(result.length>0) {
                        for (let i = 0; i < result.length; i++) {
                            for (let j = 0; j < this.state.external_course_list.length; j++) {
                                if (result[i].id == this.state.external_course_list[j].id) {
                                    result.splice(i, 1);
                                }
                            }
                        }
                        this.setState({all_external_course_list: result});
                    }
                    else{
                        this.setState({all_external_course_list: result});
                    }
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
                    if(result.length>0) {
                        for (let i = 0; i < result.length; i++) {
                            for (let j = 0; j < this.state.connected_roles.length; j++) {
                                if (result[i].id == this.state.connected_roles[j].id) {
                                    result.splice(i, 1);
                                }
                            }
                        }
                        this.setState({roles_list: result});
                    }
                    else{
                        this.setState({roles_list: result});
                    }
                },

                (error) => {

                }
            )
    }
    updateLogoImage(){
        this.setState({
            logo_change: 1
        });
        this.readURL(this.refs.logo);
    }
    readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                this.setState({
                    image:e.target.result,
                    logo_image:e.target.result
                });
            }.bind(this);
            reader.readAsDataURL(input.files[0]);
        }
    }
    renderAdditionalFields(fieldsObtained) {
        previousFields = [];
        for(let i=0;i<fieldsObtained.length;i++) {
            previousFields.push(fieldsObtained[i]);
            const additional_fields = this.state.additional_fields.concat(AdditionalFieldsClass);
            this.setState({additional_fields});
        }
    }
    removePreviousFields(index){
        previousFields.splice(index, 1);
        let reRenderedFields = previousFields;
        previousFields = [];
        if(reRenderedFields.length==0){
            const additional_fields = this.state.additional_fields.concat(AdditionalFieldsClass);
            this.setState({additional_fields});
        }
        for(let i=0;i<reRenderedFields.length;i++) {
            previousFields.push(reRenderedFields[i]);
            const additional_fields = this.state.additional_fields.concat(AdditionalFieldsClass);
            this.setState({additional_fields});
        }
    }
    handleChangeInLabel(e,index){
        previousFields[index].label = e.target.value;
        let renderNew = previousFields;
        previousFields = [];
        for(let i=0;i<renderNew.length;i++) {
            previousFields.push(renderNew[i]);
            const additional_fields = this.state.additional_fields.concat(AdditionalFieldsClass);
            this.setState({additional_fields});
        }
    }
    handleChangeInValue(e,index){
        previousFields[index].value = e.target.value;
        let renderNew = previousFields;
        previousFields = [];
        for(let i=0;i<renderNew.length;i++) {
            previousFields.push(renderNew[i]);
            const additional_fields = this.state.additional_fields.concat(AdditionalFieldsClass);
            this.setState({additional_fields});
        }
    }
    handleChangeInValueCheckBox(e,index){
        previousFields[index].value = e.target.checked;
        let renderNew = previousFields;
        previousFields = [];
        for(let i=0;i<renderNew.length;i++) {
            previousFields.push(renderNew[i]);
            const additional_fields = this.state.additional_fields.concat(AdditionalFieldsClass);
            this.setState({additional_fields});
        }
    }
    deleteCertificateById(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/delete_certificate/"+this.state.certificate_id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({openSuccessPopup: true});
                },
                (error) => {
                    console.log("delete role api error");
                    console.log(error);
                }
            )
    }
    handleChange = (id,name) => {
        let certificate_type_list = this.state.certificate_type_list;
        for(let i=0;i<certificate_type_list.length;i++){
            if(certificate_type_list[i].id == id){
                this.setState({
                    type_id: id,
                    type_name: certificate_type_list[i].name
                });
            }
        }
    };
    handleChangePrfession = (id,name) => {
        let profession_list = this.state.profession_list;
        for(let i=0;i<profession_list.length;i++){
            if(profession_list[i].id == id){
                this.setState({
                    profession_id: id,
                    profession_name: profession_list[i].name
                });
            }
        }
    };
    changeStatus = event => {
        if(this.refs.status.checked){
            this.setState({ status: 1 });
        }
        else{
            this.setState({ status: 0 });
        }
    };
    handleChangeDescription=(e)=>{
        this.setState({ description: e.editor.getData() });
    }
    handleChangeInternalDefault(e,id){
        if(e.target.checked){
            var internalList = this.state.internal_course_list;
            for(let i=0;i<internalList.length;i++){
                if(internalList[i].id==id){
                    internalList[i].status = true;
                }
            }
            this.setState({
                internal_course_list : internalList
            })
        }else{
            let internal_courses = this.state.internal_course_list;
            let all_internal_course_list = this.state.all_internal_course_list;
            for(let i=0;i<internal_courses.length;i++){
                if(internal_courses[i].id == id){
                    internal_courses[i].status = false;
                    all_internal_course_list.push(internal_courses[i]);
                    internal_courses.splice(i,1);
                    this.setState({
                        internal_course_list: internal_courses,
                        all_internal_course_list: all_internal_course_list,
                    })
                }
            }
        }
        if(this.state.internal_course_list.length>0) {
            var arr = [];
            for (let j = 0; j < this.state.internal_course_list.length; j++) {
                arr.push(this.state.internal_course_list[j].id);
            }
            this.setState({
                internal_course_list_ids: arr
            })
        }
    }
    handleChangeInternal(e,id){
        if(e.target.checked){
            e.target.checked = false;
            let internal_courses = this.state.internal_course_list;
            let all_internal_course_list = this.state.all_internal_course_list;
            for(let i=0;i<all_internal_course_list.length;i++){
                if(all_internal_course_list[i].id == id){
                    all_internal_course_list[i].status = true;
                    internal_courses.push(all_internal_course_list[i]);
                    all_internal_course_list.splice(i,1);
                    this.setState({
                        internal_course_list: internal_courses,
                        all_internal_course_list: all_internal_course_list,
                    })
                }
            }
        }else{
        }
        if(this.state.internal_course_list.length>0) {
            var arr = [];
            for (let j = 0; j < this.state.internal_course_list.length; j++) {
                arr.push(this.state.internal_course_list[j].id);
            }
            this.setState({
                internal_course_list_ids: arr
            })
        }
    }
    handleChangeExternalDefault(e,id){
        if(e.target.checked){
            var externalList = this.state.external_course_list;
            for(let i=0;i<externalList.length;i++){
                if(externalList[i].id==id){
                    externalList[i].status = true;
                }
            }
            this.setState({
                external_course_list : externalList
            })
        }else{
            let external_courses = this.state.external_course_list;
            let all_external_course_list = this.state.all_external_course_list;
            for(let i=0;i<external_courses.length;i++){
                if(external_courses[i].id == id){
                    external_courses[i].status = false;
                    all_external_course_list.push(external_courses[i]);
                    external_courses.splice(i,1);
                    this.setState({
                        internal_course_list: external_courses,
                        all_internal_course_list: all_external_course_list,
                    })
                }
            }
        }
        if(this.state.external_course_list.length>0) {
            var arr = [];
            for (let j = 0; j < this.state.external_course_list.length; j++) {
                arr.push(this.state.external_course_list[j].id);
            }
            this.setState({
                external_course_list_ids: arr
            })
        }
    }
    handleChangeExternal(e,id){
        if(e.target.checked){
            e.target.checked = false;
            let external_courses = this.state.external_course_list;
            let all_external_course_list = this.state.all_external_course_list;
            for(let i=0;i<all_external_course_list.length;i++){
                if(all_external_course_list[i].id == id){
                    all_external_course_list[i].status = true;
                    external_courses.push(all_external_course_list[i]);
                    all_external_course_list.splice(i,1);
                    this.setState({
                        external_course_list: external_courses,
                        all_external_course_list: all_external_course_list,
                    })
                }
            }
        }else{
        }
        if(this.state.external_course_list.length>0) {
            var arr = [];
            for (let j = 0; j < this.state.external_course_list.length; j++) {
                arr.push(this.state.external_course_list[j].id);
            }
            this.setState({
                external_course_list_ids: arr
            })
        }
    }
    handleChangeRoleDefault(e,id){
        if(e.target.checked){
            var defaultRoles = this.state.connected_roles;
            for(let i=0;i<defaultRoles.length;i++){
                if(defaultRoles[i].id==id){
                    defaultRoles[i].status = true;
                }
            }
        }else{
            let defaultRoles = this.state.connected_roles;
            let roles_list = this.state.roles_list;
            for(let i=0;i<defaultRoles.length;i++){
                if(defaultRoles[i].id == id){
                    defaultRoles[i].status = false;
                    roles_list.push(defaultRoles[i]);
                    defaultRoles.splice(i,1);
                    this.setState({
                        connected_roles: defaultRoles,
                        roles_list: roles_list,
                    })
                }
            }
        }
        if(this.state.connected_roles.length>0) {
            var arr = [];
            for (let j = 0; j < this.state.connected_roles.length; j++) {
                arr.push(this.state.connected_roles[j].id);
            }
            this.setState({
                roles_list_ids: arr
            })
        }
    }
    handleChangeRole(e,id){
        if(e.target.checked){
            e.target.checked = false;
            let defaultRoles = this.state.connected_roles;
            let roles_list = this.state.roles_list;
            for(let i=0;i<roles_list.length;i++){
                if(roles_list[i].id == id){
                    roles_list[i].status = true;
                    defaultRoles.push(roles_list[i]);
                    roles_list.splice(i,1);
                    this.setState({
                        connected_roles: defaultRoles,
                        roles_list: roles_list,
                    })
                }
            }
        }else{
        }
        if(this.state.connected_roles.length>0) {
            var arr = [];
            for (let j = 0; j < this.state.connected_roles.length; j++) {
                arr.push(this.state.connected_roles[j].id);
            }
            this.setState({
                roles_list_ids: arr
            })
        }
    }
    addFile(){
        var files = document.getElementById("files");
        if (files.files && files.files[0]) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                var arr = this.state.files;
                var fileBase64 = e.target.result.split("base64,")
                var data = {name : files.files[0].name, file : fileBase64[1]}
                arr.push(data);
                this.setState({
                    files:arr
                });
                files.value = "";
            }.bind(this);
            reader.readAsDataURL(files.files[0]);
        }
    }

    removeFile(name){
        var data = this.state.files;
        for (var i = 0; i < data.length; i++) {
            if(data[i].name == name){
                data.splice(i, 1);
                break;
            }
        }
        this.setState({
            files:data
        });
    }
    createNewField = (value) => {
        this.setState({ fields_dropdown: value });
        const obj = {
            "type": value,
            "label": '',
            "value": true
        }
        newFields.push(obj);
        const new_additional_fields = this.state.new_additional_fields.concat(AdditionalFieldsAddClass);
        this.setState({ new_additional_fields });
    };
    removeAdditionalFields(index){
        newFields.splice(index, 1);
        let reRenderedFields = newFields;
        newFields = [];
        if(reRenderedFields.length==0){
            const new_additional_fields = this.state.new_additional_fields.concat(AdditionalFieldsAddClass);
            this.setState({new_additional_fields});
        }
        for(let i=0;i<reRenderedFields.length;i++) {
            newFields.push(reRenderedFields[i]);
            const new_additional_fields = this.state.new_additional_fields.concat(AdditionalFieldsAddClass);
            this.setState({new_additional_fields});
        }
    }
    updateCertificate(event) {
        event.preventDefault();
        // form validation
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({ validated: true});
            return;
        }

        let errorString = "";
        let showErrorChk = false;
        if(this.state.type_id == "" || this.state.type_id == null){
            errorString = errorString + "You Must Select Certificate Type!\n";
            showErrorChk = true;
        }
        if(this.state.profession_id == "" || this.state.profession_id == null){
            errorString = errorString + "You Must Select Certificate Profession!\n";
            showErrorChk = true;
        }
        if(showErrorChk){
            swal({
                title: "Error!",
                text: errorString,
                icon: "error",
            });
            this.setState({
                showLoading: false
            });
            return;
        }
        this.setState({
            showLoading: true,
        })
        if (newFields.length > 0) {
            for (let i = 0; i < newFields.length; i++) {
                previousFields.push(newFields[i]);
            }
        }
        /*this.state.additional_fields = previousFields;
        this.state.new_additional_fields = newFields;
        console.log(this.state);*/
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/edit_certificate", {
            method: "POST",
            body: JSON.stringify({
                'certificate_id': this.state.certificate_id,
                'name': this.state.name,
                'description': this.state.description,
                'version': this.state.version,
                'logo': this.state.image,
                'logo_change': this.state.logo_change,
                'certificate_type_id': this.state.type_id,
                'profession_id': this.state.profession_id,
                'internal_course_list_ids' : this.state.internal_course_list_ids,
                'external_course_list_ids' : this.state.external_course_list_ids,
                'roles_list_ids' : this.state.roles_list_ids,
                'valid_months': this.state.valid_months,
                'training_hours': this.state.training_hours,
                'expiration_days': this.state.expiration_days,
                'user_certificate_id': this.state.user_certificate_id,
                'status': this.state.status,
                'accreditor': this.state.accreditor,
                'files_list': this.state.files,
                'additional_fields': previousFields
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        showLoading: false
                    });
                    // this.props.history.push('/');
                    this.goBack();
                    // this.props.history.push({pathname :'/certificates', state: { select_drop_down: 'certificates' }});
                },

                (error) => {
                    console.log("Error In Updating Certificate");
                    console.log(error);
                    this.setState({
                        showLoading: false
                    });
                }
            )
    }

    handleCloseSuccess = () => {
        this.setState({openSuccessPopup: false});
        this.goBack();
    };
    handleCloseError = () => {
        this.setState({openErrorPopup: false});
        this.goBack();
    };
    goBack = () => {
        this.props.history.goBack();
    };
    render() {
        const { validated } = this.state;
        const additional_fields = this.state.additional_fields.map((Element, index) => {
            return <Element key={ index } index={ index } />
        });
        const new_additional_fields = this.state.new_additional_fields.map((Element, index) => {
            return <Element key={ index } index={ index } />
        });
        return (
            <div>
                <Row style={{marginTop: '1%',marginLeft: '0.8%'}}>
                    <Col xs={12} sm={12} md={12} lg={12} style={{textAlign: 'center'}}>
                        <Button variant="outline-info" onClick={this.goBack} className="backButtonUserArchive pull-left"><i className="fa fa-arrow-left"></i> Go Back</Button>
                        <h1 style={{margin: '0px auto'}}>
                            EDIT CERTIFICATE
                        </h1>
                    </Col>
                </Row>
                <Form style={{marginLeft:15}}
                      onSubmit={e => this.updateCertificate(e)}
                      noValidate
                      validated={validated}>
                    <Row>
                        <Col xs={12} sm={12} md={9} lg={9}>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Certificate ID &nbsp;<span style={{color: 'red', fontWeight: 'bold'}}>*</span></Form.Label>
                                    <Form.Control type="text" placeholder="Enter Certificate ID" required
                                                  value={this.state.user_certificate_id}
                                                  onChange={(event) => this.setState({user_certificate_id: event.target.value})}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        Certificate id is required.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>Certificate Version</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Certificate Version"
                                                  value={this.state.version}
                                                  onChange={(event) => this.setState({version: event.target.value})}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Type &nbsp;<span style={{color: 'red', fontWeight: 'bold'}}>*</span></Form.Label>
                                    <Dropdown style={{marginTop: 0}}>
                                        <Dropdown.Toggle className="dropDownToggleCertificateType">
                                            {this.state.type_name}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item value={this.state.type_id} onClick={(id,name) => {this.handleChange(this.state.type_id,this.state.type_name)}}>{this.state.type_name}</Dropdown.Item>
                                            {this.state.certificate_type_list ? this.state.certificate_type_list.map(certificate_type => (
                                                    <Dropdown.Item value={certificate_type.id} onClick={(id,name) => {this.handleChange(certificate_type.id,certificate_type.name)}}>{certificate_type.name}</Dropdown.Item>
                                                ))

                                                :
                                                <Dropdown.Item value="">No More Type</Dropdown.Item>
                                            }
                                            {/*<Dropdown.Divider />
                                            <Dropdown.Item className="addNewButton" onClick={this.handleClickOpen} >ADD NEW CERTIFICATE TYPE</Dropdown.Item>*/}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Status Active</Form.Label>
                                    <Form.Check type="checkbox" ref="status" className="customheckBox" checked={this.state.status==1 ? true : false}
                                                onChange={(e) => this.changeStatus(e)}
                                    />
                                </Form.Group>
                            </Form.Row>


                            <Form.Row>
                                <Col xs={12} sm={12} md={3} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Certificate Accreditor</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Certificate Accreditor"
                                                      value={this.state.accreditor}
                                                      onChange={(event) => this.setState({accreditor: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12} sm={12} md={3} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Profession &nbsp;<span style={{color: 'red', fontWeight: 'bold'}}>*</span></Form.Label>
                                        <Dropdown style={{marginTop: 0}}>
                                            <Dropdown.Toggle className="dropDownToggleProfession">
                                                {this.state.profession_name}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item value={this.state.profession_id} onClick={(id,name) => {this.handleChangePrfession(this.state.profession_id,this.state.profession_name)}}>{this.state.profession_name}</Dropdown.Item>
                                                {this.state.profession_list ? this.state.profession_list.map(profession => (
                                                        <Dropdown.Item value={profession.id} onClick={(id,name) => {this.handleChangePrfession(profession.id,profession.name)}}>{profession.name}</Dropdown.Item>
                                                    ))
                                                    :
                                                    <Dropdown.Item value="">No More Professions</Dropdown.Item>
                                                }
                                                {/*<Dropdown.Divider />
                                            <Dropdown.Item className="addNewButton" onClick={this.handleClickOpen} >ADD NEW CERTIFICATE TYPE</Dropdown.Item>*/}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Form.Group>
                                </Col>
                                <div className="clearfix"></div>
                            </Form.Row>


                            <Form.Row>
                                <Col xs={12} sm={12} md={3} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Valid Time (Months) &nbsp;<span style={{color: 'red', fontWeight: 'bold'}}>*</span></Form.Label>
                                        <Form.Control type="text" placeholder="Enter Valid Time (Months)" required
                                                      value={this.state.valid_months}
                                                      onChange={(event) => this.setState({valid_months: event.target.value})}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            Valid months are required.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} sm={12} md={3} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Expiration Notice (Days) &nbsp;<span style={{color: 'red', fontWeight: 'bold'}}>*</span></Form.Label>
                                        <Form.Control type="text" placeholder="Enter Expiration Notice (Days)" required
                                                      value={this.state.expiration_days}
                                                      onChange={(event) => this.setState({expiration_days: event.target.value})}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            Expiration days are required.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} sm={12} md={3} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Minimum Training (Hours)</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Minimum Training (Hours)"
                                                      value={this.state.training_hours}
                                                      onChange={(event) => this.setState({training_hours: event.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Certificate Name &nbsp;<span style={{color: 'red', fontWeight: 'bold'}}>*</span></Form.Label>
                                    <Form.Control type="text" placeholder="Enter Certificate Name" required
                                                  value={this.state.name}
                                                  onChange={(event) => this.setState({name: event.target.value})}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        Certificate name is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Description </Form.Label>
                                    {this.state.description ?
                                        <CKEditor name="description" id="description"
                                                  activeClass="p10"
                                                  data={this.state.description}
                                                  content={this.state.description}
                                                  onFocus={this.handleChangeDescription}
                                                  onBlur={this.handleChangeDescription}
                                                  onChange={this.handleChangeDescription}
                                                  onSelectionChange={this.handleChangeDescription}
                                        /> :
                                        ''
                                    }
                                    {/*<Form.Control as="textarea" ref="description" rows="3" className="textArea"
                                                  value={this.state.description}
                                                  onChange={(e) => this.handleChangeDescription(e)}
                                    />*/}
                                </Form.Group>
                            </Form.Row>


                            <Form.Row>
                                <Form.Group as={Col}>
                                    <hr/>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Internal Courses</Form.Label>
                                    <div className="heightMarginLeftScrollAuto">
                                        {this.state.internal_course_list ? this.state.internal_course_list.map(internal_course => (
                                                <div style={{marginTop : 7}}>
                                                    <input type="checkbox" value={internal_course.id} checked={internal_course.status} onChange={e => this.handleChangeInternalDefault(e,internal_course.id)}  />
                                                    <label>{internal_course.name} </label>
                                                </div>
                                            )):
                                            ''
                                        }
                                        {this.state.all_internal_course_list ? this.state.all_internal_course_list.map(internal_course => (
                                                <div style={{marginTop : 7}}>
                                                    <input type="checkbox"  value={internal_course.id} onChange={e => this.handleChangeInternal(e,internal_course.id)} />
                                                    <label>{internal_course.name} </label>
                                                </div>
                                            )):
                                            <label>No More Internal Courses</label>
                                        }
                                    </div>
                                </Form.Group>
                            </Form.Row>


                            <Form.Row>
                                <Form.Group as={Col}>
                                    <hr/>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>External Courses</Form.Label>
                                    <div className="heightMarginLeftScrollAuto">
                                        {this.state.external_course_list ? this.state.external_course_list.map(external_course => (
                                                <div style={{marginTop : 7}}>
                                                    <input type="checkbox"  value={external_course.id} checked={external_course.status} onChange={e => this.handleChangeExternalDefault(e,external_course.id)} />
                                                    <label>{external_course.name} </label>
                                                </div>
                                            )):
                                            ''
                                        }
                                        {this.state.all_external_course_list ? this.state.all_external_course_list.map(external_course => (
                                                <div style={{marginTop : 7}}>
                                                    <input type="checkbox"  value={external_course.id} onChange={e => this.handleChangeExternal(e,external_course.id)} />
                                                    <label>{external_course.name} </label>
                                                </div>
                                            )):
                                            <label>No More External Courses</label>
                                        }
                                    </div>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <hr/>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Connected Roles</Form.Label>
                                    <div className="heightMarginLeftScrollAuto">
                                        {this.state.connected_roles ? this.state.connected_roles.map(role => (
                                                <div style={{marginTop : 7}}>
                                                    <input type="checkbox" checked={role.status} value={role.id} onChange={e => this.handleChangeRoleDefault(e,role.id)} />
                                                    <label>{role.name} </label>
                                                </div>
                                            )):
                                            ''
                                        }
                                        {this.state.roles_list ? this.state.roles_list.map(role => (
                                                <div style={{marginTop : 7}}>
                                                    <input type="checkbox"  value={role.id} onChange={e => this.handleChangeRole(e,role.id)} />
                                                    <label>{role.name} </label>
                                                </div>
                                            )):
                                            <label> No More Roles</label>
                                        }
                                    </div>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <hr/>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>File List :</Form.Label>
                                    <div className="heightMarginLeftScrollAuto">
                                        <Form.Group className="addNewExternalCourceBtn">
                                            <input type="file" id="files" onChange={this.addFile} style={{float : 'right'}}/>
                                        </Form.Group>
                                        {this.state.files ?  this.state.files.map(file => (
                                                <span>
                                            <Col xs={2} sm={2} md={2} lg={2} className="displayInlineBlock">
                                                <label className="textOut">{file.name} </label>
                                            </Col>
                                            <Col xs={1} sm={1} md={1} lg={1} className="displayInlineBlock">
                                                <Button className="btn removeFileBtn deleteBtn" onClick={() => this.removeFile(file.name)}><i className="fa fa-trash"></i></Button>
                                            </Col>
                                           <br/>
                                        </span>
                                            )):
                                            <label> No Files Selected</label>
                                        }
                                    </div>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <hr/>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row controlId="formPlaintextPassword">
                                <Form.Label column xs={12} sm={12} md={8} lg={8}>
                                    Add More Files :
                                </Form.Label>
                                <Col xs={12} sm={12} md={3} lg={3}>
                                    <Dropdown className="addNewFieldDropDown" style={{right: '9%'}}>
                                        <Dropdown.Toggle className="dropDownToggleAddNewField">
                                            Add New Field
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item value="text" onClick={(name) => {this.createNewField("text")}}>Text</Dropdown.Item>
                                            <Dropdown.Item value="number" onClick={(name) => {this.createNewField("number")}}>Number</Dropdown.Item>
                                            <Dropdown.Item value="date" onClick={(name) => {this.createNewField("date")}}>Date</Dropdown.Item>
                                            <Dropdown.Item value="status" onClick={(name) => {this.createNewField("status")}}>Status</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                                <div className="clearfix"></div>
                            </Form.Row>

                            <Form.Row>
                                <div className="inputs" style={{marginLeft: '12%', width: '100%'}}>
                                    { additional_fields }
                                    { new_additional_fields }
                                </div>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <hr/>
                                </Form.Group>
                            </Form.Row>

                        </Col>

                        <Col xs={12} sm={12} md={3} lg={3}>
                            {this.state.showLoading ?
                                <div style={{position: 'relative'}}>
                                    <CircularProgress size={60} thickness={7}
                                                      style={{marginLeft: '22%'}}/>
                                </div> :
                                <Button variant="outline-primary"
                                        style={{width: '60%', marginBottom: '3%'}}
                                        type="submit">
                                    UPDATE
                                </Button>
                            }
                            <div className="viewLogoImage">
                                {this.state.logo_image != ""?
                                    <img src={this.state.logo_image} style={{width : 145}}/>:
                                    ''
                                }
                                <br/>
                                <input type="file" ref="logo" onChange={this.updateLogoImage} />
                            </div>
                        </Col>
                    </Row>
                </Form>



                {/* SUCCESS MODAL*/}
                <Modal show={this.state.openSuccessPopup} onHide={this.handleCloseSuccess}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Success</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.message_success}
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-primary" onClose={this.handleCloseSuccess}>
                                    Close
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>


                {/* ERROR MODAL*/}
                <Modal show={this.state.openErrorPopup} onHide={this.handleCloseError}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.message_error}
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-primary" onClose={this.handleCloseError}>
                                    Close
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }

}

class AdditionalFieldsClass extends EditCertificate {
    render() {
        if(previousFields[this.props.index]==undefined){
            return (
                ''
            )
        }
        let type = previousFields[this.props.index].type;
        if(type == "date"){
            previousFields[this.props.index].value = new Date(previousFields[this.props.index].value);
        }
        return (
            <div>
                {(type == "date") ?
                    <Form.Row>
                        <Col xs={12} sm={12} md={3} lg={3}>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Enter Label" name={`additional-${ this.props.index }-field`}
                                              value={previousFields[this.props.index].label}
                                              onChange={(event) => { previousFields[this.props.index].label = event.target.value}}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3}>
                            <Form.Group>
                                <DatePicker id={this.props.index} className="form-control" placeholderText="Pick A Date"
                                            selected={previousFields[this.props.index].value}
                                            onChange={(date) => {
                                                previousFields[this.props.index].value = date;
                                                this.renderAdditionalFields(previousFields);
                                            }}

                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={12} md={1} lg={1}>
                            <Form.Group>
                                <Button className="btn deleteBtn deleteAdditionalFieldButton" onClick={() => this.removePreviousFields(this.props.index)}><i className="fa fa-trash"></i></Button>
                            </Form.Group>
                        </Col>
                    </Form.Row> :
                    <span>
                            {(type == "status") ?
                                <Form.Row>
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group>
                                            <Form.Control type="text" placeholder="Enter Label" name={`additional-${ this.props.index }-field`}
                                                          value={previousFields[this.props.index].label}
                                                          onChange={(event) => { previousFields[this.props.index].label = event.target.value}}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group>
                                            <Form.Check type="checkbox" ref="status" className="customheckBox"
                                                        checked={previousFields[this.props.index].value}
                                                        onChange={(event, newValue) => {
                                                            previousFields[this.props.index].value = newValue }} />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} sm={12} md={1} lg={1}>
                                        <Form.Group>
                                            <Button className="btn deleteBtn deleteAdditionalFieldButton" onClick={() => this.removePreviousFields(this.props.index)}><i className="fa fa-trash"></i></Button>
                                        </Form.Group>
                                    </Col>
                                </Form.Row> :

                                <Form.Row>
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group>
                                            <Form.Control type="text" placeholder="Enter Label"
                                                          name={`additional-${ this.props.index }-field`}
                                                          value={previousFields[this.props.index].label}
                                                          onChange={(event) => { previousFields[this.props.index].label = event.target.value}}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group>
                                            <Form.Control type={previousFields[this.props.index].type} placeholder="Enter Value"
                                                          name={`additional-${ this.props.index }-field`}
                                                          value={previousFields[this.props.index].value}
                                                          onChange={(event) => { previousFields[this.props.index].value = event.target.value}}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} sm={12} md={1} lg={1}>
                                        <Form.Group>
                                            <Button className="btn deleteBtn deleteAdditionalFieldButton" onClick={() => this.removePreviousFields(this.props.index)}><i className="fa fa-trash"></i></Button>
                                        </Form.Group>
                                    </Col>
                                </Form.Row>
                            }
                        </span>
                }
            </div>
        )
    }
}

class AdditionalFieldsAddClass extends EditCertificate {
    render() {
        if(newFields[this.props.index]==undefined){
            return (
                ''
            )
        }

        let type = newFields[this.props.index].type;
        return (
            <div>
                {(type == "date") ?
                    <Form.Row>
                        <Col xs={12} sm={12} md={3} lg={3}>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Enter Label" name={`additional-${ this.props.index }-field`}
                                              onChange={(event) => { newFields[this.props.index].label = event.target.value}}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3}>
                            <Form.Group>
                                <DatePicker className="form-control" placeholderText="Pick A Date"
                                            selected={this.state.startDate}
                                            onChange={(date) => {
                                                newFields[this.props.index].value = date;
                                                this.setState({
                                                    startDate: date
                                                });
                                            }}

                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={12} md={1} lg={1}>
                            <Form.Group>
                                <Button className="btn deleteBtn deleteAdditionalFieldButton" onClick={() => this.removeAdditionalFields(this.props.index)}><i className="fa fa-trash"></i></Button>
                            </Form.Group>
                        </Col>
                    </Form.Row> :
                    <span>
                            {(type == "status") ?
                                <Form.Row>
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group>
                                            <Form.Control type="text" placeholder="Enter Label" name={`additional-${ this.props.index }-field`}
                                                          onChange={(event) => { newFields[this.props.index].label = event.target.value}}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group>
                                            <Form.Check defaultChecked type="checkbox" ref="status" className="customheckBox" onChange={(event, newValue) => {
                                                newFields[this.props.index].value = newValue }} />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} sm={12} md={1} lg={1}>
                                        <Form.Group>
                                            <Button className="btn deleteBtn deleteAdditionalFieldButton" onClick={() => this.removeAdditionalFields(this.props.index)}><i className="fa fa-trash"></i></Button>
                                        </Form.Group>
                                    </Col>
                                </Form.Row> :

                                <Form.Row>
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group>
                                            <Form.Control type="text" placeholder="Enter Label" name={`additional-${ this.props.index }-field`}
                                                          onChange={(event) => { newFields[this.props.index].label = event.target.value}}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group>
                                            <Form.Control type={newFields[this.props.index].type} placeholder="Enter Value" name={`additional-${ this.props.index }-field`}
                                                          onChange={(event) => { newFields[this.props.index].value = event.target.value}}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} sm={12} md={1} lg={1}>
                                        <Form.Group>
                                            <Button className="btn deleteBtn deleteAdditionalFieldButton" onClick={() => this.removeAdditionalFields(this.props.index)}><i className="fa fa-trash"></i></Button>
                                        </Form.Group>
                                    </Col>
                                </Form.Row>
                            }
                        </span>
                }
            </div>
        )
    }
}

export default EditCertificate;
