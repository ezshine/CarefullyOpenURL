// 提取主域名的函数
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

// 语音播报函数
function speakDomain(domain) {
    // 检查浏览器是否支持语音合成
    if ('speechSynthesis' in window) {
        // 创建语音合成实例
        const utterance = new SpeechSynthesisUtterance();
        
        // 设置语音内容
        utterance.text = `${domain}`;
        
        // 设置语音属性
        utterance.lang = 'en-US'; // 中文
        utterance.rate = 0.5; // 语速稍慢
        utterance.pitch = 1; // 音高
        utterance.volume = 1; // 音量

        // 播放语音
        window.speechSynthesis.speak(utterance);
    }
}

// 添加域名高亮的函数
function highlightDomain(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        const mainDomain = extractMainDomain(hostname);
        
        // 构建正则表达式以精确匹配主域名
        const regex = new RegExp(`(${mainDomain.replace('.', '\\.')})`, 'g');
        
        // 替换URL中的主域名为高亮版本，添加data-domain属性以便绑定点击事件
        return url.replace(regex, `<span class="domain" data-domain="$1">$1</span>`);
    } catch (e) {
        return url; // 如果URL解析失败，返回原始URL
    }
}

// 获取URL参数中的目标网址
const urlParams = new URLSearchParams(window.location.search);
const targetUrl = urlParams.get('url');

// 显示目标网址（使用高亮函数）
document.getElementById('targetUrl').innerHTML = highlightDomain(decodeURIComponent(targetUrl));

// 为域名添加点击事件
document.querySelectorAll('.domain').forEach(domainElement => {
    domainElement.addEventListener('click', () => {
        const domain = domainElement.getAttribute('data-domain');
        speakDomain(domain);
        
        // 添加点击动画效果
        domainElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
            domainElement.style.transform = 'scale(1)';
        }, 200);
    });
});

let confirmCount = 0;
let requiredClicks = 3; // 默认值
const confirmBtn = document.getElementById('confirmBtn');
const visitBtn = document.getElementById('visitBtn');
const confirmCountSpan = document.getElementById('confirmCount');
const requiredClicksSpans = document.querySelector('.requiredClicks');

// 获取所需的点击次数
chrome.runtime.sendMessage({ type: 'getRequiredClicks' }, (response) => {
    if (response && response.clicks) {
        requiredClicks = response.clicks;
        
        // 更新所有需要显示点击次数的元素
        document.querySelectorAll('.requiredClicks').forEach(span => {
            span.textContent = requiredClicks;
        });
    }
});

// 处理确认按钮点击
confirmBtn.addEventListener('click', () => {
    confirmCount++;
    confirmCountSpan.textContent = confirmCount;
    
    if (confirmCount >= requiredClicks) {
        confirmBtn.style.display = 'none';
        visitBtn.style.display = 'inline-block';
    }
});

// 处理访问按钮点击
visitBtn.addEventListener('click', () => {
    // 先发送消息给background，将URL添加到已确认列表
    chrome.runtime.sendMessage({
        type: 'confirmUrl',
        url: decodeURIComponent(targetUrl)
    }, (response) => {
        if (response.success) {
            // 确认成功后访问目标URL
            window.location.href = decodeURIComponent(targetUrl);
        }
    });
}); 