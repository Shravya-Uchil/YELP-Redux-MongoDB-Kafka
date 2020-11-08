import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { Card, Container, Col, Row, Button, Pagination } from "react-bootstrap";
import axios from "axios";
import Reviews from "../Restaurant/RestaurantReview.js";
import ItemCard from "../Restaurant/Item";
import { Link } from "react-router-dom";
import serverAddress from "../../config";
import {
  getRestaurantById,
  getMenuCategory,
  getMenuItem,
} from "../../actions/restaurantHomeActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPageCount, getPageObjects } from "../../pageutils";

class RestaurantHome extends Component {
  constructor(props) {
    super(props);
    // redux change
    //this.state = {};

    this.ItemsForCategory = this.ItemsForCategory.bind(this);
    this.getAllMenuItems = this.getAllMenuItems.bind(this);
    this.getAllCategories = this.getAllCategories.bind(this);
    this.onPage = this.onPage.bind(this);
    this.calculatePages = this.calculatePages.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getAllMenuItems();
    this.getAllCategories();
  }

  onPage = (e) => {
    console.log(e.target);
    console.log(e.target.text);
    this.setState({
      curPage: e.target.text,
    });
  };

  componentWillMount() {
    console.log("Get restaurant");
    this.setState({
      curPage: 1,
    });
    this.props.getRestaurantById(localStorage.getItem("restaurant_id"));
    /*axios.defaults.headers.common["authorization"] = localStorage.getItem(
      "token"
    );
    axios
      .get(
        `${serverAddress}/yelp/profile/restaurant/${localStorage.getItem(
          "restaurant_id"
        )}`
      )
      .then((response) => {
        console.log("get res resp");
        console.log(response);
        if (response.data) {
          this.setState({
            restaurant: response.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });*/
  }

  getAllCategories = () => {
    //this.props.getAllCategoriesRestaurant();
    this.props.getMenuCategory(localStorage.getItem("restaurant_id"));
    /*axios.defaults.headers.common["authorization"] = localStorage.getItem(
      "token"
    );
    axios
      .get(
        `${serverAddress}/yelp/menu/category/${localStorage.getItem(
          "restaurant_id"
        )}`
      )
      .then((response) => {
        console.log("Category get");
        console.log(response);
        if (response.data[0]) {
          this.setState({
            menu_category: response.data,
          });
        }
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          console.log(err.response.data);
        }
      });*/
  };

  getAllMenuItems = () => {
    //this.props.getMenuItemsRestaurant();
    this.props.getMenuItem(localStorage.getItem("restaurant_id"));
    /*axios.defaults.headers.common["authorization"] = localStorage.getItem(
      "token"
    );
    return axios
      .get(
        `${serverAddress}/yelp/menu/items/${localStorage.getItem(
          "restaurant_id"
        )}`
      )
      .then((response) => {
        console.log("Items get");
        console.log(response);
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
      });*/
  };

  ItemsForCategory = (menu_category) => {
    console.log("filter item for:");

    console.log("menu_category");
    console.log(menu_category);

    console.log("this.state.menu_items");
    console.log(this.state.menu_items);
    var itemsSection = [];

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

  componentWillReceiveProps(nextProps) {
    console.log(
      "We in Restaurant Home props received, next prop is: ",
      nextProps
    );
    if (nextProps.restaurant) {
      console.log("Restaurant response");
      console.log(nextProps);
      this.setState({
        restaurant: nextProps.restaurant,
      });
    } else if (nextProps.menu_item) {
      console.log("menu item response");
      console.log(nextProps);
      this.setState({
        menu_items: nextProps.menu_item,
      });
    } else if (nextProps.menu_category) {
      console.log("menu item response");
      console.log(nextProps);
      this.setState({
        menu_category: nextProps.menu_category,
      });
    } else {
      console.log("Redux error. Props:");
      console.log(nextProps);
    }
  }

  calculatePages() {
    let count = getPageCount(this.state.menu_items.length, 5);
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
    let redirectVar = null;
    let restaurantDetails = null;
    let reviews = null;
    let category = null;
    let menuTag = [];
    let paginationItemsTag = [];
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }
    if (this.state && this.state.restaurant) {
      console.log("state");
      let restaurant = this.state.restaurant;
      console.log(restaurant);
      let resImageSrc = `${serverAddress}/yelp/images/restaurant/${this.state.restaurant.restaurant_image}`;
      restaurantDetails = (
        <Card
          bg="light"
          text="dark"
          style={{
            width: "70rem",
            height: "20rem",
            margin: "2%",
          }}
        >
          <Row>
            <Col>
              <Card.Img
                style={{ width: "20rem", height: "20rem" }}
                src={resImageSrc}
              />
            </Col>
            <Card.Body>
              <Card.Title>
                <h1>{restaurant.restaurant_name}</h1>
              </Card.Title>
              <br />
              <Card.Text>
                <h4>
                  {restaurant.phone_number} | {restaurant.zip_code}
                </h4>
              </Card.Text>
              <br />
              <Card.Text>
                <h4>Cuisine: {restaurant.cuisine}</h4>
              </Card.Text>
              <br />
              <Card.Text>
                <h4>Description: {restaurant.description}</h4>
              </Card.Text>
              <br />
            </Card.Body>
          </Row>
        </Card>
      );
      reviews = <Reviews restaurant_details={restaurant} />;
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
    return (
      <div>
        {redirectVar}
        <div>
          <Container className="justify-content">
            <br />
            {restaurantDetails}
            <Link to={{ pathname: "/additem" }}>
              <Button
                variant="primary"
                name="add_item"
                style={{ background: "#d32323" }}
              >
                Add More Items
              </Button>
            </Link>
            <Container>{menuTag}</Container>
            <center>
              <Pagination
                onClick={this.onPage}
                style={{ display: "inline-flex" }}
              >
                {paginationItemsTag}
              </Pagination>
            </center>
            <b>Reviews</b>
            <Container>{reviews}</Container>
          </Container>
        </div>
      </div>
    );
  }
}

RestaurantHome.propTypes = {
  getMenuCategory: PropTypes.func.isRequired,
  getMenuItem: PropTypes.func.isRequired,
  getRestaurantById: PropTypes.func.isRequired,
  menu_item: PropTypes.object.isRequired,
  menu_category: PropTypes.object.isRequired,
  restaurant: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  menu_item: state.restaurantHome.menu_item,
  menu_category: state.restaurantHome.menu_category,
  restaurant: state.restaurantHome.restaurant,
});

export default connect(mapStateToProps, {
  getMenuCategory,
  getMenuItem,
  getRestaurantById,
})(RestaurantHome);

//export Home Component
//export default RestaurantHome;
