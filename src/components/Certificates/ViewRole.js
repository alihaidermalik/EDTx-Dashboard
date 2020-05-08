/* eslint-disable */
import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DatePicker from "react-datepicker";
import { history } from '../../helpers';
import { Dropdown, DropdownButton, Container, Row, Col, NavDropdown, Form, Button, Badge, Alert, ButtonToolbar, Modal,Table  } from 'react-bootstrap';

let newFields = [];

class ViewRole extends Component {
    constructor() {
        super();
        let path = window.location.pathname.split("/");
        console.log(path);
        this.state = {
            role_id:path[2],
            user_role_id: "",
            image: "",
            name: "",
            work_description : "",
            description : "",
            status : "",
            certificates: "",
            files : [],
            additional_fields : [],
            openSuccessPopup : false,
            openErrorPopup : false,
            message_success : "Your record has been deleted successfully.",
            message_error : "No record found with provided ID."
        };
        this.deleteRoleById = this.deleteRoleById.bind(this);
        this.editRoleById = this.editRoleById.bind(this);
    }

    componentDidMount() {
        this.getRoleData();
    }

    renderAdditionalFields(fieldsObtained) {
        for(let i=0;i<fieldsObtained.length;i++) {
            newFields.push(fieldsObtained[i]);
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
                            image: logoUrlChk,
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
                            this.setState({
                                certificates: result.certificates,
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
    editRoleById(){
        history.push('/edit_role/'+this.state.role_id);
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
        history.push({pathname :'/certificates', state: { select_drop_down: 'roles' }});
        // this.props.history.goBack();
    }
    render() {
        const additional_fields = this.state.additional_fields.map((Element, index) => {
            return <Element key={ index } index={ index } />
        });
        return (
            <div>
                <div>
                    <Row style={{marginTop: '1%',marginLeft: '0.8%'}}>
                        <Col xs={12} sm={12} md={12} lg={12} style={{textAlign: 'center'}}>
                            <Button variant="outline-info" onClick={this.goBack} className="backButtonUserArchive pull-left"><i className="fa fa-arrow-left"></i> Go Back</Button>
                            {/*<Alert  variant="primary" className="pageHeading" style={{width: 260}}>
                                ROLE DETAILS
                            </Alert>*/}
                            <h1 style={{margin: '0px auto'}}>
                                ROLE DETAILS
                            </h1>
                        </Col>
                    </Row>
                </div>
                <Form style={{margin:'15px 0px 70px 15px'}}>
                    <Row>
                        <Col xs={12} sm={12} md={9} lg={9}>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Role ID</Form.Label>
                                    <Form.Control type="text"
                                                  value={this.state.user_role_id}
                                    />
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>Status Active</Form.Label>
                                    <Form.Check type="checkbox" ref="status" className="customheckBox" checked={this.state.status==1 ? true : false} />
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Role Name</Form.Label>
                                    <Form.Control type="text" value={this.state.name}
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
                                    <Form.Label>Work Description </Form.Label>
                                    <Form.Control as="textarea" ref="work_description" rows="3" className="textArea"
                                                  value={this.state.work_description}
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
                                    <Form.Label>Certificates </Form.Label>
                                    <div className="heightMarginLeftScrollAuto">
                                        {this.state.certificates ? this.state.certificates.map(certificate => (
                                                <div style={{marginTop : 7}}>
                                                    <li> {certificate.name} </li>
                                                </div>
                                            )):
                                            <label> No Certificates Connected</label>
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
                                    <Form.Label>Files List </Form.Label>
                                    <div className="heightMarginLeftScrollAuto">
                                        {this.state.files ?  this.state.files.map(file => (
                                                <div style={{marginTop: 7}}>
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
                                <div className="inputs" style={{marginLeft: '12%', width: '100%'}}>
                                    { additional_fields }
                                </div>
                            </Form.Row>

                        </Col>

                        <Col xs={12} sm={12} md={3} lg={3}>
                            <Button variant="outline-primary"
                                    style={{width: '60%', marginBottom: '3%' }}
                                    onClick={this.editRoleById}
                                    type="submit">
                                EDIT
                            </Button>
                            <Button variant="outline-danger"
                                    style={{width: '60%', marginBottom: '3%' }}
                                    onClick={this.deleteRoleById}
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

export default ViewRole;
