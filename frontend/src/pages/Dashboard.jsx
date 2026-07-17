import { Link } from "react-router-dom";

function Dashboard() {

    return (

        <div className="container">

            <h1>
                Welcome to Cogniva
            </h1>

            <p>
                Your AI Powered Study Workspace
            </p>

            <div className="cards">

                <div className="card">

                    <h2>
                        📄 Upload Notes
                    </h2>

                    <p>
                        Upload PDF study material for AI-powered learning.
                    </p>

                    <Link to="/upload">
                        <button>
                            Upload PDF
                        </button>
                    </Link>

                </div>

                <div className="card">

                    <h2>
                        📚 Documents
                    </h2>

                    <p>
                        View, summarize and manage all your uploaded documents.
                    </p>

                    <Link to="/documents">
                        <button>
                            View Documents
                        </button>
                    </Link>

                </div>

                <div className="card">

                    <h2>
                        🤖 AI Summary
                    </h2>

                    <p>
                        Generate concise AI summaries from your study material.
                    </p>

                    <Link to="/documents">
                        <button>
                            Generate Summary
                        </button>
                    </Link>

                </div>

                <div className="card">

                    <h2>
                        📊 Analytics
                    </h2>

                    <p>
                        Track quiz scores, study progress and overall performance.
                    </p>

                    <Link to="/analytics">
                        <button>
                            View Analytics
                        </button>
                    </Link>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;