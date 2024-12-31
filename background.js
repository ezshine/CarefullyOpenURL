import { extractMainDomain } from './js/utils.js';

// Store confirmed URLs
let confirmedUrls = [];

// Default click count
const DEFAULT_REQUIRED_CLICKS = 3;

// Check if domain is in whitelist
async function isDomainInWhitelist(url) {

    // 不拦截 chrome 内部链接和 blob
    if (url.startsWith('chrome://') || 
        url.startsWith('chrome-extension://') || 
        url.startsWith('about:') ||
        url.startsWith('blob:')) {
        return true;
    }

    try {
        const urlObj = new URL(url);
        const domain = extractMainDomain(urlObj.hostname);
        
        return new Promise((resolve) => {
            const request = indexedDB.open('DomainWhitelist', 1);
            
            request.onerror = () => {
                console.error('Failed to open whitelist database');
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
                    console.error('Failed to query whitelist');
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
        console.error('Failed to check whitelist:', error);
        return false;
    }
}

// Get required clicks
async function getRequiredClicks() {
    try {
        const result = await chrome.storage.sync.get(['requiredClicks']);
        return result.requiredClicks || DEFAULT_REQUIRED_CLICKS;
    } catch (error) {
        console.error('Failed to get click count settings:', error);
        return DEFAULT_REQUIRED_CLICKS;
    }
}

// Listen for extension icon click events
chrome.action.onClicked.addListener((tab) => {
    // Open confirm.html page
    chrome.tabs.create({
        url: chrome.runtime.getURL('confirm.html')
    });
});

// Listen for page navigation
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    // Only handle main frame navigation
    if (details.frameId === 0) {
        // If not confirm page
        if (!details.url.includes('confirm.html')) {
            // First check if URL is in confirmed list
            if (confirmedUrls.includes(details.url)) {
                return;
            }
            
            // Then check if domain is in whitelist
            const isWhitelisted = await isDomainInWhitelist(details.url);
            if (isWhitelisted) {
                return;
            }
            
            // If neither in confirmed list nor whitelist, redirect to confirm page
            chrome.tabs.update(details.tabId, {
                url: chrome.runtime.getURL('confirm.html') + '?url=' + encodeURIComponent(details.url)
            });
        }
    }
});

// Handle downloads from external apps
chrome.downloads.onCreated.addListener(async (downloadItem) => {
    // Check if URL is already confirmed
    if (confirmedUrls.includes(downloadItem.url)) {
        return;
    }
    
    // Check whitelist
    const isWhitelisted = await isDomainInWhitelist(downloadItem.url);
    if (isWhitelisted) {
        return;
    }

    // 只拦截刚创建的下载
    if (downloadItem.state !== 'in_progress') {
        return;
    }
    
    // Cancel the download immediately
    chrome.downloads.cancel(downloadItem.id);
    
    // Open confirm page
    chrome.tabs.create({
        url: chrome.runtime.getURL('confirm.html') + '?url=' + encodeURIComponent(downloadItem.url)
    });
});


// Add message listener, used to receive confirmation messages from confirm page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'confirmUrl') {
        confirmedUrls.push(message.url);
        sendResponse({success: true});
    } else if (message.type === 'getRequiredClicks') {
        // Return required clicks
        getRequiredClicks().then(clicks => {
            sendResponse({clicks: clicks});
        });
        return true; // Indicates asynchronous response
    } else if (message.type === 'getWhoisInfo') {
        fetchWhoisInfo(message.domain).then(info => {
            sendResponse({success: true, info});
        }).catch(error => {
            sendResponse({success: false, error: error.message});
        });
        return true; // 异步响应
    }
});

// 获取域名的 whois 信息
async function fetchWhoisInfo(domain) {
    try {
        const response = await fetch(`https://www.whois.com/whois/${domain}`);
        const html = await response.text();
        
        // 使用正则表达式提取注册时间和到期时间
        const creationDateMatch = html.match(/Creation Date:\s*([^\n<]+)/i) || 
                                html.match(/Registered On:\s*([^\n<]+)/i) ||
                                html.match(/Registration Date:\s*([^\n<]+)/i);
        
        const expiryDateMatch = html.match(/Registry Expiry Date:\s*([^\n<]+)/i) ||
                               html.match(/Expires On:\s*([^\n<]+)/i) ||
                               html.match(/Expiration Date:\s*([^\n<]+)/i);

        // 格式化时间的函数
        const formatDate = (dateStr) => {
            try {
                const date = new Date(dateStr);
                return new Intl.DateTimeFormat('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }).format(date);
            } catch (e) {
                return dateStr; // 如果转换失败，返回原始字符串
            }
        };
        
        if (creationDateMatch || expiryDateMatch) {
            return {
                registrationDate: creationDateMatch ? formatDate(creationDateMatch[1].trim()) : '未知',
                expiryDate: expiryDateMatch ? formatDate(expiryDateMatch[1].trim()) : '未知'
            };
        } else {
            throw new Error('无法获取域名注册信息');
        }
    } catch (error) {
        console.error('Whois 查询失败:', error);
        throw new Error('Whois 查询失败');
    }
} 