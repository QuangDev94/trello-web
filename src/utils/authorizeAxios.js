import axios from "axios"
import { toast } from "react-toastify"
import { interceptorLoadingElements } from "./formatters"
// Khởi tạo 1 đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án.
let authorizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE
// (phục vụ việc chúng ta sẽ lưu JWT tokens (refresh & access) vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

// Cấu hình Interceptors (Bộ đánh chặn vào giữa mọi Request và Response)
// Interceptor Request: Can thiệp vào giữa tất cả request từ client gửi đến server
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(true)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
// Interceptor Response: Can thiệp vào giữa tất cả response từ server gửi đến client
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    // Mọi mã status code nằm ngoài khoảng 200-299 sẽ là error và rơi vào đây
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(false)
    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message
    }
    // Dùng toast để hiện thị tất cả message lỗi lên màn hình trừ 410 - phục vụ việc tự động refresh lại token
    if (error?.status !== 410) {
      toast.error(errorMessage)
    }
    return Promise.reject(error)
  },
)

export default authorizedAxiosInstance
