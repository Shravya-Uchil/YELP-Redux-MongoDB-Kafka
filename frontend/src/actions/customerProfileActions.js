import axios from "axios";
import {
  GET_CUSTOMER,
  UPDATE_CUSTOMER,
  CUSTOMER_CARD,
  FOLLOW_CUSTOMER,
  GET_ALL_CUSTOMER,
  SEARCH_CUSTOMER,
} from "../actionTypes";
import serverAddress from "../config";

export const getCustomerDetails = () => (dispatch) => {
  console.log("get action");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(
      `${serverAddress}/yelp/profile/customer/${localStorage.getItem(
        "email_id"
      )}`
    )
    .then((response) => response.data)
    .then((customer) =>
      dispatch({
        type: GET_CUSTOMER,
        payload: customer,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const updateCustomerDetails = (customerDetails) => (dispatch) => {
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .post(`${serverAddress}/yelp/profile/customer`, customerDetails)
    .then((response) => response.data)
    .then((data) => {
      if (data === "CUSTOMER_UPDATED") {
        alert("Profile Updated Successfully!");
      }
      return dispatch({
        type: UPDATE_CUSTOMER,
        payload: data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getCustomerCard = (customerId) => (dispatch) => {
  console.log("get action");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(`${serverAddress}/yelp/profile/customerById/${customerId}`)
    .then((response) => response.data)
    .then((customer) =>
      dispatch({
        type: CUSTOMER_CARD,
        payload: customer,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const followCustomer = (customerData) => (dispatch) => {
  console.log("follow customer action");
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .post(`${serverAddress}/yelp/profile/followCustomer`, customerData)
    .then((response) => response.data)
    .then((data) => {
      if (data === "CUSTOMER_FOLLOWED") {
        alert("Following");
      }
      return dispatch({
        type: FOLLOW_CUSTOMER,
        payload: data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getAllCustomers = () => (dispatch) => {
  console.log("get all customers");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(`${serverAddress}/yelp/profile/all`)
    .then((response) => response.data)
    .then((allCustomers) =>
      dispatch({
        type: GET_ALL_CUSTOMER,
        payload: allCustomers,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const searchForCustomers = (searchInput) => (dispatch) => {
  console.log("search customers");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(`${serverAddress}/yelp/profile/customer/search/${searchInput}`)
    .then((response) => response.data)
    .then((searchCustomers) =>
      dispatch({
        type: SEARCH_CUSTOMER,
        payload: searchCustomers,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};
