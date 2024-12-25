// 存储已确认的URL
let confirmedUrls = [];

// 默认点击次数
const DEFAULT_REQUIRED_CLICKS = 3;

// 从URL中提取主域名
function extractMainDomain(hostname) {
    // 移除最后的点（如果有）
    hostname = hostname.replace(/\.$/, '');
    
    // 分割主机名
    const parts = hostname.split('.');
    
    // 如果只有两部分或更少，直接返回
    if (parts.length <= 2) return hostname;
    
    // 返回最后两部分
    return parts.slice(-2).join('.');
}

// 检查域名是否在白名单中
async function isDomainInWhitelist(url) {
    try {
        const urlObj = new URL(url);
        const domain = extractMainDomain(urlObj.hostname);
        
        return new Promise((resolve) => {
            const request = indexedDB.open('DomainWhitelist', 1);
            
            request.onerror = () => {
                console.error('无法打开白名单数据库');
                resolve(false);
            };
            
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['domains'], 'readonly');
                const store = transaction.objectStore('domains');
                
                const getRequest = store.get(domain);
                
                getRequest.onsuccess = () => {
                    resolve(!!getRequest.result);
                };
                
                getRequest.onerror = () => {
                    console.error('查询白名单失败');
                    resolve(false);
                };
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('domains')) {
                    db.createObjectStore('domains', { keyPath: 'domain' });
                }
            };
        });
    } catch (error) {
        console.error('检查白名单失败:', error);
        return false;
    }
}

// 获取所需的点击次数
async function getRequiredClicks() {
    try {
        const result = await chrome.storage.sync.get(['requiredClicks']);
        return result.requiredClicks || DEFAULT_REQUIRED_CLICKS;
    } catch (error) {
        console.error('获取点击次数设置失败:', error);
        return DEFAULT_REQUIRED_CLICKS;
    }
}

// 监听扩展图标点击事件
chrome.action.onClicked.addListener((tab) => {
    // 打开confirm.html页面
    chrome.tabs.create({
        url: chrome.runtime.getURL('confirm.html')
    });
});

// 监听页面导航
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    // 只处理主框架的导航
    if (details.frameId === 0) {
        // 如果不是确认页面
        if (!details.url.includes('confirm.html')) {
            // 首先检查URL是否在已确认列表中
            if (confirmedUrls.includes(details.url)) {
                return;
            }
            
            // 然后检查域名是否在白名单中
            const isWhitelisted = await isDomainInWhitelist(details.url);
            if (isWhitelisted) {
                return;
            }
            
            // 如果既不在已确认列表中也不在白名单中，重定向到确认页面
            chrome.tabs.update(details.tabId, {
                url: chrome.runtime.getURL('confirm.html') + '?url=' + encodeURIComponent(details.url)
            });
        }
    }
});

// 添加消息监听器，用于接收确认页面发来的确认消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'confirmUrl') {
        confirmedUrls.push(message.url);
        sendResponse({success: true});
    } else if (message.type === 'getRequiredClicks') {
        // 返回所需的点击次数
        getRequiredClicks().then(clicks => {
            sendResponse({clicks: clicks});
        });
        return true; // 表示会异步发送响应
    }
}); 