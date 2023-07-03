import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/formatters';
import {getJob} from "../lib/graphql/queries";

function JobPage() {
  const [state, setState] = useState({
    job: null,
    loading: true,
    error: false,
  })
  const { jobId } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const job = await getJob(jobId);

        setState({ job, error: false, loading: false });
      } catch(err) {
        console.error(err);
        setState({ job: null, error: true, loading: false });
      }
    })()
  }, []);

  const { loading, job, error } = state;

  if(loading) return <p>...Loading</p>

  if(error) {
    return <div className="has-text-danger">Load job error</div>
  }

  if(!job) {
    return <div className='is-text is-primary'>No jobs found</div>
  }

  return (
    <div>
      <h1 className="title is-2">
        {job.title}
      </h1>
      <h2 className="subtitle is-4">
        <Link to={`/companies/${job.company.id}`}>
          {job.company.name}
        </Link>
      </h2>
      <div className="box">
        <div className="block has-text-grey">
          Posted: {formatDate(job.date, 'long')}
        </div>
        <p className="block">
          {job.description}
        </p>
      </div>
    </div>
  );
}

export default JobPage;
