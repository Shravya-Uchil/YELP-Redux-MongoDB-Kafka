import { combineReducers } from "redux";
import customerProfileReducer from "./customerProfileReducer";
import loginReducer from "./loginReducer";
import signupReducer from "./signupReducer";
import customerHomeReducer from "./customerHomeReducer";
import restaurantHomeReducer from "./restaurantHomeReducer";
import messageReducer from "./messageReducer";
import restaurantOrderReducer from "./restaurantOrderReducer";
import eventReducer from "./eventReducer";
import customerRestaurantReducer from "./customerRestaurantReducer";

export default combineReducers({
  login: loginReducer,
  customerProfile: customerProfileReducer,
  signup: signupReducer,
  customerHome: customerHomeReducer,
  restaurantHome: restaurantHomeReducer,
  messages: messageReducer,
  restaurantOrder: restaurantOrderReducer,
  customerRestaurant: customerRestaurantReducer,
  event: eventReducer,
});
