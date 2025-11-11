import { useState, useEffect } from 'react';
import { Activity, Award, TrendingUp, AlertTriangle, CheckCircle, Clock, Users, Building2, Shield, FileText } from 'lucide-react';
import { supabase } from '../utils/supabase';
import AnimatedGreenRobot from './AnimatedGreenRobot';

interface DashboardStats {
  totalCredentials: number;
  totalIssued: number;
  totalVerifications: number;
  recentActivity: number;
  activeInstitutions: number;
  revokedCredentials: number;
  weeklyData: Array<{ date: string; issued: number; verified: number }>;
  recentNotifications: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: 'success' | 'info' | 'warning';
  }>;
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCredentials: 0,
    totalIssued: 0,
    totalVerifications: 0,
    recentActivity: 0,
    activeInstitutions: 0,
    revokedCredentials: 0,
    weeklyData: [],
    recentNotifications: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      const { data: credentials, error: credError } = await supabase
        .from('credentials')
        .select('*');

      if (credError) throw credError;

      const { data: auditLogs, error: auditError } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (auditError) throw auditError;

      const totalCredentials = credentials?.length || 0;
      const revokedCredentials = credentials?.filter(c => c.revoked).length || 0;
      const totalIssued = totalCredentials - revokedCredentials;

      const verificationLogs = auditLogs?.filter(log => log.action === 'verified') || [];
      const totalVerifications = verificationLogs.length;

      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const recentActivity = auditLogs?.filter(
        log => new Date(log.created_at) > lastWeek
      ).length || 0;

      const uniqueInstitutions = new Set(
        credentials?.map(c => c.institution_address).filter(Boolean)
      );
      const activeInstitutions = uniqueInstitutions.size;

      const weeklyData = generateWeeklyData(credentials || [], auditLogs || []);

      const recentNotifications = generateNotifications(credentials || [], auditLogs || []);

      setStats({
        totalCredentials,
        totalIssued,
        totalVerifications,
        recentActivity,
        activeInstitutions,
        revokedCredentials,
        weeklyData,
        recentNotifications,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const generateWeeklyData = (credentials: any[], auditLogs: any[]) => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const issued = credentials.filter(c => {
        const issueDate = new Date(c.issue_date).toISOString().split('T')[0];
        return issueDate === dateStr;
      }).length;

      const verified = auditLogs.filter(log => {
        const logDate = new Date(log.created_at).toISOString().split('T')[0];
        return logDate === dateStr && log.action === 'verified';
      }).length;

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        issued,
        verified,
      });
    }
    return data;
  };

  const generateNotifications = (credentials: any[], auditLogs: any[]) => {
    const notifications = [];

    const recentIssued = auditLogs
      .filter(log => log.action === 'issued')
      .slice(0, 1);

    if (recentIssued.length > 0) {
      const log = recentIssued[0];
      notifications.push({
        id: log.id,
        title: 'CREDENTIAL ISSUED',
        description: `New credential issued: ${log.metadata?.degree || 'Academic Credential'}`,
        timestamp: new Date(log.created_at).toLocaleDateString(),
        type: 'success' as const,
      });
    }

    const recentVerified = auditLogs
      .filter(log => log.action === 'verified')
      .slice(0, 1);

    if (recentVerified.length > 0) {
      const log = recentVerified[0];
      notifications.push({
        id: log.id + '_verify',
        title: 'CREDENTIAL VERIFIED',
        description: 'A credential was successfully verified by a third party',
        timestamp: new Date(log.created_at).toLocaleDateString(),
        type: 'info' as const,
      });
    }

    const recentShared = auditLogs
      .filter(log => log.action === 'shared')
      .slice(0, 1);

    if (recentShared.length > 0) {
      const log = recentShared[0];
      notifications.push({
        id: log.id + '_share',
        title: 'CREDENTIAL SHARED',
        description: 'A student shared their credential with an organization',
        timestamp: new Date(log.created_at).toLocaleDateString(),
        type: 'info' as const,
      });
    }

    return notifications.slice(0, 3);
  };

  const getSuccessRate = () => {
    if (stats.totalCredentials === 0) return 0;
    return Math.round(((stats.totalCredentials - stats.revokedCredentials) / stats.totalCredentials) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-50"></div>

      <div className="absolute right-0 top-0 h-full w-1/3 pointer-events-none opacity-20">
        <AnimatedGreenRobot size={800} color="#00FF00" animationSpeed={2} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center mb-2">
              <Shield className="w-8 h-8 text-green-500 mr-3" />
              <h1 className="text-3xl font-bold tracking-tight text-green-400">ANALYTICS OVERVIEW</h1>
            </div>
            <p className="text-sm text-gray-400 font-mono">BLOCKCHAIN CREDENTIAL SYSTEM</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase mb-1">Last Updated</p>
            <p className="text-sm font-mono text-gray-300">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 border-2 border-green-900 rounded-lg p-6 hover:border-green-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Total Issued</div>
              <Award className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-4xl font-bold text-green-400 mb-2">{stats.totalIssued}</div>
            <div className="flex items-center text-xs text-gray-500">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              Active Credentials
            </div>
          </div>

          <div className="bg-gray-800 border-2 border-blue-900 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Verifications</div>
              <CheckCircle className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-4xl font-bold text-blue-400 mb-2">{stats.totalVerifications}</div>
            <div className="flex items-center text-xs text-gray-500">
              <Activity className="w-3 h-3 mr-1 text-blue-500" />
              Total Checks
            </div>
          </div>

          <div className="bg-gray-800 border-2 border-purple-900 rounded-lg p-6 hover:border-purple-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Institutions</div>
              <Building2 className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-4xl font-bold text-purple-400 mb-2">{stats.activeInstitutions}</div>
            <div className="flex items-center text-xs text-gray-500">
              <Users className="w-3 h-3 mr-1 text-purple-500" />
              Authorized
            </div>
          </div>

          <div className="bg-gray-800 border-2 border-red-900 rounded-lg p-6 hover:border-red-500 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Success Rate</div>
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-4xl font-bold text-red-400 mb-2">{getSuccessRate()}%</div>
            <div className="flex items-center text-xs text-gray-500">
              <AlertTriangle className="w-3 h-3 mr-1 text-red-500" />
              {stats.revokedCredentials} Revoked
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-gray-800 border-2 border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-100 uppercase tracking-wider">Activity Timeline</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeRange('week')}
                  className={`px-3 py-1 text-xs rounded ${
                    timeRange === 'week'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  WEEK
                </button>
                <button
                  onClick={() => setTimeRange('month')}
                  className={`px-3 py-1 text-xs rounded ${
                    timeRange === 'month'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  MONTH
                </button>
                <button
                  onClick={() => setTimeRange('year')}
                  className={`px-3 py-1 text-xs rounded ${
                    timeRange === 'year'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  YEAR
                </button>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-2">
              {stats.weeklyData.map((day, index) => {
                const maxValue = Math.max(
                  ...stats.weeklyData.map(d => Math.max(d.issued, d.verified)),
                  1
                );
                const issuedHeight = (day.issued / maxValue) * 100;
                const verifiedHeight = (day.verified / maxValue) * 100;

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-1">
                      <div
                        className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t border border-green-500"
                        style={{ height: `${issuedHeight * 2}px` }}
                      ></div>
                      <div
                        className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t border border-blue-500"
                        style={{ height: `${verifiedHeight * 2}px` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 font-mono mt-2">{day.date}</div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-400 uppercase">Issued</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-xs text-gray-400 uppercase">Verified</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-100 uppercase tracking-wider">Notifications</h3>
              <button className="text-xs text-green-400 hover:text-green-300 uppercase">
                Clear All
              </button>
            </div>

            <div className="space-y-4">
              {stats.recentNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              ) : (
                stats.recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-gray-700 border border-gray-600 rounded p-4 hover:border-green-500 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-200 mb-1 uppercase tracking-wide">
                          {notification.title}
                        </h4>
                        <p className="text-xs text-gray-400 mb-2">{notification.description}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {notification.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {stats.recentNotifications.length > 0 && (
              <button className="w-full mt-4 py-2 text-xs text-green-400 hover:text-green-300 border border-gray-700 rounded hover:border-green-500 transition-colors uppercase tracking-wider">
                Show All ({stats.recentActivity})
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-100 uppercase tracking-wider">System Status</h3>
              <span className="px-3 py-1 bg-green-900 text-green-400 text-xs rounded uppercase tracking-wider border border-green-600">
                Online
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300 font-mono">Smart Contract</span>
                </div>
                <span className="text-xs text-green-400 font-bold">
                  {stats.totalCredentials}/{stats.totalCredentials + 100}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300 font-mono">IPFS Gateway</span>
                </div>
                <span className="text-xs text-green-400 font-bold">99.9%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300 font-mono">Database Sync</span>
                </div>
                <span className="text-xs text-yellow-400 font-bold">85.2%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-100 uppercase tracking-wider">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="bg-green-900 hover:bg-green-800 text-green-400 border-2 border-green-600 hover:border-green-400 p-4 rounded transition-all">
                <Award className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold uppercase">Issue</span>
              </button>
              <button className="bg-blue-900 hover:bg-blue-800 text-blue-400 border-2 border-blue-600 hover:border-blue-400 p-4 rounded transition-all">
                <CheckCircle className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold uppercase">Verify</span>
              </button>
              <button className="bg-purple-900 hover:bg-purple-800 text-purple-400 border-2 border-purple-600 hover:border-purple-400 p-4 rounded transition-all">
                <Users className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold uppercase">Manage</span>
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-gray-400 border-2 border-gray-600 hover:border-gray-400 p-4 rounded transition-all">
                <Activity className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold uppercase">Reports</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-600 font-mono">
          <p>BLOCKCHAIN ACADEMIC CREDENTIALS v1.0 • ETHEREUM SEPOLIA TESTNET</p>
          <p className="mt-1">POWERED BY SOULBOUND TOKENS • IPFS STORAGE</p>
        </div>
      </div>
    </div>
  );
}
