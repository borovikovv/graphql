import { useParams } from 'react-router';
import JobList from "../components/JobList";
import {useCompany} from "../lib/graphql/hooks";

function CompanyPage() {
  const { companyId } = useParams();
  const { error, loading, company } = useCompany(companyId);

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
