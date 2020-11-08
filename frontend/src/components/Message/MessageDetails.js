import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import axios from "axios";
import { Col, Row, Button, Alert, Form } from "react-bootstrap";
import { Card } from "react-bootstrap";
import NavBar from "../LandingPage/Navbar.js";
import serverAddress from "../../config";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getMessageDetails, sendMessage } from "../../actions/messageActions";

class MessageDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentDidMount() {
    console.log("porps");
    console.log(this.props.location);
    this.setState({
      noRecords: 0,
    });
    this.props.getMessageDetails(
      this.props.location.state.restaurant_id,
      this.props.location.state.customer_id
    );
  }

  componentWillReceiveProps(nextProps) {
    console.log(
      "We in Message details props received, next prop is: ",
      nextProps
    );
    if (nextProps.message === "MESSAGE_SENT") {
      alert("Message sent");
    } else if (nextProps.message && nextProps.message.length > 0) {
      console.log("Message details response");
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

  onMessage = (e) => {
    //prevent page from refresh
    e.preventDefault();
    if (this.props.location.state) {
      var data = {
        restaurant_id: this.props.location.state.restaurant_id,
        customer_id: this.props.location.state.customer_id,
        from: localStorage.getItem("from"),
        message_text: this.state.message_text,
      };
      this.props.sendMessage(data);
      //alert("Message Sent");
    }
  };

  render() {
    let redirectVar = null;
    let norecordsTag = null;
    let messageTag = null;
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }

    if (this.state && this.state.noRecords) {
      //console.log(" noRecords - ");
      //console.log(this.state);
      //norecordsTag = <Alert variant="warning">No Messages.</Alert>;
      norecordsTag = <Alert variant="warning">You have no messages. </Alert>;
    }
    if (this.state && this.state.messages && this.state.messages.length > 0) {
      console.log("render");
      messageTag = this.state.messages.map((msg) => {
        console.log(msg);
        return (
          <Row>
            <Card bg="white" style={{ width: "100rem", margin: "2%" }}>
              <Card.Body>
                <Card.Text>From: {msg.from}</Card.Text>
                <Card.Text> Date: {msg.message_date}</Card.Text>
                <Card.Text> {msg.message_text}</Card.Text>
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
        <div>
          {messageTag}
          <Form onSubmit={this.onMessage}>
            <Form.Row>
              <Form.Group as={Col} controlId="addmessage">
                <Form.Label>Write a message</Form.Label>
                <Form.Control
                  name="message_text"
                  as="textarea"
                  onChange={this.onChange}
                  autocomplete="off"
                  rows={3}
                />
              </Form.Group>
            </Form.Row>
            <div className="d-flex flex-row">
              <Button type="submit" style={{ background: "#d32323" }} id="add">
                Send Message
              </Button>
            </div>
            {"  "}
          </Form>
        </div>
        <center>{norecordsTag}</center>
      </div>
    );
  }
}

MessageDetails.propTypes = {
  getMessageDetails: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ message: state.messages.message });

export default connect(mapStateToProps, {
  getMessageDetails,
  sendMessage,
})(MessageDetails);
