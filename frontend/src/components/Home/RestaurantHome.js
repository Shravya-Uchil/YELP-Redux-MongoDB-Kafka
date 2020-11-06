import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { Card, Container, Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import Reviews from "../Restaurant/RestaurantReview.js";
import ItemCard from "../Restaurant/Item";
import { Link } from "react-router-dom";
import serverAddress from "../../config";
import {
  getRestaurantDetailsHome,
  getAllCategoriesRestaurant,
  getMenuItemsRestaurant,
} from "../../actions/restaurantHomeActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class RestaurantHome extends Component {
  constructor(props) {
    super(props);
    // redux change
    //this.state = {};

    this.ItemsForCategory = this.ItemsForCategory.bind(this);
    this.getAllMenuItems = this.getAllMenuItems.bind(this);
    this.getAllCategories = this.getAllCategories.bind(this);
    this.getAllMenuItems().then((ret) => {
      this.getAllCategories();
    });
  }

  componentWillMount() {
    console.log("Get restaurant");
    //this.props.getRestaurantDetailsHome();
    axios.defaults.headers.common["authorization"] = localStorage.getItem(
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
      });
  }

  getAllCategories = () => {
    //this.props.getAllCategoriesRestaurant();
    axios.defaults.headers.common["authorization"] = localStorage.getItem(
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
      });
  };

  getAllMenuItems = () => {
    //this.props.getMenuItemsRestaurant();
    axios.defaults.headers.common["authorization"] = localStorage.getItem(
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
      });
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
      this.state &&
      this.state.menu_items &&
      this.state.menu_items.length > 0
    ) {
      var filteredItems = this.state.menu_items.filter(
        //(_item) => _item.category_id === menu_category.category_id
        (_item) => _item.item_category === menu_category._id
      );
      //console.log(filteredItems);
      if (filteredItems.length > 0) {
        var tag = <h4>{menu_category.category_name}</h4>;
        itemsSection.push(tag);
        for (var i = 0; i < filteredItems.length; i++) {
          var item = <ItemCard menu_item={filteredItems[i]} />;
          itemsSection.push(item);
        }
      }
      return itemsSection;
    }
  };

  render() {
    let redirectVar = null;
    let restaurantDetails = null;
    let reviews = null;
    let category = null;
    let menuTag = [];
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
                  {restaurant.contact} | {restaurant.zip_code}
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
      for (var i = 0; i < this.state.menu_category.length; i++) {
        category = this.ItemsForCategory(this.state.menu_category[i]);
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
            <b>Reviews</b>
            <Container>{reviews}</Container>
          </Container>
        </div>
      </div>
    );
  }
}

/*RestaurantHome.propTypes = {
  getAllCategoriesRestaurant: PropTypes.func.isRequired,
  //searchRestaurantsHome: PropTypes.func.isRequired,
  customer: PropTypes.object.isRequired,
  restaurant: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  customer: state.restaurantHome.customer,
  restaurant: state.restaurantHome.restaurant,
});

export default connect(mapStateToProps, {
  getAllCategoriesRestaurant,
  //searchRestaurantsHome,
})(RestaurantHome);*/

//export Home Component
export default RestaurantHome;
