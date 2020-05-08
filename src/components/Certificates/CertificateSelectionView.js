/* eslint-disable */
import React from 'react';
import UsersData from './UsersData';
import RolesData from './RolesData';
import CertificatesData from './CertificatesData';
import ArchiveData from './ArchiveData';
import {certificateFilterActions} from '../../actions/certificateFilters.actions';
import {connect} from 'react-redux';
import { Dropdown, DropdownButton,Container,Row,Col,NavDropdown,Form ,Button,Badge,Alert  } from 'react-bootstrap';
const changeCase = require('change-case');

class CertificateSelectionView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdown_default: "Select View",
            type: ""
        };
    }

    componentDidMount() {
        const {pageName} = this.props;
        let value = "users";
        if(pageName){
            value = pageName;
        }
        this.setState({
            dropdown_default: changeCase.titleCase(value),
            type: value
        });
    }

    handleChange (value) {
        this.setState({
            dropdown_default: changeCase.titleCase(value),
            type: value
        });
        const {dispatch} = this.props;
        dispatch(certificateFilterActions.setFilters(value));
    };

    goBack = () => {
        this.props.props.history.push('/');
        // this.props.props.history.goBack();
    }
    
    render() {

        return (
            <div style={{width : '98.5%'}}>
                {/*<div style={{display: "flex", width: "100%", alignItems: "center"}}>
                  <div style={{ flexBasis: "40%"}}>
                      <Button variant="outline-info" onClick={this.goBack} className="backButton" style={{borderRadius:0}}><i className="fa fa-arrow-left"></i> Go Back</Button>
                  </div>
                  <div>
                      <Alert  variant="primary" className="pageHeading">
                          CERTIFICATE MANAGEMENT
                      </Alert>
                  </div>
                </div>*/}
                <div>
                    <Row style={{marginTop: '1%',marginLeft: 0}}>
                        <Col xs={12} sm={12} md={12} lg={12} style={{textAlign: 'center'}}>
                            <Button variant="outline-info" onClick={this.goBack} className="backButtonUserArchive pull-left"><i className="fa fa-arrow-left"></i> Go Back</Button>
                            <h1 style={{margin: '0px auto'}}>
                                CERTIFICATE MANAGEMENT
                            </h1>
                        </Col>
                    </Row>
                </div>
                <form ref="selectCertificateViewForm" onSubmit = {this.addCertificate} className="selectCertificateViewForm">
                    <Row>
                        <Col xs={6} sm={6} md={3} lg={3}>
                            <Dropdown>
                                <Dropdown.Toggle>
                                    {this.state.dropdown_default}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item value={"users"} onClick={(event) => {this.handleChange("users")}}>Users </Dropdown.Item>
                                    <Dropdown.Item value={"roles"} onClick={(event) => {this.handleChange("roles")}}>Roles </Dropdown.Item>
                                    <Dropdown.Item value={"certificates"} onClick={(event) => {this.handleChange("certificates")}}>Certificates</Dropdown.Item>
                                    <Dropdown.Item value={"archives"} onClick={(event) => {this.handleChange("archives")}}>Archives</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col xs={6} sm={6} md={9} lg={9}></Col>
                    </Row>
                </form>
                <div>
                    {this.state.type=="users" && <UsersData props={this.props} />}
                    {this.state.type=="roles" && <RolesData props={this.props} />}
                    {this.state.type=="certificates" && <CertificatesData props={this.props} />}
                    {this.state.type=="archives" && <ArchiveData props={this.props} />}
                </div>
            </div>
        )
    }

}
function mapStateToProps(state) {
    const {pageName} = state.filteration;
    return {
        pageName
    };
}
export default connect(mapStateToProps)(CertificateSelectionView);
/*const mainCertificatePage = connect(mapStateToProps)(CertificateSelectionView);
// export {mainCertificatePage as CertificateSelectionView};

export default mainCertificatePage;*/
