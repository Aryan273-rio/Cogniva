import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

function Flashcards() {

    const { documentId } = useParams();

    const navigate = useNavigate();

    const [flashcards, setFlashcards] = useState([]);

    const [current, setCurrent] = useState(0);

    const [showAnswer, setShowAnswer] = useState(false);

    const [loading, setLoading] = useState(true);

    const [bookmarkLoading, setBookmarkLoading] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {

        loadFlashcards();

    }, []);

    async function loadFlashcards() {

        try {

            const response = await api.get(

                `/flashcards/${documentId}`

            );

            setFlashcards(

                response.data.flashcards

            );

        }

        catch {

            try {

                const response = await api.post(

                    `/flashcards/generate/${documentId}`

                );

                setFlashcards(

                    response.data.flashcards

                );

            }

            catch (error) {

                setError(

                    error.response?.data?.detail ||

                    "Unable to load flashcards."

                );

            }

        }

        finally {

            setLoading(false);

        }

    }

    async function bookmarkCard() {

        try {

            setBookmarkLoading(true);

            const response = await api.post(

                `/bookmarks/${documentId}/${current}`

            );

            alert(response.data.message);

        }

        catch (error) {

            alert(

                error.response?.data?.detail ||

                "Unable to bookmark flashcard."

            );

        }

        finally {

            setBookmarkLoading(false);

        }

    }

    function nextCard() {

        if (current < flashcards.length - 1) {

            setCurrent(current + 1);

            setShowAnswer(false);

        }

    }

    function previousCard() {

        if (current > 0) {

            setCurrent(current - 1);

            setShowAnswer(false);

        }

    }

    if (loading) {

        return (

            <div className="flashcards-page">

                <h2>

                    Loading Flashcards...

                </h2>

            </div>

        );

    }

    if (error) {

        return (

            <div className="flashcards-page">

                <h2>

                    {error}

                </h2>

            </div>

        );

    }

    const card = flashcards[current];

    return (

        <div className="flashcards-page">

            <div className="flashcards-header">

                <h1>

                    AI Flashcards

                </h1>

                <button

                    onClick={() =>

                        navigate(`/documents/${documentId}`)

                    }

                >

                    Back

                </button>

            </div>

            <div className="flashcard-counter">

                Card {current + 1} of {flashcards.length}

            </div>

            <div

                className="flashcard"

                onClick={() =>

                    setShowAnswer(!showAnswer)

                }

            >

                {

                    !showAnswer

                    ?

                    <>

                        <h2>

                            Question

                        </h2>

                        <p>

                            {card.question}

                        </p>

                        <span>

                            Click to reveal answer

                        </span>

                    </>

                    :

                    <>

                        <h2>

                            Answer

                        </h2>

                        <p>

                            {card.answer}

                        </p>

                        <span>

                            Click to hide answer

                        </span>

                    </>

                }

            </div>

            <div className="flashcard-buttons">

                <button

                    onClick={previousCard}

                    disabled={current === 0}

                >

                    Previous

                </button>

                <button

                    onClick={nextCard}

                    disabled={

                        current === flashcards.length - 1

                    }

                >

                    Next

                </button>

            </div>

            <div className="flashcard-actions">

                <button

                    onClick={bookmarkCard}

                    disabled={bookmarkLoading}

                >

                    {

                        bookmarkLoading

                        ?

                        "Saving..."

                        :

                        "⭐ Bookmark"

                    }

                </button>

                <button

                    onClick={() =>

                        navigate(`/study/${documentId}`)

                    }

                >

                    Study Mode

                </button>

                <button

                    onClick={() =>

                        navigate("/bookmarks")

                    }

                >

                    View Bookmarks

                </button>

            </div>

        </div>

    );

}

export default Flashcards;