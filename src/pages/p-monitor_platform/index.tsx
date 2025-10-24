

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface AlertItem {
  id: number;
  name: string;
  level: 'critical' | 'warning';
  time: string;
  status: 'pending' | 'resolved';
}

const MonitorPlatform: React.FC = () => {
  const navigate = useNavigate();
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const [isRefreshingAlerts, setIsRefreshingAlerts] = useState(false);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [alertsData, setAlertsData] = useState<AlertItem[]>([
    { id: 1, name: 'API响应超时', level: 'critical', time: '2023-06-15 14:30', status: 'pending' },
    { id: 2, name: '数据库连接数过高', level: 'warning', time: '2023-06-15 13:15', status: 'resolved' },
    { id: 3, name: '内存使用率超过阈值', level: 'warning', time: '2023-06-15 10:45', status: 'resolved' }
  ]);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '监控平台 - 商家OpenAI平台';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    // 模拟图表加载
    const timer = setTimeout(() => {
      setIsChartLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handleGetAlertList = () => {
    setIsLoadingAlerts(true);
    
    setTimeout(() => {
      console.log('获取报警列表API调用');
      alert('报警列表已加载完成');
      setIsLoadingAlerts(false);
    }, 1500);
  };

  const handleDownloadReport = () => {
    setIsDownloadingReport(true);
    
    setTimeout(() => {
      console.log('下载报表API调用');
      
      // 创建模拟下载链接
      const link = document.createElement('a');
      link.href = 'https://example.com/sample-report.xlsx';
      link.download = 'system-monitoring-report.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsDownloadingReport(false);
    }, 1500);
  };

  const handleViewSystemStatus = () => {
    alert('查看系统状态功能');
  };

  const handleRefreshAlerts = () => {
    setIsRefreshingAlerts(true);
    
    setTimeout(() => {
      const mockAlertsData: AlertItem[] = [
        { id: 1, name: 'API响应超时', level: 'critical', time: '2023-06-15 14:30', status: 'pending' },
        { id: 2, name: '数据库连接数过高', level: 'warning', time: '2023-06-15 13:15', status: 'resolved' },
        { id: 3, name: '内存使用率超过阈值', level: 'warning', time: '2023-06-15 10:45', status: 'resolved' },
        { id: 4, name: '磁盘空间不足', level: 'critical', time: '2023-06-14 16:20', status: 'resolved' },
        { id: 5, name: 'CPU使用率异常', level: 'warning', time: '2023-06-14 09:10', status: 'resolved' }
      ];
      
      setAlertsData(mockAlertsData);
      setIsRefreshingAlerts(false);
    }, 1000);
  };

  const getLevelStyle = (level: string) => {
    if (level === 'critical') {
      return 'bg-red-100 text-red-500';
    } else if (level === 'warning') {
      return 'bg-yellow-100 text-yellow-500';
    }
    return '';
  };

  const getLevelText = (level: string) => {
    if (level === 'critical') {
      return '严重';
    } else if (level === 'warning') {
      return '警告';
    }
    return '';
  };

  const getStatusStyle = (status: string) => {
    if (status === 'pending') {
      return 'bg-yellow-100 text-yellow-500';
    } else if (status === 'resolved') {
      return 'bg-green-100 text-green-500';
    }
    return '';
  };

  const getStatusText = (status: string) => {
    if (status === 'pending') {
      return '未处理';
    } else if (status === 'resolved') {
      return '已解决';
    }
    return '';
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo和产品名称 */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={handleLogoClick}>
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <i className="fas fa-home text-white text-sm"></i>
            </div>
            <span className="text-text-primary font-medium">商家OpenAI平台</span>
          </div>
          
          {/* 全局搜索框 */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="搜索监控项、报警..." 
                className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg text-sm"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
            </div>
          </div>
          
          {/* 用户操作区 */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors">
              <i className="fas fa-question-circle text-lg"></i>
            </button>
            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors">
              <i className="fas fa-cog text-lg"></i>
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <div className="flex pt-16 min-h-screen">
        {/* 左侧导航 */}
        <aside className="w-64 bg-white border-r border-border-light flex-shrink-0">
          <div className="p-4 border-b border-border-light">
            <h2 className="text-text-primary font-medium">监控平台</h2>
          </div>
          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <Link to="/monitor-platform" className="flex items-center p-3 rounded-lg bg-secondary text-white">
                  <i className="fas fa-tachometer-alt w-5 text-center mr-3"></i>
                  <span>概览</span>
                </Link>
              </li>
              <li>
                <Link to="#" className={`flex items-center p-3 rounded-lg ${styles.menuItemHover} text-text-primary`}>
                  <i className="fas fa-bell w-5 text-center mr-3"></i>
                  <span>报警管理</span>
                </Link>
              </li>
              <li>
                <Link to="#" className={`flex items-center p-3 rounded-lg ${styles.menuItemHover} text-text-primary`}>
                  <i className="fas fa-chart-line w-5 text-center mr-3"></i>
                  <span>指标分析</span>
                </Link>
              </li>
              <li>
                <Link to="#" className={`flex items-center p-3 rounded-lg ${styles.menuItemHover} text-text-primary`}>
                  <i className="fas fa-cog w-5 text-center mr-3"></i>
                  <span>监控设置</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* 右侧主内容 */}
        <main className="flex-1 p-6">
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-2xl font-medium text-text-primary">监控概览</h1>
            <p className="text-text-secondary mt-1">实时监控系统运行状态和性能指标</p>
          </div>
          
          {/* 功能模块区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* 报警列表模块 */}
            <div className={`${styles.featureCard} bg-white rounded-xl shadow-card p-6`}>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-500">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <h3 className="ml-3 text-lg font-medium text-text-primary">报警列表</h3>
              </div>
              <p className="text-text-secondary text-sm mb-4">查看和管理系统中所有报警记录，支持按时间、级别筛选</p>
              <button 
                onClick={handleGetAlertList}
                disabled={isLoadingAlerts}
                className="w-full py-2 px-4 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center"
              >
                {isLoadingAlerts ? (
                  <div className={styles.loadingSpinner}></div>
                ) : (
                  <>
                    <i className="fas fa-list-ul mr-2"></i>
                    <span>获取报警列表</span>
                  </>
                )}
              </button>
            </div>
            
            {/* 下载报表模块 */}
            <div className={`${styles.featureCard} bg-white rounded-xl shadow-card p-6`}>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500">
                  <i className="fas fa-file-excel"></i>
                </div>
                <h3 className="ml-3 text-lg font-medium text-text-primary">下载报表</h3>
              </div>
              <p className="text-text-secondary text-sm mb-4">导出系统运行数据报表，支持自定义时间范围和数据维度</p>
              <button 
                onClick={handleDownloadReport}
                disabled={isDownloadingReport}
                className="w-full py-2 px-4 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center"
              >
                {isDownloadingReport ? (
                  <div className={styles.loadingSpinner}></div>
                ) : (
                  <>
                    <i className="fas fa-download mr-2"></i>
                    <span>下载XLSX报表</span>
                  </>
                )}
              </button>
            </div>
            
            {/* 系统状态模块 */}
            <div className={`${styles.featureCard} bg-white rounded-xl shadow-card p-6`}>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-500">
                  <i className="fas fa-server"></i>
                </div>
                <h3 className="ml-3 text-lg font-medium text-text-primary">系统状态</h3>
              </div>
              <p className="text-text-secondary text-sm mb-4">实时查看系统各项资源使用情况和性能指标</p>
              <button 
                onClick={handleViewSystemStatus}
                className="w-full py-2 px-4 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center"
              >
                <i className="fas fa-chart-pie mr-2"></i>
                <span>查看系统状态</span>
              </button>
            </div>
          </div>
          
          {/* 数据展示区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 最近报警表格 */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-text-primary">最近报警</h3>
                <button 
                  onClick={handleRefreshAlerts}
                  className={`text-text-secondary hover:text-text-primary ${isRefreshingAlerts ? 'animate-spin' : ''}`}
                >
                  <i className="fas fa-sync-alt"></i>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-light">
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">报警名称</th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">级别</th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">时间</th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alertsData.map((alert, index) => (
                      <tr key={alert.id} className={index < alertsData.length - 1 ? 'border-b border-border-light' : ''}>
                        <td className="py-3 px-4 text-text-primary">{alert.name}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 ${getLevelStyle(alert.level)} rounded-full text-xs`}>
                            {getLevelText(alert.level)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-text-secondary">{alert.time}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 ${getStatusStyle(alert.status)} rounded-full text-xs`}>
                            {getStatusText(alert.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* 系统性能图表 */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-text-primary">系统性能</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-secondary text-white rounded-lg">今日</button>
                  <button className="px-3 py-1 text-sm text-text-secondary hover:bg-bg-hover rounded-lg">本周</button>
                  <button className="px-3 py-1 text-sm text-text-secondary hover:bg-bg-hover rounded-lg">本月</button>
                </div>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                {isChartLoading ? (
                  <div className="text-center">
                    <div className={`${styles.loadingSpinner} mx-auto mb-2`}></div>
                    <p className="text-text-secondary text-sm">图表加载中...</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-text-secondary">图表已加载完成</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MonitorPlatform;

