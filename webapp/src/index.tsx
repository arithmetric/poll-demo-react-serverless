import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import ErrorPage from "./error-page";
import { loader as pollLoader } from "./loaders/poll";
import Poll from "./routes/poll";
import PollResults from "./routes/poll-results";
import Root from "./routes/root";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/poll/:pollId",
    element: <Poll />,
    loader: pollLoader,
  },
  {
    path: "/poll/:pollId/results",
    element: <PollResults />,
    loader: pollLoader,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
