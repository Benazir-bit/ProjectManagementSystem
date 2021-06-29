import React, { Component } from "react";
import { connect } from "react-redux";
import ProfileTable from "../ProfileTable/ProfileTable";
import EmployeeButtons from "../EmployeeButtons/EmployeeButtons";
import { getUserProfile } from "../../../../actions/profile";
import "./EmployeeWorkInfo.css";

class EmployeeWorkInfo extends Component {
  render() {
    return (
      <div className="row" id="profile_table_row">
        <ProfileTable profile={this.props.profile} />
        {this.props.auth_user.is_hr || this.props.auth_user.is_fna ? null : (
          <EmployeeButtons profile={this.props.profile} />
        )}
      </div>
    );
  }
}

//export default EmployeeWorkInfo;

const mapStateToProps = state => ({
  profile: state.profile.profile,
  auth_user: state.auth.user
});
export default connect(mapStateToProps, { getUserProfile })(EmployeeWorkInfo);
