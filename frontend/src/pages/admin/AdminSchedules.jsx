import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarIcon,
  ClockIcon,
  UserIcon,
  HomeIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useSchedule } from '../../context/ScheduleContext';
import { useUI } from '../../context/UIContext';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminSchedules = () => {
  const { schedules, loading, loadAllSchedules, updateScheduleStatus, deleteSchedule } = useSchedule();
  const { showToast } = useUI();
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadAllSchedules();
  }, []);

  const handleStatusUpdate = async (scheduleId, status) => {
    const result = await updateScheduleStatus(scheduleId, status);
    if (result.success) {
      showToast(`Schedule ${status} successfully!`, 'success');
    } else {
      showToast('Failed to update schedule status', 'error');
    }
  };

  const handleDelete = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      const result = await deleteSchedule(scheduleId);
      if (result.success) {
        showToast('Schedule deleted successfully!', 'success');
      } else {
        showToast('Failed to delete schedule', 'error');
      }
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    return filterStatus === 'all' || schedule.status === filterStatus;
  });

  const formatDateTime = (date) => {
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return date;
      }
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(dateObj);
    } catch (error) {
      return date;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
        <p className="mt-2 text-gray-600">
          Manage property viewing schedules and appointments
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 gap-6 md:grid-cols-4"
      >
        {[
          { label: 'Total Schedules', value: schedules.length, color: 'bg-blue-500' },
          { label: 'Pending', value: schedules.filter(s => s.status === 'pending').length, color: 'bg-amber-500' },
          { label: 'Confirmed', value: schedules.filter(s => s.status === 'confirmed').length, color: 'bg-emerald-500' },
          { label: 'Completed', value: schedules.filter(s => s.status === 'completed').length, color: 'bg-purple-500' }
        ].map((stat, index) => (
          <div key={stat.label} className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 bg-white rounded-lg shadow-sm"
      >
        <div className="flex items-center justify-between">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          <div className="text-sm text-gray-600">
            Showing {filteredSchedules.length} of {schedules.length} schedules
          </div>
        </div>
      </motion.div>

      {/* Schedules List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="overflow-hidden bg-white rounded-lg shadow-sm"
      >
        {filteredSchedules.length === 0 ? (
          <div className="py-12 text-center">
            <CalendarIcon className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No schedules found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filterStatus === 'all'
                ? 'No property viewing schedules have been created yet.'
                : `No ${filterStatus} schedules found.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Property & User
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Scheduled Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="max-w-xs text-sm font-medium text-gray-900 truncate">
                        {schedule.propertyTitle}
                      </div>
                      <div className="max-w-xs text-sm text-gray-500 truncate">
                        {schedule.propertyAddress}
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        User: {schedule.userName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDateTime(schedule.scheduledDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <EnvelopeIcon className="w-4 h-4 mr-1 text-gray-400" />
                        {schedule.userEmail}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        via {schedule.contactMethod}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusBadgeVariant(schedule.status)} size="sm">
                      {schedule.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          setShowDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      
                      {schedule.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(schedule.id, 'confirmed')}
                            className="text-emerald-600 hover:text-emerald-900"
                            title="Confirm"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(schedule.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel"
                          >
                            <XCircleIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {schedule.status === 'confirmed' && (
                        <button 
                          onClick={() => handleStatusUpdate(schedule.id, 'completed')}
                          className="text-purple-600 hover:text-purple-900"
                          title="Mark Complete"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Schedule Details Modal */}
      {showDetails && selectedSchedule && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowDetails(false)} />
            
            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Schedule Details</h3>
                <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedSchedule.propertyTitle}</h4>
                  <p className="text-sm text-gray-600">{selectedSchedule.propertyAddress}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">User</p>
                    <p className="text-sm text-gray-900">{selectedSchedule.userName}</p>
                    <p className="text-sm text-gray-600">{selectedSchedule.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Scheduled</p>
                    <p className="text-sm text-gray-900">{formatDateTime(selectedSchedule.scheduledDate)}</p>
                    <p className="text-sm text-gray-600">via {selectedSchedule.contactMethod}</p>
                  </div>
                </div>
                
                {selectedSchedule.message && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Message</p>
                    <p className="text-sm text-gray-900">{selectedSchedule.message}</p>
                  </div>
                )}
                
                <div className="flex justify-end pt-4 space-x-3">
                  <Button variant="secondary" onClick={() => setShowDetails(false)}>
                    Close
                  </Button>
                  {selectedSchedule.status === 'pending' && (
                    <Button onClick={() => {
                      handleStatusUpdate(selectedSchedule.id, 'confirmed');
                      setShowDetails(false);
                    }}>
                      Confirm Schedule
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchedules;