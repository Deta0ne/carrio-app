import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

import { sources, statuses } from "./data";

const jobApplications = Array.from({ length: 10 }, () => ({
  id: `JOB-${faker.number.int({ min: 1000, max: 9999 })}`,
  companyName: faker.company.name(),
  position: faker.person.jobTitle(),
  status: faker.helpers.arrayElement(statuses).value,
  applicationDate: faker.date.past({ years: 1 }).toISOString().split("T")[0], // YYYY-MM-DD format
  lastUpdate: faker.date.recent({ days: 30 }).toISOString().split("T")[0],
  interviewDate: faker.datatype.boolean()
    ? faker.date.soon({ days: 30 }).toISOString().split("T")[0]
    : null, // 50% chance of having an interview date
  source: faker.helpers.arrayElement(sources).value,
}));

fs.writeFileSync(
  path.join(__dirname, "jobApplications.json"),
  JSON.stringify(jobApplications, null, 2)
);

console.log("✅ Job application data generated.");