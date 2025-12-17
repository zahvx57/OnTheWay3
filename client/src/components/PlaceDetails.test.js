import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import PlaceDetails from "./PlaceDetails";


const mockStore = configureStore([]);
const store = mockStore({
  places: { place: { name: "Place One" }, delegates: [{ name: "Delegate One" }] },
});

describe("PlaceDetails Snapshot", () => {
  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <PlaceDetails />
        </BrowserRouter>
      </Provider>
    );


    expect(asFragment()).toMatchSnapshot();
  });
});
