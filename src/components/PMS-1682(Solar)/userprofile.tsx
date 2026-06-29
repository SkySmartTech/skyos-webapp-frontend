import { useState } from "react";
import { User, CheckCircle, Lock } from "lucide-react";

function UserProfileContent() {
  return (
    <div className="min-h-screen bg-[#e5e5e5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#f7f7f7] shadow-md p-8 rounded-sm">
        
        {/* Title */}
        <h1 className="text-[34px] text-gray-700 text-center font-normal mb-4">
          User Profile
        </h1>

        {/* Profile Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-lime-500 flex items-center justify-center">
              <User size={42} className="text-white" />
            </div>

            <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-full border-4 border-white">
              <CheckCircle size={42} className="text-white" />
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full h-12 border border-gray-300 rounded text-center text-gray-500 outline-none bg-white"
          />

          <input
            type="text"
            placeholder="Mobile number"
            className="w-full h-12 border border-gray-300 rounded text-center text-gray-500 outline-none bg-white"
          />

          {/* Current Password */}
          <div className="relative">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full h-12 border border-gray-300 rounded text-center text-gray-500 outline-none bg-white pr-12"
            />
            <Lock
              size={22}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>

          {/* New Password */}
          <div className="relative">
            <input
              type="password"
              placeholder="New Password"
              className="w-full h-12 border border-gray-300 rounded text-center text-gray-500 outline-none bg-white pr-12"
            />
            <Lock
              size={22}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>

          {/* Button */}
          <button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded mt-4 transition-colors">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsContent() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notification Preferences
            </label>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4"
            />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Enable Email Notifications</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Privacy Settings
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
              <option>Public</option>
              <option>Private</option>
              <option>Friends Only</option>
            </select>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

function HelpContent() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Help & Support</h2>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h3>
            <p className="text-gray-600 dark:text-gray-400">Find answers to common questions about your account and profile.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Contact Support</h3>
            <p className="text-gray-600 dark:text-gray-400">Get in touch with our support team for assistance.</p>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Contact Us
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Documentation</h3>
            <p className="text-gray-600 dark:text-gray-400">Browse our comprehensive documentation and guides.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserProfile() {
  const [activeView] = useState<'profile' | 'settings' | 'help'>('profile');

  return (
    <div className="w-full h-full overflow-y-auto">
      {activeView === 'profile' ? (
        <UserProfileContent />
      ) : activeView === 'settings' ? (
        <SettingsContent />
      ) : (
        <HelpContent />
      )}
    </div>
  );
}