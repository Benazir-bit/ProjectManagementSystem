import React from 'react'
import 'antd/dist/antd.css'
import './ContactCard.css'
import { List, Avatar } from 'antd';
import { Link } from 'react-router-dom'

class ContactCard extends React.Component {
  render() {
    return (
        <List
            itemLayout="horizontal"
            dataSource={this.props.devdata}
            renderItem={item =>
            (
                <List.Item>
                    <div className="ant-list-item-meta">
                        <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                            style={{
                            width: 40, height: 40, marginRight:6
                            }}
                            alt="No Image"
                        />
                        <div className="ant-list-item-meta-content">
                            <h4 className="ant-list-item-meta-title">{item.UserName}</h4>
                            <div className="ant-list-item-meta-description">Employee ID: {item.EmployeeID}</div>
                            <div className="ant-list-item-meta-description">Email: <Link to="#">{item.Email}</Link></div>
							              <div className="ant-list-item-meta-description">{item.Designation}</div>
                            <div className="ant-list-item-meta-description">{item.Department}</div>
                        </div>
                    </div>
                </List.Item>
            )}
        />

    );
  }
}
export default (ContactCard);