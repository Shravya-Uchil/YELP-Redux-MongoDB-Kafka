import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import axios from "axios";
import { Col, Row, Button, Alert } from "react-bootstrap";
import { Card } from "react-bootstrap";
import NavBar from "../LandingPage/Navbar.js";
import serverAddress from "../../config";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  getAllMessagesCustomer,
  getAllMessagesRestaurant,
} from "../../actions/messageActions";

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({
      noRecords: 0,
    });
    if (localStorage.getItem("customer_id")) {
      this.props.getAllMessagesCustomer(localStorage.getItem("customer_id"));
    } else {
      this.props.getAllMessagesRestaurant(
        localStorage.getItem("restaurant_id")
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(
      "We in Messages Home props received, next prop is: ",
      nextProps
    );
    if (nextProps.message && nextProps.message.length > 0) {
      console.log("Message response");
      console.log(nextProps);
      this.setState({
        messages: nextProps.message,
        noRecords: 0,
      });
    } else {
      this.setState({
        noRecords: 1,
      });
    }
  }

  render() {
    let redirectVar = null;
    let norecordsTag = null;
    let messageTag = null;
    let isCustomer = false;
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }

    if (this.state && this.state.noRecords) {
      //console.log(" noRecords - ");
      //console.log(this.state);
      //norecordsTag = <Alert variant="warning">No Messages.</Alert>;
      norecordsTag = <Alert variant="warning">You have no messages. </Alert>;
    }
    if (localStorage.getItem("customer_id")) {
      isCustomer = true;
    } else {
      isCustomer = false;
    }
    if (this.state && this.state.messages && this.state.messages.length > 0) {
      console.log("render");
      let fromName;
      messageTag = this.state.messages.map((msg) => {
        if (isCustomer) {
          fromName = msg.customer_name;
        } else {
          fromName = msg.restaurant_name;
        }
        console.log(msg);
        return (
          <Row>
            <Card bg="white" style={{ width: "100rem", margin: "2%" }}>
              <Card.Body>
                <Card.Text>Restaurant: {msg.restaurant_name}</Card.Text>
                <Card.Text> User Name: {msg.customer_name}</Card.Text>
                <Card.Text> Start Date: {msg.start_date}</Card.Text>
                <Link
                  to={{
                    pathname: "/messagedetails",
                    state: {
                      customer_id: msg.customer_id,
                      restaurant_id: msg.restaurant_id,
                      from: fromName,
                    },
                  }}
                >
                  <Card.Text>Click here to view messages</Card.Text>
                </Link>
              </Card.Body>
            </Card>
          </Row>
        );
      });
    }
    return (
      <div>
        {redirectVar}
        <NavBar />
        <div>{messageTag}</div>
        <center>{norecordsTag}</center>
      </div>
    );
  }
}

Messages.propTypes = {
  getAllMessagesCustomer: PropTypes.func.isRequired,
  getAllMessagesRestaurant: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ message: state.messages.message });

export default connect(mapStateToProps, {
  getAllMessagesCustomer,
  getAllMessagesRestaurant,
})(Messages);
