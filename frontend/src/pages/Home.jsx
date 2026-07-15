import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page-container">
      <h1>Welcome to Cogniva</h1>

      <p>
        Your AI-powered study workspace.
      </p>

      <p>
        Upload notes, generate summaries, take quizzes,
        track your study sessions and analyze your performance.
      </p>

      <Link to="/register">
        <button>Get Started</button>
      </Link>
    </div>
  );
}

export default Home;