import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient('http://localhost:9000/graphql');

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

  const { jobs } = await client.request(query);

  return jobs;
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

  const { job } = await client.request(query, { id });

  return job;
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

  const { company } = await client.request(query, { id });

  return company;
}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
        job: createJob(input: $input) {
            id
        }
    }
  `

  const { job } =  await client.request(mutation, {
    input: { title, description }
  });

  return job;
}

export async function deleteJob(jobId) {
  const mutation = gql`
    mutation DeleteJob($input: DeleteJobInput!) {
        deleteJob(input: $input) {
            id
        }
    }
  `

  const { id } = await client.request(mutation, {
    input: { jobId }
  })

  return id;
}