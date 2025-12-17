// Favorite.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import Favorite from "./Favorite";

const mockStore = configureStore([]);

describe("Favorite Component Snapshot", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      users: { user: { email: "test@example.com" } },
      favorites: {
        list: [
          {
            id: "1",
            name: "Delegate One",
            phone: "123456789",
            fee: 10,
            placeName: "Place A",
            avatar: "avatar1.png",
          },
          {
            id: "2",
            name: "Delegate Two",
            phone: "987654321",
            fee: 15,
            placeName: "Place B",
            avatar: "avatar2.png",
          },
        ],
      },
      theme: { mode: "light" },
    });
  });

  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Favorite />
        </BrowserRouter>
      </Provider>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("shows favorite delegates", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Favorite />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Delegate One")).toBeInTheDocument();
    expect(screen.getByText("Delegate Two")).toBeInTheDocument();
    expect(screen.getByText("📍 Place A")).toBeInTheDocument();
    expect(screen.getByText("📍 Place B")).toBeInTheDocument();
  });
});
