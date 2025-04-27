import axios from "axios"
import { toast } from "react-toastify"
import { interceptorLoadingElements } from "./formatters"
import { logoutUserApiThunk } from "~/redux/features/userSlice"
import { refreshTokenAPI } from "~/assets/apis"

/** How can I use the redux store in non component file
 * Ko thể import {store} như cách thông thường
 * Giải pháp: Inject store
 * Khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên, từ bên đó chúng ta gọi hàm injectStore ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này
 */
let axiosReduxStore
export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore
}
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
// Khởi tạo 1 promise cho việc gọi api refresh token
// Mục đích tạo Promise này để khi nào gọi api refresh_token xong xuôi thì mới retry lại nhiều api bị lỗi trước đó
let refreshTokenPromise = null
// Interceptor Response: Can thiệp vào giữa tất cả response từ server gửi đến client
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Kỹ thuật chặn spam click
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    /** Mọi mã status code nằm ngoài khoảng 200-299 sẽ là error và rơi vào đây */

    // Kỹ thuật chặn spam click
    interceptorLoadingElements(false)

    /** Xử lý refresh token tự động */
    // Case 1: Nếu nhận mã 401 từ BE, thì gọi api đăng xuất luôn
    if (error?.status === 401) {
      axiosReduxStore.dispatch(logoutUserApiThunk(false))
    }
    // Case 2: Nếu nhận mã 410 từ BE, thì sẽ gọi api refresh token để làm mới lại accessToekn
    // Đầu tiên lấy các request API đang bị lỗi
    const originalRequests = error.config
    if (error?.status === 410 && !originalRequests._retry) {
      // Gán thêm 1 giá trị _retry luôn = true trong khoảng thời gian chờ, đảm bảo việc refreshToken này chỉ thực hiện 1 lần tại 1 thời điểm
      originalRequests._retry = true
      // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện việc gọi api refresh_token đòng thời gán vào cho refreshTokenPromise
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            // Đồng thời accessToken đã nằm trong httpOnly cookie (xử lý từ BE)
            return data?.accessToken
          })
          .catch((_error) => {
            // Nếu nhận thấy bất kì lỗi nào thì logout luôn
            axiosReduxStore.dispatch(logoutUserApiThunk(false))
            return Promise.reject(_error)
          })
          .finally(() => {
            // Dù API thành công hay lỗi thì vẫn luôn gán lại refreshTokenPromise về null như ban đầu
            refreshTokenPromise = null
          })
      }

      // Cần return trường hợp chạy thành công và xử lý thêm ở đây
      // eslint-disable-next-line no-unused-vars
      return refreshTokenPromise.then((accessToken) => {
        // B1: Nếu cần lưu accessToken vào localStorage hoặc Redis thì sẽ viết thêm code xử lý ở đây
        // Hiện tại ở đây ko cần B1 này vì chúng ta đã đưa accessToken vào cookie (xử lý từ bên BE)
        // B2: Return lại axios instance của chúng ta kết hợp các originalRequests để gọi lại những api ban đầu bị lỗi
        return authorizedAxiosInstance(originalRequests)
      })
    }
    // Xử lý phần hiển thị thông báo lỗi trả về từ mọi API ở đây (viết code 1 lần)
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
