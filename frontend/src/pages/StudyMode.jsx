import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

function StudyMode() {

    const { documentId } = useParams();

    const navigate = useNavigate();

    const [flashcards, setFlashcards] = useState([]);

    const [current, setCurrent] = useState(0);

    const [showAnswer, setShowAnswer] = useState(false);

    const [completed, setCompleted] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        fetchFlashcards();

    }, []);

    async function fetchFlashcards() {

        try {

            const response = await api.get(

                `/flashcards/${documentId}`

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

        finally {

            setLoading(false);

        }

    }

    function revealAnswer() {

        setShowAnswer(true);

    }

    function nextCard() {

        if (current < flashcards.length - 1) {

            setCompleted(previous => [

                ...new Set([...previous, current])

            ]);

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

    function restartStudy() {

        setCurrent(0);

        setCompleted([]);

        setShowAnswer(false);

    }

    if (loading) {

        return (

            <div className="study-page">

                <h2>

                    Loading Study Mode...

                </h2>

            </div>

        );

    }

    if (error) {

        return (

            <div className="study-page">

                <h2>

                    {error}

                </h2>

            </div>

        );

    }

    const card = flashcards[current];

    const progress = Math.round(

        ((completed.length + (showAnswer ? 1 : 0)) /

        flashcards.length) * 100

    );

    return (

        <div className="study-page">

            <div className="study-header">

                <h1>

                    Study Mode

                </h1>

                <button

                    onClick={() =>

                        navigate(`/flashcards/${documentId}`)

                    }

                >

                    Exit

                </button>

            </div>

            <div className="study-progress">

                <div className="progress-bar">

                    <div

                        className="progress-fill"

                        style={{

                            width: `${progress}%`

                        }}

                    ></div>

                </div>

                <p>

                    {progress}% Completed

                </p>

            </div>

            <div className="study-card">

                <h2>

                    Card {current + 1} of {flashcards.length}

                </h2>

                <h3>

                    {card.question}

                </h3>

                {

                    showAnswer && (

                        <div className="study-answer">

                            <h4>

                                Answer

                            </h4>

                            <p>

                                {card.answer}

                            </p>

                        </div>

                    )

                }

            </div>

            <div className="study-controls">

                <button

                    onClick={previousCard}

                    disabled={current === 0}

                >

                    Previous

                </button>

                {

                    !showAnswer

                    ?

                    <button

                        onClick={revealAnswer}

                    >

                        Reveal Answer

                    </button>

                    :

                    <button

                        onClick={nextCard}

                        disabled={

                            current === flashcards.length - 1

                        }

                    >

                        Next

                    </button>

                }

            </div>

            {

                current === flashcards.length - 1 &&

                showAnswer && (

                    <div className="study-finished">

                        <h2>

                            🎉 Study Session Completed

                        </h2>

                        <button

                            onClick={restartStudy}

                        >

                            Study Again

                        </button>

                    </div>

                )

            }

        </div>

    );

}

export default StudyMode;