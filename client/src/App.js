import {ApolloProvider} from "@apollo/client";
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Route, Routes } from 'react-router-dom';
import { getUser } from './lib/auth';
import NavBar from './components/NavBar';
import CompanyPage from './pages/CompanyPage';
import CreateOrEditJobPage from './pages/CreateOrEditJobPage';
import HomePage from './pages/HomePage';
import JobPage from './pages/JobPage';
import LoginPage from './pages/LoginPage';
import {client} from "./lib/graphql/queries";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser);

  const handleLogin = (user) => {
    setUser(user);
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <ApolloProvider client={client}>
      <NavBar user={user} onLogout={handleLogout} />
      <main className="section">
        <Routes>
          <Route index path="/"
            element={<HomePage />}
          />
          <Route path="/companies/:companyId"
            element={<CompanyPage />}
          />
          <Route path="/jobs/new"
            element={<CreateOrEditJobPage />}
          />
          <Route path="/jobs/:jobId"
            element={<JobPage />}
          />
          <Route path="/jobs/edit/:jobId"
                 element={<CreateOrEditJobPage />}
          />
          <Route path="/login"
            element={<LoginPage onLogin={handleLogin} />}
          />
        </Routes>
      </main>
    </ApolloProvider>
  );
}

export default App;
