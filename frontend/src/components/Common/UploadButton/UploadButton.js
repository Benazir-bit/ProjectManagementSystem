import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./UploadButton.css";
import { Upload, Button } from "antd";
import { uploadProfilePhoto } from "../../../actions/profile";
//import { loadUser } from "../../../actions/auth";

// const props = {
//   onChange(info) {
//     console.log(info.file);
//     if (info.file.status !== "uploading") {
//       console.log(info.file);
//     }
//     if (info.file.status === "done") {
//       message.success(`${info.file.name} file uploaded successfully`);
//     } else if (info.file.status === "error") {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   }
// };

class UploadButton extends Component {
  uploadPhoto = file => {
    let form_data = new FormData();
    form_data.append("image", file.file, file.file.name);
    form_data.append("user_id", this.props.id);
    this.props.uploadProfilePhoto(this.props.id, form_data);
  };
  render() {
    return (
      <Fragment>
        <div className="middle">
          <Upload showUploadList={false} customRequest={this.uploadPhoto}>
            <Button id="change_img">
              {/* <Icon type="upload" />  */}
              Click to Upload
            </Button>
          </Upload>
        </div>
      </Fragment>
    );
  }
}

export default connect(
  null,
  { uploadProfilePhoto }
)(UploadButton);
