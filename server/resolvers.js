import { GraphQLError } from "graphql";
import {getJob, getJobs, getJobsByCompany, createJob, deleteJob} from "./db/jobs.js";
import {getCompany} from "./db/companies.js";

export const resolvers = {
  Query: {
    jobs: async () => await getJobs(),
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if(!job) {
       throw notFoundError(`Job with id: ${id} not found`);
      }

      return job;
    },
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if(!company) {
        throw notFoundError(`Company with id: ${id} not found`);
      }

      return company;
    },
  },
  Mutation: {
    createJob: (_root, { input: { title, description }}) => {

      return createJob({companyId: 'Gu7QW9LcnF5d', title ,description });
    },
    deleteJob: (_root, {input: {jobId}}) => {
      return deleteJob(jobId);
    }
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