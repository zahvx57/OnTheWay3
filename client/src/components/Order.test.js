// Order.test.js
import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import Order from "./Order";

const mockStore = configureStore([]);

describe("Order Component Snapshot", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      users: { user: { email: "test@example.com" } },
      selectedDelegate: {
        delegate: {
          name: "Test Delegate",
          phone: "123456789",
          fee: 2.5,
          placeName: "Test Place",
          userLocation: { lat: 23.61, lng: 58.59 },
        },
      },
      theme: { mode: "light" },
    });
  });

  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Order />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
