import {getJobs} from "./db/jobs.js";
import {getCompany} from "./db/companies.js";

export const resolvers = {
  Query: {
    jobs: async () => await getJobs(),
  },
  Job: {
    company: async (job) => await getCompany(job.companyId),
    date: (job) => toIsoDate(job.createdAt),
  }
}

function toIsoDate(date) {
  return date.slice(0, 'yyyy-mm-dd'.length)
}