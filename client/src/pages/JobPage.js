import { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/formatters';
import {getJob, deleteJob} from "../lib/graphql/queries";

function JobPage() {
  const [state, setState] = useState({
    job: null,
    loading: true,
    error: false,
    errorMessage: '',
  })
  const { jobId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const job = await getJob(jobId);

        setState({ job, error: false, loading: false, errorMessage: "" });
      } catch(err) {
        console.error(err);
        setState({ job: null, error: true, loading: false, errorMessage: "Load job error" });
      }
    })()
  }, []);

  const onDeleteJob = async () => {
    try {
      const id = await deleteJob(jobId);

      console.log(`Job ${id} successful delete`);
      navigate(`/`);
    } catch(err) {
      console.error(err);
      setState({
        ...state,
        errorMessage: `You can't delete this job`,
        error: true,
      })
    }
  }

  const onEditJob = () => {
      navigate(`/jobs/edit/${jobId}`);
  }

  const { loading, job, error } = state;

  if(loading) return <p>...Loading</p>

  if(error) {
    return <div className="has-text-danger">{`${state.errorMessage}: ${state.job.title}`}</div>
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
      <div>
        <button onClick={onEditJob} className="has-text-black is-primary button mr-2">Edit this job</button>
        <button onClick={onDeleteJob} className="has-text-white is-danger button">Delete this job</button>
      </div>
    </div>
  );
}

export default JobPage;
