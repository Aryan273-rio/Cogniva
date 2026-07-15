function Dashboard() {
  return (
    <div className="page-container">
      <h1>Cogniva Dashboard</h1>

      <p>
        Welcome to your AI-powered study workspace.
      </p>

      <div className="dashboard-cards">
        <div className="card">
          <h2>Documents</h2>
          <p>0</p>
        </div>

        <div className="card">
          <h2>Quizzes</h2>
          <p>0</p>
        </div>

        <div className="card">
          <h2>Study Hours</h2>
          <p>0</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;