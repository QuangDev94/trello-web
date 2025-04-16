/* eslint-disable no-undef */

let apiRoot = ""
console.log(process.env)
if (process.env.BUILD_MODE === "dev") {
  apiRoot = "http://localhost:8017"
}
if (process.env.BUILD_MODE === "prod") {
  apiRoot = "https://backend-trello-api.onrender.com"
}

export const API_ROOT = apiRoot
