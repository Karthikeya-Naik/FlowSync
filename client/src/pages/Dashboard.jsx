import React, {
  useState,
  useEffect,
} from 'react';

import {
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

import { getTaskStats } from '../api/taskApi';
import { useAuth } from '../context/AuthContext';

import DashboardCard from '../components/DashboardCard';
import TaskStatusChart from '../components/TaskStatusChart';
import RecentTasksTable from '../components/RecentTasksTable';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [memberProject, setMemberProject] = useState(null);
  const [memberTasks, setMemberTasks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getTaskStats();
      setStats(response.stats || {});
      setRecentTasks(response.recentTasks || []);
      setMemberProject(response.memberProject || null);
      setMemberTasks(response.memberTasks || []);
      setRecentActivity(response.recentActivity || []);
    } catch (error) {
      console.error('Dashboard Error:', error);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (value) => {
    return ((value || 0) / (stats?.totalTasks || 1)) * 100;
  };

  const cards = [
    {
      title: 'Total Tasks',
      value: stats?.totalTasks || 0,
      icon: ClipboardList,
      color: 'blue',
    },
    {
      title: 'Completed',
      value: stats?.completedTasks || 0,
      icon: CheckCircle,
      color: 'green',
      change: Number(stats?.completionRate || 0),
    },
    {
      title: 'In Progress',
      value: stats?.inProgressTasks || 0,
      icon: Clock,
      color: 'orange',
    },
    {
      title: 'Overdue',
      value: stats?.overdueTasks || 0,
      icon: AlertCircle,
      color: 'red',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your team's progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>

      {/* Completion Rate */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm">Overall Completion Rate</p>
            <p className="text-3xl font-bold">{stats?.completionRate || 0}%</p>
          </div>
          <TrendingUp size={32} className="text-blue-200" />
        </div>
        <div className="w-full bg-blue-400 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${stats?.completionRate || 0}%` }}
          />
        </div>
      </div>

      {/* Personalized Workspace - Equal Height Sections */}
      {user?.role === 'member' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* My Project - Same height as My Tasks */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">My Project</h3>
            </div>
            <div className="p-5 flex-1">
              {memberProject ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-blue-600">
                      {memberProject.title}
                    </h4>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                      Active
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {memberProject.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="text-2xl font-bold text-gray-900">
                        {memberProject.members?.length || 0}
                      </p>
                      <p className="text-xs text-gray-500">Team Members</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="text-2xl font-bold text-gray-900">
                        {memberTasks.length}
                      </p>
                      <p className="text-xs text-gray-500">My Tasks</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ClipboardList size={20} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No project assigned yet.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* My Tasks - Scrollable with max 2 tasks visible */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">My Tasks</h3>
            </div>
            <div className="p-5 flex-1 overflow-y-auto max-h-[200px] custom-scroll">
              {memberTasks.length > 0 ? (
                <div className="space-y-3">
                  {memberTasks.map((task) => (
                    <div
                      key={task._id}
                      className="border border-gray-100 rounded-lg p-3 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {task.title}
                        </h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            task.status === 'completed'
                              ? 'bg-green-50 text-green-700 border border-green-100'
                              : task.status === 'in-progress'
                              ? 'bg-blue-50 text-blue-700 border border-blue-100'
                              : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                          }`}
                        >
                          {task.status === 'completed'
                            ? 'Completed'
                            : task.status === 'in-progress'
                            ? 'In Progress'
                            : 'Todo'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        {task.project?.title || 'No project'}
                      </p>
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            task.priority === 'high'
                              ? 'bg-red-50 text-red-700 border border-red-100'
                              : task.priority === 'medium'
                              ? 'bg-orange-50 text-orange-700 border border-orange-100'
                              : 'bg-green-50 text-green-700 border border-green-100'
                          }`}
                        >
                          {task.priority?.toUpperCase() || 'LOW'}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-gray-400">
                            Due {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle size={20} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No tasks assigned yet.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Team Activity</h3>
          </div>
          <div className="p-5">
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {activity.assignedTo}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        updated <span className="font-medium text-gray-700">{activity.title}</span> in{' '}
                        <span className="font-medium text-gray-700">{activity.project}</span>
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ml-3 ${
                        activity.status === 'completed'
                          ? 'bg-green-50 text-green-700'
                          : activity.status === 'in-progress'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-yellow-50 text-yellow-700'
                      }`}
                    >
                      {activity.status === 'completed'
                        ? 'Completed'
                        : activity.status === 'in-progress'
                        ? 'In Progress'
                        : 'Todo'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp size={20} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No recent activity.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Charts - Equal Height */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Task Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Task Distribution</h3>
          </div>
          <div className="p-5 flex-1">
            <TaskStatusChart stats={stats || {}} />
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Priority Breakdown</h3>
          </div>
          <div className="p-5 flex-1">
            <div className="space-y-5 h-full flex flex-col justify-center">
              {/* High */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">High Priority</span>
                  <span className="font-semibold text-red-600">
                    {stats?.priorityBreakdown?.high || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-red-500 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${getPercentage(stats?.priorityBreakdown?.high)}%` }}
                  />
                </div>
              </div>

              {/* Medium */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">Medium Priority</span>
                  <span className="font-semibold text-orange-600">
                    {stats?.priorityBreakdown?.medium || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-orange-500 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${getPercentage(stats?.priorityBreakdown?.medium)}%` }}
                  />
                </div>
              </div>

              {/* Low */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">Low Priority</span>
                  <span className="font-semibold text-green-600">
                    {stats?.priorityBreakdown?.low || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-500 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${getPercentage(stats?.priorityBreakdown?.low)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
        </div>
        <RecentTasksTable tasks={recentTasks} />
      </div>

      {/* Add this style for custom scrollbar */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;