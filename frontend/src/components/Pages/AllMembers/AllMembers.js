import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import CardBodyOnly from "../../Common/AllCard/CardBodyOnly";
import { Icon, Input, Select, Skeleton, Button, Switch, Modal } from "antd";
import "./AllMembers.css";
import CommonTable from "../../Common/AllTables/CommonTable";
import ImageSmall from "../../Common/ImageSmall/ImageSmall";
import { getTypeMembers } from "../../../actions/member";
import { updateUser } from "../../../actions/profile";
import MemberDetailModal from "../../Common/Modals/MemberDetailModal/MemberDetailModal";
import MemberEditInfoModal from "../../Common/Modals/MemberEditInfoModal/MemberEditInfoModal";
import { Layout } from "antd";
const { Content } = Layout;
const InputGroup = Input.Group;
const { Option } = Select;

class AllMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      editloading: false
    };
  }
  componentWillMount() {
    this.setState({ fetchingData: false });
    if (this.props.match.params.id == "all") {
      this.props.getTypeMembers("all", 0);
    } else {
      this.props.getTypeMembers("group", this.props.match.params.id);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({ fetchingData: false });
      if (this.props.match.params.id == "all") {
        this.props.getTypeMembers("all", 0);
      } else {
        this.props.getTypeMembers("group", this.props.match.params.id);
      }
    }
  }

  ActiveInactive(id, active) {
    const body = {
      user_id: id,
      setActive: true,
      active,
      group_id: this.props.match.params.id
    };
    this.props.updateUser(body);
  }
  componentWillReceiveProps() {
    this.setState({ fetchingData: false });
  }

  onClick(id) {
    this.child.showModal(id);
  }

  render() {
    const { fetchingData } = this.state;
    let mem_list = [];
    if (!this.props.members) {
      for (let i = 0; i < 3; i++) {
        let mem_object = {
          Name: <Skeleton active loading={true} paragraph={false} />,
          ID: <Skeleton active loading={true} paragraph={false} />,
          Group: <Skeleton active loading={true} paragraph={false} />,
          Designation: <Skeleton active loading={true} paragraph={false} />,
          1: <Skeleton active loading={true} paragraph={false} />,
          2: <Skeleton active loading={true} paragraph={false} />,
          3: <Skeleton active loading={true} paragraph={false} />
        };
        mem_list.push(mem_object);
      }
    } else {
      this.props.members.map(member => {
        let mem_object = {
          Name: (
            <Fragment>
              <ImageSmall
                width={"30"}
                height={"30"}
                altname={member.profile.full_name}
                id={"memberpic"}
                srcfile={member.profile.image}
              />
              <Link to={`/profile/${member.profile.user}`}>
                {member.profile.full_name}
              </Link>
              &nbsp;
              {/* {member.profile.is_busy ? (
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
          ),
          ID: member.profile.username,
          Group: (
            <Fragment>
              {member.profile.groups.map((grp, i) => (
                <span key={i}>
                  {grp.name}{" "}
                  {i == member.profile.groups.length - 1 ? null : ", "}
                </span>
              ))}
            </Fragment>
          ),
          Designation: member.profile.dsg,
          1: <MemberDetailModal member={member} />,
          2: (
            <Button
              id="EditInfoBtn"
              // loading={this.state.editloading}
              onClick={() => this.onClick(member.profile.user)}
            >
              {/* <Icon type="edit" theme="filled" /> */}
              Edit Info
            </Button>
          ),
          3: (
            <Switch
              className={"switch_mem"}
              checked={member.profile.is_active_status ? true : false}
              onClick={value => this.ActiveInactive(member.profile.user, value)}
            />
          )
        };
        mem_list.push(mem_object);
      });
    }
    var tableData = {
      columns: ["Name", "ID", "Group", "Designation", "1", "2", "3"],
      rows: mem_list
    };
    return (
      <Fragment>
        <Content>
          <MemberEditInfoModal
            onRef={ref => (this.child = ref)}
            group_id={this.props.match.params.id}
          />

          <div className="col-sm-11" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />

                  <TitleHeader title={"All Members"} title_color={"#337ab7"} />
                  <div>
                    {/* <div
                    style={{ position: "absolute", top: "2.2em", right: "1em" }}
                  >
                    <InputGroup compact>
                      <Select
                        style={{
                          width: 170,
                          float: "right",
                          paddingRight: "24px"
                        }}
                        defaultValue="All Members"
                      >
                        <Option value="All Members">All Members</Option>
                        <Option value="AMS Verification">
                          AMS Verification
                        </Option>
                        <Option value="Digital Verification">
                          Digital Verification
                        </Option>
                        <Option value="Physical Layout">Physical Layout</Option>
                        <Option value="Circuit Design">Circuit Design</Option>
                        <Option value="PNR">PNR</Option>
                        <Option value="HR">HR</Option>
                        <Option value="Management">Management</Option>
                        <Option value="Sales Department">
                          Sales Department
                        </Option>
                      </Select>
                    </InputGroup>
                  </div> */}

                    <CardBodyOnly BodyId={"allMem_table"} id={"AllMemCard"}>
                      <CommonTable
                        clsattr={"table MemberTable"}
                        data={tableData}
                        class_div={""}
                      />
                    </CardBodyOnly>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Fragment>
    );
  }
}

//export default AllMembers;
const mapStateToProps = state => ({
  members: state.member.members
});

export default connect(mapStateToProps, { getTypeMembers, updateUser })(
  AllMembers
);
