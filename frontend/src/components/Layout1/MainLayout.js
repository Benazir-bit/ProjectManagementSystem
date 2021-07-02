import React, { Component } from "react";
import TopNav from "./TopNav/TopNav";
import SideNav from "./SideNav/SideNav";
import "./MainLayout.css";
import { Layout } from "antd";
const { Content } = Layout;

class MainLayout extends Component {
  render() {
    return (
      <div className="divmain">
        <Layout style={{ minHeight: "100%" }}>
          <SideNav />
          <Layout className="site-layout">
            <TopNav />
            <Content
              className="site-layout-background"
              style={{
                margin: "24px 16px",
                padding: 24,
                minHeight: 280,
                paddingTop: 0,
              }}
            >
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default MainLayout;
