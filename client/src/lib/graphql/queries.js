import {ApolloClient, InMemoryCache, gql, createHttpLink, concat, ApolloLink} from "@apollo/client";
import { getAccessToken } from "../auth";

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' });
const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if(accessToken) {
    operation.setContext({
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
  }

  return forward(operation);
})

export const client = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

const jobDetailFragment = gql`
    fragment JobDetail on Job {
        date
        description
        id
        title
        company {
            id
            name
        }
    }
`;

export const getCompanyById = gql`
    query Company($id: ID!) {
        company(id: $id) {
            name
            description
            id
            jobs(id: $id) {
                date
                description
                id
                title
            }
        }
    }
`;

const getJobQuery =  gql`
    query Job($id: ID!) {
        job(id: $id) {
            ...JobDetail
        }
    }
    ${jobDetailFragment}
`

export const getJobsQuery = gql`
    query {
        jobs {
            date
            description
            id
            title
            company {
                id
                name
                description
            }
        }
    }
`

export async function getJobs() {
  const { data } = await client.query({ query: getJobsQuery, fetchPolicy: 'network-only' });

  return data.jobs;
}

export async function getJob(id) {
  const { data } = await client.query({
    query: getJobQuery,
    variables: { id },
  });

  return data.job;
}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
        job: createJob(input: $input) {
            ...JobDetail,
        }
    }
    
    ${jobDetailFragment}
  `;

  const { data } = await client.mutate({
    mutation,
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
  })

  return data.job;
}

export async function deleteJob(jobId) {
  const mutation = gql`
    mutation DeleteJob($input: DeleteJobInput!) {
        job :deleteJob(input: $input) {
            id
        }
    }
  `

  const { data } = await client.mutate({
    mutation,
    variables: {
      input: { jobId }
    }
  });

  return data.id;
}

export async function updateJob({jobId, title, description}) {
  const mutation = gql`
      mutation UpdateJob($input: UpdateJobInput!) {
          job: updateJob(input: $input) {
              date
              description
              id
              title
              company {
                  id
                  name
              }
          }
      }
  `

  const { data } = await client.mutate({
    mutation,
    variables: {
      input: { jobId, title, description },
    },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: getJobQuery,
        variables: { id: data.job.id },
        data,
      });
    }
  });

  return data.job.id;
}