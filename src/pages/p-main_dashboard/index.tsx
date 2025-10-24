

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { MenuItem, MermaidData, SourceCode, LLMAnalysis } from './types';

const MainDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [currentFunction, setCurrentFunction] = useState<string>('UserService.getUser');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mermaidScale, setMermaidScale] = useState<number>(1);
  const [recentFunctions, setRecentFunctions] = useState<string[]>([]);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState<string>('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState<boolean>(false);
  const [showCodeDrawer, setShowCodeDrawer] = useState<boolean>(false);
  const [isCodeLoading, setIsCodeLoading] = useState<boolean>(false);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(false);
  
  // Refs
  const mermaidContainerRef = useRef<HTMLDivElement>(null);
  const mermaidDiagramRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // 模拟数据
  const mockMenuData: MenuItem[] = [
    {
      id: 'module-user',
      name: 'User Module',
      type: 'module',
      parentId: null,
      children: [
        {
          id: 'func-getUser',
          name: 'UserService.getUser',
          type: 'function',
          parentId: 'module-user',
          path: 'src/services/UserService.php',
          startLine: 15,
          endLine: 32
        },
        {
          id: 'func-createUser',
          name: 'UserService.createUser',
          type: 'function',
          parentId: 'module-user',
          path: 'src/services/UserService.php',
          startLine: 34,
          endLine: 51
        },
        {
          id: 'func-updateUser',
          name: 'UserService.updateUser',
          type: 'function',
          parentId: 'module-user',
          path: 'src/services/UserService.php',
          startLine: 53,
          endLine: 70
        }
      ]
    },
    {
      id: 'module-order',
      name: 'Order Module',
      type: 'module',
      parentId: null,
      children: [
        {
          id: 'func-createOrder',
          name: 'OrderService.createOrder',
          type: 'function',
          parentId: 'module-order',
          path: 'src/services/OrderService.php',
          startLine: 12,
          endLine: 28
        },
        {
          id: 'func-getOrder',
          name: 'OrderService.getOrder',
          type: 'function',
          parentId: 'module-order',
          path: 'src/services/OrderService.php',
          startLine: 30,
          endLine: 45
        }
      ]
    },
    {
      id: 'module-payment',
      name: 'Payment Module',
      type: 'module',
      parentId: null,
      children: [
        {
          id: 'func-processPayment',
          name: 'PaymentGateway.processPayment',
          type: 'function',
          parentId: 'module-payment',
          path: 'src/gateways/PaymentGateway.php',
          startLine: 8,
          endLine: 25
        }
      ]
    }
  ];

  const mockMermaidData: MermaidData = {
    'UserService.getUser': `
      sequenceDiagram
        participant Client
        participant API Gateway
        participant UserService
        participant Database
        participant AuthService
        participant OrderService
        
        Client->>API Gateway: GET /users/{id}
        API Gateway->>UserService: getUser(userId)
        UserService->>AuthService: validateToken(token)
        AuthService-->>UserService: tokenValid
        UserService->>Database: queryUser(userId)
        Database-->>UserService: userData
        UserService->>OrderService: getUserOrders(userId)
        OrderService-->>UserService: userOrders
        UserService-->>API Gateway: userResponse
        API Gateway-->>Client: 200 OK + userData
    `,
    'OrderService.createOrder': `
      sequenceDiagram
        participant Client
        participant API Gateway
        participant OrderService
        participant UserService
        participant PaymentGateway
        participant Database
        
        Client->>API Gateway: POST /orders
        API Gateway->>OrderService: createOrder(orderData)
        OrderService->>UserService: getUser(userId)
        UserService-->>OrderService: userData
        OrderService->>PaymentGateway: processPayment(paymentData)
        PaymentGateway-->>OrderService: paymentResult
        OrderService->>Database: saveOrder(orderData)
        Database-->>OrderService: orderId
        OrderService-->>API Gateway: orderResponse
        API Gateway-->>Client: 201 Created + orderData
    `,
    'PaymentGateway.processPayment': `
      sequenceDiagram
        participant OrderService
        participant PaymentGateway
        participant ExternalPaymentAPI
        participant Database
        
        OrderService->>PaymentGateway: processPayment(paymentData)
        PaymentGateway->>ExternalPaymentAPI: submitPayment(paymentData)
        ExternalPaymentAPI-->>PaymentGateway: paymentStatus
        PaymentGateway->>Database: logPayment(paymentData, status)
        Database-->>PaymentGateway: logId
        PaymentGateway-->>OrderService: paymentResult
    `
  };

  const mockSourceCode: SourceCode = {
    'UserService.getUser': `class UserService {
    private $userRepository;
    private $authService;
    
    public function __construct(UserRepository $userRepository, AuthService $authService) {
        $this->userRepository = $userRepository;
        $this->authService = $authService;
    }
    
    public function getUser(string $userId, string $token): UserDto {
        // 验证token
        if (!$this->authService->validateToken($token)) {
            throw new UnauthorizedException("Invalid token");
        }
        
        // 查询用户
        $user = $this->userRepository->findById($userId);
        if (!$user) {
            throw new UserNotFoundException("User not found");
        }
        
        // 转换为DTO
        return UserMapper::toDto($user);
    }
}`,
    'OrderService.createOrder': `class OrderService {
    private $orderRepository;
    private $userService;
    private $paymentGateway;
    
    public function __construct(OrderRepository $orderRepository, UserService $userService, PaymentGateway $paymentGateway) {
        $this->orderRepository = $orderRepository;
        $this->userService = $userService;
        $this->paymentGateway = $paymentGateway;
    }
    
    public function createOrder(array $orderData, string $userId): OrderDto {
        // 获取用户信息
        $user = $this->userService->getUser($userId, $orderData['token']);
        
        // 处理支付
        $paymentResult = $this->paymentGateway->processPayment($orderData['payment']);
        if (!$paymentResult['success']) {
            throw new PaymentFailedException("Payment processing failed");
        }
        
        // 创建订单
        $order = new Order($user, $orderData['items'], $paymentResult['transactionId']);
        $savedOrder = $this->orderRepository->save($order);
        
        return OrderMapper::toDto($savedOrder);
    }
}`
  };

  const mockLLMAnalysis: LLMAnalysis = {
    'UserService.getUser': `
      <div>
        <h4 class="font-medium text-text-primary mb-1">功能概述</h4>
        <p class="text-text-secondary text-xs leading-relaxed">
          该方法用于根据用户ID获取用户信息，包含token验证、用户查询和DTO转换三个主要步骤。
        </p>
      </div>
      <div>
        <h4 class="font-medium text-text-primary mb-1">关键逻辑</h4>
        <ul class="text-text-secondary text-xs leading-relaxed space-y-1">
          <li>• 首先验证token的有效性</li>
          <li>• 从数据库查询用户信息</li>
          <li>• 处理用户不存在的异常</li>
          <li>• 将实体转换为DTO返回</li>
        </ul>
      </div>
      <div>
        <h4 class="font-medium text-text-primary mb-1">依赖服务</h4>
        <ul class="text-text-secondary text-xs leading-relaxed space-y-1">
          <li>• AuthService: 负责token验证</li>
          <li>• UserRepository: 数据库访问层</li>
          <li>• UserMapper: 实体-DTO转换</li>
        </ul>
      </div>
    `,
    'OrderService.createOrder': `
      <div>
        <h4 class="font-medium text-text-primary mb-1">功能概述</h4>
        <p class="text-text-secondary text-xs leading-relaxed">
          该方法用于创建新订单，包含用户验证、支付处理、订单保存等完整业务流程。
        </p>
      </div>
      <div>
        <h4 class="font-medium text-text-primary mb-1">关键逻辑</h4>
        <ul class="text-text-secondary text-xs leading-relaxed space-y-1">
          <li>• 获取并验证用户信息</li>
          <li>• 处理支付流程</li>
          <li>• 支付失败异常处理</li>
          <li>• 创建并保存订单记录</li>
          <li>• 转换为DTO返回结果</li>
        </ul>
      </div>
      <div>
        <h4 class="font-medium text-text-primary mb-1">依赖服务</h4>
        <ul class="text-text-secondary text-xs leading-relaxed space-y-1">
          <li>• UserService: 用户信息获取</li>
          <li>• PaymentGateway: 支付处理</li>
          <li>• OrderRepository: 订单数据访问</li>
          <li>• OrderMapper: 实体-DTO转换</li>
        </ul>
      </div>
    `
  };

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '代码解析 - 商家OpenAI平台';
    return () => { document.title = originalTitle; };
  }, []);

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarCollapsed]);

  // 渲染Mermaid图
  useEffect(() => {
    const renderMermaid = () => {
      if (mermaidDiagramRef.current) {
        const mermaidCode = mockMermaidData[currentFunction] || mockMermaidData['UserService.getUser'];
        mermaidDiagramRef.current.innerHTML = `<pre class="whitespace-pre-wrap font-mono text-xs">${mermaidCode}</pre>`;
      }
    };

    renderMermaid();
  }, [currentFunction]);

  // 处理Mermaid图缩放
  const handleZoomIn = () => {
    setMermaidScale(prevScale => Math.min(prevScale + 0.1, 2));
  };

  const handleZoomOut = () => {
    setMermaidScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  const handleZoomReset = () => {
    setMermaidScale(1);
  };

  // 切换侧边栏
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  // 选择函数
  const selectFunction = (funcName: string) => {
    setCurrentFunction(funcName);
    
    // 添加到最近访问
    setRecentFunctions(prev => {
      if (!prev.includes(funcName)) {
        const newRecent = [funcName, ...prev];
        return newRecent.slice(0, 5);
      }
      return prev;
    });
  };

  // 搜索建议
  const getSearchSuggestions = (query: string): string[] => {
    const allFunctions = mockMenuData.flatMap(module => 
      module.children?.map(func => func.name) || []
    );
    
    return allFunctions.filter(func => 
      func.toLowerCase().includes(query.toLowerCase())
    );
  };

  // 处理搜索输入
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSidebarSearchQuery(query);
    
    if (query.length > 0) {
      setShowSearchSuggestions(true);
    } else {
      setShowSearchSuggestions(false);
    }
  };

  // 处理搜索建议点击
  const handleSuggestionClick = (funcName: string) => {
    selectFunction(funcName);
    setSidebarSearchQuery('');
    setShowSearchSuggestions(false);
  };

  // 切换代码抽屉
  const toggleCodeDrawer = () => {
    setShowCodeDrawer(prev => !prev);
  };

  // 复制到剪贴板
  const copyToClipboard = async (text: string, button: HTMLButtonElement) => {
    try {
      await navigator.clipboard.writeText(text);
      const originalIcon = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check text-xs"></i>';
      setTimeout(() => {
        button.innerHTML = originalIcon;
      }, 1000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // 渲染目录树
  const renderDirectoryTree = () => {
    const renderModule = (module: MenuItem) => (
      <div key={module.id} className="mb-2">
        <div 
          className={`flex items-center justify-between p-3 rounded-lg ${styles.menuItemHover} cursor-pointer`}
          onClick={() => {
            // 模块展开/折叠逻辑可以在这里实现
          }}
        >
          <div className="flex items-center space-x-3">
            <i className="fas fa-cube text-secondary text-sm"></i>
            <span className="text-sm font-medium text-text-primary">{module.name}</span>
          </div>
          <i className="fas fa-chevron-right text-xs text-text-secondary transform transition-transform"></i>
        </div>
        
        <div className="ml-6 mt-1 space-y-1">
          {module.children?.map(func => (
            <div
              key={func.id}
              className={`p-2 rounded-lg ${styles.menuItemHover} cursor-pointer ${
                currentFunction === func.name ? 'bg-secondary text-white' : ''
              }`}
              onClick={() => selectFunction(func.name)}
            >
              <i className="fas fa-code text-xs mr-2 text-text-secondary"></i>
              <span className="text-sm text-text-primary">{func.name}</span>
            </div>
          ))}
        </div>
      </div>
    );

    return mockMenuData.map(module => renderModule(module));
  };

  // 获取当前模块名称
  const getCurrentModuleName = (): string => {
    if (currentFunction.includes('UserService')) return 'User Module';
    if (currentFunction.includes('OrderService')) return 'Order Module';
    return 'Payment Module';
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo和产品名称 */}
          <Link to="/home" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <i className="fas fa-home text-white text-sm"></i>
            </div>
            <span className="text-text-primary font-medium">商家OpenAI平台</span>
          </Link>
           
          
          {/* 全局搜索框 */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="搜索函数、模块..." 
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchInputFocus} text-sm`}
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
        {/* 左侧目录区 */}
        <aside className={`${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded} bg-white border-r border-border-light flex-shrink-0 transition-all duration-300`}>
          {/* 侧边栏切换按钮 */}
          <div className="p-2 border-b border-border-light">
            <button 
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors"
            >
              <i className="fas fa-bars text-sm"></i>
            </button>
          </div>
          
          {/* 目录搜索框 */}
          <div className="p-4 border-b border-border-light relative">
            <div className="relative">
              <input 
                ref={searchInputRef}
                type="text" 
                value={sidebarSearchQuery}
                onChange={handleSearchInputChange}
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                placeholder="搜索函数、模块..." 
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchInputFocus} text-sm`}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
            </div>
            
            {/* 搜索联想结果 */}
            {showSearchSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border-light rounded-lg shadow-card z-10">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm text-text-secondary">搜索建议</div>
                  <div className="space-y-1">
                    {getSearchSuggestions(sidebarSearchQuery).map((func, index) => (
                      <div
                        key={index}
                        className={`px-3 py-2 ${styles.menuItemHover} rounded cursor-pointer`}
                        onClick={() => handleSuggestionClick(func)}
                      >
                        <i className="fas fa-code text-xs mr-2 text-text-secondary"></i>
                        <span className="text-sm">{func}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 目录树 */}
          <div className={`flex-1 overflow-y-auto ${styles.scrollbarMinimal}`}>
            <div className="p-4">
              {renderDirectoryTree()}
            </div>
          </div>
        </aside>

        {/* 中间Mermaid图展示区 */}
        <main className="flex-1 flex flex-col">
          {/* 页面头部 */}
          <div className="bg-white border-b border-border-light px-6 py-4">
            <div className="flex items-center justify-between">
              {/* 面包屑导航 */}
              <nav className="flex items-center space-x-2 text-sm">
                <span className="text-text-secondary">{getCurrentModuleName()}</span>
                <i className="fas fa-chevron-right text-xs text-text-secondary"></i>
                <span className="text-text-primary font-medium">{currentFunction}</span>
              </nav>
              
              {/* Mermaid图控制按钮 */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleZoomOut}
                  className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors"
                >
                  <i className="fas fa-search-minus text-sm"></i>
                </button>
                <button 
                  onClick={handleZoomReset}
                  className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors"
                >
                  <i className="fas fa-home text-sm"></i>
                </button>
                <button 
                  onClick={handleZoomIn}
                  className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors"
                >
                  <i className="fas fa-search-plus text-sm"></i>
                </button>
                <button 
                  onClick={toggleCodeDrawer}
                  className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors xl:hidden"
                >
                  <i className="fas fa-code text-sm"></i>
                </button>
              </div>
            </div>
          </div>
          
          {/* Mermaid图展示区 */}
          <div className="flex-1 p-6">
            <div ref={mermaidContainerRef} className={`${styles.mermaidContainer} rounded-xl p-6 h-full`}>
              <div 
                ref={mermaidDiagramRef}
                className={`h-full overflow-auto ${styles.scrollbarMinimal}`}
                style={{ transform: `scale(${mermaidScale})` }}
              >
                {/* Mermaid图将动态生成 */}
              </div>
            </div>
          </div>
        </main>

        {/* 右侧代码与解析区 */}
        <aside className="w-80 bg-white border-l border-border-light flex-shrink-0 hidden xl:block">
          {/* 代码展示面板 */}
          <div className="border-b border-border-light">
            <div className="flex items-center justify-between p-4 border-b border-border-light">
              <h3 className="text-sm font-medium text-text-primary">源代码</h3>
              <button 
                onClick={(e) => copyToClipboard(mockSourceCode[currentFunction] || mockSourceCode['UserService.getUser'], e.currentTarget)}
                className="p-1 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
              >
                <i className="fas fa-copy text-xs"></i>
              </button>
            </div>
            <div className="p-4">
              <div className={`${styles.codePanel} rounded-lg p-4 h-64 overflow-auto ${styles.scrollbarMinimal}`}>
                {isCodeLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className={styles.loadingSpinner}></div>
                    <span className="ml-2 text-sm text-text-secondary">加载中...</span>
                  </div>
                ) : (
                  <pre>
                    <code className="language-php text-xs">
                      {mockSourceCode[currentFunction] || mockSourceCode['UserService.getUser']}
                    </code>
                  </pre>
                )}
              </div>
            </div>
          </div>
          
          {/* LLM解析结果面板 */}
          <div className="flex-1">
            <div className="flex items-center justify-between p-4 border-b border-border-light">
              <h3 className="text-sm font-medium text-text-primary">智能解析</h3>
              <button 
                onClick={(e) => {
                  const analysis = document.querySelector('#analysis-content')?.textContent || '';
                  copyToClipboard(analysis, e.currentTarget);
                }}
                className="p-1 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
              >
                <i className="fas fa-copy text-xs"></i>
              </button>
            </div>
            <div className="p-4">
              <div className={`bg-gray-50 border border-border-light rounded-lg p-4 h-64 overflow-auto ${styles.scrollbarMinimal}`}>
                {isAnalysisLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className={styles.loadingSpinner}></div>
                    <span className="ml-2 text-sm text-text-secondary">AI解析中...</span>
                  </div>
                ) : (
                  <div id="analysis-content" className="text-sm text-text-primary space-y-3">
                    <div>
                      <h4 className="font-medium text-text-primary mb-1">功能概述</h4>
                      <p className="text-text-secondary text-xs leading-relaxed">
                        该方法用于根据用户ID获取用户信息，包含token验证、用户查询和DTO转换三个主要步骤。
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary mb-1">关键逻辑</h4>
                      <ul className="text-text-secondary text-xs leading-relaxed space-y-1">
                        <li>• 首先验证token的有效性</li>
                        <li>• 从数据库查询用户信息</li>
                        <li>• 处理用户不存在的异常</li>
                        <li>• 将实体转换为DTO返回</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary mb-1">依赖服务</h4>
                      <ul className="text-text-secondary text-xs leading-relaxed space-y-1">
                        <li>• AuthService: 负责token验证</li>
                        <li>• UserRepository: 数据库访问层</li>
                        <li>• UserMapper: 实体-DTO转换</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* 代码解析抽屉（小屏幕模式） */}
      {showCodeDrawer && (
        <div className={`fixed inset-0 ${styles.drawerOverlay} z-40 xl:hidden`}>
          <div className={`absolute right-0 top-0 bottom-0 w-96 bg-white ${styles.codeDrawer} open`}>
            {/* 抽屉头部 */}
            <div className="flex items-center justify-between p-4 border-b border-border-light">
              <h3 className="text-sm font-medium text-text-primary">代码解析</h3>
              <button 
                onClick={toggleCodeDrawer}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
            
            {/* 抽屉内容 */}
            <div className="flex-1 overflow-y-auto">
              {/* 代码展示面板 */}
              <div className="border-b border-border-light">
                <div className="flex items-center justify-between p-4 border-b border-border-light">
                  <h4 className="text-sm font-medium text-text-primary">源代码</h4>
                  <button 
                    onClick={(e) => copyToClipboard(mockSourceCode[currentFunction] || mockSourceCode['UserService.getUser'], e.currentTarget)}
                    className="p-1 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
                  >
                    <i className="fas fa-copy text-xs"></i>
                  </button>
                </div>
                <div className="p-4">
                  <div className={`${styles.codePanel} rounded-lg p-4 h-48 overflow-auto ${styles.scrollbarMinimal}`}>
                    <pre>
                      <code className="language-php text-xs">
                        {mockSourceCode[currentFunction] || mockSourceCode['UserService.getUser']}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
              
              {/* LLM解析结果面板 */}
              <div>
                <div className="flex items-center justify-between p-4 border-b border-border-light">
                  <h4 className="text-sm font-medium text-text-primary">智能解析</h4>
                  <button 
                    onClick={(e) => {
                      const analysis = document.querySelector('#drawer-analysis-content')?.textContent || '';
                      copyToClipboard(analysis, e.currentTarget);
                    }}
                    className="p-1 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
                  >
                    <i className="fas fa-copy text-xs"></i>
                  </button>
                </div>
                <div className="p-4">
                  <div className={`bg-gray-50 border border-border-light rounded-lg p-4 h-48 overflow-auto ${styles.scrollbarMinimal}`}>
                    <div id="drawer-analysis-content" className="text-sm text-text-primary space-y-3">
                      <div>
                        <h5 className="font-medium text-text-primary mb-1">功能概述</h5>
                        <p className="text-text-secondary text-xs leading-relaxed">
                          该方法用于根据用户ID获取用户信息，包含token验证、用户查询和DTO转换三个主要步骤。
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-text-primary mb-1">关键逻辑</h5>
                        <ul className="text-text-secondary text-xs leading-relaxed space-y-1">
                          <li>• 首先验证token的有效性</li>
                          <li>• 从数据库查询用户信息</li>
                          <li>• 处理用户不存在的异常</li>
                          <li>• 将实体转换为DTO返回</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainDashboard;

