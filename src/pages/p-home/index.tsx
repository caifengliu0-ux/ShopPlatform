

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [globalSearchValue, setGlobalSearchValue] = useState('');

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '商家OpenAI平台 - 首页';
    return () => { document.title = originalTitle; };
  }, []);

  const handleHelpButtonClick = () => {
    console.log('帮助功能需要帮助系统支持');
    alert('帮助系统即将上线，敬请期待！');
  };

  const handleSettingsButtonClick = () => {
    console.log('设置功能需要设置页面支持');
    alert('设置功能即将上线，敬请期待！');
  };

  const handleGlobalSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = globalSearchValue.trim();
      if (searchTerm) {
        console.log('搜索功能需要后端搜索服务支持');
        alert(`搜索功能即将上线，您搜索的内容：${searchTerm}`);
      }
    }
  };

  const recordRecentAccess = (featureName: string) => {
    const recentAccessKey = 'recent_features';
    let recentFeatures: string[] = [];
    
    if (typeof window !== 'undefined') {
      const storedFeatures = localStorage.getItem(recentAccessKey);
      if (storedFeatures) {
        recentFeatures = JSON.parse(storedFeatures);
      }
      
      // 移除已存在的相同项
      recentFeatures = recentFeatures.filter(item => item !== featureName);
      
      // 添加到开头
      recentFeatures.unshift(featureName);
      
      // 限制只保留最近5个
      if (recentFeatures.length > 5) {
        recentFeatures = recentFeatures.slice(0, 5);
      }
      
      localStorage.setItem(recentAccessKey, JSON.stringify(recentFeatures));
      console.log('最近访问功能：', recentFeatures);
    }
  };

  const handleFeatureCardClick = (featureName: string, path: string) => {
    recordRecentAccess(featureName);
    navigate(path);
  };

  const handleResize = () => {
    console.log('窗口大小改变，当前宽度：', window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化调用
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo和产品名称 */}
          <Link to="/home" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <i className="fas fa-robot text-white text-sm"></i>
            </div>
            <span className="text-text-primary font-medium">商家OpenAI平台</span>
          </Link>
          
          {/* 全局搜索框 */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                value={globalSearchValue}
                onChange={(e) => setGlobalSearchValue(e.target.value)}
                onKeyPress={handleGlobalSearchKeyPress}
                placeholder="搜索功能、文档..." 
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg text-sm ${styles.searchInputFocus}`}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
            </div>
          </div>
          
          {/* 用户操作区 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleHelpButtonClick}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors"
            >
              <i className="fas fa-question-circle text-lg"></i>
            </button>
            <button 
              onClick={handleSettingsButtonClick}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors"
            >
              <i className="fas fa-cog text-lg"></i>
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="pt-16">
        {/* 产品介绍区 */}
        <section className={`${styles.heroGradient} py-2 px-6 flex items-center min-h-[200px]`}>
          <div className="max-w-6xl mx-auto text-center w-full">
            <div className={styles.fadeInElement}>
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mt-4 mb-3">
                一站式AI服务管理平台
              </h1>
              <p className="text-xl text-text-secondary mb-4 max-w-3xl mx-auto">
                集成代码解析、API调用、日志管理和系统监控，让AI服务管理变得简单高效
              </p>
            </div>
          </div>
        </section>

        {/* 功能区入口 */}
        <section className="py-5 px-6">
          <div className="max-w-6xl mx-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* AI答疑功能卡片 */}
              <div 
                onClick={() => handleFeatureCardClick('ai-qa', '/ai-qa')}
                className={`bg-white rounded-xl shadow-card p-8 cursor-pointer transition-all ${styles.featureCardHover}`}
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <i className="fas fa-robot text-2xl text-indigo-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4 text-center">AI答疑</h3>
                <p className="text-text-secondary text-sm mb-6 text-center leading-relaxed">
                  智能问答系统，解答您在使用过程中遇到的技术问题和操作疑问
                </p>
                <button className={`w-full py-3 bg-indigo-50 text-indigo-600 rounded-lg font-medium transition-all ${styles.btnHover}`}>
                  <i className="fas fa-arrow-right mr-2"></i>
                  开始提问
                </button>
              </div>
              
              {/* API调用功能卡片 */}
              <div 
                onClick={() => handleFeatureCardClick('api-call', '/api-call')}
                className={`bg-white rounded-xl shadow-card p-8 cursor-pointer transition-all ${styles.featureCardHover}`}
              >
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <i className="fas fa-plug text-2xl text-green-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4 text-center">API调用</h3>
                <p className="text-text-secondary text-sm mb-6 text-center leading-relaxed">
                  便捷的API接口调用平台，支持参数配置和调用历史记录
                </p>
                <button className={`w-full py-3 bg-green-50 text-green-600 rounded-lg font-medium transition-all ${styles.btnHover}`}>
                  <i className="fas fa-arrow-right mr-2"></i>
                  调用API
                </button>
              </div>
              
              {/* 代码解析功能卡片 */}
              <div 
                onClick={() => handleFeatureCardClick('code-analysis', '/main-dashboard')}
                className={`bg-white rounded-xl shadow-card p-8 cursor-pointer transition-all ${styles.featureCardHover}`}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <i className="fas fa-code text-2xl text-blue-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4 text-center">代码解析</h3>
                <p className="text-text-secondary text-sm mb-6 text-center leading-relaxed">
                  可视化展示代码调用链，智能解析函数关系，提升代码理解效率
                </p>
                <button className={`w-full py-3 bg-blue-50 text-blue-600 rounded-lg font-medium transition-all ${styles.btnHover}`}>
                  <i className="fas fa-arrow-right mr-2"></i>
                  开始分析
                </button>
              </div>
              
              {/* 监控平台功能卡片 */}
              <div 
                onClick={() => handleFeatureCardClick('monitor-platform', '/monitor-platform')}
                className={`bg-white rounded-xl shadow-card p-8 cursor-pointer transition-all ${styles.featureCardHover}`}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <i className="fas fa-chart-line text-2xl text-purple-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4 text-center">监控平台</h3>
                <p className="text-text-secondary text-sm mb-6 text-center leading-relaxed">
                  全面的系统状态监控，实时掌握服务运行情况和性能指标
                </p>
                <button className={`w-full py-3 bg-purple-50 text-purple-600 rounded-lg font-medium transition-all ${styles.btnHover}`}>
                  <i className="fas fa-arrow-right mr-2"></i>
                  查看监控
                </button>
              </div>
              
              {/* 日志平台功能卡片 */}
              <div 
                onClick={() => handleFeatureCardClick('log-platform', '/log-platform')}
                className={`bg-white rounded-xl shadow-card p-8 cursor-pointer transition-all ${styles.featureCardHover}`}
              >
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <i className="fas fa-file-alt text-2xl text-orange-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4 text-center">日志平台</h3>
                <p className="text-text-secondary text-sm mb-6 text-center leading-relaxed">
                  强大的日志查询和分析工具，支持实时监控和异常告警
                </p>
                <button className={`w-full py-3 bg-orange-50 text-orange-600 rounded-lg font-medium transition-all ${styles.btnHover}`}>
                  <i className="fas fa-arrow-right mr-2"></i>
                  查看日志
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;

