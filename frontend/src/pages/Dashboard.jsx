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

                        Upload Notes

                    </h2>

                    <p>

                        Upload PDF study material.

                    </p>

                    <Link to="/upload">

                        <button>

                            Upload

                        </button>

                    </Link>

                </div>

                <div className="card">

                    <h2>

                        Documents

                    </h2>

                    <p>

                        View uploaded documents.

                    </p>

                    <Link to="/documents">

                        <button>

                            View

                        </button>

                    </Link>

                </div>

                <div className="card">

                    <h2>

                        AI Summary

                    </h2>

                    <p>

                        Generate AI powered summaries.

                    </p>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;