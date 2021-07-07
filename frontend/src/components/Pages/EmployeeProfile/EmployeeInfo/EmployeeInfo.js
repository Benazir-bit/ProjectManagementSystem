import React, { Component, Fragment } from "react";
// import AllButton from "../../../Common/AllButton/AllButton";
import { connect } from "react-redux";
// import { Icon } from "antd";
import "./EmployeeInfo.css";
import UpdateProfileModal from "../../../Common/Modals/UpdateProfileModal/UpdateProfileModal";
import ResetPasswordModal from "../../../Common/Modals/ResetPasswordModal/ResetPasswordModal";
class EmployeeInfo extends Component {
  render() {
    return (
      <div className="col-sm-6" id="profile_cont">
        <Fragment>
          <h3 id="employee_name">{this.props.profile.full_name}</h3>
          &nbsp;
          {/* {this.props.profile.is_busy ? (
            <Icon
              type="thunderbolt"
              theme="filled"
              style={{ color: "#52c41a" }}
            />
          ) : (
            <Icon
              type="thunderbolt"
              theme="outlined"
              style={{ color: "#aaa" }}
            />
          )} */}
        </Fragment>
        <h4 id="profile_info">
          <span>
            {this.props.profile.is_teamleader ? "Team Leader, " : ""}
            {this.props.profile.dsg}
          </span>
          <br />
          {this.props.profile.groups.map((grp, i) => (
            <span key={i}>{grp.name} {i === (this.props.profile.groups.length - 1) ? null : ', '}</span>
          ))}
          <br />
          <span>
            <b>Contact: </b>
            {this.props.profile.phone_number}
          </span>
          <br />
          <span>
            <b>Email: </b>
            {this.props.profile.email}
          </span>
        </h4>
        {this.props.profile.user === this.props.user.id ? (
          <Fragment>
            <UpdateProfileModal /> &emsp;
            <ResetPasswordModal />
          </Fragment>
        ) : null}

        <br />
        <br />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  user_id: state.auth.user.id
});
export default connect(mapStateToProps)(EmployeeInfo);
