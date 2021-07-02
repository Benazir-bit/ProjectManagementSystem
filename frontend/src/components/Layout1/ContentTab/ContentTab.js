import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Tabs } from "antd";
const { TabPane } = Tabs;

class ContenTab extends Component {
  getComponent = (key) => {
    return this.props.children.filter((comp) => {
      return comp.key === key.toString();
    });
  };
  render() {
    return (
      <Fragment>
        <Tabs
          defaultActiveKey="0"
          //   onChange={callback}
          tabPosition={"left"}
          style={{
            height: "100%",
            background: "white",
            padding: "24px 5px",
          }}
        >
          {this.props.tablist.map((value, i) => (
            <TabPane tab={value} key={i}>
              {this.getComponent(i)}
            </TabPane>
          ))}
        </Tabs>
      </Fragment>
    );
  }
}

export default ContenTab;
