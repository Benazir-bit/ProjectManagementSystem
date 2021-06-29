import React, { Component } from "react";
import "./ProfileTable.css";
import { Switch } from "antd";
class ProfileTable extends Component {
  render() {
    return (
      <div className="col-md-7" id="profile_table_div">
        <table className="table" id="profile_table">
          <tbody>
            <tr>
              <td id="profile_category">
                <b>Employee ID</b>
              </td>
              <td id="profile_description">{this.props.profile.username}</td>
            </tr>
            <tr>
              <td id="profile_category">
                <b>Date of Joining</b>
              </td>
              <td id="profile_description">
                {this.props.profile.date_of_joining}
              </td>
            </tr>
            <tr>
              <td id="profile_category">
                <b>Date of Birth</b>
              </td>
              <td id="profile_description">
                {this.props.profile.date_of_birth}
              </td>
            </tr>
            <tr>
              <td id="profile_category">
                <b>Phone Number</b>
              </td>
              <td id="profile_description">
                {this.props.profile.phone_number}
              </td>
            </tr>
            <tr>
              <td id="profile_category">
                <b>Present Address</b>
              </td>
              <td id="profile_description">
                {this.props.profile.present_address}
              </td>
            </tr>
            <tr>
              <td id="profile_category">
                <b>Highest Degree</b>
              </td>
              <td id="profile_description">
                {this.props.profile.highest_degree}
              </td>
            </tr>
            <tr>
              <td id="profile_category">
                <b>Blood Group</b>
              </td>
              <td id="profile_description">{this.props.profile.blood_group}</td>
            </tr>
            <tr>
              <td id="profile_category">
                <b>Emergency Contact</b>
              </td>
              <td id="profile_description">
                {this.props.profile.emergency_contact}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default ProfileTable;
