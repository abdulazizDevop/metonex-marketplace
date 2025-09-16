import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { isTokenValid, refreshToken } from '../utils/api.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export default function RoleGuard({ requiredRole = 'SELLER', requireCompany = true, children }) {
  const [state, setState] = useState({ loading: true, allow: false })

  useEffect(() => {
    const access = localStorage.getItem('access')
    const refresh = localStorage.getItem('refresh')
    
    if (!access || !refresh) {
      setState({ loading: false, allow: false })
      return
    }

    // Token yaroqliligini tekshiramiz
    if (!isTokenValid()) {
      setState({ loading: false, allow: false })
      return
    }

    ;(async () => {
      try {
        // Token refresh qilib ko'ramiz
        try {
          await refreshToken()
        } catch (error) {
          // Refresh token ham tugagan bo'lsa, ruxsat bermaymiz
          setState({ loading: false, allow: false })
          return
        }

        // avval local cache
        const cachedRole = localStorage.getItem('user_role')
        const cachedHasCompany = localStorage.getItem('has_company')
        const norm = (v)=> String(v||'').toLowerCase()
        let roleOk = false
        if (cachedRole) {
          const role = norm(cachedRole)
          if (requiredRole === 'BUYER') {
            roleOk = role === 'sotib_oluvchi'
          } else if (requiredRole === 'SELLER') {
            roleOk = role === 'sotuvchi'
          } else {
            // default - barcha role'lar uchun
            roleOk = role === 'sotib_oluvchi' || role === 'sotuvchi'
          }
        }
        let companyOk = cachedHasCompany ? cachedHasCompany === '1' : false
        // agar cache yo'q yoki noto'g'ri bo'lsa serverdan tekshiramiz
        if (!roleOk || (requireCompany && !companyOk)) {
          const { data } = await axios.get(`${API_URL}/companies/my_status/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
          })
          const r = norm(data?.user_role)
          if (requiredRole === 'BUYER') {
            roleOk = r === 'sotib_oluvchi'
          } else if (requiredRole === 'SELLER') {
            roleOk = r === 'sotuvchi'
          } else {
            // default - barcha role'lar uchun
            roleOk = r === 'sotib_oluvchi' || r === 'sotuvchi'
          }
          companyOk = requireCompany ? Boolean(data?.has_company) : true
          try {
            localStorage.setItem('user_role', String(data?.user_role || ''))
            localStorage.setItem('has_company', data?.has_company ? '1' : '0')
          } catch {}
        }
        try { console.debug('[RoleGuard]', { requiredRole, requireCompany, roleOk, companyOk, cachedRole, cachedHasCompany }) } catch {}
        setState({ loading: false, allow: roleOk && companyOk })
      } catch {
        setState({ loading: false, allow: false })
      }
    })()
  }, [requiredRole, requireCompany])

  if (state.loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-sky-500 border-t-transparent rounded-full spinner" />
      </div>
    )
  }

  if (!state.allow) {
    // Agar kompaniyasi yo'q bo'lsa, onboardingga
    const hasAccess = Boolean(localStorage.getItem('access'))
    return hasAccess ? <Navigate to="/company-setup" replace /> : <Navigate to="/login" replace />
  }

  return children
}


