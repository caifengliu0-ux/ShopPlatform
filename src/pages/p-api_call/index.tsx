

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface ApiResponse {
  code: number;
  message: string;
  data: any;
}

const ApiCallPage: React.FC = () => {
  const navigate = useNavigate();
  
  // API参数状态
  const [storeIdParam, setStoreIdParam] = useState('');
  const [entityIdParam, setEntityIdParam] = useState('');
  const [userIdParam, setUserIdParam] = useState('');
  const [storeIdsParam, setStoreIdsParam] = useState('');
  
  // API响应结果状态
  const [storeInfoResult, setStoreInfoResult] = useState<ApiResponse | null>(null);
  const [entityInfoResult, setEntityInfoResult] = useState<ApiResponse | null>(null);
  const [userInfoResult, setUserInfoResult] = useState<ApiResponse | null>(null);
  const [storeStatusResult, setStoreStatusResult] = useState<ApiResponse | null>(null);
  
  // 加载状态
  const [isStoreInfoLoading, setIsStoreInfoLoading] = useState(false);
  const [isEntityInfoLoading, setIsEntityInfoLoading] = useState(false);
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(false);
  const [isStoreStatusLoading, setIsStoreStatusLoading] = useState(false);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'API调用 - 商家OpenAI平台';
    return () => { document.title = originalTitle; };
  }, []);

  // 模拟API调用函数
  const simulateApiCall = async (endpoint: string, params: any): Promise<ApiResponse> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 根据不同的API端点返回不同的模拟数据
    let mockData: ApiResponse = { code: 200, message: 'success', data: {} };
    
    if (endpoint === 'store-info') {
      mockData.data = {
        "storeId": params.storeId || "1001",
        "storeName": "示例便利店",
        "address": "北京市朝阳区建国路88号",
        "contactPhone": "010-12345678",
        "businessHours": "08:00-22:00",
        "status": "OPEN",
        "rating": 4.8,
        "createTime": "2023-01-15T08:30:00Z"
      };
    } else if (endpoint === 'entity-info') {
      mockData.data = {
        "entityId": params.entityId || "E2001",
        "entityName": "示例商业有限公司",
        "entityType": "ENTERPRISE",
        "legalPerson": "张三",
        "registrationNumber": "110105000000001",
        "establishmentDate": "2020-05-20",
        "status": "ACTIVE"
      };
    } else if (endpoint === 'user-info') {
      mockData.data = {
        "userId": params.userId || "U3001",
        "userName": "李四",
        "phone": "13800138000",
        "email": "lisi@example.com",
        "role": "ADMIN",
        "permissions": ["READ", "WRITE", "DELETE"],
        "lastLoginTime": "2023-06-10T14:20:00Z"
      };
    } else if (endpoint === 'store-status') {
      const storeIds = params.storeIds || ["1001", "1002", "1003"];
      mockData.data = storeIds.map((id: string) => ({
        "storeId": id,
        "status": Math.random() > 0.2 ? "ONLINE" : "OFFLINE",
        "onlineTime": "2023-06-15T09:00:00Z",
        "serviceCount": Math.floor(Math.random() * 100),
        "avgResponseTime": Math.floor(Math.random() * 500) + 100
      }));
    }
    
    return mockData;
  };

  // API调用处理函数
  const handleStoreInfoApiCall = async () => {
    setIsStoreInfoLoading(true);
    const result = await simulateApiCall('store-info', { storeId: storeIdParam.trim() || '1001' });
    setStoreInfoResult(result);
    setIsStoreInfoLoading(false);
  };

  const handleEntityInfoApiCall = async () => {
    setIsEntityInfoLoading(true);
    const result = await simulateApiCall('entity-info', { entityId: entityIdParam.trim() || 'E2001' });
    setEntityInfoResult(result);
    setIsEntityInfoLoading(false);
  };

  const handleUserInfoApiCall = async () => {
    setIsUserInfoLoading(true);
    const result = await simulateApiCall('user-info', { userId: userIdParam.trim() || 'U3001' });
    setUserInfoResult(result);
    setIsUserInfoLoading(false);
  };

  const handleStoreStatusApiCall = async () => {
    setIsStoreStatusLoading(true);
    const storeIds = storeIdsParam.trim() ? storeIdsParam.split(',').map(id => id.trim()) : ['1001', '1002', '1003'];
    const result = await simulateApiCall('store-status', { storeIds });
    setStoreStatusResult(result);
    setIsStoreStatusLoading(false);
  };

  // 返回主页面
  const handleBackToHome = () => {
    navigate(-1);
  };

  // 滚动到结果区域
  const scrollToResult = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 20,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 搜索框区域 */}
      <div className="bg-white border-b border-border-light p-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full flex items-center">
            {/* 返回主页面按钮 */}
            <button 
              onClick={handleBackToHome}
              className="mr-4 text-text-primary hover:text-text-secondary transition-colors"
            >
              <i className="fas fa-home text-lg"></i>
            </button>
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="搜索API、参数、返回值..." 
                className={`w-full pl-10 pr-4 py-3 border border-border-light rounded-lg text-sm ${styles.searchInputFocus}`}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
            </div>
          </div>
        </div>
      </div>

      {/* 主布局容器 */}
      <div className="flex max-w-7xl mx-auto">
        {/* 左侧目录 */}
        <div className="w-48 pl-0 pr-6 py-6 hidden lg:block">
          <div className="sticky top-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">API目录</h2>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToResult('store-info-api')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-bg-hover text-text-primary text-sm transition-colors"
                >
                  查询店铺信息
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToResult('entity-info-api')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-bg-hover text-text-primary text-sm transition-colors"
                >
                  查询主体信息
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToResult('user-info-api')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-bg-hover text-text-primary text-sm transition-colors"
                >
                  查询用户信息
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToResult('store-status-api')}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-bg-hover text-text-primary text-sm transition-colors"
                >
                  查询门店在线状态
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 pl-0 pr-6 py-6">
          <h1 className="text-2xl font-semibold text-text-primary mb-6">API调用</h1>
          
          {/* API查询模块容器 */}
          <div className="space-y-6">
            {/* 查询店铺信息API */}
            <div id="store-info-api" className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-primary">查询店铺信息</h2>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">GET</span>
              </div>
              <p className="text-sm text-text-secondary mb-4">根据店铺ID查询店铺详细信息，包括名称、地址、联系方式等。</p>
              
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">请求参数</label>
                  <input 
                    type="text" 
                    value={storeIdParam}
                    onChange={(e) => setStoreIdParam(e.target.value)}
                    className={`w-full px-4 py-2 border border-border-light rounded-lg text-sm ${styles.searchInputFocus}`}
                    placeholder='{"storeId": "1001"}'
                  />
                </div>
              </div>
              
              <button 
                onClick={handleStoreInfoApiCall}
                disabled={isStoreInfoLoading}
                className="w-full bg-accent text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {isStoreInfoLoading ? '调用中...' : '调用API'}
              </button>
              
              {storeInfoResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-border-light">
                  <h3 className="text-sm font-medium text-text-primary mb-2">响应结果</h3>
                  <pre className={`text-xs text-text-secondary overflow-x-auto whitespace-pre-wrap ${styles.scrollbarThin}`}>
                    {JSON.stringify(storeInfoResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            {/* 查询主体信息API */}
            <div id="entity-info-api" className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-primary">查询主体信息</h2>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">GET</span>
              </div>
              <p className="text-sm text-text-secondary mb-4">根据主体ID查询企业或个人主体的详细信息。</p>
              
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">请求参数</label>
                  <input 
                    type="text" 
                    value={entityIdParam}
                    onChange={(e) => setEntityIdParam(e.target.value)}
                    className={`w-full px-4 py-2 border border-border-light rounded-lg text-sm ${styles.searchInputFocus}`}
                    placeholder='{"entityId": "E2001"}'
                  />
                </div>
              </div>
              
              <button 
                onClick={handleEntityInfoApiCall}
                disabled={isEntityInfoLoading}
                className="w-full bg-accent text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {isEntityInfoLoading ? '调用中...' : '调用API'}
              </button>
              
              {entityInfoResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-border-light">
                  <h3 className="text-sm font-medium text-text-primary mb-2">响应结果</h3>
                  <pre className={`text-xs text-text-secondary overflow-x-auto whitespace-pre-wrap ${styles.scrollbarThin}`}>
                    {JSON.stringify(entityInfoResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            {/* 查询用户信息API */}
            <div id="user-info-api" className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-primary">查询用户信息</h2>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">GET</span>
              </div>
              <p className="text-sm text-text-secondary mb-4">根据用户ID查询用户的基本信息和权限设置。</p>
              
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">请求参数</label>
                  <input 
                    type="text" 
                    value={userIdParam}
                    onChange={(e) => setUserIdParam(e.target.value)}
                    className={`w-full px-4 py-2 border border-border-light rounded-lg text-sm ${styles.searchInputFocus}`}
                    placeholder='{"userId": "U3001"}'
                  />
                </div>
              </div>
              
              <button 
                onClick={handleUserInfoApiCall}
                disabled={isUserInfoLoading}
                className="w-full bg-accent text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {isUserInfoLoading ? '调用中...' : '调用API'}
              </button>
              
              {userInfoResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-border-light">
                  <h3 className="text-sm font-medium text-text-primary mb-2">响应结果</h3>
                  <pre className={`text-xs text-text-secondary overflow-x-auto whitespace-pre-wrap ${styles.scrollbarThin}`}>
                    {JSON.stringify(userInfoResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            {/* 查询门店在线状态信息API */}
            <div id="store-status-api" className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-primary">查询门店在线状态</h2>
                <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">POST</span>
              </div>
              <p className="text-sm text-text-secondary mb-4">查询多个门店的实时在线状态和服务情况。</p>
              
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">请求参数</label>
                  <textarea 
                    value={storeIdsParam}
                    onChange={(e) => setStoreIdsParam(e.target.value)}
                    className={`w-full px-4 py-2 border border-border-light rounded-lg text-sm ${styles.searchInputFocus}`}
                    rows={3}
                    placeholder='{"storeIds": ["1001", "1002", "1003"]}'
                  />
                </div>
              </div>
              
              <button 
                onClick={handleStoreStatusApiCall}
                disabled={isStoreStatusLoading}
                className="w-full bg-accent text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {isStoreStatusLoading ? '调用中...' : '调用API'}
              </button>
              
              {storeStatusResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-border-light">
                  <h3 className="text-sm font-medium text-text-primary mb-2">响应结果</h3>
                  <pre className={`text-xs text-text-secondary overflow-x-auto whitespace-pre-wrap ${styles.scrollbarThin}`}>
                    {JSON.stringify(storeStatusResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiCallPage;

