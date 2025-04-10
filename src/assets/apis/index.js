import axios from "axios"
import { API_ROOT } from "~/utils/constants"

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)

  return response.data
}

export const createColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns/`, newColumnData)

  return response.data
}

export const createCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards/`, newCardData)

  return response.data
}
