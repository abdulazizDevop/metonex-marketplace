import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { checkUserStatusAndRedirect } from '../utils/api.js'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [redirectTo, setRedirectTo] = useState(null)

  useEffect(() => {
    checkUserRole()
  }, [])

  async function checkUserRole() {
    try {
      const result = await checkUserStatusAndRedirect()
      setRedirectTo(result.target)
    } catch (error) {
      console.error('Role tekshirishda xato:', error)
      setRedirectTo('/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />
  }

  return null
}
