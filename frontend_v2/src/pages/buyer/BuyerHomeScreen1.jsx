import React from 'react'
import { Link } from 'react-router-dom'

const BuyerHomeScreen1 = () => {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <header className="p-6 pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, BuildCo</h1>
          <button className="text-gray-500">
            <span className="material-symbols-outlined text-3xl">
              notifications
            </span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-center items-center px-6 text-center">
        <div className="space-y-6">
          <img 
            alt="Construction materials" 
            className="w-48 h-48 mx-auto" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2PLJ1mxubGQnbAr6J7T8c06qoWCqCBsHooV2vc-ts_MFwIK0Rg--drd6ckudHyAgXR9gOhDKCVqlMEf0XonZo59nBdyAmOVuRuwINl4_LIs91JlIOMrBERNWBmwl_9aZPTSBxTPDZ2CasN1h01WKkM3a5sAE9v3ZGe-hR5w5iZE6hj0G8l1zE6C8QFhg4xuFSzjIFOqPdHppqHodVApXP1KlwRVYKMPBVg37WgqL8xnnpMAWvFsITL_9derqV4SYCajRBI2mBChw"
          />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">You don't have any orders yet</h2>
          </div>
        </div>
      </main>

      <div className="p-6">
        <Link 
          to="/manual-order-request-form"
          className="btn-primary w-full block text-center"
        >
          Create New Request
        </Link>
      </div>
    </div>
  )
}

export default BuyerHomeScreen1
