import React, { Component, Fragment } from "react";
import { Form, Col } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ContactUsForm from "../../Common/Form/ContactUsForm";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import ContactCard from "../../Common/AllCard/ContactCard/ContactCard";
import { getUserProfile } from "../../../actions/profile";
// import ActivityList from "../../Layout/ActivityList/ActivityList";
import { Layout } from "antd";
const { Content } = Layout;
const data = [
  {
    UserName: "Simul Barua",
    EmployeeID: "141001",
    Email: "simul@ulkasemi.com",
    Designation: "Senior Engineer",
    Department: "Front-End Verification"
  },
  {
    UserName: "Benazir",
    EmployeeID: "171201",
    Email: "benazir@ulkasemi.com",
    Designation: "Enigineer",
    Department: "Front-End Verification"
  },
  {
    UserName: "Rashik Tahmid",
    EmployeeID: "170101",
    Email: "rashik@ulkasemi.com",
    Designation: "Enigineer",
    Department: "Front-End Verification"
  }
];

class ContactUs extends Component {
  componentWillMount() {
    let id = this.props.match.params.id;
    this.props.getUserProfile(id);
  }
  static propTypes = {
    getUserProfile: PropTypes.func.isRequired,
    profile: PropTypes.object
  };
  render() {
    // if (!this.props.profile) {
    //   return null;
    // }
    return (
      <Fragment>
        <Content>
          <div className="col-sm-12" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  <TitleHeader
                    title={"The Developer Team"}
                    title_color={"#337ab7"}
                  />
                  <br />
                  <Col span={24}>
                    <Form
                      style={{ marginTop: "10px" }}
                      onFinish={this.handleSubmit}
                    >
                      <Col span={14}>
                        <ContactUsForm
                          UserName={
                            this.props.profile
                              ? this.props.profile.full_name
                              : null
                          }
                          Email={
                            this.props.profile ? this.props.profile.email : null
                          }
                        />
                      </Col>
                      <Col span={3}></Col>
                      <Col span={7}>
                        <ContactCard devdata={data} />
                      </Col>
                    </Form>
                  </Col>
                </div>
              </div>
            </div>
          </div>
        </Content>
        {/* Off For Appraisal <ActivityList id={this.props.match.params.id} type={"all"} /> */}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile.profile
});
export default connect(mapStateToProps, { getUserProfile })(ContactUs);
