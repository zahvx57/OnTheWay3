// Admin.test.js
import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import Admin from "./Admin";

const mockStore = configureStore([]);

describe("Admin Component Snapshot", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      users: { user: { email: "admin@test.com", adminFlag: "Y" }, message: "" },
      theme: { mode: "light" },
    });

    // Mock fetch
    global.fetch = jest.fn((url) => {
      if (url.endsWith("/places")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { _id: "1", name: "Place One", city: "City One" },
              { _id: "2", name: "Place Two", city: "City Two" },
            ]),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });
  });

  afterEach(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it("renders correctly and matches snapshot", async () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Admin />
        </BrowserRouter>
      </Provider>
    );

    // انتظر حتى تظهر الخيارات في select بعد fetch
    await waitFor(() => screen.getByText("Place One"));
    await waitFor(() => screen.getByText("Place Two"));

    expect(asFragment()).toMatchSnapshot();
  });
});
