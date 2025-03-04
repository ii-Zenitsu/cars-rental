
const initialState = {
  user: null,
  cars: [],
  clients: [],
  contracts: [],
};


const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_USER":
      return { ...state, user: action.payload };
    case "UPDATE_CARS":
      return { ...state, cars: action.payload };
    case "UPDATE_CLIENTS":
      return { ...state, clients: action.payload };
    case "UPDATE_CONTRACTS":
      return { ...state, contracts: action.payload };
    default:
      return state;
  }
};

export default storeReducer;
