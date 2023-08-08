import {useQuery, useMutation} from "@apollo/client";
import {getCompanyById, getJobsQuery, getJobQuery, createJobMutation} from "./queries";

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

export function useCreateJob(title, description) {
  const [mutate, result] = useMutation(createJobMutation, {
    variables: {
      input: { title, description }
    },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: getJobQuery,
        variables: { id: data.job.id },
        data,
      });
    }
  });

  return { mutate, loading: result?.loading };
}