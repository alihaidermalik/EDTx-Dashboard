/* eslint-disable */
import React, {Component} from 'react';
import DatePicker from "react-datepicker";
import CircularProgress from 'material-ui/CircularProgress';
import { Dropdown, DropdownButton, Container, Row, Col, NavDropdown, Form, Button, Badge, Alert, ButtonToolbar, Modal,Table  } from 'react-bootstrap';
import swal from 'sweetalert';
import CKEditor from 'ckeditor4-react';
let previousFields = [];
let newFields = [];

class EditRole extends Component {
    constructor() {
        super();
        let path = window.location.pathname.split("/");
        console.log(path);
        this.state = {
            validated: false,
            showLoading: false,
            startDate: null,
            role_id:path[2],
            user_role_id: "",
            image: "",
            logo_image: "",
            logo_change: 0,
            name: "",
            work_description : "",
            description : "",
            status : "",
            certificates: [],
            certificates_list_ids: [],
            files : [],
            additional_fields : [],
            new_additional_fields : [],
            certificates_list : [],
            fields_dropdown : "",
            openSuccessPopup : false,
            openErrorPopup : false,
            message_success : "Your record has been deleted successfully.",
            message_error : "No record found with provided ID."
        };
        this.deleteRoleById = this.deleteRoleById.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangeWorkDescription = this.handleChangeWorkDescription.bind(this);
        this.handleChangeCertificateDefault = this.handleChangeCertificateDefault.bind(this);
        this.handleChangeCertificate = this.handleChangeCertificate.bind(this);
        this.getCertificateList = this.getCertificateList.bind(this);
        this.addFile = this.addFile.bind(this);
        this.removeFile = this.removeFile.bind(this);
        this.createNewField = this.createNewField.bind(this);
        this.removeAdditionalFields = this.removeAdditionalFields.bind(this);
        this.removePreviousFields = this.removePreviousFields.bind(this);
        this.handleChangeInLabel = this.handleChangeInLabel.bind(this);
        this.handleChangeInValue = this.handleChangeInValue.bind(this);
        this.handleChangeInValueCheckBox = this.handleChangeInValueCheckBox.bind(this);
        this.updateRole = this.updateRole.bind(this);
        this.updateLogoImage = this.updateLogoImage.bind(this);
    }

    componentDidMount() {
        this.getRoleData();
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

    getRoleData(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_role/"+this.state.role_id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.roles) {
                        let logoUrlChk = "";
                        if(result.roles[0].logo_url)
                        {
                            logoUrlChk = process.env.REACT_APP_FILES_URL + result.roles[0].logo_url;
                        }
                        this.setState({
                            image: result.roles[0].logo_url,
                            logo_image: logoUrlChk,
                            user_role_id: result.roles[0].user_role_id,
                            name: result.roles[0].name,
                            work_description: result.roles[0].work_description,
                            description: result.roles[0].description,
                            status: result.roles[0].status,
                            certificates: result.certificates,
                            files: result.files,
                            additional_fields: [],
                        });

                        if (result.certificates.length > 0) {
                            var arr = [];
                            for(let i=0;i<result.certificates.length;i++){
                                result.certificates[i].status = true;
                                arr.push(result.certificates[i].id);
                            }
                            this.setState({
                                certificates: result.certificates,
                                certificates_list_ids: arr
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
                    }
                    else{
                        this.setState({openErrorPopup: true});
                    }
                    this.getCertificateList();
            },

            (error) => {
                console.log("get role api error");
                console.log(error);
            }
        )
    }
    deleteRoleById(){
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/delete_role/"+this.state.role_id, {
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
    getCertificateList() {
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/get_certificate_list", {
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
                            for (let j = 0; j < this.state.certificates.length; j++) {
                                if(result[i]) {
                                    if (result[i].id == this.state.certificates[j].id) {
                                        result.splice(i, 1);
                                    }
                                }
                            }
                        }
                        this.setState({certificates_list: result});
                    }
                    else{
                        this.setState({certificates_list: result});
                    }

                },

                (error) => {

                }
            )
    }
    updateRole(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({ validated: true});
            return;
        }
        console.log(this.state.certificates_list_ids)
        if(this.state.certificates_list_ids.length<1){
            swal({
                title: "Error!",
                text: "You Must Connect At Least One Certificate!",
                icon: "error",
            });
            this.setState({
                showLoading: false
            });
            return;
        }

        this.setState({
            showLoading: true
        });
        if(newFields.length>0){
            for(let i=0;i<newFields.length;i++){
                previousFields.push(newFields[i]);
            }
        }
        /*this.state.additional_fields = previousFields;
        this.state.new_additional_fields = newFields;
        console.log(this.state);*/
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/edit_role", {
            method: "POST",
            body: JSON.stringify({
                'role_id': this.state.role_id,
                'name': this.state.name,
                'status': this.state.status,
                'description': this.state.description,
                'work_description': this.state.work_description,
                'logo': this.state.image,
                'logo_change': this.state.logo_change,
                'certificates_list_ids': this.state.certificates_list_ids,
                'user_role_id': this.state.user_role_id,
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
                    /*newFields = [];
                    this.state.additional_fields = [];*/
                    this.setState({
                        showLoading: false,
                    });
                    this.goBack();
                    // this.props.history.push({pathname :'/certificates', state: { select_drop_down: 'roles' }});
                },

                (error) => {
                    console.log("Error In Add New Role");
                    console.log(error);
                    this.setState({
                        showLoading: false,
                    });
                    swal({
                        title: "Error!",
                        text: "Unable To Update Role!",
                        icon: "error",
                    });
                }
            )
    }
    changeStatus = event => {
        if(this.refs.status.checked){
            this.setState({ status: 1 });
        }
        else{
            this.setState({ status: 0 });
        }
    };
    handleChangeDescription(e){
        this.setState({ description: e.editor.getData() });
    }
    handleChangeWorkDescription(e){
        this.setState({ work_description: e.editor.getData() });
    }
    handleChangeCertificateDefault(e,id){
        if (e.target.checked) {
            var defaultCertificates = this.state.certificates;
            for(let i=0;i<defaultCertificates.length;i++){
                if(defaultCertificates[i].id==id){
                    defaultCertificates[i].status = true;
                }
            }
            this.setState({
                certificates : defaultCertificates
            })
        } else {
            let certificates = this.state.certificates;
            let certificates_list = this.state.certificates_list;
            for(let i=0;i<certificates.length;i++){
                if(certificates[i].id == id){
                    certificates[i].status = false;
                    certificates_list.push(certificates[i]);
                    certificates.splice(i,1);
                    this.setState({
                        certificates: certificates,
                        certificates_list: certificates_list,
                    })
                }
            }
        }
        console.log(this.state.certificates);
        console.log(this.state.certificates_list_ids);
        if(this.state.certificates.length>0) {
            var arr = [];
            for (let j = 0; j < this.state.certificates.length; j++) {
                arr.push(this.state.certificates[j].id);
            }
            this.setState({
                certificates_list_ids: arr
            })
        }
        else {
            this.setState({
                certificates_list_ids: []
            })
        }
    }
    handleChangeCertificate(e,id){
        if (e.target.checked) {
            e.target.checked = false;
            let certificates = this.state.certificates;
            let certificates_list = this.state.certificates_list;
            for(let i=0;i<certificates_list.length;i++){
                if(certificates_list[i].id == id){
                    certificates_list[i].status = true;
                    certificates.push(certificates_list[i]);
                    certificates_list.splice(i,1);
                    this.setState({
                        certificates: certificates,
                        certificates_list: certificates_list,
                    })
                }
            }
        } else {

        }
        if(this.state.certificates.length>0) {
            var arr = [];
            for (let j = 0; j < this.state.certificates.length; j++) {
                arr.push(this.state.certificates[j].id);
            }
            this.setState({
                certificates_list_ids: arr
            })
        }
    }
    addFile() {
        var files = document.getElementById("files");
        if (files.files && files.files[0]) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                var arr = this.state.files;
                var fileBase64 = e.target.result.split("base64,")
                var data = {name: files.files[0].name, file: fileBase64[1]}
                arr.push(data);
                this.setState({
                    files: arr
                });
                files.value = "";
            }.bind(this);
            reader.readAsDataURL(files.files[0]);
        }
    }
    removeFile(name) {
        var data = this.state.files;
        for (var i = 0; i < data.length; i++) {
            if (data[i].name == name) {
                data.splice(i, 1);
                break;
            }
        }
        this.setState({
            files: data
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
                    image: e.target.result,
                    logo_image: e.target.result,
                });
            }.bind(this);
            reader.readAsDataURL(input.files[0]);
        }
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
    }
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
                <div>
                    <Row style={{marginTop: '1%',marginLeft: '0.8%'}}>
                        <Col xs={12} sm={12} md={12} lg={12} style={{textAlign: 'center'}}>
                            <Button variant="outline-info" onClick={this.goBack} className="backButtonUserArchive pull-left"><i className="fa fa-arrow-left"></i> Go Back</Button>
                            <h1 style={{margin: '0px auto'}}>
                                EDIT DETAILS
                            </h1>
                        </Col>
                    </Row>
                </div>

                <Form
                    onSubmit={e => this.updateRole(e)}
                              noValidate
                              validated={validated}
                    style={{margin:'15px 0px 70px 15px'}}>
                    <Row>
                        <Col xs={12} sm={12} md={9} lg={9}>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Role ID &nbsp;<span style={{color: 'red', fontWeight: 'bold'}}>*</span></Form.Label>
                                    <Form.Control type="text" required
                                                  value={this.state.user_role_id}
                                                  onChange={(event) => this.setState({user_role_id: event.target.value})}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        Role id is required.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>Status Active</Form.Label>
                                    <Form.Check type="checkbox" ref="status" className="customheckBox" checked={this.state.status==1 ? true : false}
                                                onChange={(e) => this.changeStatus(e)}
                                    />
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Role Name &nbsp;<span style={{color: 'red', fontWeight: 'bold'}}>*</span></Form.Label>
                                    <Form.Control type="text" placeholder="Enter Role Name" value={this.state.name} required
                                                  onChange={(event) => this.setState({name: event.target.value})}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        Role name is required.
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
                                    {/*<Form.Control as="textarea" ref="description" rows="3" className="textArea" placeholder="Enter Role Description"
                                                  value={this.state.description}
                                                  onChange={(e) => this.handleChangeDescription(e)}
                                    />*/}
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Work Description </Form.Label>
                                    {this.state.work_description ?
                                        <CKEditor name="work_description" id="work_description"
                                                  activeClass="p10"
                                                  data={this.state.work_description}
                                                  content={this.state.work_description}
                                                  onFocus={this.handleChangeWorkDescription}
                                                  onBlur={this.handleChangeWorkDescription}
                                                  onChange={this.handleChangeWorkDescription}
                                                  onSelectionChange={this.handleChangeWorkDescription}
                                        /> :
                                        ''
                                    }
                                    {/*<Form.Control as="textarea" ref="work_description" rows="3" className="textArea" placeholder="Enter Role's Work Description"
                                                  value={this.state.work_description}
                                                  onChange={(e) => this.handleChangeWorkDescription(e)}
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
                                    <Form.Label>Certificates &nbsp;<span style={{color: 'red', fontWeight: 'bold'}}>*</span></Form.Label>
                                    <div className="heightMarginLeftScrollAuto">
                                        {this.state.certificates ? this.state.certificates.map(certificate => (
                                                <div style={{marginTop : 7}}>
                                                    <input type="checkbox" className="inpuCheckBox"  value={certificate.id} checked={certificate.status} onChange={(e,id) => this.handleChangeCertificateDefault(e,certificate.id)} />
                                                    <label className="customeLabelWihCheckBox">{certificate.name} </label>
                                                </div>
                                            )):
                                            ''
                                        }
                                        {this.state.certificates_list ? this.state.certificates_list.map(certificate => (
                                                <div style={{marginTop : 7}}>
                                                    <input type="checkbox" className="inpuCheckBox"  value={certificate.id} onChange={(e,id) => this.handleChangeCertificate(e,certificate.id)} />
                                                    <label className="customeLabelWihCheckBox">{certificate.name} </label>
                                                </div>
                                            )):
                                            <label> No More Certificate </label>
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




                            <Form.Row controlId="formPlaintextPassword">
                                <Form.Label column xs={12} sm={12} md={8} lg={8}>
                                    Add More Files :
                                </Form.Label>
                                <Col xs={12} sm={12} md={3} lg={3}>
                                    <Dropdown className="addNewFieldDropDown">
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
                        <Modal.Title>Success</Modal.Title>
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

class AdditionalFieldsClass extends EditRole {
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

class AdditionalFieldsAddClass extends EditRole {
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

export default EditRole;
