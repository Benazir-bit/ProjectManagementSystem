import React from "react";
import "antd/dist/antd.css";

import { Empty } from "antd";

class NoData extends React.Component {
  render() {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
}

export default NoData;
