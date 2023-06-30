import {getJob, getJobs, getJobsByCompany} from "./db/jobs.js";
import {getCompany} from "./db/companies.js";

export const resolvers = {
  Query: {
    jobs: async () => await getJobs(),
    job: (_root, { id }) => getJob(id),
    company: (_root, { id }) => getCompany(id),
  },
  Job: {
    company: async (job) => await getCompany(job.companyId),
    date: (job) => toIsoDate(job.createdAt),
  },
  Company: {
    jobs: (company) => getJobsByCompany(company.id)
  }
}

function toIsoDate(date) {
  return date.slice(0, 'yyyy-mm-dd'.length)
}