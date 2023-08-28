import {GraphQLError} from "graphql";
import {getJob, getJobs, getJobsByCompany, createJob, deleteJob, updateJob} from "./db/jobs.js";
import { getCompany } from './db/companies.js';

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
    createJob: (_root, { input: { title, description }}, { user }) => {
      if(!user) {
        throw unauthorized('Missing authorization!');
      }

      return createJob({companyId: user.companyId, title ,description });
    },
    deleteJob: (_root, {input: {jobId}}, { user }) => {
      if(!user) {
        throw unauthorized('Missing authorization!');
      }
      return deleteJob(jobId, user.companyId);
    },
    updateJob: (_root, { input: { jobId, title, description }}, { user }) => {
      if(!user) {
        throw unauthorized('Missing authorization!');
      }
      return updateJob({id: jobId, title, description, companyId: user.companyId})
    }
  },
  Job: {
    company: (job, _args, { companyLoader }) => companyLoader.load(job.companyId),
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

function unauthorized(message) {
  return new GraphQLError(message, {
    extensions: { code: 'UNAUTHORIZED'}
  });
}

function toIsoDate(date) {
  return date.slice(0, 'yyyy-mm-dd'.length)
}