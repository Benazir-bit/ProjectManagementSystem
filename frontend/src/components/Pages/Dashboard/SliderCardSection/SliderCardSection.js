import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  Carousel,
  // Icon, 
  Skeleton
} from "antd";
import SliderCard from "../../../Common/AllCard/SliderCard";
import "./SliderCardSection.css";
import { AreaChartOutlined, RightCircleOutlined, LeftCircleOutlined } from "@ant-design/icons";
class SliderCardSection extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.carousel = React.createRef();
  }
  next() {
    this.carousel.next();
  }
  previous() {
    this.carousel.prev();
  }

  render() {
    const props = {
      infinite: false,
      speed: 500,
      slidesToShow: 3.5
      //slidesToScroll: 1
    };

    return (
      <Fragment>
        <div className="col-sm-12">
          <div className="ArrowDiv">
            <LeftCircleOutlined
              type="left-circle"
              style={{ fontSize: 22 }}
              onClick={this.previous}
            />
          </div>
          <div className="CarouselDiv">
            <Carousel
              className="slider"
              dots={false}
              ref={node => (this.carousel = node)}
              {...props}
            >
              <SliderCard
                // IconImage={
                // 	"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                // }
                link={`/user/tasks/current/${this.props.user.id}`}
                IconTag={
                  <AreaChartOutlined
                    style={{
                      fontSize: "32px",
                      color: "rgb(92, 184, 92)"
                    }}
                    type="area-chart"
                  />
                }
                slidertaskbtn={"sliderCard cnttask"}
                title={"Current Tasks"}
                description={"Completed Task 20%"}
                number={
                  this.props.panel_data ? (
                    this.props.panel_data.current_tasks
                  ) : (
                    <Skeleton
                      active
                      loading={true}
                      paragraph={false}
                    ></Skeleton>
                  )
                }
              />
              <SliderCard
                // IconImage={
                // 	"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                // }
                link={`/user/tasks/current/${this.props.user.id}`}
                // IconTag={
                //   <Icon
                //     style={{ fontSize: "32px", color: "#f0ad4e" }}
                //     type="warning"
                //   />
                // }
                slidertaskbtn={"sliderCard NearingDeadline"}
                title={"Nearing Deadline"}
                description={"Completed Task 20%"}
                number={
                  this.props.panel_data ? (
                    this.props.panel_data.cld_tasks
                  ) : (
                    <Skeleton
                      active
                      loading={true}
                      paragraph={false}
                    ></Skeleton>
                  )
                }
              />
              <SliderCard
                // IconImage={
                // 	"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                // }
                link={`/user/tasks/current/${this.props.user.id}`}
                // IconTag={
                //   <Icon
                //     style={{ fontSize: "32px", color: "#d9534f " }}
                //     type="dashboard"
                //   />
                // }
                slidertaskbtn={"sliderCard Overdue"}
                title={"Overdue Tasks"}
                description={"Completed Task 20%"}
                number={
                  this.props.panel_data ? (
                    this.props.panel_data.overdue_tasks
                  ) : (
                    <Skeleton
                      active
                      loading={true}
                      paragraph={false}
                    ></Skeleton>
                  )
                }
              />
              <SliderCard
                // IconImage={
                // 	"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                // }
                link={`/raised-issues/${this.props.user.id}`}
                // IconTag={
                //   <Icon
                //     style={{
                //       fontSize: "32px",
                //       color: "#5b3312"
                //     }}
                //     type="exception"
                //   />
                // }
                slidertaskbtn={"sliderCard Unresolved"}
                title={"Unresolved Issues"}
                description={"Completed Task 20%"}
                number={
                  this.props.panel_data ? (
                    this.props.panel_data.unresolved_issues
                  ) : (
                    <Skeleton
                      active
                      loading={true}
                      paragraph={false}
                    ></Skeleton>
                  )
                }
              />
              {this.props.panel_data ? (
                this.props.panel_data.waiting_for_review_tasks > 0 ? (
                  <Fragment>
                    <SliderCard
                      // IconImage={
                      // 	"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      // }
                      link={`/user/tasks/current/${this.props.user.id}`}
                      // IconTag={
                      //   <Icon
                      //     style={{
                      //       fontSize: "32px",
                      //       color: "#5b3312"
                      //     }}
                      //     type="exception"
                      //   />
                      // }
                      slidertaskbtn={"sliderCard Unresolved"}
                      title={"Waiting For Review"}
                      description={"Waiting for review Task 20%"}
                      number={
                        this.props.panel_data ? (
                          this.props.panel_data.waiting_for_review_tasks
                        ) : (
                          <Skeleton
                            active
                            loading={true}
                            paragraph={false}
                          ></Skeleton>
                        )
                      }
                    />
                  </Fragment>
                ) : null
              ) : null}
            </Carousel>
          </div>
          <div className="ArrowDiv">
            <RightCircleOutlined
              style={{ fontSize: 22 }}
              type="right-circle"
              onClick={this.next}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  panel_data: state.profile.panel_data,
  user: state.auth.user
});
export default connect(mapStateToProps)(SliderCardSection);
