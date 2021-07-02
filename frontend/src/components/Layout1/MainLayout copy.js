import React, { Component, Fragment } from 'react';
import TopNav from './TopNav/TopNav'
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import "./MainLayout.css";
import { Layout, Menu } from "antd";
const { Sider, Content } = Layout;

class MainLayout extends Component {
    state = {
        collapsed: false,
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    render() {
        return (
            <Fragment>
                <Layout style={{ height: '100%' }}>
                    <TopNav />
                    <Sider trigger={null} style={{
                        paddingTop: 64
                    }} collapsible collapsed={true}>

                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                            <Menu.Item key="1" className='sideMenu' onClick={this.toggle} icon={<Fragment><UserOutlined /><div style={{ lineHeight: 1.5, fontSize: 12 }}>Home</div></Fragment>}></Menu.Item>
                            <Menu.Item key="2" className='sideMenu' icon={<VideoCameraOutlined />}></Menu.Item>
                            <Menu.Item key="3" className='sideMenu' icon={<UploadOutlined />}></Menu.Item>
                        </Menu>
                    </Sider>

                    <Layout className="site-layout" style={{ paddingTop: 64 }}>

                        <Sider className="trans_slider" trigger={null} style={{ display: this.state.collapsed ? 'block' : 'None' }} >

                            <Menu theme="dark" mode="inline" >
                                <Menu.Item key="1">
                                    nav 1
                            </Menu.Item>
                                <Menu.Item key="2">
                                    nav 2
                            </Menu.Item>
                                <Menu.Item key="3" >
                                    nav 3
                            </Menu.Item>
                            </Menu>
                        </Sider>
                        <Content
                            className="site-layout-background"
                            style={{
                                margin: '24px 16px',
                                padding: 24,
                                minHeight: 280,
                            }}
                        >
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            </Fragment>
        );
    }
}

export default MainLayout;