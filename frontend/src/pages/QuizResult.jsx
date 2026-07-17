import { useEffect, useState } from "react";
import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";
import api from "../services/api";

function QuizResult() {

    const { quizId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);

    useEffect(() => {

        if (location.state?.result) {

            setResult(location.state.result);
            setLoading(false);
            return;

        }

        fetchResult();

    }, []);

    async function fetchResult() {

        try {

            const response = await api.get(
                `/quiz/result/${quizId}`
            );

            setResult(response.data);

        }

        catch (error) {

            alert(
                error.response?.data?.detail ||
                "Unable to load quiz result."
            );

            navigate("/documents");

        }

        finally {

            setLoading(false);

        }

    }

    function retryQuiz() {

        navigate(`/quiz/${quizId}`);

    }

    function goToDocuments() {

        navigate("/documents");

    }

    function goToDashboard() {

        navigate("/dashboard");

    }

    if (loading) {

        return (

            <div className="result-page">

                <h2>
                    Calculating Your Score...
                </h2>

            </div>

        );

    }

    if (!result) {

        return (

            <div className="result-page">

                <h2>
                    Result not found.
                </h2>

            </div>

        );

    }

    return (

        <div className="result-page">

            <div className="score-card">

                <h1>
                    🎉 Quiz Completed
                </h1>

                <h2>
                    Your Score
                </h2>

                <div className="score-circle">
                    {result.score} / {result.total}
                </div>

                <h3>
                    {result.percentage}%
                </h3>

                <div
                    style={{
                        marginTop: "20px",
                        marginBottom: "25px"
                    }}
                >

                    {result.percentage >= 80 && (
                        <p>
                            🌟 Excellent! Outstanding performance.
                        </p>
                    )}

                    {result.percentage >= 60 &&
                        result.percentage < 80 && (
                            <p>
                                👍 Good job! Keep practicing.
                            </p>
                        )}

                    {result.percentage < 60 && (
                        <p>
                            📚 Review the document and try again.
                        </p>
                    )}

                </div>

                <div className="quiz-buttons">

                    <button
                        onClick={retryQuiz}
                    >
                        Retry Quiz
                    </button>

                    <button
                        onClick={goToDocuments}
                    >
                        Documents
                    </button>

                    <button
                        onClick={goToDashboard}
                    >
                        Dashboard
                    </button>

                </div>

            </div>

        </div>

    );

}

export default QuizResult;