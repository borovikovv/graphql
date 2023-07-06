import { useState, useEffect } from 'react';
import {useNavigate, useParams} from "react-router";

import {createJob, getJob, updateJob} from "../lib/graphql/queries";

function CreateOrEditJobPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
    try {
      const job = await createJob({title, description});
      console.log('Success created new job:', job.id);

      navigate(`/jobs/${job.id}`);
    } catch(err) {
      console.error(err);
    }
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    try {
      const id = await updateJob({jobId, title, description});

      navigate(`/jobs/${id}`);
    } catch(err) {
      console.error(err);
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
              <button className="button is-link" onClick={handleSubmit}>
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
