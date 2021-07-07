import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import ProfileInfo from "../../Pages/EmployeeProfile/ProfileInfo/ProfileInfo";
import EmployeeWorkInfo from "../../Pages/EmployeeProfile/EmployeeWorkInfo/EmployeeWorkInfo";
import ProfileKpi from "../../Pages/EmployeeProfile/ProfileKpi/ProfileKpi";
import "./EmployeeProfile.css";
// import { DatePicker } from "antd";
import { getUserProfile } from "../../../actions/profile";
import Spinner from "../../Common/Spinner/Spinner";
// import ActivityList from "../../Layout/ActivityList/ActivityList";
import { Layout } from "antd";
// import NoData from "../../Common/NoData/NoData";
import Page404 from "../../Common/404Page/404Page";

const { Content } = Layout;
class EmployeeProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  static propTypes = {
    getUserProfile: PropTypes.func.isRequired,
    profile: PropTypes.object
  };

  componentDidMount() {
    let id = this.props.match.params.id;
    this.props.getUserProfile(id);
    this.setState({ loading: false });
  }
  render() {
    if (!this.props.profile) {
      return <Spinner />;
    }
    if (this.state.loading) {
      return <Spinner srcfile={this.props.profile.image} />;
    }
    let profileGroup;
    this.props.profile.groups.map(profGrp => (profileGroup = profGrp.id));

    let userGroup;
    this.props.auth_user.groups.map(
      userGrp => (
        // console.log(userGrp.id, "user groups"),
        (userGroup = userGrp.id)
      )
    );

    let ProfileKpiBottom;
    if (this.props.auth_user.is_fna) {
      ProfileKpiBottom = null;
    } else if (
      this.props.auth_user.is_teamleader ||
      this.props.auth_user.is_staff ||
      this.props.auth_user.id === this.props.profile.id
    ) {
      ProfileKpiBottom = <ProfileKpi profile={this.props.profile} />;
    } else {
      ProfileKpiBottom = null;
    }

    let ProfileKpiHR;
    if (this.props.auth_user.is_hr) {
      if (this.props.profile.id !== this.props.auth_user.id) {
        ProfileKpiBottom = <ProfileKpi profile={this.props.profile} />;
      } else {
        ProfileKpiBottom = null;
      }
    }

    return (
      <Fragment>
        <Content>
          <div className="col-sm-12" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  {this.props.auth_user.is_hr || this.props.auth_user.is_fna ? (
                    <Fragment>
                      <TitleHeader title={"Profile"} title_color={"#337ab7"} />
                      <br />
                      <ProfileInfo
                        profile={this.props.profile}
                        user={this.props.auth_user}
                      />
                      <br />

                      <EmployeeWorkInfo profile={this.props.profile} />
                      <br />
                      {ProfileKpiBottom}
                      {ProfileKpiHR}
                    </Fragment>
                  ) : profileGroup !== userGroup &&
                    !this.props.auth_user.is_staff ? (
                    <Page404 />
                  ) : (
                    <Fragment>
                      <TitleHeader title={"Profile"} title_color={"#337ab7"} />
                      <br />
                      <ProfileInfo
                        profile={this.props.profile}
                        user={this.props.auth_user}
                      />
                      <br />

                      <EmployeeWorkInfo profile={this.props.profile} />
                      <br />
                      {ProfileKpiBottom}
                      {ProfileKpiHR}
                    </Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Content>
        {/* Off For Appraisal <ActivityList id={this.props.auth_user.id} type={"user"} /> */}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile.profile,
  auth_user: state.auth.user
});
export default connect(mapStateToProps, { getUserProfile })(EmployeeProfile);
