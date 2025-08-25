import React from 'react'
import { 
  BarChart2, Package, DollarSign, Bot, Video, 
  Bot as BotIcon, User, Settings, LogOut
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { account } from '../config/Appwrite'

const Sidebar = ({ activePage, setActivePage, navigate }) => {
  const handleNavigation = (page, route) => {
    if (route) {
      // Navigate to external route
      navigate(route)
    } else {
      // Set active page for dashboard content
      setActivePage(page)
    }
  }

  const handleLogout = async () => {
    try {
      // Delete the current session
      await account.deleteSession('current')
      // Clear any stored user data
      localStorage.removeItem('user')
      sessionStorage.clear()
      // Navigate back to auth page
      navigate('/auth', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, clear local data and redirect
      localStorage.removeItem('user')
      sessionStorage.clear()
      navigate('/auth', { replace: true })
    }
  }

  const navItems = [
    { 
      icon: BarChart2, 
      label: 'Analytics Page',
      description: 'View analytics and insights',
      route: null // Stay in dashboard
    },
    { 
      icon: DollarSign, 
      label: 'Investors List',
      description: 'Browse potential investors',
      route: '/investors' // Navigate to investors page
    },
    { 
      icon: Bot, 
      label: 'Chatbot',
      description: 'AI-powered assistance',
      route: '/neeti' // Navigate to neeti AI page
    },
    { 
      icon: Video, 
      label: 'Meeting Room',
      description: 'Join virtual meetings',
      route: null // Stay in dashboard
    },
    { 
      icon: User, 
      label: 'Profile',
      description: 'View and edit your profile',
      route: null // Stay in dashboard
    },
    { 
      icon: Settings, 
      label: 'Settings',
      description: 'Manage preferences and settings',
      route: null // Stay in dashboard
    }
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <BotIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Chanakya </h1>
            <p className="text-sm text-gray-500">Business Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(item.label, item.route)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
              !item.route && activePage === item.label
                ? 'bg-blue-50 border border-blue-200 text-blue-700'
                : 'text-gray-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg transition-colors duration-200 ${
                !item.route && activePage === item.label
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className={`text-xs ${
                  !item.route && activePage === item.label ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {item.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </nav>

      {/* User Section and Logout */}
      <div className="p-4 border-t border-gray-200">
        

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 p-3 text-red-600 rounded-lg transition-all duration-200 border border-red-100"
        >
          <LogOut className="w-3 h-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
