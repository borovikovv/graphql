import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import {getCompany} from "../lib/graphql/queries";
import JobList from "../components/JobList";

function CompanyPage() {
  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false,
  })
  const { companyId } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const company = await getCompany(companyId);

        setState({company, loading: false, error: false});
      } catch(err) {
        console.error(err);
        setState({company: null, loading: false, error: true});
      }
    })()
  }, []);

  const { company, loading, error } = state;

  if(loading) return <p>...Loading</p>

  if(error) {
    return <div className="has-text-danger">Load data failed!</div>
  }

  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <p className="title is-5">{`Jobs as ${company.name}`}</p>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
