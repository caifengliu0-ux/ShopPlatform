
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface LogTag {
    name: string;
    path: string;
    line: number;
}

interface LogEntry {
    id: number;
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'debug';
    traceId: string;
    content: string;
    service: string;
    tags: LogTag[];
}

const LogPlatform: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // 状态管理
    const [traceIdSearchValue, setTraceIdSearchValue] = useState('');
    const [timeRangeValue, setTimeRangeValue] = useState('24h');
    const [logLevelValue, setLogLevelValue] = useState('all');
    const [serviceNameValue, setServiceNameValue] = useState('all');
    const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(false);
    const [currentLogsList, setCurrentLogsList] = useState<LogEntry[]>([]);
    const [selectedLogEntry, setSelectedLogEntry] = useState<LogEntry | null>(null);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [isLoadingVisible, setIsLoadingVisible] = useState(false);
    const [globalSearchValue, setGlobalSearchValue] = useState('');

    const pageSize = 10;

    // 模拟日志数据
    const mockLogsData: LogEntry[] = [
        {
            id: 1,
            timestamp: '2024-01-15 14:30:25.123',
            level: 'info',
            traceId: 'trace-001',
            content: '用户登录成功，用户ID: 12345',
            service: 'user-service',
            tags: [
                { name: 'UserService.login', path: 'src/services/UserService.php', line: 45 },
                { name: 'AuthMiddleware.validateToken', path: 'src/middleware/AuthMiddleware.php', line: 23 }
            ]
        },
        {
            id: 2,
            timestamp: '2024-01-15 14:30:26.456',
            level: 'warning',
            traceId: 'trace-001',
            content: '订单状态异常，订单ID: 67890',
            service: 'order-service',
            tags: [
                { name: 'OrderService.updateStatus', path: 'src/services/OrderService.php', line: 156 }
            ]
        },
        {
            id: 3,
            timestamp: '2024-01-15 14:30:27.789',
            level: 'error',
            traceId: 'trace-002',
            content: '支付处理失败: 网络连接超时',
            service: 'payment-service',
            tags: [
                { name: 'PaymentGateway.processPayment', path: 'src/gateways/PaymentGateway.php', line: 89 },
                { name: 'TransactionService.handleError', path: 'src/services/TransactionService.php', line: 203 }
            ]
        },
        {
            id: 4,
            timestamp: '2024-01-15 14:30:28.123',
            level: 'debug',
            traceId: 'trace-003',
            content: 'API网关请求转发，路径: /api/users',
            service: 'api-gateway',
            tags: [
                { name: 'ApiGateway.routeRequest', path: 'src/gateway/ApiGateway.php', line: 67 }
            ]
        },
        {
            id: 5,
            timestamp: '2024-01-15 14:30:29.456',
            level: 'info',
            traceId: 'trace-004',
            content: '用户数据查询成功，用户ID: 54321',
            service: 'user-service',
            tags: [
                { name: 'UserService.getUser', path: 'src/services/UserService.php', line: 78 }
            ]
        }
    ];

    // 设置页面标题
    useEffect(() => {
        const originalTitle = document.title;
        document.title = '日志平台 - 商家OpenAI平台';
        return () => { document.title = originalTitle; };
    }, []);

    // 初始化页面
    useEffect(() => {
        const traceIdParam = searchParams.get('traceId');
        if (traceIdParam) {
            setTraceIdSearchValue(traceIdParam);
            handlePerformSearch();
        } else {
            setCurrentLogsList(mockLogsData);
        }
    }, [searchParams]);

    // 获取日志级别样式类
    const getLogLevelClass = (level: string) => {
        return styles[`logLevel${level.charAt(0).toUpperCase() + level.slice(1)}`] || '';
    };

    // 获取日志级别图标
    const getLogLevelIcon = (level: string) => {
        const iconMap = {
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-exclamation-circle',
            debug: 'fas fa-bug'
        };
        return iconMap[level as keyof typeof iconMap] || 'fas fa-info-circle';
    };

    // 执行搜索
    const handlePerformSearch = () => {
        setIsLoadingVisible(true);

        setTimeout(() => {
            let searchResults = mockLogsData;

            // 应用筛选条件
            if (traceIdSearchValue.trim()) {
                searchResults = searchResults.filter(log => log.traceId.includes(traceIdSearchValue.trim()));
            }

            if (logLevelValue !== 'all') {
                searchResults = searchResults.filter(log => log.level === logLevelValue);
            }

            if (serviceNameValue !== 'all') {
                searchResults = searchResults.filter(log => log.service === serviceNameValue);
            }

            setCurrentLogsList(searchResults);
            setCurrentPageNumber(1);
            setSelectedLogEntry(null);
            setIsLoadingVisible(false);
        }, 800);
    };

    // 重置搜索
    const handleResetSearch = () => {
        setTraceIdSearchValue('');
        setTimeRangeValue('24h');
        setLogLevelValue('all');
        setServiceNameValue('all');
        setCurrentPageNumber(1);
        setCurrentLogsList(mockLogsData);
        setSelectedLogEntry(null);
    };

    // 选择日志
    const handleSelectLog = (log: LogEntry) => {
        setSelectedLogEntry(log);
    };

    // 显示代码
    const handleShowCode = (tag: LogTag) => {
        // 模拟代码内容
        const mockCodeContent = `
class UserService {
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
    
    public function login(string $username, string $password): string {
        // 查找用户
        $user = $this->userRepository->findByUsername($username);
        if (!$user) {
            throw new UserNotFoundException("User not found");
        }
        
        // 验证密码
        if (!password_verify($password, $user->password)) {
            throw new AuthenticationException("Invalid credentials");
        }
        
        // 生成token
        $token = $this->authService->generateToken($user->id);
        
        // 记录登录日志
        $this->logger->info("用户登录成功，用户ID: {$user->id}");
        
        return $token;
    }
}
    `;

        const codeDisplayElement = document.querySelector('#code-display');
        if (codeDisplayElement) {
            codeDisplayElement.textContent = mockCodeContent.trim();
            // @ts-ignore
            if (window.hljs) {
                // @ts-ignore
                window.hljs.highlightElement(codeDisplayElement);
            }
        }

        // 高亮指定行
        handleHighlightCodeLine(tag.line);
    };

    // 高亮代码行
    const handleHighlightCodeLine = (lineNumber: number) => {
        const codeLines = document.querySelectorAll('#code-content pre code .hljs-line');
        codeLines.forEach((line, index) => {
            const lineElement = line as HTMLElement;
            if (index + 1 === lineNumber) {
                lineElement.classList.add(styles.codeLineHighlight);
                lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                lineElement.classList.remove(styles.codeLineHighlight);
            }
        });
    };

    // 复制代码
    const handleCopyCode = async () => {
        const codeElement = document.querySelector('#code-display');
        if (codeElement && codeElement.textContent) {
            try {
                await navigator.clipboard.writeText(codeElement.textContent);
                const copyButton = document.querySelector('#copy-code-btn');
                if (copyButton) {
                    copyButton.innerHTML = '<i class="fas fa-check text-sm"></i>';
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy text-sm"></i>';
                    }, 1000);
                }
            } catch (error) {
                console.error('复制失败:', error);
            }
        }
    };

    // 同步代码
    const handleSyncCode = () => {
        if (selectedLogEntry && selectedLogEntry.tags.length > 0) {
            handleShowCode(selectedLogEntry.tags[0]);
            const syncButton = document.querySelector('#sync-code-btn');
            if (syncButton) {
                syncButton.innerHTML = '<i class="fas fa-check text-sm"></i>';
                setTimeout(() => {
                    syncButton.innerHTML = '<i class="fas fa-sync-alt text-sm"></i>';
                }, 1000);
            }
        }
    };

    // 全局搜索
    const handleGlobalSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const keyword = globalSearchValue.trim();
            if (keyword) {
                navigate(`/main-dashboard?search=${encodeURIComponent(keyword)}`);
            }
        }
    };

    // 标签点击事件
    const handleTagClick = (e: React.MouseEvent, tag: LogTag) => {
        e.stopPropagation();
        handleShowCode(tag);
    };

    // 计算分页信息
    const totalPagesCount = Math.ceil(currentLogsList.length / pageSize);
    const startIndex = (currentPageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPageLogs = currentLogsList.slice(startIndex, endIndex);
    const displayStartIndex = currentLogsList.length > 0 ? startIndex + 1 : 0;
    const displayEndIndex = Math.min(endIndex, currentLogsList.length);

    return (
       <div className={styles.pageWrapper}>
    {/* 顶部导航栏 */}
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50 shadow-sm">
        <div className="flex items-center justify-between h-full px-6 space-x-4">
            {/* 左侧 Logo和名称 */}
            <Link to="/home" className="flex items-center space-x-3 flex-shrink-0">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <i className="fas fa-link text-white text-sm"></i>
                </div>
                <h1 className="text-xl font-semibold text-text-primary">代码链</h1>
            </Link>

            {/* 中间搜索区域 */}
            <div className="flex-1 max-w-2xl mx-6">
                <div className="flex items-center space-x-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={traceIdSearchValue}
                            onChange={(e) => setTraceIdSearchValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handlePerformSearch()}
                            placeholder="请输入 trace ID 进行搜索..."
                            className={`w-full pl-12 pr-4 py-2 border border-border-light rounded-lg text-sm ${styles.searchInputFocus}`}
                        />
                        <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                    </div>

                    {/* 按钮组 */}
                    <button
                        onClick={handlePerformSearch}
                        className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
                    >
                        <i className="fas fa-search mr-1"></i>搜索
                    </button>
                    <button
                        onClick={handleResetSearch}
                        className="px-4 py-2 border border-border-light text-text-primary rounded-lg hover:bg-bg-hover transition-colors text-sm font-medium"
                    >
                        <i className="fas fa-undo mr-1"></i>重置
                    </button>
                    <button
                        onClick={() => setIsAdvancedSearchVisible(!isAdvancedSearchVisible)}
                        className="px-3 py-2 border border-border-light text-text-primary rounded-lg hover:bg-bg-hover transition-colors text-sm"
                    >
                        <i className={`fas ${isAdvancedSearchVisible ? 'fa-times' : 'fa-filter'}`}></i>
                    </button>
                </div>
            </div>

            {/* 右侧用户操作区 */}
            <div className="flex items-center space-x-4 flex-shrink-0">
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
    <div className="flex min-h-screen pt-16">
        {/* 日志列表和代码展示区 */}
        <div className="flex-1 flex h-[calc(100vh-4rem)]">
            {/* 日志列表区 */}
            <div className="w-1/2 bg-white border-r border-border-light flex flex-col">

                {/* 日志表格 */}
                <div className="flex-1 overflow-auto">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <tbody className="bg-white divide-y divide-border-light">
                                {currentPageLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-text-secondary">
                                            <i className="fas fa-search text-2xl mb-2"></i>
                                            <div>未找到相关日志</div>
                                            <div className="text-sm mt-1">请检查 trace ID 或调整搜索条件</div>
                                        </td>
                                    </tr>
                                ) : (
                                    currentPageLogs.map((log) => (
                                        <tr
                                            key={log.id}
                                            onClick={() => handleSelectLog(log)}
                                            className={`${styles.tableRowHover} cursor-pointer ${
                                                selectedLogEntry?.id === log.id ? 'bg-bg-hover' : ''
                                            }`}
                                        >
                                            <td className="px-4 py-3 text-sm text-text-primary">{log.timestamp}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLogLevelClass(
                                                        log.level
                                                    )}`}
                                                >
                                                    <i className={`${getLogLevelIcon(log.level)} mr-1`}></i>
                                                    {log.level.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-text-primary font-mono">{log.traceId}</td>
                                            <td className="px-4 py-3 text-sm text-text-secondary max-w-xs truncate">{log.content}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {log.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            onClick={(e) => handleTagClick(e, tag)}
                                                            className={styles.logTag}
                                                        >
                                                            {tag.name.split('.').pop()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 代码展示区 */}
            <div className="w-1/2 bg-white border-r border-border-light flex flex-col">
                {/* 代码内容区 */}
                <div className="flex-1 overflow-auto">
                    <div className="p-4 h-full">
                        <div className={`${styles.codePanel} rounded-lg p-4 h-full overflow-auto`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm text-text-secondary">
                                    <i className="fas fa-file-code mr-2"></i>
                                    <span>
                                        {selectedLogEntry?.tags?.length > 0
                                            ? selectedLogEntry.tags[0].path
                                            : '未选择日志'}
                                    </span>
                                </div>
                                <div className="text-xs text-text-secondary">
                                    行 <span>{selectedLogEntry?.tags?.[0]?.line ?? '-'}</span>
                                </div>
                            </div>
                            <pre className="language-php text-xs whitespace-pre-wrap">
                                <code>
                                    {selectedLogEntry?.tags?.length > 0
                                        ? `class UserService {
    private $userRepository;
    private $authService;

    public function __construct(UserRepository $userRepository, AuthService $authService) {
        $this->userRepository = $userRepository;
        $this->authService = $authService;
    }

    public function getUser(string $userId, string $token): UserDto {
        if (!$this->authService->validateToken($token)) {
            throw new UnauthorizedException("Invalid token");
        }

        $user = $this->userRepository->findById($userId);
        if (!$user) {
            throw new UserNotFoundException("User not found");
        }

        return UserMapper::toDto($user);
    }

    public function login(string $username, string $password): string {
        $user = $this->userRepository->findByUsername($username);
        if (!$user) {
            throw new UserNotFoundException("User not found");
        }

        if (!password_verify($password, $user->password)) {
            throw new AuthenticationException("Invalid credentials");
        }

        $token = $this->authService->generateToken($user->id);
        $this->logger->info("用户登录成功，用户ID: {$user->id}");
        return $token;
    }
}`
                                        : '// 请选择一条日志查看关联代码'}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* 加载状态 */}
    {isLoadingVisible && (
        <div className="fixed inset-0 z-[60] bg-black bg-opacity-20 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-secondary"></div>
                <span className="text-text-primary">正在搜索日志...</span>
            </div>
        </div>
    )}
</div>

    );
};

export default LogPlatform;

