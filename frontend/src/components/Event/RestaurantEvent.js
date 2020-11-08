import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import axios from "axios";
import { Button, Alert, Col, Row, Pagination } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import serverAddress from "../../config";
import { getPageCount, getPageObjects } from "../../pageutils";

class RestaurantEvent extends Component {
  constructor(props) {
    super(props);
    this.setState({
      noRecords: false,
      curPage: 1,
    });
    this.onPage = this.onPage.bind(this);
  }

  onPage = (e) => {
    console.log(e.target);
    console.log(e.target.text);
    this.setState({
      curPage: e.target.text,
    });
  };

  componentDidMount() {
    axios.defaults.headers.common["authorization"] = localStorage.getItem(
      "token"
    );
    axios
      .get(
        `${serverAddress}/yelp/event/restaurant/${localStorage.getItem(
          "restaurant_id"
        )}`
      )
      .then((response) => {
        console.log("response");
        console.log(response.data);
        if (response.data) {
          if (response.data[0].result === "NO_RECORD") {
            this.setState({
              noRecords: true,
            });
          } else {
            this.setState({
              allEvents: response.data,
              curPage: 1,
            });
          }
        }
        console.log("state");
        console.log(this.state);
      })
      .catch((error) => {
        console.log("Error");
        console.log(error);
      });
  }

  render() {
    let redirectVar = null;
    let messageTag = null;
    let eventsTag = null;
    let paginationItemsTag = [];
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }
    if (this.state && this.state.allEvents) {
      let count = getPageCount(this.state.allEvents.length);
      let active = this.state.curPage;
      for (let number = 1; number <= count; number++) {
        paginationItemsTag.push(
          <Pagination.Item key={number} active={number === active}>
            {number}
          </Pagination.Item>
        );
      }
      let filteredObjects = getPageObjects(
        this.state.curPage,
        this.state.allEvents
      );

      eventsTag = filteredObjects.map((event) => {
        var imageSrc = `${serverAddress}/yelp/images/event/${event.event_image}`;
        return (
          <Col sm={3}>
            <Card bg="white" style={{ width: "18rem" }}>
              <Link to={{ pathname: "/eventdetails", state: event }}>
                <Card.Img
                  variant="top"
                  style={{ height: "15rem" }}
                  src={imageSrc}
                />
                <Card.Title>{event.event_name}</Card.Title>
              </Link>
              <Card.Body>
                <Card.Text>{event.event_description}</Card.Text>
                <Card.Text>{event.event_location}</Card.Text>
                <Card.Text>
                  {event.event_date} | {event.event_time}
                </Card.Text>
                <Card.Text>{event.event_hashtag}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        );
      });
    }
    if (this.state && this.state.noRecords) {
      messageTag = <Alert variant="warning">No events found.</Alert>;
    }

    return (
      <div>
        {redirectVar}
        <div>
          <center>
            <br />
            <br />
            <br />
            {messageTag}
            <Row>{eventsTag}</Row>
            <br />
            <br />
            <Pagination
              onClick={this.onPage}
              style={{ display: "inline-flex" }}
            >
              {paginationItemsTag}
            </Pagination>
            <br />
            <br />
            <br />
            <br />
            <Button
              variant="success"
              name="order"
              href="/addevent"
              style={{ background: "#d32323" }}
            >
              Add Event
            </Button>
          </center>
        </div>
      </div>
    );
  }
}
//export Home Component
export default RestaurantEvent;
