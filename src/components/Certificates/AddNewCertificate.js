/* eslint-disable */
import React, {Component} from 'react';
import { Dropdown, DropdownButton, Container, Row, Col, NavDropdown, Form, Button, Badge, Alert, ButtonToolbar, Modal,Table  } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CircularProgress from 'material-ui/CircularProgress';
import swal from 'sweetalert';
import CKEditor from 'ckeditor4-react';

let newFields = [];

class AddNewCertificate extends Component {
    constructor(args) {
        super(args);
        this.addCertificateType = this.addCertificateType.bind(this);
        this.addProfession = this.addProfession.bind(this);
        this.addCertificate = this.addCertificate.bind(this);
        this.addExternalCourse = this.addExternalCourse.bind(this);
        this.addFile = this.addFile.bind(this);
        this.removeAdditionalFields = this.removeAdditionalFields.bind(this);

        this.state = {
            validated: false,
            showLoading: false,
            openAddCertificateType : false,
            certificate_type : "",
            certificate_type_id: "",
            certificate_name_select: "Select Type",
            profession_id : "",
            profession_name_select : "Select Profession",
            profession_list: "",
            openAddProfession : false,
            description: "",
            course_details: "",
            comments: "",
            version: "",
            logoImage:"",
            internal_course_list : "",
            internal_course_list_ids : [],
            openAddExternalCourse : false,
            external_course_list: "",
            external_course_list_ids : [],
            roles_list : "",
            roles_list_ids : [],
            name : "",
            user_certificate_id : "",
            expiration_days : "",
            training_hours : "",
            valid_months : "",
            certificate_type_name : "",
            profession_name : "",
            ext_course_name : "",
            ext_course_url : "",
            ext_course_vendor : "",
            ext_course_cost : "",
            accreditor : "",
            files : [],
            fields_dropdown : "",
            additional_fields : [],
            startDate: null
          }
    }
    componentDidMount() {
        this.getCertificateTypeList();
        this.getProfessionList();
        this.getInternalCourseList();
        this.getExternalCourseList();
        this.getRolesList();
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
                    this.setState({certificate_type: result});
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

    handleClickOpen = () => {
      this.setState({ openAddCertificateType: true });
    };

    handleClose = () => {
      this.setState({ openAddCertificateType: false });
    };

    handleClickOpenProfession = () => {
      this.setState({ openAddProfession: true });
    };

    handleCloseProfession = () => {
      this.setState({ openAddProfession: false });
    };

    addCertificateType () {
        var type_name = this.state.certificate_type_name;
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_certificate_type", {
            method: "POST",
            body: JSON.stringify({
                'name': type_name,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({certificate_type: result, openAddCertificateType: false});
                },

                (error) => {

                }
            )
    }

    addProfession (){
      var profession_name = this.state.profession_name;
      fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_profession", {
                method: "POST",
                body:JSON.stringify({
                  'name': profession_name,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                  this.setState({ profession_list: result, openAddProfession: false  });
            },

            (error) => {

            }
        )
    }

    handleChange (id,name){
        this.setState({
            certificate_type_id: id,
            certificate_name_select: name
        });
    };

    handleChangePrfession (id,name) {
        this.setState({
            profession_id: id,
            profession_name_select: name
        });
    };
    createNewField (value) {
        this.setState({ fields_dropdown: value });
        const obj = {
            "type": value,
            "label": '',
            "value": true
        }
        newFields.push(obj);
        const additional_fields = this.state.additional_fields.concat(AdditionalFieldsClass);
        this.setState({ additional_fields });
    };
    addCertificate(event){
      event.preventDefault();
        // form validation
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({ validated: true});
            return;
        }
        let status = 0;
        if(this.refs.status.checked){
            status = 1;
        }
      this.setState({
          /*'description': this.refs.description.value,*/
          status: status,
          showLoading: true
      });
        this.addCertificateQuerry();
      // this.readURL(this.refs.logo);
    }

    readURL=(input)=> {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onloadend = function (e) {
          this.setState({
              logoImage:e.target.result
          });

          // this.addCertificateQuerry();
        }.bind(this);
      reader.readAsDataURL(input.files[0]);
      }
    }
    updateLogoImage=()=>{
        this.readURL(this.refs.logo);
    }

    addCertificateQuerry=()=>{
        let errorString = "";
        let showErrorChk = false;
        if(this.state.certificate_type_id == "" || this.state.certificate_type_id == null){
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
      // this.state.additional_fields = newFields;
      fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_new_certificate", {
                method: "POST",
                body:JSON.stringify({
                  'name': this.state.name,
                  'description' : this.state.description,
                  'version' : this.state.version,
                  'logo' : this.state.logoImage,
                  'certificate_type_id' : this.state.certificate_type_id,
                  'profession_id' : this.state.profession_id,
                  'internal_course_list_ids' : this.state.internal_course_list_ids,
                  'external_course_list_ids' : this.state.external_course_list_ids,
                  'roles_list_ids' : this.state.roles_list_ids,
                  'valid_months' : this.state.valid_months,
                  'training_hours' : this.state.training_hours,
                  'expiration_days' : this.state.expiration_days,
                  'user_certificate_id' : this.state.user_certificate_id,
                  'status' : this.state.status,
                  'accreditor' : this.state.accreditor,
                  'files_list' : this.state.files,
                  'additional_fields' : newFields
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                  newFields = [];
                  this.state.additional_fields = [];
                  this.setState({
                      showLoading: false,
                  });
                  this.goBack();
                  /*swal({
                      title: "Success!",
                      text: "Certificate Has Been Added Successfully!",
                      icon: "success",
                  });*/
            },

            (error) => {
                console.log("Error In Add New Certificate");
                console.log(error);
                this.setState({
                    showLoading: false,
                });
                swal({
                    title: "Error!",
                    text: "Unable To Add Certificate!",
                    icon: "error",
                });
            }
        )
    }

    handleChangeInternal(e){
      if(e.target.checked){
        var arr = [];
        arr.push(e.target.value);
        this.setState({
          internal_course_list_ids : arr
        })
      }else{
        var arr = this.state.internal_course_list_ids;
        var index = arr.indexOf(e.target.value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        this.setState({
          internal_course_list_ids : arr
        })
      }
    }

    handleChangeExternal(e){
      if(e.target.checked){
        var arr = [];
        arr.push(e.target.value);
        this.setState({
          external_course_list_ids : arr
        })
      }else{
        var arr = this.state.external_course_list_ids;
        var index = arr.indexOf(e.target.value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        this.setState({
          external_course_list_ids : arr
        })
      }
    }

    handleChangeRole(e){
      if(e.target.checked){
        var arr = [];
        arr.push(e.target.value);
        this.setState({
          roles_list_ids : arr
        })
      }else{
        var arr = this.state.roles_list_ids;
        var index = arr.indexOf(e.target.value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        this.setState({
          roles_list_ids : arr
        })
      }
    }

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

    addExternalCourseQuerry(image){
       /* 'description' : document.getElementById("course_details").value,
        'comments' : document.getElementById("comments").value*/
      fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_external_course", {
                method: "POST",
                body:JSON.stringify({
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
                    console.log(result);
                  this.setState({ external_course_list: result, openAddExternalCourse: false  });
            },

            (error) => {

            }
        )
    }

    goBack = () => {
        this.props.history.push({pathname :'/certificates', state: { select_drop_down: 'certificates' }});
        // this.props.history.goBack();
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
    removeAdditionalFields(index){
        newFields.splice(index, 1);
        let reRenderedFields = newFields;
        newFields = [];
        if(reRenderedFields.length==0){
            const additional_fields = this.state.additional_fields.concat(AdditionalFieldsClass);
            this.setState({additional_fields});
        }
        for(let i=0;i<reRenderedFields.length;i++) {
            newFields.push(reRenderedFields[i]);
            const additional_fields = this.state.additional_fields.concat(AdditionalFieldsClass);
            this.setState({additional_fields});
        }
    }
    render() {
        const { validated } = this.state;
        const additional_fields = this.state.additional_fields.map((Element, index) => {
            return <Element key={ index } index={ index } />
        });
        return (
            <div>
                <Row style={{marginTop: '1%',marginLeft: '0.8%'}}>
                    <Col xs={12} sm={12} md={12} lg={12} style={{textAlign: 'center'}}>
                        <Button variant="outline-info" onClick={this.goBack} className="backButtonUserArchive pull-left"><i className="fa fa-arrow-left"></i> Go Back</Button>
                        <h1 style={{margin: '0px auto'}}>
                            ADD NEW CERTIFICATE
                        </h1>
                    </Col>
                </Row>
            <Form ref="addCertificateForm" onSubmit={e => this.addCertificate(e)} className="addNewCertificateForm"
                  noValidate
                  validated={validated}>
            <div className="addNewCertificateFormDiv">
                <Row>
                    <Col xs={12} sm={12} md={9} lg={9}>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Certificate ID &nbsp;<span style={{color: 'red', fontWeight: 'bold'}}>*</span></Form.Label>
                                <Form.Control type="text" placeholder="Enter Certificate ID" required
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
                                              onChange={(event) => this.setState({version: event.target.value})}
                                />
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Type &nbsp;<span style={{color: 'red', fontWeight: 'bold'}}>*</span></Form.Label>
                                <Dropdown style={{marginTop: 0}}>
                                    <Dropdown.Toggle className="dropDownToggleCertificateType">
                                        {this.state.certificate_name_select}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {this.state.certificate_type ? this.state.certificate_type.map(certificate_type => (
                                                <Dropdown.Item value={certificate_type.id} onClick={(id,name) => {this.handleChange(certificate_type.id,certificate_type.name)}}>{certificate_type.name}</Dropdown.Item>
                                            ))

                                            :
                                            <Dropdown.Item value="">No Type</Dropdown.Item>
                                        }
                                        <Dropdown.Divider />
                                        <Dropdown.Item className="addNewButton" onClick={this.handleClickOpen} >ADD NEW TYPE</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Status Active</Form.Label>
                                <Form.Check type="checkbox" ref="status" className="customheckBox" />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Col xs={12} sm={12} md={3} lg={3}>
                                <Form.Group>
                                    <Form.Label>Certificate Accreditor</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Certificate Accreditor"
                                                  onChange={(event) => this.setState({accreditor: event.target.value})}
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} sm={12} md={3} lg={3}>
                                <Form.Group>
                                    <Form.Label>Profession &nbsp;<span style={{color: 'red', fontWeight: 'bold'}}>*</span></Form.Label>
                                    <Dropdown style={{marginTop: 0}}>
                                        <Dropdown.Toggle className="dropDownToggleProfession">
                                            {this.state.profession_name_select}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            {this.state.profession_list ? this.state.profession_list.map(profession => (
                                                    <Dropdown.Item value={profession.id} onClick={(id,name) => {this.handleChangePrfession(profession.id,profession.name)}}>{profession.name}</Dropdown.Item>
                                                ))

                                                :
                                                <Dropdown.Item value="">No Profession</Dropdown.Item>
                                            }
                                            <Dropdown.Divider />
                                            <Dropdown.Item className="addNewButton" onClick={this.handleClickOpenProfession} >ADD NEW PROFESSION</Dropdown.Item>
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
                                    <Form.Control type="number" placeholder="Enter Valid Time (Months)" required
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
                                    <Form.Control type="number" placeholder="Enter Expiration Notice (Days)" required
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
                                                  onChange={(event) => this.setState({training_hours: event.target.value})}
                                    />
                                </Form.Group>
                            </Col>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Certificate Name &nbsp;<span style={{color: 'red', fontWeight: 'bold'}}>*</span></Form.Label>
                                <Form.Control type="text" placeholder="Enter Certificate Name" required
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
                                <Form.Label>Description : </Form.Label>

                                <CKEditor name="description" id="description"
                                          activeClass="p10"
                                          content={this.state.description}
                                          onFocus={(event) => this.setState({description: event.editor.getData()})}
                                          onBlur={(event) => this.setState({description: event.editor.getData()})}
                                          onChange={(event) => this.setState({description: event.editor.getData()})}
                                          onSelectionChange={(event) => this.setState({description: event.editor.getData()})}
                                />
                                {/*<Form.Control as="textarea" ref="description" rows="3" className="textArea" />*/}
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Connect Internal Courses :</Form.Label>
                                <div className="heightMarginLeftScrollAuto">
                                    {this.state.internal_course_list ? this.state.internal_course_list.map(internal_course => (
                                            <div style={{marginTop : 7}}>
                                                <input type="checkbox" className="inpuCheckBox" value={internal_course.id} onChange={e => this.handleChangeInternal(e)} />
                                                <label className="customeLabelWihCheckBox">{internal_course.name} </label>
                                            </div>
                                        )):
                                        <label>No Internal Courses</label>
                                    }
                                </div>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Connect External Courses :</Form.Label>
                                <div className="heightMarginLeftScrollAuto">
                                    <Form.Group xs={12} sm={12} md={3} lg={3} className="addNewExternalCourceBtn">
                                        <Button variant="outline-primary" onClick={this.handleClickOpenExternalCourse}>
                                            ADD NEW EXTERNAL COURSE
                                        </Button>
                                    </Form.Group>
                                    {this.state.external_course_list ? this.state.external_course_list.map(external_course => (
                                            <div style={{marginTop : 7}}>
                                                <input type="checkbox" className="inpuCheckBox"  value={external_course.id} onChange={e => this.handleChangeExternal(e)} />
                                                <label className="customeLabelWihCheckBox">{external_course.name} </label>
                                            </div>
                                        )):
                                        <label>No External Courses</label>
                                    }
                                </div>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Connect Roles :</Form.Label>
                                <div className="heightMarginLeftScrollAuto">
                                    {this.state.roles_list ? this.state.roles_list.map(role => (
                                            <div style={{marginTop : 7}}>
                                                <input type="checkbox" className="inpuCheckBox"  value={role.id} onChange={e => this.handleChangeRole(e)} />
                                                <label className="customeLabelWihCheckBox">{role.name} </label>
                                            </div>
                                        )):
                                        <label> No Roles</label>
                                    }
                                </div>
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
                            </div>
                        </Form.Row>

                        {/*new fields*/}



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
                                                  style={{marginLeft: '25%'}}/>
                            </div> :
                            <Button variant="outline-primary"
                                    style={{width: '60%', marginBottom: '3%' }}
                                    type="submit">
                                PUBLISH
                            </Button>
                        }
                        <br/>
                        <div className="viewLogoImage">
                            <img src={this.state.logoImage} style={{width : 145}}/>
                            <br/>
                            <input type="file" className="publishFile" ref="logo" onChange={this.updateLogoImage} />
                        </div>
                        <Button className="logoBtn" variant="outline-primary" style={{width: '60%'}}>
                            {/*<input className="publishFile" type="file" ref="logo"/>*/}
                            <span className="spanLogo">Logo</span>
                        </Button>
                    </Col>
                </Row>
              </div>
            </Form>


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
                                            <input className="publishFile" style={{borderColor: 'white'}} type="file" id="course_image" />
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

                {/* ADD CERTIFICATE MODAL*/}
                <Modal show={this.state.openAddCertificateType} onHide={this.handleClose}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Certificate Type</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Certificate Type</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Certificate Type"
                                                  onChange={(event) => this.setState({certificate_type_name: event.target.value})}
                                    />
                                </Form.Group>
                            </Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.handleClose}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.addCertificateType} style={{marginLeft: 5}}>
                                    Add
                                </Button>
                            </Form.Group>
                        </Row>
                    </Modal.Footer>
                </Modal>

                {/* ADD PROFESSION MODAL*/}
                <Modal show={this.state.openAddProfession} onHide={this.handleCloseProfession}
                       aria-labelledby="contained-modal-title-vcenter"
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Profession</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form ref="addNewFolderForm">
                            <Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Profession Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Profession Name"
                                                  onChange={(event) => this.setState({profession_name: event.target.value})}
                                    />
                                </Form.Group>
                            </Row>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Form.Group as={Col}>
                                <Button variant="outline-secondary" onClick={this.handleCloseProfession}>
                                    Cancel
                                </Button>
                                <Button variant="outline-primary" onClick={this.addProfession} style={{marginLeft: 5}}>
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

class AdditionalFieldsClass extends AddNewCertificate {
    render() {
        console.log(newFields)
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

export default AddNewCertificate;
