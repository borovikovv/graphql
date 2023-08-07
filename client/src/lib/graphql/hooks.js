import {useQuery} from "@apollo/client";
import {getCompanyById, getJobsQuery, getJobQuery} from "./queries";

export function useCompany(id) {
  const { error, loading, data } = useQuery(getCompanyById, {
    variables: { id },
  });

  return { error, loading, company: data?.company };
}

export function useJobs() {
  const { error, loading, data } = useQuery(getJobsQuery)

  return { error, loading, jobs: data?.jobs };
}

export function useJob(id) {
  const { data, error, loading } = useQuery(getJobQuery, {
    variables: { id }
  })

  return { error, loading, job: data?.job };
}