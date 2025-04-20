import React, { useState, useEffect } from 'react';
import { setDevMonitoring, getMonitoringStatus } from '../../../utils/env-aware-monitoring';

const MonitoringToggle: React.FC = () => {
  const [status, setStatus] = useState<{ enabled: boolean, environment: string }>(
    { enabled: false, environment: 'development' }
  );
  
  useEffect(() => {
    // Get initial status
    setStatus(getMonitoringStatus());
  }, []);
  
  const toggleMonitoring = () => {
    setDevMonitoring(!status.enabled);
  };
  
  // Only show in development
  if (process.env.NODE_ENV === 'production') return null;
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">Performance Monitoring</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {status.enabled 
              ? 'Monitoring is enabled in development' 
              : 'Monitoring is disabled in development'}
          </p>
        </div>
        <div className="relative inline-block w-12 mr-2 align-middle select-none">
          <input
            type="checkbox"
            name="toggle"
            id="monitoring-toggle"
            checked={status.enabled}
            onChange={toggleMonitoring}
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          />
          <label
            htmlFor="monitoring-toggle"
            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
              status.enabled ? 'bg-green-400' : 'bg-gray-300'
            }`}
          ></label>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
        <p>Environment: {status.environment}</p>
        <p className="mt-1">Note: Toggling will reload the page to apply changes</p>
      </div>
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #68D391;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #68D391;
        }
        .toggle-checkbox {
          right: 0;
          top: 0;
          border-color: #CBD5E0;
          transition: all 0.3s;
        }
        .toggle-label {
          transition: background-color 0.3s;
        }
      `}</style>
    </div>
  );
};

export default MonitoringToggle;
