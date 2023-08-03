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

const client = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

export async function getJobs() {
  const query = gql`
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

  const { data } = await client.query({ query });

  return data.jobs;
}

export async function getJob(id) {
  const query = gql`
      query Job($id: ID!) {
          job(id: $id) {
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

  const { data } = await client.query({
    query,
    variables: { id }
  });

  return data.job;
}

export async function getCompany(id) {
  const query = gql`
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
  `

  const { data } = await client.query({
    query,
    variables: { id }
  });

  return data.company;
}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
        job: createJob(input: $input) {
            id
        }
    }
  `

  const { data } = await client.mutate({
    mutation,
    variables: {
      input: { title, description }
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
              id
          }
      }
  `

  const { data } = await client.mutate({
    mutation,
    variables: {
      input: { jobId, title, description },
    }
  });

  return data.job.id;
}