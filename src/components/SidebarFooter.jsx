import React from 'react'
import { LogOut, User } from 'lucide-react'
import { account } from '../config/Appwrite'
import { useNavigate } from 'react-router-dom'

const SidebarFooter = ({ navigate }) => {
  const handleLogout = async () => {
    try {
      // Delete the current session
      await account.deleteSession('current')
      console.log('Session deleted successfully')
      
      // Clear any local storage or state if needed
      localStorage.removeItem('user')
      sessionStorage.clear()
      
      // Navigate to auth page
      navigate('/auth', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      // Even if there's an error, redirect to auth page
      navigate('/auth', { replace: true })
    }
  }

  return (
    <div className="border-t border-gray-200 p-2">
      <div className="space-y-1">
        <button
          onClick={handleLogout}
          className="w-full text-left p-3 rounded-lg transition-all duration-200 group text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-gray-200 transition-colors duration-200">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Logout</div>
              <div className="text-xs text-gray-400">
                Sign out of account
              </div>
            </div>
          </div>
        </button>
      </div>
      
      {/* User Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">Welcome back!</div>
            <div className="text-xs text-gray-500">Manage your business</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SidebarFooter
