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
            console.log(
              typeof this.props.data[property],
              this.props.data[property],
              "type............ detailsmodal"
            );
            data_.push({
              key: k,
              type: property,
              field: this.props.data[property]
            });
            k = k + 1;
          }
        }
        // console.log(`${property}: ${object[property]}`);
      }
      // Object.keys(this.props.data).map((key, index) =>
      //   data_.push({ key: key, field: this.props.data[key] })
      // );
    }
    console.log(data_, "data_?????????????????////");

    const columns = [
      {
        title: "",
        dataIndex: "type",
        align: "right",
        // width: "60%"
        render: text => <div>{text + " :"}</div>
      },
      {
        title: "",
        dataIndex: "field",
        // width: "20%",
        // render: value => moment(value).format("MMM DD, YYYY, hh:MM A")
        render: (value, record) => {
          let val = [];
          let length = value.length;
          let i;
          console.log(length, "modal length email.........");
          for (i = 0; i < length; i++) {
            console.log(value, "record modal............email");
            if (i < length - 1) {
              val.push(<div key={i}>{value[i] + ", "}</div>);
            } else {
              val.push(<div key={i}>{value[i]}</div>);
            }
          }
          console.log(val, "val.........");
          // console.log(value, "record modal............email");
          return <div>{val}</div>;
        }
      }
    ];
    return (
      <Fragment>
        <Tooltip
          // placement="bottomLeft"
          title={"Show Details"}
          visible={this.state.hovered}
          // onVisibleChange={this.handleHoverChange(t)}
          onVisibleChange={this.handleHoverChange}
        >
          <Popover
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
            // content={
            //   this.props.data ? (
            //     <div
            //       className="row"
            //       style={{
            //         backgroundColor: "pink",
            //         overFlow: "scroll",
            //         maxHeight: "80%"
            //         // maxWidth: "70%",
            //         // minWidth: "30%"
            //       }}
            //     >
            //       <div
            //         className="col-sm-4"
            //         style={{ backgroundColor: "yellow" }}
            //       >
            //         Lorem ipsum dolor sit amet, consectetur adipisicing ea
            //         commodo consequat.
            //       </div>
            //       <div className="">
            //         Sed ut perspiciatis unde omnis iste natus error
            //         sitllllllllllllllllllllllllll
            //       </div>
            //     </div>
            //   ) : null
            // }
            // title="Click title"
            trigger="click"
            // placement="bottomLeft"
            visible={this.state.clicked}
            onVisibleChange={this.handleClickChange}
          // getPopupContainer={() => document.getElementById("details-modal")}
          //document.getElementById("demo");  document.body
          // onMouseLeave={this.hide}
          >
            {/* <a
              onMouseEnter={() => this.handleHoverChange(true)}
              onMouseLeave={() => this.handleHoverChange(false)}
            > */}
            {/* <Icon
              style={{ fontSize: 10 }}
              type="down"
              // onMouseEnter={() => this.handleHoverChange(true)}
              onMouseLeave={() => this.handleHoverChange(false)}
            /> */}
            {/* </a> */}
          </Popover>
        </Tooltip>
      </Fragment>
    );
  }
}
export default DetailsModal;
