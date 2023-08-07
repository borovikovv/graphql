import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import {getCompanyById} from "../lib/graphql/queries";
import JobList from "../components/JobList";
import {useQuery} from "@apollo/client";

function CompanyPage() {
  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false,
  });
  const { companyId } = useParams();
  const { error, loading, data } = useQuery(getCompanyById, {
    variables: { id: companyId },
  });

  if(loading) return <p>...Loading</p>

  const { company } = data;

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
