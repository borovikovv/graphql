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