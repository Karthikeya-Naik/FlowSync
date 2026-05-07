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
  const [stats, setStats] =
    useState(null);

  const [recentTasks, setRecentTasks] =
    useState([]);
  const [memberProject, setMemberProject] =
    useState(null);

  const [memberTasks, setMemberTasks] =
    useState([]);

  const [recentActivity, setRecentActivity] =
    useState([]);
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData =
    async () => {
      try {
        setLoading(true);

        setError('');

        const response =
          await getTaskStats();

        setStats(response.stats || {});

        setRecentTasks(
          response.recentTasks || []
        );
        setMemberProject(
          response.memberProject || null
        );

        setMemberTasks(
          response.memberTasks || []
        );

        setRecentActivity(
          response.recentActivity || []
        );
      } catch (error) {
        console.error(
          'Dashboard Error:',
          error
        );

        setError(
          'Failed to load dashboard data.'
        );
      } finally {
        setLoading(false);
      }
    };

  const getPercentage = (value) => {
    return (
      ((value || 0) /
        (stats?.totalTasks || 1)) *
      100
    );
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
      change: Number(
        stats?.completionRate || 0
      ),
    },

    {
      title: 'In Progress',
      value:
        stats?.inProgressTasks || 0,
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
        <div className="text-gray-500 text-lg">
          Loading dashboard...
        </div>
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
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Overview of your team's
          progress
        </p>
      </div>

      {/* Stats Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <DashboardCard
            key={index}
            {...card}
          />
        ))}
      </div>

      {/* Completion Rate */}

      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm">
              Overall Completion Rate
            </p>

            <p className="text-3xl font-bold">
              {stats?.completionRate ||
                0}
              %
            </p>
          </div>

          <TrendingUp
            size={32}
            className="text-blue-200"
          />
        </div>

        <div className="w-full bg-blue-400 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{
              width: `${
                stats?.completionRate ||
                0
              }%`,
            }}
          />
        </div>
      </div>

        {/* Personalized Workspace */}

        {user?.role === 'member' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* My Project */}

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                My Project
              </h3>

              {memberProject ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-blue-600">
                      {memberProject.title}
                    </h4>

                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {
                      memberProject.description
                    }
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-900">
                        {
                          memberProject.members
                            ?.length
                        }
                      </p>

                      <p className="text-sm text-gray-500">
                        Team Members
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-900">
                        {
                          memberTasks.length
                        }
                      </p>

                      <p className="text-sm text-gray-500">
                        My Tasks
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  No project assigned yet.
                </p>
              )}
             </div>

             {/* My Tasks */}

             <div className="card">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">
                 My Tasks
               </h3>

             {memberTasks.length > 0 ? (
                <div className="space-y-3">
                  {memberTasks.map(
                    (task) => (
                      <div
                        key={task._id}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">
                            {task.title}
                          </h4>

                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                             task.status ===
                              'completed'
                                ? 'bg-green-100 text-green-700'
                                : task.status ===
                                  'in-progress'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mb-2">
                          {
                            task.project
                            ?.title
                          }
                        </p>

                        <div className="flex justify-between items-center">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              task.priority ===
                               'high'
                                 ? 'bg-red-100 text-red-700'
                                 : task.priority ===
                                  'medium'
                                 ? 'bg-orange-100 text-orange-700'
                                 : 'bg-green-100 text-green-700'
                              }`}
                          >
                            {
                            task.priority
                            }
                          </span>

                          {task.dueDate && (
                            <span className="text-xs text-gray-500">
                              Due{' '}
                              {new Date(
                                task.dueDate
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-500">
                  No tasks assigned yet.
                </p>
              )}
            </div>
          </div>
         ) : (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Team Activity
              </h3>

              {recentActivity.length >
              0 ? (
                <div className="space-y-3">
                  {recentActivity.map(
                    (activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between border-b border-gray-100 pb-3"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                          {
                            activity.assignedTo
                          }
                          </p>

                          <p className="text-sm text-gray-500">
                            updated{' '}
                            <span className="font-medium">
                              {
                                activity.title
                              }
                            </span>{' '}
                        i   n{' '}
                            {
                              activity.project
                            }
                          </p>
                        </div>

                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            activity.status ===
                            'completed'
                              ? 'bg-green-100 text-green-700'
                              : activity.status ===
                                'in-progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {activity.status}
                        </span>
                      </div>
                    )
                  )}
                </div>
               ) : (
                 <p className="text-gray-500">
                    No recent activity.
                 </p>
               )}
            </div>
        )}

      {/* Charts */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Task Distribution */}

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Task Distribution
          </h3>

          <TaskStatusChart
            stats={stats || {}}
          />
        </div>

        {/* Priority Breakdown */}

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Priority Breakdown
          </h3>

          <div className="space-y-5">
            {/* High */}

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">
                  High Priority
                </span>

                <span className="font-semibold text-red-600">
                  {stats
                    ?.priorityBreakdown
                    ?.high || 0}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 rounded-full h-2 transition-all duration-500"
                  style={{
                    width: `${getPercentage(
                      stats
                        ?.priorityBreakdown
                        ?.high
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Medium */}

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">
                  Medium Priority
                </span>

                <span className="font-semibold text-orange-600">
                  {stats
                    ?.priorityBreakdown
                    ?.medium || 0}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 rounded-full h-2 transition-all duration-500"
                  style={{
                    width: `${getPercentage(
                      stats
                        ?.priorityBreakdown
                        ?.medium
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Low */}

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">
                  Low Priority
                </span>

                <span className="font-semibold text-green-600">
                  {stats
                    ?.priorityBreakdown
                    ?.low || 0}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 rounded-full h-2 transition-all duration-500"
                  style={{
                    width: `${getPercentage(
                      stats
                        ?.priorityBreakdown
                        ?.low
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Tasks
        </h3>

        <RecentTasksTable
          tasks={recentTasks}
        />
      </div>
    </div>
  );
};

export default Dashboard;