import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import {getCompany} from "../lib/graphql/queries";
import JobList from "../components/JobList";

function CompanyPage() {
  const [company, setCompany] = useState(null);
  const { companyId } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const result = await getCompany(companyId);

        setCompany(result);
      } catch(err) {
        console.error(err);
      }
    })()
  }, []);

  if(!company) return <p>...Loading</p>

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
