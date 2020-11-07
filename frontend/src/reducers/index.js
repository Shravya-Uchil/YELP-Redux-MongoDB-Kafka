import { combineReducers } from "redux";
import customerProfileReducer from "./customerProfileReducer";
import loginReducer from "./loginReducer";
import signupReducer from "./signupReducer";
import customerHomeReducer from "./customerHomeReducer";
import restaurantHomeReducer from "./restaurantHomeReducer";

export default combineReducers({
  login: loginReducer,
  customerProfile: customerProfileReducer,
  signup: signupReducer,
  customerHome: customerHomeReducer,
  restaurantHome: restaurantHomeReducer,
});
