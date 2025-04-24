import { useEffect, useState } from "react"
import { Navigate, useSearchParams } from "react-router-dom"
import NotFound from "../404/NotFound"
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner"
import { verifyUserAPI } from "~/assets/apis"

function AccountVerification() {
  // Lấy giá trị email và token từ url
  let [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])
  //   Tạo biến state để check tài khoản đã được verify hay chưa
  const [isVerified, setIsVerified] = useState(false)
  //   Call API để verify tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setIsVerified(true))
    }
  }, [email, token])
  // Nếu url có vấn đề , ko tồn tại email hoặc token thì đá sang 404
  if (!email || !token) {
    return <Navigate to={<NotFound />} />
  }
  // Nếu chưa verify  xong thì hiện loading
  if (!isVerified) {
    return <PageLoadingSpinner caption="Verifying your account" />
  }
  // Nếu ko có vấn đề gì + verify thành công thì thì điều hướng về trang login cùng giá trị verifiedEmail
  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification
