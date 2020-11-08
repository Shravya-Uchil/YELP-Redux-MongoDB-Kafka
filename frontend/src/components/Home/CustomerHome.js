import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import {
  InputGroup,
  FormControl,
  Button,
  DropdownButton,
  Dropdown,
  Alert,
  Col,
  Row,
  Pagination,
} from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Map from "../Map/Map";
import Geocode from "react-geocode";
import serverAddress from "../../config";
import {
  getCustomerDetailsHome,
  searchRestaurantsHome,
} from "../../actions/customerHomeActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPageCount, getPageObjects } from "../../pageutils";

Geocode.setApiKey("AIzaSyAIzrgRfxiIcZhQe3Qf5rIIRx6exhZPwwE");
Geocode.setLanguage("en");
Geocode.setRegion("us");

class CustomerHome extends Component {
  constructor(props) {
    super(props);
    // redux change
    this.state = {};
    //redux change comment
    /*
    this.setState({
      search_input: "",
      noRecords: 0,
      locations: [],
    });*/

    this.onChange = this.onChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onCuisineSelect = this.onCuisineSelect.bind(this);
    this.onPage = this.onPage.bind(this);
    this.getCustomerInfo();
  }

  onPage = (e) => {
    console.log(e.target);
    console.log(e.target.text);
    this.setState({
      curPage: e.target.text,
    });
  };

  componentWillReceiveProps(nextProps) {
    console.log(
      "We in Customer Home props received, next prop is: ",
      nextProps
    );
    this.setState({
      curPage: 1,
    });
    if (nextProps.customer) {
      console.log("Customer response");
      console.log(nextProps);
      this.setState({
        customer: nextProps.customer,
      });
      let addr = "San Jose";
      if (nextProps.customer.city != "") {
        addr = nextProps.customer.city;
      }
      Geocode.fromAddress().then(
        (resp) => {
          console.log("Locations");
          console.log(resp.results[0].geometry);
          //console.log(latitude + ", " + longitude);
          let coordinates = {
            lat: resp.results[0].geometry.location.lat,
            lng: resp.results[0].geometry.location.lng,
            address: "YOU",
          };
          console.log("Coordinates");
          console.log(coordinates);

          this.setState({
            center: coordinates,
          });
        },
        (error) => {
          console.error(error);
        }
      );
    } else if (nextProps.restaurant) {
      var cuisines = [];
      console.log("Restaurant response");
      console.log(nextProps);
      if (nextProps.restaurant === "NO_RECORD") {
        this.setState({
          noRecords: true,
          filteredRestaurants: null,
        });
      } else {
        this.setState({
          allRestaurants: nextProps.restaurant,
          filteredRestaurants: nextProps.restaurant,
          noRecords: false,
          search_input: "",
        });
      }
    } else {
      console.log("Redux error. Props:");
      console.log(nextProps);
    }
  }

  getCustomerInfo = () => {
    this.props.getCustomerDetailsHome();
    /*axios
      .get(
        `${serverAddress}/yelp/profile/customerById/${localStorage.getItem(
          "customer_id"
        )}`
      )
      .then((response) => {
        console.log("response");
        console.log(response.data);
        if (response.data) {
          this.setState({
            customer: response.data,
          });
          let addr = "San Jose";
          if (response.data.city != "") {
            addr = response.data.city;
          }
          Geocode.fromAddress(addr).then(
            (resp) => {
              console.log("Locations");
              console.log(resp.results[0].geometry);
              //console.log(latitude + ", " + longitude);
              let coordinates = {
                lat: resp.results[0].geometry.location.lat,
                lng: resp.results[0].geometry.location.lng,
                address: "YOU",
              };
              console.log("Coordinates");
              console.log(coordinates);

              this.setState({
                center: coordinates,
              });
            },
            (error) => {
              console.error(error);
            }
          );
        }
      })
      .catch((error) => {
        console.log("Error");
        console.log(error);
      });*/
  };

  componentDidMount() {
    this.props.searchRestaurantsHome("_");
    /*axios
      .get(`${serverAddress}/yelp/restaurant/search/_`)
      .then((response) => {
        var cuisines = [];
        console.log("response");
        console.log(response.data);
        if (response.data) {
          if (response.data === "NO_RECORD") {
            this.setState({
              noRecords: true,
              search: "",
            });
          } else {
            this.setState({
              allRestaurants: response.data,
              filteredRestaurants: response.data,
            });
          }
        }
        console.log("state");
        console.log(this.state);
      })
      .catch((error) => {
        console.log("Error");
        console.log(error);
      });*/
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      noRecords: 0,
    });
  };

  onCuisineSelect = (e) => {
    let filter = e.target.text;
    if (filter === "All") {
      this.setState({
        filteredRestaurants: this.state.allRestaurants,
        noRecords: 0,
      });
    } else {
      var filteredList = this.state.allRestaurants.filter(
        (restaurant) => restaurant.cuisine === filter
      );
      this.setState({
        filteredRestaurants: filteredList,
      });
      if (filteredList.length === 0) {
        this.setState({ noRecords: 1 });
      }
    }
  };

  onTypeSelect = (e) => {
    let filter = e.target.text;
    let filteredList = this.state.allRestaurants;
    if (filter === "All") {
      this.setState({
        noRecords: 0,
      });
    } else if (filter === "Dine-in") {
      filteredList = this.state.allRestaurants.filter(
        (restaurant) => restaurant.dine_in
      );
    } else if (filter === "Delivery") {
      filteredList = this.state.allRestaurants.filter(
        (restaurant) => restaurant.yelp_delivery
      );
    } else if (filter === "Pickup") {
      filteredList = this.state.allRestaurants.filter(
        (restaurant) => restaurant.curbside_pickup
      );
    }
    this.setState({
      filteredRestaurants: filteredList,
    });

    if (filteredList && filteredList.length === 0) {
      this.setState({ noRecords: 1 });
    }
  };

  onSearch = (e) => {
    e.preventDefault();
    if (this.state) {
      var searchInput =
        typeof this.state.search_input === "undefined" ||
        this.state.search_input === ""
          ? "_"
          : this.state.search_input;
      this.setState({
        search_input: searchInput,
      });
      this.props.searchRestaurantsHome(searchInput);
      /*axios
        .get(`${serverAddress}/yelp/restaurant/search/${searchInput}`)
        .then((response) => {
          console.log("resp");
          console.log(response);
          if (response.data) {
            if (response.data === "NO_RECORD") {
              console.log("Here");
              this.setState({
                noRecords: true,
                search_input: searchInput,
                filteredRestaurants: null,
              });
            } else {
              console.log("there");
              this.setState({
                filteredRestaurants: response.data,
                noRecords: false,
                search_input: "",
              });
            }
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            console.log(error.response.data);
          }
        });*/
    }
  };

  render() {
    if (this.state) {
      console.log("render home");
      console.log(this.state);
    }
    let cuisineTag = null;
    let redirectVar = null;
    let messageTag = null;
    let restaurantsTag = null;
    let paginationItemsTag = [];
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }
    console.log("cust" + redirectVar);
    let cusineList = [
      "All",
      "Pizza",
      "Chinese",
      "Indian",
      "Mexican",
      "American",
      "Thai",
      "Burgers",
      "Italian",
      "Stakehouse",
      "Seafood",
      "Korean",
      "Japanese",
      "Breakfast",
      "Sushi",
      "Vietnamese",
      "Sandwiches",
    ];
    cuisineTag = cusineList.map((cuisine) => {
      return (
        <Dropdown.Item href="#" onClick={this.onCuisineSelect}>
          {cuisine}
        </Dropdown.Item>
      );
    });

    let orderTypeList = ["All", "Dine-in", "Delivery", "Pickup"];
    let orderTypeTag = orderTypeList.map((type) => {
      return (
        <Dropdown.Item href="#" onClick={this.onTypeSelect}>
          {type}
        </Dropdown.Item>
      );
    });

    let filteredObjects = [];
    if (this.state && this.state.filteredRestaurants) {
      let count = getPageCount(this.state.filteredRestaurants.length);
      let active = this.state.curPage;
      for (let number = 1; number <= count; number++) {
        paginationItemsTag.push(
          <Pagination.Item key={number} active={number === active}>
            {number}
          </Pagination.Item>
        );
      }
      filteredObjects = getPageObjects(
        this.state.curPage,
        this.state.filteredRestaurants
      );
      restaurantsTag = filteredObjects.map((restaurant) => {
        var imageSrc = `${serverAddress}/yelp/images/restaurant/${restaurant.restaurant_image}`;
        return (
          <Col sm={3}>
            <Link to={{ pathname: "/restaurant", state: restaurant }}>
              <Card bg="white" style={{ width: "18rem", margin: "5%" }}>
                <Card.Img
                  variant="top"
                  style={{ height: "15rem" }}
                  src={imageSrc}
                />
                <Card.Body>
                  <Card.Title>{restaurant.restaurant_name}</Card.Title>
                  <Card.Text>{restaurant.cuisine}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        );
      });
    }
    if (this.state && this.state.noRecords) {
      console.log(" noRecords - ");
      console.log(this.state);
      messageTag = (
        <Alert variant="warning">No Results. Please try again.</Alert>
      );
    }

    let center = null;
    let locList = [];
    if (filteredObjects.length) {
      locList = filteredObjects;
    }
    if (this.state && this.state.center) {
      center = this.state.center;
    }
    var location = {
      address: "1919 Fruitdale Avenue",
      lat: 37.31231,
      lng: -121.92534,
    };
    return (
      <div>
        {redirectVar}
        <div>
          <center>
            <br />
            <h3>Search for restaurants!</h3>
            <br />
            <form onSubmit={this.onSearch}>
              <InputGroup style={{ width: "50%", display: "flex" }} size="lg">
                <FormControl
                  placeholder="Pizza, Indian, Italian..."
                  aria-label="Search Restaurants"
                  aria-describedby="basic-addon2"
                  name="search_input"
                  onChange={this.onChange}
                />
                <Button
                  variant="primary"
                  type="submit"
                  style={{ background: "#d32323" }}
                >
                  Search
                </Button>
              </InputGroup>
              <br />
              <InputGroup style={{ width: "50%", display: "flex" }} size="lg">
                <DropdownButton
                  as={InputGroup.Append}
                  variant="outline-secondary"
                  title="Cuisine"
                  id="input-group-dropdown-2"
                  style={{ float: "right" }}
                >
                  {cuisineTag}
                </DropdownButton>
                &nbsp;&nbsp;
                <DropdownButton
                  as={InputGroup.Append}
                  variant="outline-secondary"
                  title="Mode of Delivery"
                  id="input-group-dropdown-2"
                  style={{ float: "right" }}
                >
                  {orderTypeTag}
                </DropdownButton>
              </InputGroup>
            </form>
            <br />
            <br />
            {messageTag}
            <Row>{restaurantsTag}</Row>
            <center>
              <br />
              <br />
              <Pagination
                onClick={this.onPage}
                style={{ display: "inline-flex" }}
              >
                {paginationItemsTag}
              </Pagination>
            </center>
            <Map locationList={locList} center={location} zoomLevel={10} />
          </center>
        </div>
      </div>
    );
  }
}
//export Home Component
//export default CustomerHome;

CustomerHome.propTypes = {
  getCustomerDetailsHome: PropTypes.func.isRequired,
  searchRestaurantsHome: PropTypes.func.isRequired,
  customer: PropTypes.object.isRequired,
  restaurant: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  customer: state.customerHome.customer,
  restaurant: state.customerHome.restaurant,
});

export default connect(mapStateToProps, {
  getCustomerDetailsHome,
  searchRestaurantsHome,
})(CustomerHome);
