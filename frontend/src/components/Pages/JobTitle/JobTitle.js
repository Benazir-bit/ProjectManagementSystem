import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import {
  List,
  Avatar,
  Button,
  Skeleton,
  Collapse,
  Icon,
  Layout,
  Descriptions,
  Modal
} from "antd";

import { getAllDesignations, DeleteDesignation } from "../../../actions/HR";
import AddDesignationModal from "./AddDesignationModal";
//import AllCardBody from '../../Common/AllCard/AllCardBody';
// import JobDetailCard from "../../Common/JobDetailCard/JobDetailCard";
//import TaskIssueTable from "../../Common/AllTables/TaskIssueTable";

const { Panel } = Collapse;
const { Content } = Layout;

class JobTitle extends Component {
  state = {
    delmod: false,
    delete_id: "",
    delete_designation_name: ""
  };
  deletehandleCancel = () => {
    this.setState({
      delmod: false,
      delete_id: "",
      delete_designation_name: ""
    });
  };
  DeleteDesignationClick(id, name) {
    this.setState({
      delmod: true,
      delete_id: id,
      delete_designation_name: name
    });
  }

  delete = () => {
    this.props.DeleteDesignation(this.state.delete_id);
    this.setState({
      delmod: false,
      delete_id: "",
      delete_designation_name: ""
    });
  };
  componentDidMount() {
    this.props.getAllDesignations("all");
  }
  addDesignationClick(type) {
    this.child.showModal(type);
  }

  render() {
    // if (!this.props.designations) {
    //   return null;
    // }
    const customPanelStyle = {
      background: "rgba(234, 234, 234, 0.22)",
      borderRadius: 4,
      marginBottom: 24,
      border: "1px solid #337ab726",
      overflow: "hidden"
    };
    return (
      <Fragment>
        <Content>
          <Modal
            title="Delete Designation"
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
              Are you sure, you want to delete Designation "
              <b>{this.state.delete_designation_name}</b>" ?
            </p>
          </Modal>
          <AddDesignationModal onRef={ref => (this.child = ref)} />
          <div className="col-sm-11" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  <TitleHeader
                    title={"Job Designation"}
                    title_color={"#337ab7"}
                  />
                  <br />
                  <Button
                    type="primary"
                    style={{
                      background: "#337ab7",
                      marginRight: 10,
                      marginBottom: 20
                    }}
                    onClick={() => this.addDesignationClick("post")}
                  >
                    Add Designation
                  </Button>
                  {this.props.designations ? (
                    <Collapse
                      bordered={false}
                    // defaultActiveKey={['1']}
                    // expandIcon={({ isActive }) => (
                    //   <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                    // )}
                    >
                      {this.props.designations.map((designations, i) => (
                        <Panel
                          header={
                            <Fragment>
                              <span style={{ fontSize: 16, fontWeight: 600 }}>
                                {designations.title_name}
                              </span>
                              &nbsp;&nbsp;&nbsp;
                            </Fragment>
                          }
                          key={i}
                          style={customPanelStyle}
                          // extra={[<Button type="primary" >Subscribe</Button>, <Button type="danger" style={{ background: '#e43838', color: 'white' }} > Cancel</Button>]}>
                          extra={
                            <Fragment>
                              <Button
                                type="primary"
                                style={{ marginRight: 10, marginBottom: 11 }}
                                onClick={() =>
                                  this.addDesignationClick(designations)
                                }
                              >
                                Edit
                              </Button>
                              <Button
                                type="danger"
                                onClick={() =>
                                  this.DeleteDesignationClick(
                                    designations.id,
                                    designations.title_name
                                  )
                                }
                              >
                                Delete
                              </Button>
                            </Fragment>
                          }
                        >
                          <List>
                            <List.Item>
                              <List.Item.Meta
                                description={
                                  <Descriptions
                                    column={{
                                      xxl: 1,
                                      xl: 1,
                                      lg: 1,
                                      md: 1,
                                      sm: 1,
                                      xs: 1
                                    }}
                                  >
                                    <Descriptions.Item>
                                      <b>Groups:</b>
                                      <div
                                        style={{
                                          display: "inline-table",
                                          marginLeft: "17px"
                                        }}
                                      >
                                        {designations.groups.map((grp, i) => (
                                          <p
                                            key={i}
                                            style={{ marginBottom: 5 }}
                                          >
                                            {i + 1}. {grp.name}
                                          </p>
                                        ))}
                                      </div>
                                    </Descriptions.Item>
                                  </Descriptions>
                                }
                              />
                              {/* <div>content</div> */}
                            </List.Item>
                          </List>
                        </Panel>
                      ))}
                    </Collapse>
                  ) : (
                    <Skeleton active loading={true} paragraph={true} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  designations: state.HR.designations
});
const mapActionsToProps = {
  getAllDesignations: getAllDesignations,
  DeleteDesignation: DeleteDesignation
};
export default connect(mapStateToProps, mapActionsToProps)(JobTitle);
