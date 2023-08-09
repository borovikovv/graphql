import {useQuery, useMutation} from "@apollo/client";
import {getCompanyById, getJobsQuery, getJobQuery, createJobMutation} from "./queries";

export function useCompany(id) {
  const { error, loading, data } = useQuery(getCompanyById, {
    variables: { id },
  });

  return { error, loading, company: data?.company };
}

export function useJobs() {
  const { error, loading, data } = useQuery(
    getJobsQuery,
    {
      fetchPolicy: 'network-only',
    }
  )

  return { error, loading, jobs: data?.jobs };
}

export function useJob(id) {
  const { data, error, loading } = useQuery(getJobQuery, {
    variables: { id }
  })

  return { error, loading, job: data?.job };
}

export function useCreateJob() {
  const [mutate, { loading }] = useMutation(createJobMutation);

  const createJob = async (title, description) => {
    const { data: { job } } = await mutate({
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

    return job;
  }

  return { createJob, loading };
}