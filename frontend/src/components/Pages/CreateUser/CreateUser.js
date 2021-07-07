import React, { Component, Fragment } from "react";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import CreateUserForm from "../../Common/Form/CreateUserForm";
import { Layout } from "antd";
// import "./CreateUser.css";

const { Content } = Layout;

class CreateUser extends Component {
  render() {
    return (
      <Fragment>
        <Content>
          <div className="col-sm-11" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  <TitleHeader
                    title={"Create New User"}
                    title_color={"#337ab7"}
                  />
                  <br />
                  <div className="row">
                    <div className="col-md-12" id="table_modal_size">
                      <CreateUserForm />
                    </div>
                  </div>
                </div>

                <br />
              </div>
            </div>
          </div>
        </Content>
      </Fragment>
    );
  }
}

export default CreateUser;
