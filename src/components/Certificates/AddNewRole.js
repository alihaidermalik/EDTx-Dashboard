/* eslint-disable */
import React, {Component} from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import DatePicker from "react-datepicker";
import { Dropdown, DropdownButton, Container, Row, Col, NavDropdown, Form, Button, Badge, Alert, ButtonToolbar, Table, Modal,Tab, Tabs, Image  } from 'react-bootstrap';
import swal from 'sweetalert';
import CKEditor from 'ckeditor4-react';

let newFields = [];

class AddNewRole extends Component {
    goBack = () => {
        this.props.history.push({pathname :'/certificates', state: { select_drop_down: 'roles' }});
        // this.props.history.goBack();
    }
    createNewField = (value) => {
        this.setState({fields_dropdown: value});
        const obj = {
            "type": value,
            "label": '',
            "value": true
        }
        newFields.push(obj);
        const additional_fields = this.state.additional_fields.concat(AdditionalFieldsClass);
        this.setState({additional_fields});
    };

    constructor() {
        super();
        this.addRole = this.addRole.bind(this);
        this.addFile = this.addFile.bind(this);
        this.removeAdditionalFields = this.removeAdditionalFields.bind(this);
        this.state = {
            validated: false,
            showLoading: false,
            logoImage: "",
            name: "",
            description: "",
            work_description: "",
            status: "",
            certificates_list: "",
            certificates_list_ids: [],
            user_role_id: "",
            files: [],
            fields_dropdown: "",
            startDate: null,
            additional_fields: []
        };
    }


    componentDidMount() {
        this.getCertificateList();
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
                    if (result.length > 0) {
                        this.setState({certificates_list: result});
                    }

                },

                (error) => {

                }
            )
    }

    addRole(event) {
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
            status: status,
            /*'description': this.refs.description.value,
            'work_description': this.refs.work_description.value,*/
            showLoading: true
        });
        this.addRoleQuerry();
        // this.readURL(this.refs.logo);
    }

    addRoleQuerry() {
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

        // this.state.additional_fields = newFields;
        fetch(process.env.REACT_APP_SECOND_API_URL + "/api/add_new_role", {
            method: "POST",
            body: JSON.stringify({
                'name': this.state.name,
                'status': this.state.status,
                'description': this.state.description,
                'work_description': this.state.work_description,
                'logo': this.state.logoImage,
                'certificates_list_ids': this.state.certificates_list_ids,
                'user_role_id': this.state.user_role_id,
                'files_list': this.state.files,
                'additional_fields': newFields
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
                    /* console.log("Success In Add New Role");
                     console.log(result);*/
                    this.setState({
                        showLoading: false,
                    });
                    this.goBack();
                    /*swal({
                        title: "Success!",
                        text: "Role Has Been Added Successfully!",
                        icon: "success",
                    });*/
                },

                (error) => {
                    console.log("Error In Add New Role");
                    console.log(error);
                    this.setState({
                        showLoading: false
                    })
                    swal({
                        title: "Error!",
                        text: "Unable To Add Role!",
                        icon: "error",
                    });
                }
            )
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

    readURL=(input)=> {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                this.setState({
                    logoImage: e.target.result
                });

                // this.addRoleQuerry();
            }.bind(this);
            reader.readAsDataURL(input.files[0]);
        }
    }
    updateLogoImage=()=>{
        this.readURL(this.refs.logo);
    }

    handleChange(e) {
        if (e.target.checked) {
            var arr = [];
            arr.push(e.target.value);
            this.setState({
                certificates_list_ids: arr
            })
        } else {
            var arr = this.state.certificates_list_ids;
            var index = arr.indexOf(e.target.value);
            if (index > -1) {
                arr.splice(index, 1);
            }
            this.setState({
                certificates_list_ids: arr
            })
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
    uploadImageCallBack(file) {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://api.imgur.com/3/image');
                xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    customHandlerDescription =( evt )=> {
        // console.log( evt );
        var newContent = evt.editor.getData();
        this.setState({
            description: newContent
        })
    }
    customHandlerWorkDescription =( evt )=> {
        // console.log( evt );
        var newContent = evt.editor.getData();
        this.setState({
            work_description: newContent
        })
    }


    render() {
        const { validated } = this.state;
        const additional_fields = this.state.additional_fields.map((Element, index) => {
            return <Element key={index} index={index}/>
        });
        return (
            <div>
                <Row style={{marginTop: '1%',marginLeft: '0.8%'}}>
                    <Col xs={12} sm={12} md={12} lg={12} style={{textAlign: 'center'}}>
                        <Button variant="outline-info" onClick={this.goBack} className="backButtonUserArchive pull-left"><i className="fa fa-arrow-left"></i> Go Back</Button>
                        <h1 style={{margin: '0px auto'}}>
                            ADD NEW ROLE
                        </h1>
                    </Col>
                </Row>
                <Form ref="addRoleForm" onSubmit={e => this.addRole(e)}
                      noValidate
                      validated={validated}
                      style={{marginLeft: 15, marginBottom: 70}}>
                    <Row>
                        <Col xs={12} sm={12} md={9} lg={9}>
                            <Form.Row style={{margin: 5, marginLeft: 0}}>
                                <Form.Group style={{width: '25%'}}>
                                    <Form.Label>Role ID &nbsp;<span style={{color: 'red', fontWeight: 'bold'}}>*</span></Form.Label>
                                    <Form.Control type="text" placeholder="Enter Role ID" required
                                                  onChange={(event) => this.setState({user_role_id: event.target.value})}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        Role id is required.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>Status Active</Form.Label>
                                    <Form.Check type="checkbox" ref="status" className="customheckBox" />
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Role Name &nbsp;<span style={{color: 'red', fontWeight: 'bold'}}>*</span></Form.Label>
                                    <Form.Control type="text" placeholder="Enter Role Name" required
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
                                    <Form.Label>Description : </Form.Label>
                                    {/*<EditorImage name="description" title="Description" value={this.state.description}
                                    onChange={this.handleChangeDescriptionText} />
                                    <ReactQuill value={this.state.description}
                                                onChange={this.handleChangeDescriptionText}
                                                theme='snow'
                                                modules={Editor.modules}
                                                formats={Editor.formats}
                                                placeholder="Enter Value"/>*/}
                                    <CKEditor name="description" id="description"
                                              activeClass="p10"
                                        /*data="Your Description..."*/
                                              content={this.state.description}
                                              onFocus={this.customHandlerDescription}
                                              onBlur={this.customHandlerDescription}
                                              onChange={this.customHandlerDescription}
                                              onSelectionChange={this.customHandlerDescription}
                                        /* config={ {
                                             extraPlugins : 'filebrowser',
                                         } }*/
                                    />
                                    {/*
                                    <Form.Control as="textarea" ref="description" rows="3" className="textArea" placeholder="Enter Role Description" />*/}
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Work Description : </Form.Label>
                                    <CKEditor name="work_description" id="work_description"
                                              activeClass="p10"
                                        /* data="Your Work Description..."*/
                                              content={this.state.work_description}
                                              onFocus={this.customHandlerWorkDescription}
                                              onBlur={this.customHandlerWorkDescription}
                                              onChange={this.customHandlerWorkDescription}
                                              onSelectionChange={this.customHandlerWorkDescription}
                                    />

                                    {/*<Form.Control as="textarea" ref="work_description" rows="3" className="textArea" placeholder="Enter Role's Work Description" />*/}
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <hr/>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Connect Certificates : &nbsp;<span style={{color: 'red', fontWeight: 'bold'}}>*</span></Form.Label>
                                    <div className="heightMarginLeftScrollAuto">
                                        {this.state.certificates_list ? this.state.certificates_list.map(certificate => (
                                                <div style={{marginTop : 7}}>
                                                    <input type="checkbox" className="inpuCheckBox"  value={certificate.id} onChange={e => this.handleChange(e)} />
                                                    <label className="customeLabelWihCheckBox">{certificate.name} </label>
                                                </div>
                                            )):
                                            <label> No Certificates</label>
                                        }
                                    </div>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>File List :</Form.Label>
                                    <div className="heightMarginLeftScrollAuto">
                                        <Form.Group style={{position: 'absolute',left: '67%'}}>
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
                                </div>
                            </Form.Row>
                        </Col>


                        <Col xs={12} sm={12} md={3} lg={3}>
                            {this.state.showLoading ?
                                <div style={{position: 'relative'}}>
                                    <CircularProgress size={60} thickness={7}
                                                      style={{marginLeft: '17%'}}/>
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
                </Form>
            </div>
        )
    }

}

class AdditionalFieldsClass extends AddNewRole {
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

export default AddNewRole;
