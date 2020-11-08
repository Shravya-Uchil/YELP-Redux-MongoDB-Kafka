import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import axios from "axios";
import { Button, Col, Container, Pagination } from "react-bootstrap";
import { Card } from "react-bootstrap";
import NavBar from "../LandingPage/Navbar.js";
import { Link } from "react-router-dom";
import serverAddress from "../../config";
import { getPageCount, getPageObjects } from "../../pageutils";

class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.onRegister = this.onRegister.bind(this);
    this.onPage = this.onPage.bind(this);
  }

  onRegister = (e) => {
    axios.defaults.withCredentials = true;

    var data = {
      event_id: this.props.location.state._id,
      customer_id: localStorage.getItem("customer_id"),
      restaurant_id: this.props.location.state.restaurant_id,
    };

    //var data = Object.assign({}, this.state);
    console.log("Register to event");
    console.log(data);
    axios.defaults.headers.common["authorization"] = localStorage.getItem(
      "token"
    );
    axios
      .post(`${serverAddress}/yelp/event/register`, data)
      .then((response) => {
        console.log("Registered");
        alert("Registered to event!!");
        this.setState({
          isRegistered: 1,
        });
      })
      .catch((error) => {
        console.log("Error");
        console.log(error);
      });
  };

  onPage = (e) => {
    console.log(e.target);
    console.log(e.target.text);
    this.setState({
      curPage: e.target.text,
    });
  };

  componentDidMount() {
    this.setState({
      curPage: 1,
    });
    if (localStorage.getItem("customer_id")) {
      axios.defaults.headers.common["authorization"] = localStorage.getItem(
        "token"
      );
      axios
        .get(
          `${serverAddress}/yelp/event/customer/isRegistered/${localStorage.getItem(
            "customer_id"
          )}/${this.props.location.state._id}`
        )
        .then((response) => {
          console.log("response");
          console.log(response.data);
          if (response.data) {
            if (response.data.result === "REGISTERED") {
              this.setState({
                isRegistered: 1,
              });
            }
          }
        })
        .catch((error) => {
          console.log("Error");
          console.log(error);
        });
    } else {
      axios.defaults.headers.common["authorization"] = localStorage.getItem(
        "token"
      );
      axios
        .get(
          `${serverAddress}/yelp/event/restaurant/registration/${this.props.location.state._id}`
        )
        .then((response) => {
          console.log("response cust");
          console.log(response.data);
          if (response.data && response.data.result != "NO_RECORD") {
            this.setState({
              registered_customers: response.data,
            });
          }
        })
        .catch((error) => {
          console.log("Error");
          console.log(error);
        });
    }
  }

  render() {
    console.log("render");
    console.log(this.props.location.state);
    let redirectVar = null;
    let eventTag = null;
    let registerTag = null;
    let registered_customers = null;
    let paginationItemsTag = [];
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }
    if (localStorage.getItem("customer_id")) {
      if (this.state && this.state.isRegistered) {
        registerTag = (
          <Button
            variant="success"
            name="registered"
            style={{ background: "#d32323" }}
            disabled={true}
          >
            Registered
          </Button>
        );
      } else {
        registerTag = (
          <Button
            variant="success"
            name="registered"
            onClick={this.onRegister}
            style={{ background: "#d32323" }}
          >
            Register
          </Button>
        );
      }
    } else {
      console.log("this.state");
      console.log(this.state);
      if (this.state && this.state.registered_customers) {
        let count = getPageCount(this.state.registered_customers.length);
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
          this.state.registered_customers
        );
        registered_customers = filteredObjects.map((cust) => {
          var imageSrc = `${serverAddress}/yelp/images/customer/${cust.cust_image}`;
          return (
            <Col sm={3} style={{ margin: "2%" }}>
              <Card bg="white" style={{ width: "15rem" }}>
                <Link to={{ pathname: "/customercard", state: cust }}>
                  <Card.Img variant="top" src={imageSrc} />
                  <Card.Title>{cust.cust_name}</Card.Title>
                </Link>
              </Card>
            </Col>
          );
        });
      }
    }

    var eventSrc = `${serverAddress}/yelp/images/event/${this.props.location.state.event_image}`;
    eventTag = (
      <Card
        bg="white"
        style={{ width: "70rem", height: "30rem", margin: "2%" }}
      >
        <Card.Img variant="top" style={{ width: "15rem" }} src={eventSrc} />
        <Card.Title>{this.props.location.state.event_name}</Card.Title>
        <Card.Body>
          <Card.Text>{this.props.location.state.event_description}</Card.Text>
          <Card.Text>{this.props.location.state.event_location}</Card.Text>
          <Card.Text>
            {this.props.location.state.event_date} |{" "}
            {this.props.location.state.event_time}
          </Card.Text>
          <Card.Text>{this.props.location.state.event_hashtag}</Card.Text>
        </Card.Body>
        {registerTag}
      </Card>
    );

    let header = null;
    if (localStorage.getItem("restaurant_id")) {
      header = <h4>Registered Customers</h4>;
    }
    return (
      <div>
        {redirectVar}
        <NavBar />
        <div>{eventTag}</div>
        <Container style={{ margin: "5%" }}>
          {header}
          {registered_customers}
          <br />
          <br />
          <center>
            <Pagination
              onClick={this.onPage}
              style={{ display: "inline-flex" }}
            >
              {paginationItemsTag}
            </Pagination>
          </center>
        </Container>
      </div>
    );
  }
}
//export Home Component
export default EventDetails;
