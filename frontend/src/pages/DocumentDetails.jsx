import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import api from "../services/api";

function DocumentDetails() {

    const { documentId } = useParams();

    const navigate = useNavigate();

    const [document, setDocument] = useState(null);

    const [loading, setLoading] = useState(true);

    const [summaryLoading, setSummaryLoading] = useState(false);

    const [quizLoading, setQuizLoading] = useState(false);

    const [flashcardLoading, setFlashcardLoading] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {

        fetchDocument();

    }, []);

    async function fetchDocument() {

        try {

            const response = await api.get(

                `/documents/${documentId}`

            );

            setDocument(response.data);

        }

        catch (error) {

            setError(

                error.response?.data?.detail ||

                "Unable to load document."

            );

        }

        finally {

            setLoading(false);

        }

    }

    async function generateSummary() {

        try {

            setSummaryLoading(true);

            const response = await api.post(

                `/ai/summary/${documentId}`

            );

            setDocument({

                ...document,

                summary: response.data.summary

            });

        }

        catch (error) {

            alert(

                error.response?.data?.detail ||

                "Unable to generate summary."

            );

        }

        finally {

            setSummaryLoading(false);

        }

    }

    async function generateQuiz() {

        try {

            setQuizLoading(true);

            const response = await api.post(

                `/quiz/generate/${documentId}`

            );

            navigate(

                `/quiz/${response.data.quiz_id}`

            );

        }

        catch (error) {

            alert(

                error.response?.data?.detail ||

                "Unable to generate quiz."

            );

        }

        finally {

            setQuizLoading(false);

        }

    }

    async function openFlashcards() {

        try {

            setFlashcardLoading(true);

            await api.post(

                `/flashcards/generate/${documentId}`

            );

        }

        catch {

            // Ignore if already generated

        }

        finally {

            setFlashcardLoading(false);

            navigate(

                `/flashcards/${documentId}`

            );

        }

    }

    function openChat() {

        navigate(

            `/chat/${documentId}`

        );

    }

    if (loading) {

        return (

            <div className="document-page">

                <h2>

                    Loading Document...

                </h2>

            </div>

        );

    }

    if (error) {

        return (

            <div className="document-page">

                <h2>

                    {error}

                </h2>

            </div>

        );

    }

    return (

        <div className="document-page">

            <Link

                className="back-link"

                to="/documents"

            >

                ← Back to Documents

            </Link>

            <h1 className="document-title">

                {document.filename}

            </h1>

            <div className="summary-section">

                <div className="section-header">

                    <h2>

                        AI Summary

                    </h2>

                    {

                        !document.summary && (

                            <button

                                onClick={generateSummary}

                                disabled={summaryLoading}

                            >

                                {

                                    summaryLoading

                                    ?

                                    "Generating..."

                                    :

                                    "Generate Summary"

                                }

                            </button>

                        )

                    }

                </div>

                <div className="summary-box">

                    {

                        document.summary

                        ?

                        <pre>

                            {document.summary}

                        </pre>

                        :

                        <p>

                            No summary generated.

                        </p>

                    }

                </div>

            </div>

            <div className="quiz-section">

                <h2>

                    AI Quiz

                </h2>

                <button

                    onClick={generateQuiz}

                    disabled={quizLoading}

                >

                    {

                        quizLoading

                        ?

                        "Generating Quiz..."

                        :

                        "Generate Quiz"

                    }

                </button>

            </div>

            <div className="quiz-section">

                <h2>

                    AI Tutor

                </h2>

                <button

                    onClick={openChat}

                >

                    Open AI Chat

                </button>

            </div>

            <div className="quiz-section">

                <h2>

                    AI Flashcards

                </h2>

                <p>

                    Generate interactive flashcards for quick revision.

                </p>

                <button

                    onClick={openFlashcards}

                    disabled={flashcardLoading}

                >

                    {

                        flashcardLoading

                        ?

                        "Generating..."

                        :

                        "Open Flashcards"

                    }

                </button>

            </div>

            <div className="text-section">

                <h2>

                    Extracted Text

                </h2>

                <div className="text-box">

                    <pre>

                        {document.text}

                    </pre>

                </div>

            </div>

        </div>

    );

}

export default DocumentDetails;