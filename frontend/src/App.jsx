import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import UploadDocument from "./pages/UploadDocument";
import DocumentDetails from "./pages/DocumentDetails";

import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";

import Analytics from "./pages/Analytics";
import Chat from "./pages/Chat";

import Flashcards from "./pages/Flashcards";
import StudyMode from "./pages/StudyMode";
import Bookmarks from "./pages/Bookmarks";

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

                <Route
                    path="/quiz/:quizId"
                    element={
                        <ProtectedRoute>
                            <Quiz />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/quiz-result/:quizId"
                    element={
                        <ProtectedRoute>
                            <QuizResult />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/chat/:documentId"
                    element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/flashcards/:documentId"
                    element={
                        <ProtectedRoute>
                            <Flashcards />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/study/:documentId"
                    element={
                        <ProtectedRoute>
                            <StudyMode />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/bookmarks"
                    element={
                        <ProtectedRoute>
                            <Bookmarks />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;