import {useNavigate, useParams} from 'react-router';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/formatters';
import {deleteJob} from "../lib/graphql/queries";
import {useJob} from "../lib/graphql/hooks";

function JobPage() {
  const { jobId } = useParams();
  const { job, error, loading} = useJob(jobId);
  const navigate = useNavigate();

  const onDeleteJob = async () => {
    try {
      const id = await deleteJob(jobId);

      console.log(`Job ${id} successful delete`);
      navigate(`/`);
    } catch(err) {
      console.error(err);
    }
  }

  const onEditJob = () => {
      navigate(`/jobs/edit/${jobId}`);
  }

  if(loading) return <p>...Loading</p>

  if(error) {
    return <div className="has-text-danger">`You can't delete this job`</div>
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
