
import React, { useState } from 'react';
import { 
  BellIcon,
  CogIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  ChartBarIcon,
  UserIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      analysis: true,
      marketing: false
    },
    analysis: {
      autoSave: true,
      detailedReports: true,
      parallelProcessing: true,
      maxRetries: 3
    },
    appearance: {
      theme: 'light',
      sidebarCollapsed: false,
      animationsEnabled: true
    },
    privacy: {
      dataCollection: true,
      analytics: true,
      thirdPartySharing: false
    }
  });

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSelectChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const ToggleSwitch = ({ isOn, onToggle, disabled = false }) => (
    <div 
      className={`relative inline-block w-10 h-5 transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={disabled ? undefined : onToggle}
    >
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
        isOn 
          ? 'bg-blue-500' 
          : 'bg-white border border-blue-200'
      }`} />
      <div className={`absolute top-0.5 w-4 h-4 ${isOn ? 'bg-white' : 'bg-black'} rounded-full transition-all duration-300 transform ${
        isOn ? 'translate-x-5' : 'translate-x-0.5'
      }`} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Customize your Chanakya experience and preferences</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BellIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-600">Control how you receive updates and alerts</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive analysis results and updates via email</p>
                </div>
                <ToggleSwitch
                  isOn={settings.notifications.email}
                  onToggle={() => handleToggle('notifications', 'email')}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Get instant notifications in your browser</p>
                </div>
                <ToggleSwitch
                  isOn={settings.notifications.push}
                  onToggle={() => handleToggle('notifications', 'push')}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Analysis Completion</h4>
                  <p className="text-sm text-gray-600">Notify when AI analysis is complete</p>
                </div>
                <ToggleSwitch
                  isOn={settings.notifications.analysis}
                  onToggle={() => handleToggle('notifications', 'analysis')}
                />
              </div>
            </div>
          </div>

          {/* Analysis Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Analysis Preferences</h3>
                <p className="text-sm text-gray-600">Configure how your analyses are processed</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Auto-save Drafts</h4>
                  <p className="text-sm text-gray-600">Automatically save your input as you type</p>
                </div>
                <ToggleSwitch
                  isOn={settings.analysis.autoSave}
                  onToggle={() => handleToggle('analysis', 'autoSave')}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Detailed Reports</h4>
                  <p className="text-sm text-gray-600">Generate comprehensive analysis reports</p>
                </div>
                <ToggleSwitch
                  isOn={settings.analysis.detailedReports}
                  onToggle={() => handleToggle('analysis', 'detailedReports')}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Parallel Processing</h4>
                  <p className="text-sm text-gray-600">Process all perspectives simultaneously for faster results</p>
                </div>
                <ToggleSwitch
                  isOn={settings.analysis.parallelProcessing}
                  onToggle={() => handleToggle('analysis', 'parallelProcessing')}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Maximum Retries</h4>
                  <p className="text-sm text-gray-600">Number of retry attempts for failed analyses</p>
                </div>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  value={settings.analysis.maxRetries}
                  onChange={(e) => handleSelectChange('analysis', 'maxRetries', parseInt(e.target.value))}
                >
                  <option value={1}>1 retry</option>
                  <option value={2}>2 retries</option>
                  <option value={3}>3 retries</option>
                  <option value={5}>5 retries</option>
                </select>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <PaintBrushIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
                <p className="text-sm text-gray-600">Customize the look and feel of the application</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Theme</h4>
                  <p className="text-sm text-gray-600">Choose between light and dark modes</p>
                </div>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  value={settings.appearance.theme}
                  onChange={(e) => handleSelectChange('appearance', 'theme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Sidebar Default State</h4>
                  <p className="text-sm text-gray-600">Start with sidebar collapsed or expanded</p>
                </div>
                <ToggleSwitch
                  isOn={settings.appearance.sidebarCollapsed}
                  onToggle={() => handleToggle('appearance', 'sidebarCollapsed')}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Animations</h4>
                  <p className="text-sm text-gray-600">Enable smooth transitions and animations</p>
                </div>
                <ToggleSwitch
                  isOn={settings.appearance.animationsEnabled}
                  onToggle={() => handleToggle('appearance', 'animationsEnabled')}
                />
              </div>
            </div>
          </div>

          {/* Privacy & Data */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ShieldCheckIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Privacy & Data</h3>
                <p className="text-sm text-gray-600">Control your data and privacy preferences</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Usage Analytics</h4>
                  <p className="text-sm text-gray-600">Help improve Chanakya by sharing anonymous usage data</p>
                </div>
                <ToggleSwitch
                  isOn={settings.privacy.analytics}
                  onToggle={() => handleToggle('privacy', 'analytics')}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Data Collection</h4>
                  <p className="text-sm text-gray-600">Allow collection of analysis data for service improvement</p>
                </div>
                <ToggleSwitch
                  isOn={settings.privacy.dataCollection}
                  onToggle={() => handleToggle('privacy', 'dataCollection')}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Third-party Sharing</h4>
                  <p className="text-sm text-gray-600">Share data with third-party analytics services</p>
                </div>
                <ToggleSwitch
                  isOn={settings.privacy.thirdPartySharing}
                  onToggle={() => handleToggle('privacy', 'thirdPartySharing')}
                />
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Account</h3>
                <p className="text-sm text-gray-600">Manage your account and data</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center space-x-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 group">
                <DocumentArrowDownIcon className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                <span className="text-gray-700 group-hover:text-blue-600">Export Data</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 group">
                <ClockIcon className="h-5 w-5 text-gray-600 group-hover:text-orange-600" />
                <span className="text-gray-700 group-hover:text-orange-600">Clear History</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-300 group">
                <TrashIcon className="h-5 w-5 text-red-600 group-hover:text-red-700" />
                <span className="text-red-700 group-hover:text-red-800">Delete Account</span>
              </button>
            </div>
          </div>

          {/* Save Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300">
                Reset to Defaults
              </button>
              <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
