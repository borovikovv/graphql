import {useState} from 'react';
import JobList from '../components/JobList';
import {useJobs} from "../lib/graphql/hooks";
import PaginationBar from '../components/PaginationBar';

const LIMIT = 5;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, error, jobs } = useJobs(LIMIT, (currentPage - 1) * LIMIT);
  const pageCount = Math.round(jobs?.itemsCount / LIMIT)

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
      <PaginationBar currentPage={currentPage} totalPages={pageCount} onPageChange={setCurrentPage} />
      <JobList jobs={jobs.items} />
    </div>
  );
}

export default HomePage;
