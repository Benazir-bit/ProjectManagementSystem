import React, { Component } from "react";
import ImageBig from "../../../Common/ImageBig/ImageBig";
import EmployeeInfo from "../EmployeeInfo/EmployeeInfo";
import UploadButton from "../../../Common/UploadButton/UploadButton";
import "./ProfileInfo.css";
// import { Avatar, Icon } from "antd";
class ProfileInfo extends Component {
  render() {
    // const DefaultImange = "../../../../../static/frontend/img/pic.png";
    console.log("llolololoo", this.props.profile);
    return (
      <div>
        <div className="row" id="profile_pic_row">
          <div className="col-sm-6" id="cont">
            {this.props.profile.image ? (
              <ImageBig
                id={"employee_pic"}
                clsattr="img-reg"
                altname={this.props.profile.full_name}
                srcfile={this.props.profile.image}
              />
            ) : (
              <img
                id={"employee_pic"}
                className="img-reg"
                width={200}
                height={200}
                alt={this.props.profile.full_name}
                src={
                  "https://www.sackettwaconia.com/wp-content/uploads/default-profile.png"
                }
              />
            )}

            <br />
            {this.props.profile.user === this.props.user.id ? (
              <UploadButton id={this.props.profile.user} />
            ) : null}
          </div>
          <EmployeeInfo profile={this.props.profile} user={this.props.user} />
          <br />
        </div>
      </div>
    );
  }
}

export default ProfileInfo;
