

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { MenuItem, MermaidData, SourceCode, LLMAnalysis } from './types';
import mermaid from "mermaid";
import Split from 'react-split';


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
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const mermaidContainerRef = useRef<HTMLDivElement>(null);
  const mermaidDiagramRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [leftWidth, setLeftWidth] = useState(300); // 默认左侧宽
  const [rightWidth, setRightWidth] = useState(320); // 默认右侧宽
  const resizingRef = useRef<'left' | 'right' | null>(null);

  // 响应式折叠逻辑
useEffect(() => {
  const handleResize = () => {
    // 当宽度小于 1024 时自动折叠，否则展开
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  };

  // 初始化执行一次
  handleResize();

  // 绑定事件
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []); // ✅ 注意：依赖数组为空，只执行一次

  const startLeftResize = (e: React.MouseEvent) => {
    resizingRef.current = 'left';
    e.preventDefault();
  };

  const startRightResize = (e: React.MouseEvent) => {
    resizingRef.current = 'right';
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;
      if (resizingRef.current === 'left') {
        setLeftWidth(Math.max(200, e.clientX)); // 最小200px
      } else if (resizingRef.current === 'right' && containerRef.current) {
        const newWidth = window.innerWidth - e.clientX;
        setRightWidth(Math.max(200, newWidth));
      }
    };
    const handleMouseUp = () => { resizingRef.current = null; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);



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

  // mock 函数对应节点
  const mockNodeToFunctions: Record<string, string[]> = {
    "Client": ["GET /users/{id}"],
    "API Gateway": ["getUser(userId)"]
  };

  const mockMermaidData: MermaidData = {
    'UserService.getUser': `
      sequenceDiagram
    participant Controller as Border::newOrdersAction
    Controller->>ShopModel: formatShopIdListAndAuth()
    Controller->>ShopModel: getShopListByOrderConfirmMethod()
    ShopModel->>ShopModel: getShopOrderConfirmMethod()
    ShopModel->>ShopModel: getShopBaseInfoChunkBySize()
    ShopModel->>ShopModel: getShopBaseInfoByIDs()
    ShopModel->>ShopModel: getShopCommonInfo()
    Controller->>TradeModel: setRequestSourceVersion()
    Controller->>ShopModel: getShopInfoAndFilterByAttribute()
    ShopModel->>ShopModel: getShopBaseInfoByIDs()
    ShopModel->>ShopModel: getShopCommonInfo()
    ShopModel->>ShopExtModel: filterShopByGrayAndBAppBackupValue()
    ShopExtModel->>Apollo: getOpenapiBAppBackupGray()
    Apollo->>Apollo: getApolloConfig()
    Controller->>ShopModel: isHitMixedDeliveryGray()
    Controller->>OrderBaseModel: getNewAndHighLightOrderByShopIDs()
    OrderBaseModel->>OrderDataModel: getNewOrders()
    OrderDataModel->>OrderDataModel: _formatUnfinishedListParams()
    OrderDataModel->>OrderDataModel: _unfinishedOrderList()
    OrderDataModel->>Order: getUnfinishedOrderList()
    OrderDataModel->>Apollo: getApolloConfig()
    OrderBaseModel->>OrderDataModel: getNewHightLightOrders()
    OrderDataModel->>Apollo: getApolloConfig()
    OrderDataModel->>OrderDataModel: _formatUnfinishedListParams()
    OrderDataModel->>OrderDataModel: _unfinishedOrderList()
    OrderDataModel->>Order: getUnfinishedOrderList()
    OrderDataModel->>Apollo: getApolloConfig()
    OrderBaseModel->>OrderTicketModel: needPrintTicket()
    OrderTicketModel->>OrderBaseModel: isNotCanceledByShop()
    OrderBaseModel->>OrderItemModel: convertOrderItemList()
    OrderItemModel->>ItemModel: getItemListByItemIds()
    ItemModel->>ClientModel: getItemClient()
    OrderItemModel->>CurrencyConvertor: getCurrencyEntity()
    CurrencyConvertor->>CurrencyConvertor: getCurrencySymbol()
    CurrencyConvertor->>CurrencyConvertor: formatCents2Yuan()
    OrderBaseModel->>Constant: getDisplayStatusText()
    OrderBaseModel->>Constant: getActions()
    OrderBaseModel->>OrderBaseModel: getDisplayInfo()
    OrderBaseModel->>OrderBaseModel: _convertInfoByDisplayStatus()
    OrderBaseModel->>OrderBaseModel: getDisplayStatusByOrderStatus()
    OrderBaseModel->>OrderBaseModel: _isShowCountDown()
    OrderBaseModel->>OrderBaseModel: getPreparedTime()
    OrderBaseModel->>RedisService: getFusionClient()
    OrderBaseModel->>OrderBaseModel: checkCancelApply()
    OrderBaseModel->>OrderItemModel: convertOrderItemList()
    OrderItemModel->>ItemModel: getItemListByItemIds()
    ItemModel->>ClientModel: getItemClient()
    OrderItemModel->>CurrencyConvertor: getCurrencyEntity()
    CurrencyConvertor->>CurrencyConvertor: getCurrencySymbol()
    CurrencyConvertor->>CurrencyConvertor: formatCents2Yuan()
    OrderBaseModel->>OrderBaseModel: _convertInfoBySubStatus()
    OrderBaseModel->>OrderBaseModel: checkCancelApply()
    OrderBaseModel->>OrderBaseModel: _convertInfoByDeliveryType()
    OrderBaseModel->>OrderBaseModel: checkCancelApply()
    OrderBaseModel->>OrderBaseModel: getPreparedTime()
    OrderBaseModel->>RedisService: getFusionClient()
    OrderBaseModel->>OrderBaseModel: _convertInfoByReminder()
    OrderBaseModel->>OrderBaseModel: setBETA4NewOrders()
    OrderBaseModel->>OrderBaseModel: getBETATimeMap()
    OrderBaseModel->>ShopModel: mayUseBETATimeOrderByShopInfo()
    ShopModel->>ShopModel: inBetaWhiteListByShopInfo()
    ShopModel->>Apollo: getAllApolloInfo()
    OrderBaseModel->>ShopModel: batchGetShopETATime()
    ShopModel->>ShopModel: packageBatchData()
    ShopModel->>Forecastor: batchGetShopETA()
    Forecastor->>Forecastor: _getClient()
    OrderBaseModel->>OrderBaseModel: getMealTimeStatus()
    Controller->>ShopModel: getDefaultTtsConf()
    Controller->>ShopModel: ttsConfFilter()
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

  const filteredNodes = searchQuery
    ? Object.keys(mockNodeToFunctions).filter(node =>
      node.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : Object.keys(mockNodeToFunctions);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '代码解析 - 商家OpenAI平台';
    return () => { document.title = originalTitle; };
  }, []);



  // 初始化 Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
    });
  }, []);


  // 渲染 Mermaid 图（不绑定点击事件）
  useEffect(() => {
    const renderMermaid = async () => {
      if (!mermaidDiagramRef.current) return;

      try {
        const mermaidCode =
          mockMermaidData[currentFunction] || mockMermaidData["UserService.getUser"];
        if (!mermaidCode) return;

        // 渲染成 SVG 字符串
        const { svg } = await mermaid.render("diagram", mermaidCode);
        mermaidDiagramRef.current.innerHTML = svg;

        // 可选：调整样式或高亮
        const svgElement = mermaidDiagramRef.current.querySelector("svg");
        if (svgElement) {
          svgElement.style.width = "500%";
          svgElement.style.height = "auto";
        }

      } catch (err) {
        console.error("Mermaid 渲染失败:", err);
      }
    };

    renderMermaid();
  }, [currentFunction]);



  // 发送 API 请求函数
  const fetchCodeAndExplanation = async (target: string) => {
    try {
      console.log("📡 正在请求节点信息：", target);

      //const res = await fetch(`/api/getInfo?name=${encodeURIComponent(target)}`);
      //const data = await res.json();
      //console.log("✅ 收到数据：", data);
      // 这里你可以用 modal、右侧面板、console.log 等展示内容
      //alert(`节点：${target}\n\n代码：${data.code}\n\n解释：${data.explanation}`);

      const code = mockSourceCode["UserService.getUser"];
      const explanation = mockLLMAnalysis["UserService.getUser"];
      setSelectedLabel(target);
      setCode(code);
      setAnalysis(explanation);
      alert(`【${target}】\n\n代码:\n${code}\n\n说明:\n${explanation}`);

    } catch (error) {
      console.error("请求失败:", error);
    }
  };


  // 处理Mermaid图缩放
  const handleZoomIn = () => {
    setMermaidScale((s) => s + 1);
  };

  const handleZoomOut = () => {
    if (!containerRef.current || !mermaidDiagramRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    const contentWidth = mermaidDiagramRef.current.scrollWidth;
    const contentHeight = mermaidDiagramRef.current.scrollHeight;

    const minScale = Math.min(containerWidth / contentWidth, containerHeight / contentHeight, 1);
    setMermaidScale((s) => Math.max(s - 0.1, minScale));
  };

  const handleZoomReset = () => {
    if (!containerRef.current || !mermaidDiagramRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    const contentWidth = mermaidDiagramRef.current.scrollWidth;
    const contentHeight = mermaidDiagramRef.current.scrollHeight;

    const minScale = Math.min(containerWidth / contentWidth, containerHeight / contentHeight, 1);
    setMermaidScale(minScale);
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
              className={`p-2 rounded-lg ${styles.menuItemHover} cursor-pointer ${currentFunction === func.name ? 'bg-secondary text-white' : ''
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
      <div className="flex pt-16 min-h-screen relative h-screen">
        {/* 左侧目录区 */}
        <aside className={`${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded} bg-white border-r border-border-light flex-shrink-0 transition-all duration-300 z-40`}>
          <div
            className="flex flex-col h-full"
          >
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
            <div className="p-4 border-b border-border-light relative z-40">
              <div className="relative z-40">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={sidebarSearchQuery}
                  onChange={handleSearchInputChange}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
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
            <div className={`flex-1 overflow-y-auto 
            ${styles.scrollbarMinimal}`}>
              <div className="p-4">
                {renderDirectoryTree()}
              </div>
            </div>
          </div>
        </aside>

        {/* 中间 Mermaid 图展示区 */}
        <main className="flex-1 flex flex-col overflow-auto relative z=0" ref={containerRef} >
          {/* 页面头部 */}
          <div className="bg-white border-b border-border-light px-6 py-4 z-20 relative">
            <div className="flex items-center justify-between">
              {/* 面包屑导航 */}
              <nav className="flex items-center space-x-2 text-sm">
                <span className="text-text-secondary">{getCurrentModuleName()}</span>
                <i className="fas fa-chevron-right text-xs text-text-secondary"></i>
                <span className="text-text-primary font-medium">{currentFunction}</span>
              </nav>

              {/* 控制按钮 */}
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
              </div>
            </div>
          </div>

          {/* Mermaid 图 */}
          <div className="flex-1 p-6 verflow-auto relative z=0">
            <div
              ref={mermaidDiagramRef}
              className="mermaid-container"
              style={{
                transform: `scale(${mermaidScale})`,
                transformOrigin: '0 0',
                width: 'max-content',
                height: 'max-content',
                position: 'relative',
                zIndex: 0,  // ✅ 重点1
                pointerEvents: 'auto', // ✅ 保证图能点
              }}
            />
          </div>
        </main>

        {/* 右侧：代码与解析区 */}
        <aside className="bg-white border-l border-border-light flex-shrink-0 hidden xl:flex flex-col h-full z-40 "
          style={{ width: rightWidth }}
          onMouseDown={startRightResize} // 拖拽逻辑
        >
          <div className="relative w-full p-4 z-40 flex-none">
            {/* 搜索框 */}
            <div className="relative z-40">
              <input
                type="text"
                placeholder="搜索节点..."
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  setShowSuggestions(true);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm"></i>
            </div>

            {/* 节点列表 */}
            {showSuggestions && filteredNodes.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border-light rounded-lg shadow-card z-10 max-h-64 overflow-auto">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm text-text-secondary font-medium">搜索结果</div>
                  <div className="space-y-1">
                    {filteredNodes.map((node) => (
                      <div
                        key={node}
                        onMouseEnter={() => setExpandedNode(node)}
                        onMouseLeave={() => setExpandedNode(null)}
                      >
                        {/* 节点 */}
                        <div className="px-3 py-2 cursor-pointer rounded hover:bg-blue-50 flex justify-between items-center text-sm font-medium">
                          <span>{node}</span>
                          <span className="text-xs text-gray-400">+</span>
                        </div>

                        {/* 展开函数 */}
                        {expandedNode === node && (
                          <div className="ml-2 space-y-1">
                            {mockNodeToFunctions[node].map((func) => (
                              <div
                                key={func}
                                className="px-3 py-2 cursor-pointer rounded hover:bg-blue-100 text-sm text-text-primary"
                                onClick={() => {
                                  setSelectedFunction(func);
                                  setCode(mockSourceCode["UserService.getUser"]);
                                  setAnalysis(mockLLMAnalysis["UserService.getUser"]);
                                  setSearchQuery(func); // 点击后填充搜索框
                                  setExpandedNode(null); // 收起展开
                                  setShowSuggestions(false);
                                }}
                              >
                                {func}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 源代码展示 */}
          <div className="flex flex-col flex-1 border-b border-border-light overflow-hidden">
            <div className="flex items-center justify-between p-1 border-b border-border-light flex-none">
              <h3 className="text-sm font-medium text-text-primary">
                源代码
              </h3>
              <button
                onClick={(e) =>
                  copyToClipboard(code || "", e.currentTarget)
                }
                className="p-1 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
              >
                <i className="fas fa-copy text-xs"></i>
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto">
              <div
                className={`${styles.codePanel} rounded-lg p-4  overflow-auto ${styles.scrollbarMinimal} h-full`}
              >
                {code ? (
                  <pre>
                    <code className="language-php text-xs whitespace-pre-wrap">
                      {code}
                    </code>
                  </pre>
                ) : (
                  <div className="text-xs text-text-secondary text-center mt-8">
                    搜索函数查看代码
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 智能解析展示 */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center justify-between p-1 border-b border-border-light flex-none">
              <h3 className="text-sm font-medium text-text-primary">智能解析</h3>
              <button
                onClick={(e) =>
                  copyToClipboard(analysis || "", e.currentTarget)
                }
                className="p-1 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
              >
                <i className="fas fa-copy text-xs"></i>
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto">
              <div
                className={`bg-gray-50 border border-border-light rounded-lg p-4 overflow-auto ${styles.scrollbarMinimal} h-full`}
              >
                {analysis ? (
                  <div
                    id="analysis-content"
                    className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap"
                  >
                    {analysis}
                  </div>
                ) : (
                  <div className="text-xs text-text-secondary text-center mt-8">
                    搜索函数查看智能解析
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

