import { useState, useEffect } from 'react';
import {useNavigate, useParams} from "react-router";

import {getJob, updateJob} from "../lib/graphql/queries";
import {useCreateJob} from "../lib/graphql/hooks";

function CreateOrEditJobPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState({
    error: false,
    errorMessage: '',
  });
  const {mutate, loading } = useCreateJob(title, description);
  const navigate = useNavigate();
  const { jobId } = useParams();

  useEffect(() => {
    setTitle('');
    setDescription('');
    if(!jobId) return;

    (async () => {
      try {
        const job = await getJob(jobId);

        setTitle(job.title);
        setDescription(job.description);
      } catch(err) {
        console.error(err);
      }
    })()

  }, [jobId]);

  const handleCreate = async (event) => {
    event.preventDefault();

    const { data: { job }} = await mutate();

    console.log('Success created new job:', job?.id);

    navigate(`/jobs/${job?.id}`);
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    try {
      const id = await updateJob({jobId, title, description});

      navigate(`/jobs/${id}`);
    } catch(err) {
      console.error(err);
      setError({
        error: true,
        errorMessage: `You can't edit this job`
      })
    }
  }

  const handleSubmit = (event) => {
    if(jobId) {
      void handleEdit(event);

      return;
    }

    void handleCreate(event)
  }

  return (
    <div>
      <h1 className="title">
        {jobId ? 'Edit Job' : 'New Job'}
      </h1>
      {
        error.error &&
        <div className="has-text-danger">{`${error.errorMessage}`}</div>
      }
      <div className="box">
        <form>
          <div className="field">
            <label className="label">
              Title
            </label>
            <div className="control">
              <input className="input" type="text" value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">
              Description
            </label>
            <div className="control">
              <textarea className="textarea" rows={10} value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button disabled={error.error || loading} className="button is-link" onClick={handleSubmit}>
                {jobId ? 'Edit' :'Submit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOrEditJobPage;
