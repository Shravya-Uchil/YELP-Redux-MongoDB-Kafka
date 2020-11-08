import React, { Component } from "react";
import { Redirect } from "react-router";
import axios from "axios";
import ItemCard from "./Item";
import {
  Button,
  Card,
  Container,
  Col,
  Row,
  Form,
  Dropdown,
  DropdownButton,
  InputGroup,
  Pagination,
} from "react-bootstrap";
import cookie from "react-cookies";
import NavBar from "../LandingPage/Navbar.js";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import serverAddress from "../../config";
import { getPageCount, getPageObjects } from "../../pageutils";

class Restaurant extends Component {
  constructor(props) {
    super(props);
    this.setState({
      menu_category: [],
      menu_items: [],
      review_rating: 0,
      order_type: "PICKUP",
      curPage: 1,
    });
    this.ItemsForCategory = this.ItemsForCategory.bind(this);
    this.getAllMenuItems = this.getAllMenuItems.bind(this);
    this.getAllCategories = this.getAllCategories.bind(this);
    this.onChange = this.onChange.bind(this);
    this.changeRating = this.changeRating.bind(this);
    this.onOrder = this.onOrder.bind(this);
    this.calculatePages = this.calculatePages.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.onPage = this.onPage.bind(this);
    this.getAllMenuItems().then((ret) => {
      this.getAllCategories();
    });
    this.onAdd = this.onAdd.bind(this);
    console.log("End constructor");
  }

  onPage = (e) => {
    console.log(e.target);
    console.log(e.target.text);
    this.setState({
      curPage: e.target.text,
    });
  };

  componentWillMount() {
    this.setState({
      curPage: 1,
    });
    console.log("mount");
    localStorage.removeItem("cart_list");
    if (this.props.location.state) {
      let id =
        this.props.location.state.restaurant_id ||
        this.props.location.state._id;
      axios.defaults.headers.common["authorization"] = localStorage.getItem(
        "token"
      );
      axios.defaults.headers.common["authorization"] = localStorage.getItem(
        "token"
      );
      axios
        .get(
          `${serverAddress}/yelp/restaurant/hasReviewed/${localStorage.getItem(
            "customer_id"
          )}/${id}`
        )
        .then((response) => {
          console.log("response");
          console.log(response.data);
          if (response.data) {
            if (response.data.result === "REVIEWED") {
              this.setState({
                hasReviewed: 1,
              });
            }
          }
        })
        .catch((error) => {
          console.log("Error");
          console.log(error);
        });

      document.title = this.props.location.state.restaurant_name;
      localStorage.setItem("selected_restaurant_id", id);
    }
  }

  getAllCategories = () => {
    if (this.props.location.state) {
      let id =
        this.props.location.state.restaurant_id ||
        this.props.location.state._id;
      axios.defaults.headers.common["authorization"] = localStorage.getItem(
        "token"
      );
      axios
        .get(`${serverAddress}/yelp/menu/category/${id}`)
        .then((response) => {
          if (response.data[0]) {
            this.setState({
              menu_category: response.data,
            });
          }
          console.log("Category get");
        })
        .catch((err) => {
          if (err.response && err.response.data) {
            console.log(err.response.data);
          }
        });
    }
  };

  getAllMenuItems = () => {
    if (this.props.location.state) {
      let id =
        this.props.location.state.restaurant_id ||
        this.props.location.state._id;
      axios.defaults.headers.common["authorization"] = localStorage.getItem(
        "token"
      );
      return axios
        .get(`${serverAddress}/yelp/menu/items/${id}`)
        .then((response) => {
          console.log("Items get");
          //if (response.data[0]) {
          this.setState({
            menu_items: response.data,
          });
          //}
        })
        .catch((err) => {
          if (err.response && err.response.data) {
            console.log(err.response.data);
          }
        });
    }
  };

  ItemsForCategory = (menu_category) => {
    //console.log("filter item for:");
    console.log("menu_category");
    console.log(menu_category);
    //console.log("this.state.menu_items");
    //console.log(this.state.menu_items);
    var itemsSection = [];
    //console.log("menu_category.category_name");
    //console.log(menu_category.category_name);
    if (
      menu_category &&
      menu_category.items &&
      menu_category.items.length > 0
    ) {
      var tag = <h4>{menu_category.category.category_name}</h4>;
      itemsSection.push(tag);
      for (var i = 0; i < menu_category.items.length; i++) {
        var item = <ItemCard menu_item={menu_category.items[i]} />;
        itemsSection.push(item);
      }
      return itemsSection;
    }
  };

  onOrder = (e) => {
    if (localStorage.getItem("cart_list")) {
      var total_cost = 0;
      var cartList = [];
      cartList.push(...JSON.parse(localStorage.getItem("cart_list")));
      for (let i = 0; i < cartList.length; i++) {
        total_cost =
          cartList[i].item_quantity * cartList[i].item_price + total_cost;
      }
      if (this.props.location.state) {
        let data = {
          customer_id: localStorage.getItem("customer_id"),
          restaurant_id:
            this.props.location.state.restaurant_id ||
            this.props.location.state._id,
          order_status: "New Order",
          order_cost: total_cost,
          order_type: this.state.order_type,
          cart_items: cartList,
          order_delivery_status: "Order Received",
        };
        console.log("placing order");
        console.log(data);
        axios.defaults.headers.common["authorization"] = localStorage.getItem(
          "token"
        );
        axios
          .post(`${serverAddress}/yelp/order/customer/placeorder`, data)
          .then((response) => {
            localStorage.removeItem("cart_items");
            //alert("Your order is placed!");
            this.setState({
              isOrderPlaced: 1,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  changeRating = (newRating, name) => {
    this.setState({
      [name]: newRating,
    });
  };

  onAdd = (e) => {
    //prevent page from refresh
    e.preventDefault();
    axios.defaults.withCredentials = true;
    if (this.props.location.state) {
      var data = {
        restaurant_id:
          this.props.location.state.restaurant_id ||
          this.props.location.state._id,
        customer_id: localStorage.getItem("customer_id"),
        review_text: this.state.review_text,
        review_rating: this.state.review_rating || 0,
      };
    }

    //var data = Object.assign({}, this.state);
    console.log("Add review");
    console.log(data);
    axios.defaults.headers.common["authorization"] = localStorage.getItem(
      "token"
    );
    axios
      .post(`${serverAddress}/yelp/restaurant/restaurantReview`, data)
      .then((response) => {
        alert("Review Added!");
        this.setState({
          isAddDone: 1,
        });
      })
      .catch((error) => {
        console.log("Error");
        console.log(error);

        alert("Review already exists!");
      });
  };

  onTypeSelect = (e) => {
    let type = e.target.text;
    this.setState({
      order_type: type,
    });
  };

  calculatePages() {
    let count = getPageCount(this.state.menu_items.length);
    let active = this.state.curPage;
    let paginationItemsTag = [];
    for (let number = 1; number <= count; number++) {
      paginationItemsTag.push(
        <Pagination.Item key={number} active={number === active}>
          {number}
        </Pagination.Item>
      );
    }
    return paginationItemsTag;
  }

  getCategories() {
    let categories = this.state.menu_category;
    let items = this.state.menu_items;
    let i = 0;
    let list = [];
    for (i = 0; i < categories.length; i++) {
      var filteredItems = items.filter(
        (_item) => _item.item_category === categories[i]._id
      );
      let data = { category: categories[i], items: [] };
      data.items = filteredItems;
      list.push(data);
    }
    let curPage = this.state.curPage;
    let pageSize = 5;
    let start = pageSize * (curPage - 1);
    let end = start + 5;
    let count = 0;
    let startCount = 0;
    let filteredList = [];
    let insert = false;
    for (i = 0; i < list.length; i++) {
      insert = false;
      let data = { category: list[i].category, items: [] };
      for (var j = 0; j < list[i].items.length; j++) {
        /*console.log(
          "count = ",
          count,
          ", startCount = ",
          startCount,
          "start = ",
          start
        );*/
        if (startCount >= start) {
          insert = true;
          data.items.push(list[i].items[j]);
          count++;
        }
        if (count === pageSize) {
          filteredList.push(data);
          //console.log(filteredList);
          return filteredList;
        }
        startCount++;
      }
      if (insert) {
        filteredList.push(data);
      }
      if (count === pageSize) {
        //console.log(filteredList);
        return filteredList;
      }
    }

    //console.log(filteredList);
    return filteredList;
  }

  render() {
    let message = null;
    let paginationItemsTag = [];
    console.log("render");
    let redirect = null;
    if (!cookie.load("cookie")) {
      redirect = <Redirect to="/login" />;
    }

    let category = null,
      menuTag = [],
      restaurant_name,
      contact,
      cuisine,
      zip_code,
      description,
      restaurant_image,
      restaurant = this.props.location.state;

    if (!localStorage.getItem("customer_id") || !this.props.location.state) {
      redirect = <Redirect to="/home" />;
    }

    if (restaurant) {
      restaurant_name = restaurant.restaurant_name;
      contact = restaurant.contact;
      zip_code = restaurant.zip_code;
      cuisine = restaurant.cuisine;
      description = restaurant.description;
      restaurant_image = restaurant.restaurant_image;
    }
    if (
      this.state &&
      this.state.menu_category &&
      this.state.menu_category.length > 0
    ) {
      paginationItemsTag = this.calculatePages();
      let filteredList = this.getCategories();
      console.log("*************************************");
      console.log(filteredList);
      console.log("*************************************");
      for (var i = 0; i < filteredList.length; i++) {
        category = this.ItemsForCategory(filteredList[i]);
        menuTag.push(category);
      }
    }
    console.log("render");
    console.log(this.state);
    let rating = 0;
    if (this.state && this.state.review_rating) {
      rating = this.state.review_rating;
    }
    let isReviewAdded = false;
    if (this.state && this.state.isAddDone) {
      isReviewAdded = true;
    }
    if (this.state && this.state.hasReviewed) {
      isReviewAdded = true;
    }
    let orderTypeList = ["Delivery", "Pickup"];
    let orderTypeTag = orderTypeList.map((type) => {
      return (
        <Dropdown.Item href="#" onClick={this.onTypeSelect}>
          {type}
        </Dropdown.Item>
      );
    });
    let ordertag = (
      <Button
        variant="success"
        name="order"
        onClick={this.onOrder}
        style={{ background: "#d32323" }}
      >
        Order
      </Button>
    );
    if (this.state && this.state.isOrderPlaced) {
      redirect = <Redirect to="/customerOrderHistory" />;
      console.log("redirect");
      console.log(redirect);
    }
    if (this.state) {
      var imageSrc = `${serverAddress}/yelp/images/restaurant/${restaurant_image}`;
    }
    return (
      <div>
        {redirect}
        <NavBar />
        <Container>
          <Card
            bg="light"
            text="dark"
            style={{ width: "70rem", height: "20rem", margin: "2%" }}
          >
            <Row>
              <Col>
                <Card.Img
                  style={{ width: "20rem", height: "20rem" }}
                  src={imageSrc}
                />
              </Col>
              <Card.Body>
                <Card.Title>
                  <h1>{restaurant_name}</h1>
                </Card.Title>
                <br />
                <Card.Text>
                  <h4>
                    {zip_code} | {contact}
                  </h4>
                </Card.Text>
                <br />
                <Card.Text>
                  <h4>Cuisine: {cuisine}</h4>
                </Card.Text>
                <br />
                <Card.Text>
                  <h4>Description: {description}</h4>
                </Card.Text>
              </Card.Body>
            </Row>
          </Card>
          <Form onSubmit={this.onAdd}>
            <StarRatings
              rating={rating}
              starRatedColor="#d32323"
              changeRating={this.changeRating}
              numberOfStars={5}
              name="review_rating"
            />
            <Form.Row>
              <Form.Group as={Col} controlId="addreview">
                <Form.Label>Write review</Form.Label>
                <Form.Control
                  name="review_text"
                  as="textarea"
                  onChange={this.onChange}
                  autocomplete="off"
                  rows={3}
                />
              </Form.Group>
            </Form.Row>
            <div className="d-flex flex-row">
              <Button
                type="submit"
                style={{ background: "#d32323" }}
                id="add"
                disabled={isReviewAdded}
              >
                Add Review
              </Button>
              {"   "}
              <Link to={{ pathname: "/restaurantreview", state: restaurant }}>
                <Button name="view_review" style={{ background: "#d32323" }}>
                  View Reviews
                </Button>
              </Link>
            </div>
            {"  "}
          </Form>
          <br />
          <Container>{menuTag}</Container>
          <br />
          <br />
          <Pagination onClick={this.onPage} style={{ display: "inline-flex" }}>
            {paginationItemsTag}
          </Pagination>
        </Container>
        <center>
          <DropdownButton
            variant="outline-secondary"
            title="Order Type"
            id="input-group-dropdown-2"
            style={{ display: "flow-root" }}
          >
            {orderTypeTag}
          </DropdownButton>
          <br />
          <br />
          {ordertag}
        </center>
        <br />
      </div>
    );
  }
}

export default Restaurant;
