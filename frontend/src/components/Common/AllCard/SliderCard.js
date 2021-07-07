import React, { Component, Fragment } from "react";
import { Card } from "antd";
import "./SliderCard.css";
import { Link } from "react-router-dom";
class SliderCard extends Component {
  render() {
    const { Meta } = Card;
    return (
      <Fragment>
        <Card
          style={{ marginLeft: 6, marginRight: 6 }}
          className={this.props.slidertaskbtn}
          actions={[
            <Fragment>
              <Link to={this.props.link} style={{ color: "white" }}>
                VIEW DETAILS
                {/* <Icon type="arrow-right" style={{ paddingLeft: 10 }} /> */}
              </Link>
            </Fragment>
          ]}
        >
          <Card.Grid style={{ width: "80%" }} className="cardGrid">
            <Meta
              //avatar={<Avatar src={this.props.IconImage} />}
              avatar={this.props.IconTag}
              title={this.props.title}
              description={this.props.description}
            />
          </Card.Grid>
          <Card.Grid
            className="cardGridNo"
            style={{ width: "20%", fontSize: "30px" }}
          >
            {this.props.number}
          </Card.Grid>
        </Card>
      </Fragment>
    );
  }
}

export default SliderCard;
