import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import QuestionCard from "../components/QuestionCard";

function Quiz() {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchQuiz();
    }, []);

    async function fetchQuiz() {
        try {
            const response = await api.get(`/quiz/${quizId}`);

            setQuestions(response.data.questions);

            setAnswers(
                new Array(response.data.questions.length).fill("")
            );
        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "Unable to load quiz."
            );
        } finally {
            setLoading(false);
        }
    }

    function selectAnswer(option) {
        const updated = [...answers];
        updated[currentQuestion] = option;
        setAnswers(updated);
    }

    function nextQuestion() {
        if (!answers[currentQuestion]) {
            alert("Please select an answer.");
            return;
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    }

    function previousQuestion() {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    }

    async function submitQuiz() {
        if (!answers[currentQuestion]) {
            alert("Please select an answer.");
            return;
        }

        setSubmitting(true);

        try {
            const response = await api.post(
                `/quiz/submit/${quizId}`,
                {
                    answers: answers
                }
            );

            navigate(`/quiz-result/${quizId}`, {
                state: {
                    result: response.data
                }
            });
        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "Failed to submit quiz."
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="quiz-page">
                <h2>Loading Quiz...</h2>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="quiz-page">
                <h2>No questions found.</h2>
            </div>
        );
    }

    return (
        <div className="quiz-page">
            <QuestionCard
                question={questions[currentQuestion]}
                currentQuestion={currentQuestion}
                totalQuestions={questions.length}
                selectedAnswer={answers[currentQuestion]}
                onAnswerSelect={selectAnswer}
            />

            <div className="quiz-buttons">
                <button
                    onClick={previousQuestion}
                    disabled={currentQuestion === 0 || submitting}
                >
                    Previous
                </button>

                {currentQuestion === questions.length - 1 ? (
                    <button
                        onClick={submitQuiz}
                        disabled={submitting}
                    >
                        {submitting ? "Submitting..." : "Submit Quiz"}
                    </button>
                ) : (
                    <button
                        onClick={nextQuestion}
                        disabled={submitting}
                    >
                        Next
                    </button>
                )}
            </div>

            <div className="progress">
                Question {currentQuestion + 1} / {questions.length}
            </div>
        </div>
    );
}

export default Quiz;