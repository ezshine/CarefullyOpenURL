// 语言包定义
const messages = {
    'zh-CN': {
        'pageTitle': '小心打开网址',
        'mainTitle': '⚠️ 确认是否打开以下网址',
        'urlCheckPrompt': '仔细检查以下网址，特别是高亮的域名部分',
        'securityTip': '安全提示：仔细检查域名能有效防止访问钓鱼网站或恶意网址',
        'confirmationProgress': '需要点击确认按钮 $1 次才能访问此网页',
        'confirmButton': '确认 ($1/$2)',
        'visitButton': '访问网页',
        'settingsTitle': '设置',
        'saveButton': '保存',
        'savedStatus': '已保存'
    },
    'en': {
        'pageTitle': 'Carefully Open URL',
        'mainTitle': '⚠️ Confirm if you want to open this URL',
        'urlCheckPrompt': 'Check the URL carefully, especially the highlighted domain part',
        'securityTip': 'Security Tip: Verify the domain name to prevent phishing websites or malicious URLs',
        'confirmationProgress': 'You need to click the confirm button $1 times to visit this webpage',
        'confirmButton': 'Confirm ($1/$2)',
        'visitButton': 'Visit Website',
        'settingsTitle': 'Settings',
        'saveButton': 'Save',
        'savedStatus': 'Saved'
    }
};

// 获取当前语言
function getCurrentLanguage() {
    return localStorage.getItem('preferredLanguage') || 'zh-CN';
}

// 获取消息文本
function i18n(messageName, substitutions = null) {
    const currentLang = getCurrentLanguage();
    const message = messages[currentLang][messageName];
    
    if (!message) return messageName;
    
    if (substitutions) {
        return substitutions.reduce((str, sub, i) => {
            return str.replace(`$${i + 1}`, sub);
        }, message);
    }
    
    return message;
}

// 切换语言
function switchLanguage() {
    const currentLang = getCurrentLanguage();
    const newLang = currentLang === 'zh-CN' ? 'en' : 'zh-CN';
    
    // 保存新的语言设置到 localStorage
    localStorage.setItem('preferredLanguage', newLang);
    
    // 更新页面上的所有文本
    updateAllText();
    
    // 更新语言切换按钮
    updateLanguageButton();
}

// 更新语言切换按钮文本
function updateLanguageButton() {
    const langSwitch = document.getElementById('langSwitch');
    const currentLangSpan = langSwitch.querySelector('.current-lang');
    const currentLang = getCurrentLanguage();
    
    currentLangSpan.textContent = currentLang === 'zh-CN' ? '中文' : 'English';
}

// 更新所有文本的函数
function updateAllText() {
    // 更新所有带有 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const messageName = element.getAttribute('data-i18n');
        const args = element.getAttribute('data-i18n-args');
        
        if (args) {
            const substitutions = args.split(',');
            element.textContent = i18n(messageName, substitutions);
        } else {
            element.textContent = i18n(messageName);
        }
    });

    // 更新页面标题
    document.title = i18n('pageTitle');
    
    // 更新确认按钮文本
    updateConfirmButtonText();
}

// 初始化页面文本
function initializeI18n() {
    updateAllText();
    updateLanguageButton();
    
    // 添加语言切换按钮事件监听
    const langSwitch = document.getElementById('langSwitch');
    if (langSwitch) {
        langSwitch.addEventListener('click', switchLanguage);
    }
}

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
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = domain;
        
        // 根据当前语言设置语音
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;

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

// 更新确认按钮文本的函数
function updateConfirmButtonText() {
    const confirmBtn = document.getElementById('confirmBtn');
    if (confirmBtn) {
        confirmBtn.textContent = i18n('confirmButton', [confirmCount.toString(), requiredClicks.toString()]);
    }
}

// 处理确认按钮点击
confirmBtn.addEventListener('click', () => {
    confirmCount++;
    updateConfirmButtonText();
    
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

// 初始化设置
function initializeSettings() {
    const clickNumber = document.getElementById('clickNumber');
    
    // 从存储中获取设置
    chrome.storage.local.get('requiredClicks', (result) => {
        if (result.requiredClicks) {
            clickNumber.value = result.requiredClicks;
            requiredClicks = result.requiredClicks;
            
            // 更新所有显示点击次数的元素
            document.querySelectorAll('.requiredClicks').forEach(span => {
                span.textContent = result.requiredClicks;
            });
            
            // 更新确认按钮文本
            updateConfirmButtonText();
        }
    });
    
    // 添加输入事件监听，实时更新
    clickNumber.addEventListener('input', () => {
        let value = parseInt(clickNumber.value);
        
        // 验证输入值
        if (isNaN(value) || value < 0) value = 0;
        if (value > 9) value = 9;
        
        // 更新输入框值
        clickNumber.value = value;
        
        // 更新设置
        requiredClicks = value;
        
        // 更新所有显示点击次数的元素
        document.querySelectorAll('.requiredClicks').forEach(span => {
            span.textContent = value;
        });
        
        // 更新确认按钮文本
        updateConfirmButtonText();
        
        // 保存到存储
        chrome.storage.local.set({ requiredClicks: value });
        
        // 如果当前点击次数已经达到新的要求
        if (confirmCount >= value) {
            confirmBtn.style.display = 'none';
            visitBtn.style.display = 'inline-block';
        } else {
            confirmBtn.style.display = 'inline-block';
            visitBtn.style.display = 'none';
        }
    });
}

// 处理白名单按钮点击
document.getElementById('whitelistBtn').addEventListener('click', async () => {
    try {
        const urlObj = new URL(decodeURIComponent(targetUrl));
        const domain = extractMainDomain(urlObj.hostname);
        
        // 打开数据库连接
        const request = indexedDB.open('DomainWhitelist', 1);
        
        request.onerror = () => console.error('无法打开数据库');
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['domains'], 'readwrite');
            const store = transaction.objectStore('domains');
            
            // 添加域名到白名单
            const addRequest = store.add({
                domain,
                dateAdded: new Date().toISOString()
            });
            
            addRequest.onsuccess = () => {
                // 更新按钮状态
                const whitelistBtn = document.getElementById('whitelistBtn');
                whitelistBtn.innerHTML = '<i class="ri-check-line"></i>已加入白名单';
                whitelistBtn.style.color = 'var(--success-color)';
                
                // 3秒后恢复按钮状态
                setTimeout(() => {
                    whitelistBtn.innerHTML = '<i class="ri-shield-star-line"></i>将域名加入白名单';
                    whitelistBtn.style.color = '';
                }, 3000);
            };
            
            addRequest.onerror = () => {
                if (addRequest.error.name === 'ConstraintError') {
                    // 域名已存在
                    whitelistBtn.innerHTML = '<i class="ri-information-line"></i>域名已在白名单中';
                    whitelistBtn.style.color = 'var(--warning-color)';
                    
                    setTimeout(() => {
                        whitelistBtn.innerHTML = '<i class="ri-shield-star-line"></i>将域名加入白名单';
                        whitelistBtn.style.color = '';
                    }, 3000);
                }
            };
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('domains')) {
                const store = db.createObjectStore('domains', { keyPath: 'domain' });
                store.createIndex('dateAdded', 'dateAdded', { unique: false });
            }
        };
    } catch (error) {
        console.error('添加到白名单失败:', error);
    }
});

// 白名单列表相关功能
const whitelistListBtn = document.getElementById('whitelistListBtn');
const whitelistModal = document.getElementById('whitelistModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const whitelistItems = document.getElementById('whitelistItems');
const whitelistCount = document.getElementById('whitelistCount');

// 更新白名单数量徽章
async function updateWhitelistCount() {
    try {
        const db = await openDatabase();
        const transaction = db.transaction(['domains'], 'readonly');
        const store = transaction.objectStore('domains');
        const count = await new Promise((resolve, reject) => {
            const countRequest = store.count();
            countRequest.onsuccess = () => resolve(countRequest.result);
            countRequest.onerror = () => reject(countRequest.error);
        });
        whitelistCount.textContent = count;
    } catch (error) {
        console.error('获取白名单数量失败:', error);
        whitelistCount.textContent = '0';
    }
}

// 打开数据库的辅助函数
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('DomainWhitelist', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('domains')) {
                const store = db.createObjectStore('domains', { keyPath: 'domain' });
                store.createIndex('dateAdded', 'dateAdded', { unique: false });
            }
        };
    });
}

// 更新白名单列表项
async function updateWhitelistItems() {
    try {
        const db = await openDatabase();
        const transaction = db.transaction(['domains'], 'readonly');
        const store = transaction.objectStore('domains');
        const request = store.getAll();

        request.onsuccess = () => {
            const domains = request.result;
            whitelistItems.innerHTML = '';

            if (domains.length === 0) {
                whitelistItems.innerHTML = '<div class="whitelist-item">暂无白名单数据</div>';
                return;
            }

            // 按日期降序排序
            domains.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

            domains.forEach(item => {
                const domainElement = document.createElement('div');
                domainElement.className = 'whitelist-item';
                domainElement.innerHTML = `
                    <span class="domain">${item.domain}</span>
                    <button class="remove-btn" data-domain="${item.domain}">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                `;
                whitelistItems.appendChild(domainElement);
            });

            // 绑定删除按钮事件
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const domain = e.currentTarget.dataset.domain;
                    removeFromWhitelist(domain);
                });
            });
        };

        request.onerror = () => {
            console.error('获取白名单列表失败:', request.error);
            whitelistItems.innerHTML = '<div class="whitelist-item">加载白名单失败</div>';
        };
    } catch (error) {
        console.error('访问数据库失败:', error);
        whitelistItems.innerHTML = '<div class="whitelist-item">加载白名单失败</div>';
    }
}

// 从白名单中删除域名
async function removeFromWhitelist(domain) {
    try {
        const db = await openDatabase();
        const transaction = db.transaction(['domains'], 'readwrite');
        const store = transaction.objectStore('domains');
        
        const request = store.delete(domain);
        
        request.onsuccess = () => {
            updateWhitelistItems();
            updateWhitelistCount();
        };
        
        request.onerror = () => {
            console.error('删除域名失败:', request.error);
        };
    } catch (error) {
        console.error('访问数据库失败:', error);
    }
}

// 初始化白名单功能
function initializeWhitelist() {
    updateWhitelistCount();
    
    // 绑定白名单列表按钮点击事件
    whitelistListBtn.addEventListener('click', showWhitelistModal);
    
    // 绑定关闭按钮点击事件
    closeModalBtn.addEventListener('click', hideWhitelistModal);
    
    // 点击模态框外部区域关闭
    whitelistModal.addEventListener('click', (e) => {
        if (e.target === whitelistModal) {
            hideWhitelistModal();
        }
    });
}

// 显示白名单列表
function showWhitelistModal() {
    whitelistModal.classList.add('show');
    updateWhitelistItems();
}

// 隐藏白名单列表
function hideWhitelistModal() {
    whitelistModal.classList.remove('show');
}

// 在页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    // 初始化国际化
    initializeI18n();
    
    // 初始化设置
    initializeSettings();
    
    // 初始化白名单功能
    initializeWhitelist();
    
    // 初始化目标URL显示
    const targetUrl = urlParams.get('url');
    if (targetUrl) {
        const targetUrlElement = document.getElementById('targetUrl');
        if (targetUrlElement) {
            targetUrlElement.innerHTML = highlightDomain(decodeURIComponent(targetUrl));
            
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
        }
    }
}); 