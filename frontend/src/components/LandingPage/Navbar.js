import React, { Component } from "react";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import { customerLogout } from "../../actions/loginActions";
import { connect } from "react-redux";

//create the Navbar Component
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }
  //handle logout to destroy the cookie
  handleLogout = () => {
    console.log("Logout");
    cookie.remove("cookie", { path: "/" });
    this.props.customerLogout();
  };
  render() {
    //if Cookie is set render Logout Button
    let navLogin = null;
    if (cookie.load("cookie")) {
      console.log("Able to read cookie");
      let ordersTab = null;
      if (localStorage.getItem("customer_id")) {
        ordersTab = (
          <Link to="/customerorderhistory" id="login-link">
            Orders
          </Link>
        );
      } else {
        ordersTab = (
          <Link to="/restaurantorders" id="login-link">
            Orders
          </Link>
        );
      }
      let usersTab = null;
      if (localStorage.getItem("customer_id")) {
        usersTab = (
          <Link to="/users" id="login-link">
            Users
          </Link>
        );
      }
      navLogin = (
        <ul
          className="nav navbar-nav navbar-right d-flex flex-row"
          id="login-icon"
        >
          <li>
            <Link to="/profile" id="login-link">
              Profile
            </Link>
          </li>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <li>
            <Link to="/event" id="login-link">
              Events
            </Link>
          </li>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <li>{ordersTab}</li>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <li>{usersTab}</li>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <li>
            <Link to="/messages" id="login-link">
              Messages
            </Link>
          </li>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <li>
            <Link to="/" id="login-link" onClick={this.handleLogout}>
              <span className="glyphicon glyphicon-user"></span>Logout
            </Link>
          </li>
        </ul>
      );
    } else {
      //Else display login button
      localStorage.clear();
      console.log("Not Able to read cookie");
      navLogin = (
        <ul className="nav navbar-nav navbar-right" id="login-icon">
          <li>
            <Link to="/login" id="login-link">
              <span className="glyphicon glyphicon-log-in"></span> Login
            </Link>
          </li>
        </ul>
      );
    }
    return (
      <div>
        <nav className="navbar navbar-inverse" id="nav-fluid">
          <div className="container-fluid" id="nav-fluid">
            <div className="navbar-header" id="nav-div">
              <a className="navbar-brand navbar-left">
                <Link to="/home" id="login-link">
                  Yelp
                </Link>
              </a>
            </div>
            {navLogin}
          </div>
        </nav>
      </div>
    );
  }
}

export default connect(null, { customerLogout })(Navbar);
