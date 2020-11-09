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
  Pagination,
} from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import serverAddress from "../../config";
import { getPageCount, getPageObjects } from "../../pageutils";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getAllEvents,
  getRegisteredEvents,
  searchEvents,
} from "../../actions/eventActions";

class CustomerEvent extends Component {
  constructor(props) {
    super(props);
    this.setState({
      search_input: "",
      noRecords: 0,
      curPage: 1,
    });

    this.onChange = this.onChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.MyEvents = this.MyEvents.bind(this);
    this.getRegisteredEvents = this.getRegisteredEvents.bind(this);
    this.onSort = this.onSort.bind(this);
    this.onPage = this.onPage.bind(this);
    //this.onCuisineSelect = this.onCuisineSelect.bind(this);

    this.getRegisteredEvents();
  }

  onPage = (e) => {
    console.log(e.target);
    console.log(e.target.text);
    this.setState({
      curPage: e.target.text,
    });
  };

  getRegisteredEvents = () => {
    this.props.getRegisteredEvents(localStorage.getItem("customer_id"));
    /*axios.defaults.headers.common["authorization"] = localStorage.getItem(
      "token"
    );
    axios
      .get(
        `${serverAddress}/yelp/event/customer/registration/${localStorage.getItem(
          "customer_id"
        )}`
      )
      .then((response) => {
        var cuisines = [];
        console.log("registration response");
        console.log(response.data);
        if (response.data) {
          if (response.data[0].result === "NO_RECORD") {
            console.log("No registrations");
          } else {
            this.setState({
              registrations: response.data,
            });
          }
        }
      })
      .catch((error) => {
        console.log("Error");
        console.log(error);
      });*/
  };

  componentDidMount() {
    this.setState({
      curPage: 1,
    });
    this.props.getAllEvents();

    /*axios.defaults.headers.common["authorization"] = localStorage.getItem(
      "token"
    );
    axios
      .get(`${serverAddress}/yelp/event/all`)
      .then((response) => {
        var cuisines = [];
        console.log("response");
        console.log(response.data);
        if (response.data) {
          if (response.data[0].result === "NO_RECORD") {
            this.setState({
              noRecords: true,
              search: "",
            });
          } else {
            this.setState({
              allEvents: response.data,
              filteredEvents: response.data,
              curPage: 1,
            });
          }
        }
      })
      .catch((error) => {
        console.log("Error");
        console.log(error);
      });*/
  }

  onSearch = (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    if (this.state) {
      var searchInput =
        typeof this.state.search_input === "undefined" ||
        this.state.search_input === ""
          ? "_"
          : this.state.search_input;
      this.props.searchEvents(searchInput);
      /*axios.defaults.headers.common["authorization"] = localStorage.getItem(
        "token"
      );
      axios
        .get(`${serverAddress}/yelp/event/${searchInput}`)
        .then((response) => {
          if (response.data) {
            if (response.data[0].result === "NO_RECORD") {
              this.setState({
                noRecord: true,
                search_input: searchInput,
                filteredEvents: this.state.allEvents,
              });
            } else {
              this.setState({
                filteredEvents: response.data,
                noRecord: false,
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
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      noRecords: false,
    });
  };

  MyEvents = (e) => {
    console.log("Myevents");
    if (this.state.registrations) {
      console.log("Here");
      this.setState({
        filteredEvents: this.state.registrations,
      });
    } else {
      this.setState({
        noRecords: true,
      });
    }
  };

  onSort = (e) => {
    let filter = e.target.text;
    let filteredList = this.state.allEvents;
    console.log("all events");
    console.log(this.state.allEvents);
    if (filter === "Descending") {
      filteredList.sort(function (a, b) {
        return new Date(b.event_date) - new Date(a.event_date);
      });
      this.setState({
        filteredEvents: filteredList,
      });
    } else if (filter === "Ascending") {
      filteredList.sort(function (a, b) {
        return new Date(a.event_date) - new Date(b.event_date);
      });
      this.setState({
        filteredEvents: filteredList,
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    console.log(
      "We in Customer events props received, next prop is: ",
      nextProps
    );
    if (nextProps.event) {
      if (nextProps.event.result === "NO_RECORD") {
        console.log("Events response no record");
        console.log(nextProps);
        this.setState({
          noRecord: 1,
          search_input: "",
        });
      } else {
        this.setState({
          allEvents: nextProps.event,
          filteredEvents: nextProps.event,
        });
      }
    } else if (nextProps.filtered) {
      console.log("search response");
      console.log(nextProps);
      if (nextProps.filtered.result === "NO_RECORD") {
        console.log("search response no record");
        console.log(nextProps);
        this.setState({
          noRecord: 1,
          search_input: "",
          filteredEvents: this.state.allEvents,
        });
      } else {
        this.setState({
          filteredEvents: nextProps.filtered,
          allEvents: nextProps.filtered,
          noRecord: 0,
          search_input: "",
        });
      }
    } else if (nextProps.registered) {
      console.log("registered response");
      console.log(nextProps);
      if (nextProps.registered.result === "NO_RECORD") {
        console.log("registered response no record");
      } else {
        this.setState({
          registrations: nextProps.registered,
        });
      }
    } else {
      console.log("Redux error. Props:");
      console.log(nextProps);
    }
  }

  render() {
    let redirectVar = null;
    let messageTag = null;
    let eventsTag = null;
    let myEventsTag = null;
    let paginationItemsTag = [];
    if (!cookie.load("cookie")) {
      redirectVar = <Redirect to="/login" />;
    }

    myEventsTag = (
      <Button
        variant="success"
        name="order"
        onClick={this.MyEvents}
        style={{ background: "#d32323" }}
      >
        Registered events
      </Button>
    );

    let sortList = ["Ascending", "Descending"];
    let sortTag = sortList.map((sort) => {
      return (
        <Dropdown.Item href="#" onClick={this.onSort}>
          {sort}
        </Dropdown.Item>
      );
    });

    if (this.state && this.state.filteredEvents) {
      console.log("render");

      let count = getPageCount(this.state.filteredEvents.length);
      let active = this.state.curPage;
      for (let number = 1; number <= count; number++) {
        paginationItemsTag.push(
          <Pagination.Item key={number} active={number === active}>
            {number}
          </Pagination.Item>
        );
      }
      let filteredEvents = getPageObjects(
        this.state.curPage,
        this.state.filteredEvents
      );

      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      eventsTag = filteredEvents.map((event) => {
        let date = new Date(event.event_date);
        console.log(event);
        var imageSrc = `${serverAddress}/yelp/images/event/${event.event_image}`;
        return (
          <Col sm={3}>
            <Card bg="white" style={{ width: "18rem" }}>
              <Link to={{ pathname: "/eventdetails", state: event }}>
                <Card.Img
                  variant="top"
                  style={{ height: "15rem" }}
                  src={imageSrc}
                />
                <Card.Title>{event.event_name}</Card.Title>
              </Link>
              <Card.Body>
                <Card.Text>
                  {date.toLocaleDateString(undefined, options)}
                </Card.Text>
                <Card.Text>{event.event_description}</Card.Text>
              </Card.Body>
            </Card>
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
      eventsTag = null;
    }

    return (
      <div>
        {redirectVar}
        <div>
          <center>
            <br />
            <h3>Search for Events!</h3>
            <br />
            <form onSubmit={this.onSearch}>
              <InputGroup style={{ width: "50%", display: "flex" }} size="lg">
                <FormControl
                  placeholder="Event..."
                  aria-label="Search Events"
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
                {myEventsTag}
                &nbsp;&nbsp;
                <DropdownButton
                  as={InputGroup.Append}
                  variant="outline-secondary"
                  title="Sort Events"
                  id="input-group-dropdown-2"
                  style={{ float: "right" }}
                >
                  {sortTag}
                </DropdownButton>
              </InputGroup>
            </form>
            <br />
            <br />
            {messageTag}
            <Row>{eventsTag}</Row>

            <br />
            <br />
            <Pagination
              onClick={this.onPage}
              style={{ display: "inline-flex" }}
            >
              {paginationItemsTag}
            </Pagination>
          </center>
        </div>
      </div>
    );
  }
}

CustomerEvent.propTypes = {
  getRegisteredEvents: PropTypes.func.isRequired,
  searchEvents: PropTypes.func.isRequired,
  getAllEvents: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  filtered: PropTypes.object.isRequired,
  registered: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  event: state.event.event,
  filtered: state.event.filtered,
  registered: state.event.registered,
});

export default connect(mapStateToProps, {
  getRegisteredEvents,
  searchEvents,
  getAllEvents,
})(CustomerEvent);

//export Home Component
//export default CustomerEvent;
