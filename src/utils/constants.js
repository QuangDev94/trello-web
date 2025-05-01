/* eslint-disable no-undef */

let apiRoot = ""

if (process.env.BUILD_MODE === "dev") {
  apiRoot = "http://localhost:8017"
}
if (process.env.BUILD_MODE === "prod") {
  apiRoot = "https://backend-trello-api.onrender.com"
}

export const API_ROOT = apiRoot

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12
