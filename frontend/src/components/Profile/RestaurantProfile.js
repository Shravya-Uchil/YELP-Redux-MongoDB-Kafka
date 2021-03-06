import React, { Component } from "react";
import axios from "axios";
import {
  Container,
  Col,
  Row,
  Form,
  Button,
  ButtonGroup,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import serverAddress from "../../config";

class RestaurantProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentWillMount() {
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
        var resData = {
          restaurant_id: response.data._id,
          restaurant_name:
            response.data.restaurant_name || this.state.restaurant_name,
          email_id: response.data.email_id || this.state.email_id,
          phone_number: response.data.phone_number || this.state.phone_number,
          description: response.data.description || this.state.description,
          zip_code: response.data.zip_code || this.state.zip_code,
          curbside_pickup:
            response.data.curbside_pickup || this.state.curbside_pickup,
          dine_in: response.data.dine_in || this.state.dine_in,
          yelp_delivery:
            response.data.yelp_delivery || this.state.yelp_delivery,
          cuisine: response.data.cuisine || this.state.cuisine,
          restaurant_image:
            response.data.restaurant_image || this.state.restaurant_image,
        };
        this.setState(resData);
        console.log("State:", this.state);
      })
      .catch((error) => {
        console.log("error:");
        console.log(error);
      });
  }

  onUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("res_image", this.state.file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios.defaults.headers.common["authorization"] = localStorage.getItem(
      "token"
    );
    axios
      .post(
        `${serverAddress}/yelp/images/restaurant/${localStorage.getItem(
          "restaurant_id"
        )}`,
        formData,
        config
      )
      .then((response) => {
        alert("Image uploaded successfully!");
        this.setState({
          file_text: "Choose file...",
          restaurant_image: response.data,
        });
      })
      .catch((err) => {
        console.log("Error");
      });
  };

  onImageChange = (e) => {
    this.setState({
      file: e.target.files[0],
      file_text: e.target.files[0].name,
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onRefresh = (e) => {
    if (this.state.curbside_pickup) {
      document.getElementById("curbside_pickup").checked = true;
    }
    if (this.state.dine_in) {
      document.getElementById("dine_in").checked = true;
    }
    if (this.state.yelp_delivery) {
      document.getElementById("yelp_delivery").checked = true;
    }
  };

  onUpdate = (e) => {
    //prevent page from refresh
    e.preventDefault();
    axios.defaults.withCredentials = true;
    let data = Object.assign({}, this.state);
    if (document.getElementById("curbside_pickup").checked === true) {
      data.curbside_pickup = 1;
    } else {
      data.curbside_pickup = 0;
    }

    if (document.getElementById("dine_in").checked === true) {
      data.dine_in = 1;
    } else {
      data.dine_in = 0;
    }

    if (document.getElementById("yelp_delivery").checked === true) {
      data.yelp_delivery = 1;
    } else {
      data.yelp_delivery = 0;
    }
    console.log("data");
    console.log(data);
    axios.defaults.headers.common["authorization"] = localStorage.getItem(
      "token"
    );
    axios
      .post(`${serverAddress}/yelp/profile/restaurant`, data)
      .then((response) => {
        console.log("Updated done");
        console.log(response);
        if (response.status === 200 && response.data === "RESTAURANT_UPDATED") {
          console.log("Updated");
          alert("Updated profile");
          document.getElementById("update").blur();
        }
      })
      .catch((error) => {
        console.log("Error");
        console.log(error);
      });
  };

  render() {
    var fileText = this.state.file_text || "Choose image..";
    if (this.state) {
      var imageSrc = `${serverAddress}/yelp/images/restaurant/${this.state.restaurant_image}`;
    }
    this.onRefresh();
    return (
      <div>
        <Container fluid={true}>
          <Row>
            <Col xs={6} md={4}>
              <center>
                <br />
                <br />
                <Card style={{ width: "18rem" }}>
                  <Card.Img variant="top" src={imageSrc} />
                  <Card.Body>
                    <Card.Title>
                      <h3>{this.state.restaurant_name}</h3>
                    </Card.Title>
                  </Card.Body>
                </Card>
                <form onSubmit={this.onUpload}>
                  <br />
                  <div class="custom-file" style={{ width: "80%" }}>
                    <input
                      type="file"
                      class="custom-file-input"
                      name="res_image"
                      accept="image/*"
                      onChange={this.onImageChange}
                      required
                    />
                    <label class="custom-file-label" for="res_image">
                      {fileText}
                    </label>
                  </div>
                  <br />
                  <br />
                  <Button
                    type="submit"
                    variant="primary"
                    style={{ background: "#d32323" }}
                  >
                    Upload
                  </Button>
                </form>
              </center>
            </Col>
            <Col style={{ margin: "2%" }}>
              <h4>Profile</h4>
              <br />
              <Form onSubmit={this.onUpdate}>
                <Form.Row>
                  <Form.Group as={Col} controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      name="restaurant_name"
                      type="text"
                      onChange={this.onChange}
                      value={this.state.restaurant_name}
                      pattern="^[A-Za-z0-9 ]+$"
                      required={true}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="desc">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      name="description"
                      type="text"
                      onChange={this.onChange}
                      value={this.state.description}
                      pattern="^[A-Za-z ]+$"
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="email_id">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email_id"
                      value={this.state.email_id}
                      disabled
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="zip_code">
                    <Form.Label>ZIP Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="zip_code"
                      onChange={this.onChange}
                      value={this.state.zip_code}
                      pattern="^[0-9]+"
                      required={true}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="phone_number">
                    <Form.Label>Contact Info</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone_number"
                      onChange={this.onChange}
                      value={this.state.phone_number}
                      required={true}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="cuisine">
                    <Form.Label>Cuisine</Form.Label>
                    <Form.Control
                      type="text"
                      name="cuisine"
                      onChange={this.onChange}
                      value={this.state.cuisine}
                      required={true}
                      placeholder="american, indian, chinese"
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="delivery">
                    <Form.Label>Delivery type</Form.Label>
                    <br />
                    Curbside Pickup
                    <input
                      type="checkbox"
                      name="curbside_pickup"
                      id="curbside_pickup"
                      value="curbside_pickup"
                      style={{ margin: "0 10px 0 3px" }}
                    />
                    Dine in
                    <input
                      type="checkbox"
                      name="dine_in"
                      id="dine_in"
                      value="dine_in"
                      style={{ margin: "0 10px 0 3px" }}
                    />
                    Yelp Delivery
                    <input
                      type="checkbox"
                      name="yelp_delivery"
                      id="yelp_delivery"
                      value="yelp_delivery"
                      style={{ margin: "0 10px 0 3px" }}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="RB.password">
                    <Form.Label>Change Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      onChange={this.onChange}
                      placeholder="New Password"
                    />
                  </Form.Group>
                </Form.Row>
                <br />
                <ButtonGroup aria-label="Third group">
                  <Button
                    type="submit"
                    variant="success"
                    style={{ background: "#d32323" }}
                    id="update"
                  >
                    Save Changes
                  </Button>
                </ButtonGroup>
                {"  "}
                <ButtonGroup aria-label="Fourth group">
                  <Link to="/home">Cancel</Link>
                </ButtonGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default RestaurantProfile;
