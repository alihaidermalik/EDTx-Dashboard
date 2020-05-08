/* eslint-disable */
import React, {Component} from 'react';
import DatePicker from 'material-ui/DatePicker';
import { history } from '../../helpers';
import { Dropdown, DropdownButton, Container, Row, Col, NavDropdown, Form, Button, Badge, Alert, ButtonToolbar, Modal,Table  } from 'react-bootstrap';
let newFields = [];

class ViewCertificate extends Component {
    constructor() {
        super();
        let path = window.location.pathname.split("/");
        console.log(path);
        this.state = {
            certificate_id:path[2],
            user_certificate_id: "",
            image: "",
            name: "",
            type_name : "",
            profession_name : "",
            description : "",
            version : "",
            external_course_list : "",
            internal_course_list : "",
            connected_roles : "",
            status : "",
            accreditor : "",
            expiration_days : "",
            training_hours : "",
            valid_months : "",
            files : [],
            additional_fields : [],
            openSuccessPopup : false,
            openErrorPopup : false,
            message_success : "Your record has been deleted successfully.",
            message_error : "No record found with provided ID."
        };
        this.deleteCertificateById = this.deleteCertificateById.bind(this);
        this.editCertificateById = this.editCertificateById.bind(this);
    }

    componentDidMount() {
        this.getCertificateData();
    }

    renderAdditionalFields(fieldsObtained) {
        for(let i=0;i<fieldsObtained.length;i++) {
            newFields.push(fieldsObtained[i]);
            const additional_fields = this.state.additional_fields.concat(AdditionalFieldsClass);
            this.setState({additional_fields});
        }
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
                    let logoUrlChk = "";
                    if(result.certificates[0].logo_url)
                    {
                        logoUrlChk = process.env.REACT_APP_FILES_URL + result.certificates[0].logo_url;
                    }
                    if(result.certificates) {
                        this.setState({
                            image: logoUrlChk,
                            user_certificate_id: result.certificates[0].user_certificate_id,
                            name: result.certificates[0].name,
                            type_name: result.certificates[0].type_name,
                            profession_name: result.certificates[0].profession_name,
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
                        });

                        if (result.internal_courses.length > 0) {
                            this.setState({
                                internal_course_list: result.internal_courses,
                            });
                        }

                        if (result.external_courses.length > 0) {
                            this.setState({
                                external_course_list: result.external_courses,
                            });
                        }

                        if (result.roles.length > 0) {
                            this.setState({
                                connected_roles: result.roles,
                            });
                        }
                        if (result.files.length > 0) {
                            this.setState({
                                files: result.files,
                            });
                        }
                        if (result.additional_fields.length > 0) {
                            /*this.setState({
                                additional_fields : result.additional_fields,
                            });*/
                            this.renderAdditionalFields(result.additional_fields);
                        }
                    }
                    else{
                        this.setState({openErrorPopup: true});
                    }
            },

            (error) => {

            }
        )
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
    editCertificateById(){
        history.push('/edit_certificate/'+this.state.certificate_id);
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
        this.props.history.push({pathname :'/certificates', state: { select_drop_down: 'certificates' }});
        // this.props.history.goBack();
    };
    render() {
        const additional_fields = this.state.additional_fields.map((Element, index) => {
            return <Element key={ index } index={ index } />
        });
        return (
            <div>
                <Row style={{marginTop: '1%',marginLeft: '0.8%'}}>
                    <Col xs={12} sm={12} md={12} lg={12} style={{textAlign: 'center'}}>
                        <Button variant="outline-info" onClick={this.goBack} className="backButtonUserArchive pull-left"><i className="fa fa-arrow-left"></i> Go Back</Button>
                        <h1 style={{margin: '0px auto'}}>
                            CERTIFICATE DETAILS
                        </h1>
                    </Col>
                </Row>
                <form style={{marginLeft:15}}>
                    <Row>
                        <Col xs={12} sm={12} md={9} lg={9}>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Certificate ID</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Certificate ID"
                                                  value={this.state.user_certificate_id}
                                    />
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>Certificate Version</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Certificate Version"
                                                  value={this.state.version}
                                    />
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>Type</Form.Label>
                                    <Dropdown style={{marginTop: 0}}>
                                        <Dropdown.Toggle className="dropDownToggleProfession">
                                            {this.state.type_name}
                                        </Dropdown.Toggle>
                                    </Dropdown>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Status Active</Form.Label>
                                    <Form.Check type="checkbox" ref="status" className="customheckBox" checked={this.state.status==1 ? true : false} />
                                </Form.Group>
                            </Form.Row>


                            <Form.Row>
                                <Col xs={12} sm={12} md={3} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Certificate Accreditor</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Certificate Accreditor"
                                                      value={this.state.accreditor}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12} sm={12} md={3} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Profession</Form.Label>
                                        <Dropdown style={{marginTop: 0}}>
                                            <Dropdown.Toggle className="dropDownToggleProfession">
                                                {this.state.profession_name}
                                            </Dropdown.Toggle>
                                        </Dropdown>
                                    </Form.Group>
                                </Col>
                                <div className="clearfix"></div>
                            </Form.Row>


                            <Form.Row>
                                <Col xs={12} sm={12} md={3} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Valid Time (Months)</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Valid Time (Months)"
                                                      value={this.state.valid_months}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12} sm={12} md={3} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Expiration Notice (Days)</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Expiration Notice (Days)"
                                                      value={this.state.expiration_days}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12} sm={12} md={3} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Minimum Training (Hours)</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Minimum Training (Hours)"
                                                      value={this.state.training_hours}
                                        />
                                    </Form.Group>
                                </Col>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Certificate Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Certificate Name"
                                                  value={this.state.name}
                                    />
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Description </Form.Label>
                                    <Form.Control as="textarea" ref="description" rows="3" className="textArea"
                                                  value={this.state.description}
                                    />
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
                                                    <li>{internal_course.name} </li>
                                                </div>
                                            )):
                                            <label>No Internal Courses</label>
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
                                                    <li>{external_course.name} </li>
                                                </div>
                                            )):
                                            <label>No External Courses</label>
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
                                                    <li>{role.name} </li>
                                                </div>
                                            )):
                                            <label> No Roles</label>
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
                                        {this.state.files ?  this.state.files.map(file => (
                                                <div style={{marginTop : 7}}>
                                                    <li><a href={process.env.REACT_APP_FILES_URL + file.file_url} style={{textDecoration : 'none'}} target="_blank"> {file.name} </a></li>
                                                </div>
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

                            <Form.Row>
                                <Form.Label>Additional Fields :</Form.Label>
                                <div className="inputs" style={{marginLeft: '12%', width: '100%'}}>
                                    { additional_fields }
                                </div>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <hr/>
                                </Form.Group>
                            </Form.Row>

                        </Col>

                        <Col xs={12} sm={12} md={3} lg={3}>
                            <Button variant="outline-primary"
                                    style={{width: '60%', marginBottom: '3%' }}
                                    onClick={this.editCertificateById}
                                    type="submit">
                                EDIT
                            </Button>
                            <Button variant="outline-danger"
                                    style={{width: '60%', marginBottom: '3%' }}
                                    onClick={this.deleteCertificateById}
                                    type="submit">
                                DELETE
                            </Button>
                            <div className="viewLogoImage">
                                {this.state.image != ""?
                                    <img src={this.state.image} style={{width : 145}}/>:
                                    ''
                                }
                            </div>
                        </Col>
                    </Row>
                </form>

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
class AdditionalFieldsClass extends Component {
    render() {
        let type = newFields[this.props.index].type;
        if(type == "date"){
            newFields[this.props.index].value = new Date(newFields[this.props.index].value);
        }
        return (
            <div>
                {(type == "date") ?
                    <Form.Row>
                        <Col xs={12} sm={12} md={3} lg={3}>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Enter Label" name={`additional-${ this.props.index }-field`}
                                              value={newFields[this.props.index].label}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={12} md={3} lg={3}>
                            <Form.Group>
                                <DatePicker id={this.props.index} className="form-control" placeholderText="Pick A Date"
                                            selected={newFields[this.props.index].value} disabled
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={12} md={1} lg={1}>
                        </Col>
                    </Form.Row> :
                    <span>
                            {(type == "status") ?
                                <Form.Row>
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group>
                                            <Form.Control type="text" placeholder="Enter Label" name={`additional-${ this.props.index }-field`}
                                                          value={newFields[this.props.index].label}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group>
                                            <Form.Check type="checkbox" ref="status" className="customheckBox"
                                                        checked={newFields[this.props.index].value}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} sm={12} md={1} lg={1}>

                                    </Col>
                                </Form.Row> :

                                <Form.Row>
                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group>
                                            <Form.Control type="text" placeholder="Enter Label"
                                                          name={`additional-${ this.props.index }-field`}
                                                          value={newFields[this.props.index].label}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Form.Group>
                                            <Form.Control type={newFields[this.props.index].type} placeholder="Enter Value"
                                                          name={`additional-${ this.props.index }-field`}
                                                          value={newFields[this.props.index].value}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12} sm={12} md={1} lg={1}>

                                    </Col>
                                </Form.Row>
                            }
                        </span>
                }
            </div>
        )
    }
}

export default ViewCertificate;
