import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import CardBodyOnly from "../../Common/AllCard/CardBodyOnly";
import "./ManageGroups.css";
import { Button, Skeleton, Icon, Modal, Form, Input, Select } from "antd";
import ImageSmall from "../../Common/ImageSmall/ImageSmall";
import CommonTable from "../../Common/AllTables/CommonTable";
// import { getGroupListAll } from '../../../actions/group'
import UpdateGroupModal from "./UpdateGroupModal";
import {
  DeleteGroup,
  AddGroup,
  addTeamleader,
  getGroupListAll
} from "../../../actions/group";
import { getFileItem } from "antd/lib/upload/utils";
import { Layout } from "antd";
const { Content } = Layout;

class ManageGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: false,
      modal: false,
      mod: null,
      visible: false,
      group_id: null,
      visibleaddGroup: false,
      grpvalue: "",
      grp_teamleader: [],
      teamleadervisible: false,
      selectedTeamleader: "",
      delmod: false,
      delete_id: "",
      delete_group_name: ""
    };
  }
  componentDidMount() {
    this.props.getGroupListAll();
    this.setState({ fetchingData: false });
  }

  componentWillReceiveProps(prevProps) {
    this.setState({ fetchingData: false });
  }
  onClick(id) {
    this.setState({
      visible: true,
      group_id: id
    });
  }

  handleSubmit = () => {
    this.child.handleSubmit();
    this.setState({
      visible: false
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  addGroup = () => {
    this.setState({
      visibleaddGroup: true
    });
  };
  CancelAddGroup = () => {
    this.setState({
      visibleaddGroup: false,
      grpvalue: ""
    });
  };
  handleSubmitGroup = () => {
    const body = {
      name: this.state.grpvalue
    };
    this.props.AddGroup(body);
    this.setState({
      visibleaddGroup: false,
      grpvalue: ""
    });
  };
  groupnameValue = e => {
    this.setState({
      grpvalue: e.target.value
    });
  };
  teamleaderhandleCancel = () => {
    this.setState({
      teamleadervisible: false,
      grp_teamleader: []
    });
  };
  selectTeamleader = value => {
    this.setState({
      selectedTeamleader: value
    });
  };
  addTeamleadersubmit = () => {
    const body = {
      group: this.state.group_id,
      employees: this.state.selectedTeamleader
    };
    this.props.addTeamleader(body);
    this.setState({
      teamleadervisible: false,
      grp_teamleader: []
    });
    // this.props.getGroupList();
  };

  addTeamleader = group => {
    this.setState({
      teamleadervisible: true,
      group_id: group.id
    });
    if (group.user_set.employees.length !== 0) {
      group.user_set.employees.map((user, i) => {
        this.state.grp_teamleader.push(
          <Select.Option key={i} value={user.id}>
            {user.full_name}
          </Select.Option>
        );
      });
    }
  };
  deletehandleCancel = () => {
    this.setState({
      delmod: false,
      delete_id: "",
      delete_group_name: ""
    });
  };
  delGroup = (id, name) => {
    this.setState({
      delmod: true,
      delete_id: id,
      delete_group_name: name
    });
  };
  delete = () => {
    this.props.DeleteGroup(this.state.delete_id);
    this.setState({
      delmod: false,
      delete_id: "",
      delete_group_name: ""
    });
  };
  render() {
    if (!this.props.allgroup) {
      return null;
    }
    const fetchingData = this.state.fetchingData;
    let managegrp_list = [];
    {
      this.props.allgroup.map(group => {
        let managleplp_object = {
          "Group Name": (
            <Skeleton active loading={fetchingData} paragraph={false}>
              <Link to={`/allmembers/${group.id}`}>{group.name}</Link>
            </Skeleton>
          ),
          Teamleader: (
            <Skeleton active loading={fetchingData} paragraph={false}>
              {group.teamleader ? (
                group.teamleader.teamleaders.map((teamleader, i) => (
                  <Fragment>
                    <Link key={i} to={`/profile/${teamleader.profile.user}`}>
                      <ImageSmall
                        clsattr={"img-circle"}
                        altname={teamleader.profile.full_name}
                        srcfile={teamleader.profile.image}
                      />
                      {teamleader.profile.full_name}
                    </Link>
                    {i == group.teamleader.teamleaders.length - 1 ? null : ", "}
                  </Fragment>
                ))
              ) : (
                <Button
                  id="DetailsBtn"
                  style={{
                    background: "#337ab7",
                    color: "white",
                    width: "75px"
                  }}
                  onClick={() => this.addTeamleader(group)}
                >
                  {/* <Icon type="plus-circle" theme="filled" /> */}
                  Add
                </Button>
              )}
            </Skeleton>
          ),
          "Total Members": (
            <Skeleton active loading={fetchingData} paragraph={false}>
              {group.user_set.total_employees}
            </Skeleton>
          ),
          "1": (
            <Skeleton active loading={fetchingData} paragraph={false}>
              <Button
                disabled={group.teamleader ? false : true}
                id="DetailsBtn"
                style={{ background: "#337ab7", color: "white", width: "100%" }}
                onClick={() => this.onClick(group.id)}
              >
                {/* <Icon type="edit" theme="filled" /> */}
                Edit
              </Button>

              {/* <UpdateGroupModal /> */}
            </Skeleton>
          ),
          "": (
            <Skeleton active loading={fetchingData} paragraph={false}>
              {/* <Button id="deleteBtn" style={{ width: '100%' }} onClick={() => this.delete(group.id)}> */}
              <Button
                id="deleteBtn"
                style={{ width: "100%" }}
                onClick={() => this.delGroup(group.id, group.name)}
              >
                {/* <Icon type="delete" theme="filled" /> */}
                Delete
              </Button>
            </Skeleton>
          )
        };
        managegrp_list.push(managleplp_object);
      });
    }
    var tableData = {
      columns: ["Group Name", "Teamleader", "Total Members", "1", ""],
      rows: managegrp_list
    };

    return (
      <Fragment>
        <Content>
          <Modal
            title="Delete Group"
            destroyOnClose={true}
            onCancel={this.deletehandleCancel}
            visible={this.state.delmod}
            footer={[
              <Button key="back" onClick={this.deletehandleCancel}>
                Return
              </Button>,
              <Button type="primary" onClick={this.delete}>
                Yes
              </Button>
            ]}
          >
            <p>
              Are you sure, you want to delete group "
              <b>{this.state.delete_group_name}</b>" ?
            </p>
          </Modal>
          <Modal
            title="Add Teamleader"
            destroyOnClose={true}
            onCancel={this.teamleaderhandleCancel}
            visible={this.state.teamleadervisible}
            footer={[
              <Button key="back" onClick={this.teamleaderhandleCancel}>
                Return
              </Button>,
              <Button type="primary" onClick={this.addTeamleadersubmit}>
                Submit
              </Button>
            ]}
          >
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              onChange={this.selectTeamleader}
              getPopupContainer={trigger => trigger.parentNode}
            >
              {this.state.grp_teamleader}
            </Select>
          </Modal>
          <Modal
            title="Update Group"
            destroyOnClose={true}
            onCancel={this.handleCancel}
            visible={this.state.visible}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                Return
              </Button>,
              <Button type="primary" onClick={this.handleSubmit}>
                Submit
              </Button>
            ]}
          >
            <UpdateGroupModal
              onRef={ref => (this.child = ref)}
              group_id={this.state.group_id}
            />
          </Modal>

          <div className="col-sm-11" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  <TitleHeader title={"Groups"} title_color={"#337ab7"} />
                  <CardBodyOnly
                    BodyId={"ManageGrpTable"}
                    id={"ManageGroupCard"}
                  >
                    <div style={{ textAlign: "end" }}>
                      {/* <ManageGroupTable /> */}
                      <CommonTable
                        clsattr={"table issueTable managegrptab"}
                        data={tableData}
                        class_div={"issuetab"}
                      />
                    </div>
                  </CardBodyOnly>
                </div>
              </div>
            </div>
            <br />
            <center className="wrapper">
              <Button type="primary" icon="plus" onClick={this.addGroup}>
                Add New Group
              </Button>
              <Modal
                title="Add Group"
                destroyOnClose={true}
                onCancel={this.CancelAddGroup}
                visible={this.state.visibleaddGroup}
                footer={[
                  <Button key="back" onClick={this.CancelAddGroup}>
                    Return
                  </Button>,
                  <Button type="primary" onClick={this.handleSubmitGroup}>
                    Submit
                  </Button>
                ]}
              >
                <Form>
                  <Form.Item label={<span>Group Name</span>}>
                    <Input
                      type="text"
                      value={this.state.grpvalue}
                      onChange={this.groupnameValue}
                    />
                  </Form.Item>
                </Form>
              </Modal>
            </center>
            <br />
          </div>
        </Content>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  allgroup: state.group.allgroup
});
export default connect(mapStateToProps, {
  getGroupListAll,
  DeleteGroup,
  AddGroup,
  addTeamleader
})(ManageGroups);
