

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { ChatHistoryItem, Message } from './types';

const AiQaPage: React.FC = () => {
  const navigate = useNavigate();
  const [questionInputValue, setQuestionInputValue] = useState('');
  const [chatHistoryList, setChatHistoryList] = useState<ChatHistoryItem[]>([
    {
      id: 'chat-history-item-1',
      title: '如何优化我的代码性能？',
      isActive: true
    },
    {
      id: 'chat-history-item-2',
      title: '解释一下什么是微服务架构',
      isActive: false
    },
    {
      id: 'chat-history-item-3',
      title: '帮我生成一个用户登录界面的代码',
      isActive: false
    },
    {
      id: 'chat-history-item-4',
      title: '如何实现数据库索引优化',
      isActive: false
    },
    {
      id: 'chat-history-item-5',
      title: '什么是RESTful API设计原则',
      isActive: false
    }
  ]);
  const [chatMessagesList, setChatMessagesList] = useState<Message[]>([
    {
      id: 'message-1',
      type: 'user',
      content: '如何优化我的代码性能？',
      timestamp: new Date()
    },
    {
      id: 'message-2',
      type: 'ai',
      content: `代码性能优化是一个广泛的话题，以下是一些常见的优化策略：

1. 算法与数据结构优化
   - 选择合适的算法，降低时间复杂度
   - 使用高效的数据结构，如哈希表、二叉搜索树等
   - 避免不必要的排序和搜索操作

2. 内存管理优化
   - 减少内存分配和释放操作
   - 使用对象池复用对象
   - 避免内存泄漏

3. 代码层面优化
   - 减少循环嵌套和循环次数
   - 避免在循环中进行耗时操作
   - 使用惰性计算和缓存结果`,
      timestamp: new Date()
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'AI问答 - 商家OpenAI平台';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 滚动到底部
  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  // 发送消息
  const handleSendMessage = () => {
    const question = questionInputValue.trim();
    
    if (question) {
      // 清空输入框
      setQuestionInputValue('');
      
      // 添加用户消息
      const userMessage: Message = {
        id: `message-${Date.now()}`,
        type: 'user',
        content: question,
        timestamp: new Date()
      };
      
      setChatMessagesList(prevMessages => [...prevMessages, userMessage]);
      
      // 显示AI正在输入状态
      setIsAiTyping(true);
      
      // 滚动到底部
      setTimeout(scrollToBottom, 100);
      
      // 模拟API调用
      fetchAIAnswer(question);
    }
  };

  // 调用API获取AI回答
  const fetchAIAnswer = (question: string) => {
    // 模拟API调用延迟
    setTimeout(() => {
      const aiMessage: Message = {
        id: `message-${Date.now()}`,
        type: 'ai',
        content: `这是AI对"${question}"的回答。在实际应用中，这里会显示真实的AI回答内容。`,
        timestamp: new Date()
      };
      
      // 隐藏正在输入状态
      setIsAiTyping(false);
      
      // 添加AI回答
      setChatMessagesList(prevMessages => [...prevMessages, aiMessage]);
      
      // 滚动到底部
      setTimeout(scrollToBottom, 100);
    }, 2000);
  };

  // 处理输入框回车
  const handleQuestionInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 清除输入框
  const handleClearInput = () => {
    setQuestionInputValue('');
  };

  // 开始新对话
  const handleStartNewChat = () => {
    setChatMessagesList([]);
    setQuestionInputValue('');
    
    // 重置对话历史选中状态
    setChatHistoryList(prevList => 
      prevList.map(item => ({ ...item, isActive: false }))
    );
  };

  // 选择对话历史项
  const handleSelectChatHistoryItem = (itemId: string) => {
    // 更新选中状态
    setChatHistoryList(prevList => 
      prevList.map(item => ({ ...item, isActive: item.id === itemId }))
    );
    
    // 加载对应对话内容
    const selectedItem = chatHistoryList.find(item => item.id === itemId);
    if (selectedItem) {
      setChatMessagesList([
        {
          id: 'message-1',
          type: 'user',
          content: selectedItem.title,
          timestamp: new Date()
        },
        {
          id: 'message-2',
          type: 'ai',
          content: `这是AI对"${selectedItem.title}"的回答。在实际应用中，这里会显示历史对话的内容。`,
          timestamp: new Date()
        }
      ]);
    }
  };

  // 复制消息
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content).catch(err => {
      console.error('复制失败:', err);
    });
  };

  // 消息点赞/点踩
  const handleMessageFeedback = (messageId: string, isLike: boolean) => {
    console.log(`Message ${messageId} ${isLike ? 'liked' : 'disliked'}`);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo和产品名称 */}
          <div className="flex items-center space-x-3 cursor-pointer">
            {/* Logo和产品名称 */}
            <Link to="/home" className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <i className="fas fa-home text-white text-sm"></i>
              </div>
              <span className="text-text-primary font-medium">商家OpenAI平台</span>
            </Link>
          </div>
          
          {/* 全局搜索框 */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="搜索历史对话..." 
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg text-sm ${styles.searchInputFocus}`}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
            </div>
          </div>
          
          {/* 用户操作区 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleStartNewChat}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-opacity-90 transition-colors"
            >
              <i className="fas fa-plus mr-1"></i> 新对话
            </button>
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
      <div className={`flex pt-16 ${styles.mainContainer}`}>
        {/* 左侧对话历史区 */}
        <aside className={`${isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded} bg-white border-r border-border-light flex-shrink-0 transition-all duration-300 ${styles.sidebarContainer}`}>
          {/* 对话历史标题 */}
          <div className="p-4 border-b border-border-light">
            <h2 className="text-sm font-medium text-text-primary">聊天</h2>
          </div>
          
          {/* 对话历史列表 */}
          <div className="flex-1 p-2">
            {chatHistoryList.map((chatItem) => (
              <div 
                key={chatItem.id}
                onClick={() => handleSelectChatHistoryItem(chatItem.id)}
                className={`p-3 rounded-lg cursor-pointer mt-1 ${styles.menuItemHover} ${
                  chatItem.isActive ? 'bg-secondary text-white' : ''
                }`}
              >
                <div className="flex items-start">
                  <i className={`fas fa-circle text-xs mr-2 mt-1 ${
                    chatItem.isActive ? 'text-white' : 'text-text-secondary'
                  }`}></i>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{chatItem.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* 中间对话区域 */}
        <main className={`flex-1 flex flex-col ${styles.contentContainer}`}>
          {/* 对话内容区域 */}
          <div ref={chatMessagesRef} className="flex-1 p-6 pb-24">
            {/* 欢迎消息 */}
            {chatMessagesList.length === 0 && (
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-accent bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-robot text-2xl text-accent"></i>
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">欢迎使用AI问答助手</h2>
                <p className="text-text-secondary max-w-md mx-auto">我可以帮助你解答问题、生成代码、提供建议等。请在下方输入你的问题。</p>
              </div>
            )}
            
            {/* 对话消息 */}
           {chatMessagesList.map((message) => (
             <div key={message.id} className="mb-8 flex justify-center">
          <div className="w-full max-w-3xl flex flex-col">
            {message.type === 'user' ? (
        // 用户消息（右侧）
        <div className="flex items-start justify-end space-x-3">
          <div className="max-w-[80%]">
            <div className={`p-4 rounded-2xl shadow-sm bg-[#daf1ff] text-text-primary ${styles.messageBubbleUser}`}>
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center justify-end mt-2 text-sm text-text-secondary">
              <button 
                onClick={() => handleCopyMessage(message.content)}
                className="flex items-center hover:text-text-primary"
              >
                <i className="far fa-copy mr-1"></i> 复制
              </button>
            </div>
          </div>

          {/* 用户头像 */}
          <div className="w-8 h-8 bg-accent text-white flex items-center justify-center rounded-full text-sm">
            <i className="fas fa-user"></i>
          </div>
        </div>
      ) : (
        // AI 消息（左侧）
        <div className="flex items-start justify-start space-x-3">
          {/* AI头像 */}
          <div className="w-8 h-8 bg-accent bg-opacity-20 text-accent flex items-center justify-center rounded-full text-sm">
            <i className="fas fa-robot"></i>
          </div>

          {/* AI内容 */}
          <div className="max-w-[80%]">
            <div className={`p-4 rounded-2xl border border-border-light bg-white shadow-sm ${styles.messageBubbleAi}`}>
              <pre className="text-text-primary whitespace-pre-wrap break-words">
                {message.content}
              </pre>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center mt-2 text-sm text-text-secondary space-x-4">
              <button 
                onClick={() => handleMessageFeedback(message.id, true)}
                className="flex items-center hover:text-text-primary"
              >
                <i className="far fa-thumbs-up mr-1"></i> 有用
              </button>
              <button 
                onClick={() => handleMessageFeedback(message.id, false)}
                className="flex items-center hover:text-text-primary"
              >
                <i className="far fa-thumbs-down mr-1"></i> 无用
              </button>
              <button 
                onClick={() => handleCopyMessage(message.content)}
                className="flex items-center hover:text-text-primary"
              >
                <i className="far fa-copy mr-1"></i> 复制
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
            </div>
))}

            
            {/* 正在输入状态 */}
            {isAiTyping && (
              <div className="flex justify-center mb-6">
                <div className="max-w-3xl w-full">
                  <div className={`p-4 border border-border-light ${styles.messageBubbleAi}`}>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 提问输入区域 */}
          <div className="bg-white border-t border-border-light p-4">
            <div className="flex justify-center">
              <div className="max-w-3xl w-full">
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    value={questionInputValue}
                    onChange={(e) => setQuestionInputValue(e.target.value)}
                    onKeyDown={handleQuestionInputKeyDown}
                    placeholder="输入你的问题..." 
                    className={`flex-1 p-3 border border-border-light rounded-lg text-sm ${styles.searchInputFocus}`}
                  />
                  
                  {/* 输入框工具栏 */}
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors">
                      <i className="fas fa-paperclip text-sm"></i>
                    </button>
                    <button 
                      onClick={handleClearInput}
                      className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
                    >
                      <i className="fas fa-times text-sm"></i>
                    </button>
                    <button 
                      onClick={handleSendMessage}
                      className="p-2 bg-accent text-white rounded transition-colors"
                    >
                      <i className="fas fa-paper-plane text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AiQaPage;

