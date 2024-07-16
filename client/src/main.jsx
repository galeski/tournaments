import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "./App";
import Tournament from "./components/Tournament";
import TournamentList from "./components/TournamentList";
import TournamentView from "./components/TournamentView";
import Answer from './components/Answer';
import AnswerList from "./components/AnswerList";
import Login from "./components/Login";
import Register from './components/Register';
import Score from './components/Score';
import ScoreView from "./components/ScoreView";
import ResultView from "./components/ResultView";
import "./index.css";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute><TournamentList /></ProtectedRoute>,
      },
      {
        path: "/answers",
        element: <ProtectedRoute><AnswerList /></ProtectedRoute>,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/create",
    element: <App />,
    children: [
      {
        path: "/create",
        element: <ProtectedRoute><Tournament /></ProtectedRoute>,
      },
    ],
  },
  {
    path: "/edit/:id",
    element: <App />,
    children: [
      {
        path: "/edit/:id",
        element: <ProtectedRoute><Tournament /></ProtectedRoute>,
      },
    ],
  },
  {
    path: "/view/:id",
    element: <App />,
    children: [
      {
        path: "/view/:id",
        element: <ProtectedRoute><TournamentView /></ProtectedRoute>,
      },
    ],
  },
  // maybe I should add a more robust solution here
  {
    path: "/answer/:id",
    element: <App />,
    children: [
      {
        path: "/answer/:id",
        element: <Answer />,
      },
    ],
  },
  {
    path: "/answers/:id",
    element: <App />,
    children: [
      {
        path: "/answers/:id",
        element: <ProtectedRoute><AnswerList /></ProtectedRoute>,
      },
    ],
  },
  {
    path: "/score/:id",
    element: <App />,
    children: [
      {
        path: "/score/:id",
        element: <ProtectedRoute><Score /></ProtectedRoute>,
      },
    ],
  },
  {
    path: "/scores/:id",
    element: <App />,
    children: [
      {
        path: "/scores/:id",
        element: <ProtectedRoute><ScoreView /></ProtectedRoute>,
      },
    ],
  },
  {
    path: "/result/:id",
    element: <App />,
    children: [
      {
        path: "/result/:id",
        element: <ProtectedRoute><ResultView /></ProtectedRoute>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);