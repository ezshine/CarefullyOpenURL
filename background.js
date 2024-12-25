// 存储已确认的URL
let confirmedUrls = [];

// 默认点击次数
const DEFAULT_REQUIRED_CLICKS = 3;

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
    // 打开侧边栏
    chrome.sidePanel.open({ windowId: tab.windowId });
});

// 监听页面导航
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    // 只处理主框架的导航
    if (details.frameId === 0) {
        // 如果不是确认页面且URL不在已确认列表中
        if (!details.url.includes('confirm.html') && !confirmedUrls.includes(details.url)) {
            // 取消当前导航，重定向到确认页面
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