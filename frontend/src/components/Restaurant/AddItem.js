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
import { Redirect } from "react-router";
import NavBar from "../LandingPage/Navbar.js";

class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onChange = this.onChange.bind(this);
    //this.onImageChange = this.onImageChange.bind(this);
    this.onAdd = this.onAdd.bind(this);
    //this.onUpload = this.onUpload.bind(this);
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentDidMount() {
    if (this.props.location.state) {
      var item = {
        item_id: this.props.location.state.item_id,
        item_name: this.props.location.state.item_name,
        item_price: this.props.location.state.item_price,
        item_description: this.props.location.state.item_description,
        item_ingredients: this.props.location.state.item_ingredients,
        item_image: this.props.location.state.item_image,
      };

      this.setState(item);
    }
    axios;
    if (this.props.location.state) {
      axios
        .get(
          `http://localhost:3001/yelp/menu/categoryById/${this.props.location.state.category_id}`
        )
        .then((response) => {
          console.log("response");
          console.log(response.data[0]);
          if (response.data[0]) {
            this.setState({
              item_category: response.data[0].category_name,
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
  }

  onAdd = (e) => {
    //prevent page from refresh
    e.preventDefault();
    axios.defaults.withCredentials = true;

    /*let item_id = null;
    let item_name = null;
    let item_price = null;
    let item_description = null;
    let item_ingredients = null;
    let item_image = null;
    let item_category = null;
    if (this.props.location.state) {
      item_id = this.props.location.state.item_id;
      item_name = this.props.location.state.item_name;
      item_price = this.props.location.state.item_price;
      item_description = this.props.location.state.item_description;
      item_ingredients = this.props.location.state.item_ingredients;
      item_image = this.props.location.state.item_image;
    }
    if (this.state.menu_category) {
      item_category = this.state.menu_category.category_name;
    }*/
    var data = {
      restaurant_id: localStorage.getItem("restaurant_id"),
      item_id: this.state.item_id,
      item_name: this.state.item_name,
      item_description: this.state.item_description,
      item_ingredients: this.state.item_ingredients,
      item_price: this.state.item_price,
      item_category: this.state.item_category,
      item_image: this.state.item_image,
    };

    //var data = Object.assign({}, this.state);
    console.log("Add item");
    console.log(data);
    axios
      .post(`http://localhost:3001/yelp/menu/item`, data)
      .then((response) => {
        console.log("Updated item");
        alert("Item Added!");
        this.setState({
          isAddDone: 1,
        });
      })
      .catch((error) => {
        console.log("Error");
        console.log(error);
      });
  };

  render() {
    let redirectVar = null;
    if (!localStorage.getItem("restaurant_id")) {
      redirectVar = <Redirect to="/login" />;
    } else if (this.state.isAddDone) {
      redirectVar = <Redirect to="/home" />;
    }
    /*var item_name = null;
    var item_price = null;
    var item_description = null;
    var item_ingredients = null;
    var item_image = null;
    var item_category = null;

    if (this.props.location.state) {
      item_name = this.state.item_name || this.props.location.state.item_name;
      item_price =
        this.state.item_price || this.props.location.state.item_price;
      item_description =
        this.state.item_description ||
        this.props.location.state.item_description;
      item_ingredients =
        this.state.item_ingredients ||
        this.props.location.state.item_ingredients;
      item_image =
        this.state.item_image || this.props.location.state.item_image;
    }*/
    console.log("render");
    console.log(this.state);
    console.log(this.props.location.state);
    /*if (this.state.menu_category) {
      item_category = this.state.menu_category.category_name;
    }*/
    return (
      <div>
        {redirectVar}
        <NavBar />
        <Container fluid={true}>
          <Row>
            <Col xs={6} md={4}>
              <center>
                <Card style={{ width: "18rem", margin: "5%" }}>
                  <Card.Img
                    variant="top"
                    src="http://localhost:3001/yelp/images/item/item_profile.png"
                  />
                  <Card.Body>
                    <Card.Title>
                      <h3>{this.state.item_name}</h3>
                    </Card.Title>
                  </Card.Body>
                </Card>
                <form onSubmit={this.onUpload}>
                  <br />
                  <br />
                  <div class="item-file" style={{ width: "80%" }}>
                    <input
                      type="file"
                      class="item-file-input"
                      name="item_image"
                      accept="image/*"
                      onChange={this.onImageChange}
                      required
                    />
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
              <h4>Add/Update Item</h4>
              <br />
              <Form onSubmit={this.onAdd}>
                <Form.Row>
                  <Form.Group as={Col} controlId="item_name">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control
                      name="item_name"
                      type="text"
                      pattern="^[A-Za-z0-9 ]+$"
                      required={true}
                      onChange={this.onChange}
                      autocomplete="off"
                      value={this.state.item_name}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="description">
                    <Form.Label>Item Description</Form.Label>
                    <Form.Control
                      name="item_description"
                      type="text"
                      pattern="^[A-Za-z0-9 ]+$"
                      required={true}
                      onChange={this.onChange}
                      autocomplete="off"
                      value={this.state.item_description}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="ingredients">
                    <Form.Label>Item Ingredients</Form.Label>
                    <Form.Control
                      name="item_ingredients"
                      type="text"
                      pattern="^[A-Za-z0-9 ]+$"
                      required={true}
                      onChange={this.onChange}
                      autocomplete="off"
                      value={this.state.item_ingredients}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="price">
                    <Form.Label>Item Price</Form.Label>
                    <Form.Control
                      name="item_price"
                      type="text"
                      pattern="^[A-Za-z0-9 ]+$"
                      required={true}
                      onChange={this.onChange}
                      autocomplete="off"
                      value={this.state.item_price}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="category">
                    <Form.Label>Item Category</Form.Label>
                    <Form.Control
                      name="item_category"
                      type="text"
                      pattern="^[A-Za-z0-9 ]+$"
                      required={true}
                      onChange={this.onChange}
                      autocomplete="off"
                      value={this.state.item_category}
                    />
                  </Form.Group>
                </Form.Row>
                <ButtonGroup aria-label="Third group">
                  <Button
                    type="submit"
                    variant="success"
                    style={{ background: "#d32323" }}
                    id="add"
                  >
                    Add/Update Item
                  </Button>
                </ButtonGroup>
                {"  "}
              </Form>
            </Col>
          </Row>
          <br />
        </Container>
      </div>
    );
  }
}

export default AddItem;
