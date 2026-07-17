import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Analytics() {

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    async function fetchAnalytics() {

        try {

            const response = await api.get("/analytics");

            setAnalytics(response.data);

        }

        catch (error) {

            alert(

                error.response?.data?.detail ||

                "Unable to load analytics."

            );

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (

            <div className="analytics-page">

                <h2>Loading Analytics...</h2>

            </div>

        );

    }

    return (

        <div className="analytics-page">

            <div className="analytics-header">

                <div>

                    <h1>📊 Learning Analytics</h1>

                    <p>
                        Track your study progress and quiz performance.
                    </p>

                </div>

                <Link to="/dashboard">
                    <button>
                        Back to Dashboard
                    </button>
                </Link>

            </div>

            <div className="analytics-grid">

                <div className="analytics-card">

                    <h2>📄 Documents</h2>

                    <h1>{analytics.total_documents}</h1>

                    <p>Uploaded PDFs</p>

                </div>

                <div className="analytics-card">

                    <h2>📝 Quizzes</h2>

                    <h1>{analytics.total_quizzes}</h1>

                    <p>Generated quizzes</p>

                </div>

                <div className="analytics-card">

                    <h2>✅ Attempts</h2>

                    <h1>{analytics.quizzes_attempted}</h1>

                    <p>Total attempts</p>

                </div>

                <div className="analytics-card">

                    <h2>⭐ Average</h2>

                    <h1>{analytics.average_score}%</h1>

                    <p>Average score</p>

                </div>

            </div>

            <div className="analytics-summary">

                <div className="summary-card">

                    <h2>Highest Score</h2>

                    <div className="summary-value success">

                        {analytics.highest_score}%

                    </div>

                </div>

                <div className="summary-card">

                    <h2>Lowest Score</h2>

                    <div className="summary-value danger">

                        {analytics.lowest_score}%

                    </div>

                </div>

            </div>

            <div className="analytics-progress">

                <h2>Your Overall Performance</h2>

                <div className="progress-bar">

                    <div

                        className="progress-fill"

                        style={{

                            width: `${analytics.average_score}%`

                        }}

                    >

                        {analytics.average_score}%

                    </div>

                </div>

            </div>

            <div className="recent-attempts">

                <h2>Recent Quiz Attempts</h2>

                {

                    analytics.recent_attempts.length === 0

                    ?

                    (

                        <div className="empty-state">

                            <h3>No quiz attempts yet.</h3>

                        </div>

                    )

                    :

                    (

                        <table>

                            <thead>

                                <tr>

                                    <th>Document</th>

                                    <th>Score</th>

                                    <th>Percentage</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    analytics.recent_attempts.map(

                                        (attempt, index) => (

                                            <tr key={index}>

                                                <td>

                                                    {

                                                        attempt.document_name

                                                    }

                                                </td>

                                                <td>

                                                    {

                                                        attempt.score

                                                    }

                                                    /

                                                    {

                                                        attempt.total

                                                    }

                                                </td>

                                                <td>

                                                    {

                                                        attempt.percentage

                                                    }

                                                    %

                                                </td>

                                            </tr>

                                        )

                                    )

                                }

                            </tbody>

                        </table>

                    )

                }

            </div>

        </div>

    );

}

export default Analytics;