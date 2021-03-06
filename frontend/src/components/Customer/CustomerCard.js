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
  getCustomerCard,
  followCustomer,
} from "../../actions/customerProfileActions";

class CustomerCard extends Component {
  constructor(props) {
    super(props);
    // redux change
    this.state = {};
    this.setState({
      disable: false,
      buttonName: "Follow",
      msgButtonName: "Message",
    });
    this.enableButton = this.enableButton.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    this.enableButton();
    this.setState({
      disable: false,
      buttonName: "Follow",
    });
    this.props.getCustomerCard(this.props.location.state._id);
    /*axios
      .get(
        `${serverAddress}/yelp/profile/customerById/${this.props.location.state.customer_id}`
      )
      .then((response) => {
        console.log("response");
        console.log(response.data);
        if (response.data) {
          this.setState({
            customer: response.data[0],
          });
        }
      })
      .catch((error) => {
        console.log("Error");
        console.log(error);
      });*/
  }

  componentWillReceiveProps(nextProps) {
    console.log("We in props received, next prop is: ", nextProps);
    if (nextProps.customer) {
      var { customer } = nextProps;

      if (customer.result == "CUSTOMER_FOLLOWED") {
        this.setState({
          disable: true,
          buttonName: "Following",
        });
      } else {
        /* var customerData = {
        cust_name: customer.cust_name || this.state.cust_name,
        email_id: customer.email_id || this.state.email_id,
        city: customer.city || this.state.city,
        state: customer.state || this.state.state,
        country: customer.country || this.state.country,
        phone_number: customer.phone_number || this.state.phone_number,
        cust_image: customer.cust_image || this.state.cust_image,
        dob: customer.dob || this.state.dob,
        nick_name: customer.nick_name || this.state.nick_name,
        headline: customer.headline || this.state.headline,
        yelp_since: customer.yelp_since || this.state.yelp_since,
        things_love: customer.things_love || this.state.things_love,
        find_me: customer.find_me || this.state.find_me,
        blog_website: customer.blog_website || this.state.blog_website,
        customer_id: customer.customer_id || this.state.customer_id,
      };*/
        this.setState({
          customer: customer,
        });
        console.log("customer data");
      }
    }
  }

  onClick = (e) => {
    //prevent page from refresh
    e.preventDefault();
    let data = {
      current_cust_id: localStorage.getItem("customer_id"),
      target_cust_id: this.props.location.state._id,
    };
    this.props.followCustomer(data);
  };

  enableButton() {
    if (localStorage.getItem("customer_id") != this.props.location.state._id) {
      this.setState({
        disable: false,
      });
    }
  }

  render() {
    console.log("render cust card");
    console.log(this.state);
    let redirectVar = null;
    let customerTag = null;
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }

    let disable = this.state.disable;
    let buttonName = this.state.buttonName;
    let buttonTag = null;
    let messageTag = null;
    if (this.state && this.state.customer) {
      var imgSrc = `${serverAddress}/yelp/images/customer/${this.state.customer.cust_image}`;
      console.log("Check if already following");
      console.log(this.state.customer);
      if (this.state.customer.followers.length > 0) {
        let idx = this.state.customer.followers.indexOf(
          localStorage.getItem("customer_id")
        );
        console.log(idx);
        if (idx != -1) {
          disable = true;
          buttonName = "Following";
        }
      }

      if (localStorage.getItem("customer_id")) {
        buttonTag = (
          <Button
            variant="primary"
            onClick={this.onClick}
            disabled={disable}
            style={{ background: "#d32323" }}
          >
            {buttonName} {this.state.customer.cust_name}
          </Button>
        );
      }

      if (localStorage.getItem("restaurant_id")) {
        messageTag = (
          <Link
            to={{
              pathname: "/messagedetails",
              state: {
                customer_id: this.state.customer._id,
                restaurant_id: localStorage.getItem("restaurant_id"),
                from: localStorage.getItem("restaurant_id"),
              },
            }}
          >
            <Button
              variant="primary"
              name="message_btn"
              style={{ background: "#d32323" }}
            >
              Message {this.state.customer.cust_name}
            </Button>
          </Link>
        );
      }

      customerTag = (
        <Row>
          <Col sm={2}>
            <Card
              bg="light"
              text="dark"
              style={{ width: "70rem", height: "25rem", margin: "2%" }}
            >
              <Card.Img variant="top" style={{ width: "15rem" }} src={imgSrc} />
              <Card.Title>{this.state.customer.cust_name || ""}</Card.Title>
            </Card>
          </Col>
          <Col sm={2}>
            <Card
              bg="light"
              text="dark"
              style={{ width: "70rem", height: "25rem", margin: "2%" }}
            >
              <Card.Body>
                <Card.Text>
                  Nick name: {this.state.customer.nick_name || ""}
                </Card.Text>
                <Card.Text>City: {this.state.customer.city || ""}</Card.Text>
                <Card.Text>State: {this.state.customer.state || ""}</Card.Text>
                <Card.Text>
                  Country: {this.state.customer.country || ""}
                </Card.Text>
                <Card.Text>
                  Phone no: {this.state.customer.phone_number || ""}
                </Card.Text>
                <Card.Text>Bio: {this.state.customer.headline || ""}</Card.Text>
                {buttonTag}
                {messageTag}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      );
    }
    return (
      <div>
        {redirectVar}
        <NavBar />
        <div>{customerTag}</div>
      </div>
    );
  }
}
//export Home Component
CustomerCard.propTypes = {
  getCustomerCard: PropTypes.func.isRequired,
  customer: PropTypes.object.isRequired,
  followCustomer: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  customer: state.customerProfile.customer,
});

export default connect(mapStateToProps, {
  getCustomerCard,
  followCustomer,
})(CustomerCard);
