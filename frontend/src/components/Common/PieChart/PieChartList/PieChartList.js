import React, { Component, Fragment } from "react";
import { Skeleton } from "antd";
import "./PieChartList.css";

class PieChartList extends Component {
  static defaultProps = {
    type: "group",
    data: [
      {
        borderColor: "#fa8214",
        listName: "Total Tasks",
        number: 0
      },
      {
        borderColor: "#000e24",
        listName: "Completed",
        number: 0
      },
      {
        borderColor: "#2c5ea9",
        listName: "Ongoing",
        number: 0
      },
      {
        borderColor: "#3c92d3",
        listName: "Paused",
        number: 0
      },
      {
        borderColor: "#7bcef3",
        listName: "Waiting For Review",
        number: 0
      },
      {
        borderColor: "#C6E2FF",
        listName: "Not Started Yet",
        number: 0
      }
    ]
  };

  render() {
    // if (!this.props.overview) {
    //   return null;
    // }
    const data = this.props.data;
    var listItems = [];
    // const { fetchingData } = this.props;
    if (!data) {
      for (let i = 0; i < 3; i++) {
        listItems.push(
          <li key={i} style={{ borderColor: data.borderColor }}>
            <Skeleton avatar loading={true} paragraph={false} />
          </li>
        );
      }
    } else {
      listItems = data.map((data, index) => (
        <li key={index} style={{ borderColor: data.borderColor }}>
          <em>{data.listName}</em>

          <span>{data.number}</span>
        </li>
      ));
    }

    return (
      <Fragment>
        <ul
          className="pieID dash_member"
        //style={!data ? { filter: "blur(0px)" } : {}}
        >
          {listItems}
        </ul>
      </Fragment>
    );
  }
}

export default PieChartList;
