import {

  BrowserRouter,

  Routes,

  Route

} from "react-router-dom";


import Navbar from "./components/Navbar";

import ProtectedRoute from "./components/ProtectedRoute";


import Home from "./pages/Home";

import Login from "./pages/Login";

import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";

import Documents from "./pages/Documents";

import UploadDocument from "./pages/UploadDocument";

import DocumentDetails from "./pages/DocumentDetails";


function App() {

  return (

    <BrowserRouter>


      <Navbar />


      <Routes>


        <Route

          path="/"

          element={<Home />}

        />


        <Route

          path="/login"

          element={<Login />}

        />


        <Route

          path="/register"

          element={<Register />}

        />


        <Route

          path="/dashboard"

          element={

            <ProtectedRoute>

              <Dashboard />

            </ProtectedRoute>

          }

        />


        <Route

          path="/documents"

          element={

            <ProtectedRoute>

              <Documents />

            </ProtectedRoute>

          }

        />


        <Route

          path="/upload"

          element={

            <ProtectedRoute>

              <UploadDocument />

            </ProtectedRoute>

          }

        />


        <Route

          path="/documents/:documentId"

          element={

            <ProtectedRoute>

              <DocumentDetails />

            </ProtectedRoute>

          }

        />


      </Routes>


    </BrowserRouter>

  );

}


export default App;