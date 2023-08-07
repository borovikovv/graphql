import JobList from '../components/JobList';
import {useJobs} from "../lib/graphql/hooks";

function HomePage() {
  const { loading, error, jobs } = useJobs();

  if(loading) {
    return <p className="is-text is-loading">...Loading</p>
  }

  if(error) {
    return <p className="is-text is-danger">Data load error</p>
  }

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
