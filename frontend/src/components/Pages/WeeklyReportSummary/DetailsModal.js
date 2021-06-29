import React, { Component, Fragment } from "react";
import { Popover, Tooltip, Table, Icon } from "antd";
import moment from "moment-timezone";
import Item from "antd/lib/list/Item";

import "./DetailsModal.css";

class DetailsModal extends Component {
  state = {
    clicked: false,
    hovered: false
  };

  hide = () => {
    this.setState({
      clicked: false,
      hovered: false
    });
  };

  handleHoverChange = visible => {
    this.setState({
      hovered: visible
      // clicked: false
    });
  };

  handleClickChange = visible => {
    this.setState({
      clicked: visible,
      hovered: false
    });
  };

  render() {
    let data_ = [];
    if (this.props.data) {
      let k = 0;
      for (const property in this.props.data) {
        if (property !== null && property != undefined) {
          if (property.length > 0) {
            data_.push({
              key: k,
              type: property,
              field: this.props.data[property]
            });
            k = k + 1;
          }
        }
      }
    }

    const columns = [
      {
        title: "",
        dataIndex: "type",
        align: "right",
        render: text => <div>{text + " :"}</div>
      },
      {
        title: "",
        dataIndex: "field",
        render: (value, record) => {
          let val = [];
          let length = value.length;
          let i;
          for (i = 0; i < length; i++) {
            if (i < length - 1) {
              val.push(<div key={i}>{value[i] + ", "}</div>);
            } else {
              val.push(<div key={i}>{value[i]}</div>);
            }
          }
          return <div>{val}</div>;
        }
      }
    ];
    return (
      <Fragment>
        <Tooltip
          title={"Show Details"}
          visible={this.state.hovered}
          onVisibleChange={this.handleHoverChange}
        >
          <Popover
            placement="bottomLeft"
            overlayClassName="modal-popover"
            content={
              <Table
                // pagination={pagination}
                className="modal-table"
                // style={{ overFlow: "visible" }}
                bordered={false}
                showHeader={false}
                pagination={false}
                columns={columns}
                dataSource={data_}
              />
            }
            trigger="click"
            visible={this.state.clicked}
            onVisibleChange={this.handleClickChange}
          // getPopupContainer={() => document.getElementById("btnDetails")}
          //document.getElementById("demo");  document.body
          // onMouseLeave={this.hide}
          >
            {/* <Icon
              style={{ fontSize: 10 }}
              type="down"
              // onMouseEnter={() => this.handleHoverChange(true)}
              onMouseLeave={() => this.handleHoverChange(false)}
            /> */}
          </Popover>
        </Tooltip>
      </Fragment>
    );
  }
}
export default DetailsModal;
