import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import axios from "axios";
import {
  InputGroup,
  FormControl,
  Button,
  Alert,
  Col,
  Row,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import serverAddress from "../../config";
import NavBar from "../LandingPage/Navbar.js";

class Users extends Component {
  constructor(props) {
    super(props);
    this.setState({
      search_input: "",
      noRecords: false,
    });
    this.onFollowSelect = this.onFollowSelect.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      search_input: "",
      noRecords: 0,
    });
    axios.defaults.headers.common["authorization"] = localStorage.getItem(
      "token"
    );
    axios
      .get(`${serverAddress}/yelp/profile/all`)
      .then((response) => {
        console.log("response");
        console.log(response.data);
        if (response.data) {
          if (response.data[0].result === "NO_RECORD") {
            this.setState({
              noRecords: true,
              search: "",
            });
          } else {
            let data = response.data;
            let i = 0;
            let current_id = localStorage.getItem("customer_id");
            for (i = 0; i < data.length; i++) {
              if (data[i]._id === current_id) {
                break;
              }
            }
            data.splice(i, 1);
            this.setState({
              allUsers: data,
              filteredUsers: data,
              // filteredEvents: response.data,
            });
          }
        }
      })
      .catch((error) => {
        console.log("Error");
        console.log(error);
      });
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      noRecords: 0,
    });
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

      //this.props.searchRestaurantsHome(searchInput);
      axios.defaults.headers.common["authorization"] = localStorage.getItem(
        "token"
      );
      axios
        .get(`${serverAddress}/yelp/profile/customer/search/${searchInput}`)
        .then((response) => {
          console.log("resp");
          console.log(response);
          if (response.data) {
            if (response.data === "NO_RECORD") {
              this.setState({
                noRecords: 1,
                filteredUsers: null,
              });
            } else {
              this.setState({
                filteredUsers: response.data,
                noRecords: 0,
                search_input: "",
              });
            }
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            console.log(error.response.data);
          }
        });
    }
  };

  onFollowSelect = (e) => {
    let filter = e.target.text;
    let filteredList = this.state.allUsers;
    let current_id = localStorage.getItem("customer_id");
    if (filter === "All") {
      this.setState({
        noRecords: 0,
      });
    } else if (filter === "Following") {
      filteredList = this.state.allUsers.filter(
        (user) =>
          user.followers.length > 0 && user.followers.indexOf(current_id) != -1
      );
    } else if (filter === "Not Following") {
      filteredList = this.state.allUsers.filter(
        (user) =>
          user.followers.length == 0 ||
          (user.followers.length > 0 &&
            user.followers.indexOf(current_id) === -1)
      );
    }

    this.setState({
      filteredUsers: filteredList,
    });

    if (filteredList && filteredList.length === 0) {
      this.setState({ noRecords: 1 });
    }
  };

  render() {
    let redirectVar = null;
    let messageTag = null;
    let usersTag = null;
    let followTag = null;
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }

    if (this.state && this.state.filteredUsers) {
      console.log("render");

      let followList = ["All", "Following", "Not Following"];
      followTag = followList.map((follow) => {
        return (
          <Dropdown.Item href="#" onClick={this.onFollowSelect}>
            {follow}
          </Dropdown.Item>
        );
      });

      let current_id = localStorage.getItem("customer_id");
      usersTag = this.state.filteredUsers.map((user) => {
        if (user._id != current_id) {
          //console.log(user);
          var imageSrc = `${serverAddress}/yelp/images/customer/${user.cust_image}}`;
          return (
            <Col sm={3}>
              <Card bg="white" style={{ width: "15rem" }}>
                <Link to={{ pathname: "/customercard", state: user }}>
                  <Card.Img
                    variant="top"
                    style={{ height: "15rem" }}
                    src={imageSrc}
                  />
                  <Card.Title>{user.cust_name}</Card.Title>
                </Link>
                <Card.Body>
                  <Card.Text>
                    {user.city} | {user.country}
                  </Card.Text>
                  <Card.Text>{user.nick_name}</Card.Text>
                  <Card.Text>{user.headline}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        }
      });
    }
    if (this.state && this.state.noRecords) {
      console.log(" noRecords - ");
      console.log(this.state);
      messageTag = (
        <Alert variant="warning">No Results. Please try again.</Alert>
      );
      usersTag = null;
    }

    return (
      <div>
        {redirectVar}
        <NavBar />
        <div>
          <center>
            <br />
            <h3>Search for Users!</h3>
            <br />
            <form onSubmit={this.onSearch}>
              <InputGroup style={{ width: "50%", display: "flex" }} size="lg">
                <FormControl
                  placeholder="User..."
                  aria-label="Search Users"
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
                  title="Followers filter"
                  id="input-group-dropdown-2"
                  style={{ float: "right" }}
                >
                  {followTag}
                </DropdownButton>
              </InputGroup>
            </form>
            <br />
            <br />
            {messageTag}
            <Row>{usersTag}</Row>
          </center>
        </div>
      </div>
    );
  }
}
//export Home Component
export default Users;
