import { GraphQLError } from "graphql";
import {getJob, getJobs, getJobsByCompany} from "./db/jobs.js";
import {getCompany} from "./db/companies.js";

export const resolvers = {
  Query: {
    jobs: async () => await getJobs(),
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if(!job) {
       throw notFoundError(`Job with id: ${id} not found`);
      }

    },
    company: async (_root, { id }) => {
      const {company} = await getCompany(id);
      if(!company) {
        throw notFoundError(`Company with id: ${id} not found`);
      }
    },
  },
  Job: {
    company: async (job) => await getCompany(job.companyId),
    date: (job) => toIsoDate(job.createdAt),
  },
  Company: {
    jobs: (company) => getJobsByCompany(company.id)
  }
}

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND'}
  });
}

function toIsoDate(date) {
  return date.slice(0, 'yyyy-mm-dd'.length)
}