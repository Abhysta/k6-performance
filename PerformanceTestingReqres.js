import { check, group } from "k6";
import http from "k6/http";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  scenarios: {
    shared_iter_scenario: {
      executor: "shared-iterations",
      vus: 1000,
      iterations: 3500,
      startTime: "0s",
    },
  },
  thresholds: {
    "http_req_duration{group:::Create User}": ["p(95)<2000"],
    "http_req_duration{group:::Update User}": ["p(95)<2000"],
  },
};

export default function () {
  group("Create User", () => {
    const baseUrl = "https://reqres.in/api/users";
    const payLoad = {
      name: "morph",
      job: "employee",
    };
    const res = http.post(baseUrl, payLoad);
    const response = check(res, {
      "Status Response 201": (res) => res.status,
    });
  });

  group("Update User", () => {
    const urlPut = `https://reqres.in/api/users/2`;
    const payLoadPut = {
      name: "morpheus",
      job: "zion resident",
    };
    const resPut = http.put(urlPut, payLoadPut);
    const responsePut = check(resPut, {
      "Status Response 201": (resPut) => resPut.status,
    });
  });
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
