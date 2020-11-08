import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import axios from "axios";
import { Card, Pagination } from "react-bootstrap";
import NavBar from "../LandingPage/Navbar.js";
import StarRatings from "react-star-ratings";
import { Link } from "react-router-dom";
import serverAddress from "../../config";
import { getPageCount, getPageObjects } from "../../pageutils";

class RestaurantReview extends Component {
  constructor(props) {
    super(props);
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
    this.setState({
      curPage: 1,
    });
    let res_id = null;
    if (this.props.restaurant_details) {
      res_id = this.props.restaurant_details._id;
    } else {
      res_id = this.props.location.state._id;
    }
    axios.defaults.headers.common["authorization"] = localStorage.getItem(
      "token"
    );
    axios
      .get(`${serverAddress}/yelp/restaurant/restaurantReview/${res_id}`)
      .then((response) => {
        var cuisines = [];
        console.log("response");
        console.log(response.data);
        if (response.data) {
          this.setState({
            reviews: response.data,
          });
        }
      })
      .catch((error) => {
        console.log("Error");
        console.log(error);
      });
  }

  render() {
    console.log("render");
    console.log(this.state);
    let redirectVar = null;
    let reviewsTag = null;
    let paginationItemsTag = [];
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }

    if (this.state && this.state.reviews) {
      let count = getPageCount(this.state.reviews.length);
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
        this.state.reviews
      );
      reviewsTag = filteredObjects.map((review) => {
        return (
          <Card
            bg="white"
            style={{ width: "70rem", height: "15rem", margin: "2%" }}
          >
            <StarRatings
              rating={review.review_rating}
              starRatedColor="#d32323"
              numberOfStars={5}
              name="review_rating"
              disabled={true}
            />
            <Link to={{ pathname: "/customercard", state: review.customer_id }}>
              <Card.Title>{review.customer_id.cust_name}</Card.Title>
            </Link>
            <Card.Body>
              <Card.Text>
                {review.restaurant_id.restaurant_name} | {review.review_date}
              </Card.Text>
              <Card.Text>{review.review_text}</Card.Text>
            </Card.Body>
          </Card>
        );
      });
    }
    let navbar = <NavBar />;
    if (this.props.restaurant_details) {
      navbar = null;
    }
    return (
      <div>
        {redirectVar}
        {navbar}
        <div>{reviewsTag}</div>
        <center>
          <br />
          <br />
          <Pagination onClick={this.onPage} style={{ display: "inline-flex" }}>
            {paginationItemsTag}
          </Pagination>
        </center>
      </div>
    );
  }
}
//export
export default RestaurantReview;
