import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Header from "./components/header";
import PollSkeleton from "./components/poll-skeleton";
import ErrorPage from "./error-page";
import { loader as pollLoader } from "./loaders/poll";
import Poll from "./routes/poll";
import PollResults from "./routes/poll-results";
import Root from "./routes/root";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/poll/:pollId",
    element: <Poll />,
    errorElement: <ErrorPage />,
    loader: pollLoader,
  },
  {
    path: "/poll/:pollId/results",
    element: <PollResults />,
    errorElement: <ErrorPage />,
    loader: pollLoader,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Header></Header>
    <RouterProvider
      router={router}
      fallbackElement={<PollSkeleton/>}
    />
  </React.StrictMode>
);
