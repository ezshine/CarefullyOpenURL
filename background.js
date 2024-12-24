// 存储已确认的URL
let confirmedUrls = [];

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
  }
}); 