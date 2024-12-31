// Language package definition
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
        'savedStatus': '已保存',
        'clickCountLabel': '确认次数',
        'whitelistButton': '白名单列表',
        'whitelistModalTitle': '白名单列表',
        'importButton': '导入',
        'exportButton': '导出',
        'noWhitelistData': '暂无白名单数据',
        'loadWhitelistFailed': '加载白名单失败',
        'addToWhitelist': '将域名加入白名单',
        'alreadyInWhitelist': '域名已在白名单中',
        'exportFailed': '导出白名单失败',
        'importFailed': '导入白名单失败',
        'invalidImportFormat': '无效的导入文件格式',
        'pageInfo': '第 $1 页，共 $2 页',
        'addedToWhitelist': '已加入白名单',
        'domainInWhitelist': '域名已在白名单中',
        'clearWhitelistConfirm': '确定要清空所有白名单数据吗？此操作不可恢复。',
        'clearWhitelistSuccess': '白名单已清空',
        'clearWhitelistFailed': '清空白名单失败',
        'searchPlaceholder': '搜索域名...',
        'clearAll': '清空全部',
        'introPoint1': '1. 防范钓鱼网站最好的方式就是仔细检查每一个即将要打开的网址。',
        'introPoint2': '2. 钓鱼网站通常采用近似目标域名的方式来进行迷惑，点击播放域名的读音，将使得这些迷惑的域名无处遁形。'
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
        'savedStatus': 'Saved',
        'clickCountLabel': 'Confirm Count',
        'whitelistButton': 'Whitelist',
        'whitelistModalTitle': 'Whitelist',
        'importButton': 'Import',
        'exportButton': 'Export',
        'noWhitelistData': 'No whitelist data',
        'loadWhitelistFailed': 'Failed to load whitelist',
        'addToWhitelist': 'Add to Whitelist',
        'alreadyInWhitelist': 'Domain already in whitelist',
        'exportFailed': 'Failed to export whitelist',
        'importFailed': 'Failed to import whitelist',
        'invalidImportFormat': 'Invalid import file format',
        'pageInfo': 'Page $1 of $2',
        'addedToWhitelist': 'Added to whitelist',
        'domainInWhitelist': 'Domain already in whitelist',
        'clearWhitelistConfirm': 'Are you sure you want to clear all whitelist data? This operation cannot be undone.',
        'clearWhitelistSuccess': 'Whitelist has been cleared',
        'clearWhitelistFailed': 'Failed to clear whitelist',
        'searchPlaceholder': 'Search domains...',
        'clearAll': 'Clear All',
        'introPoint1': '1. The best way to prevent phishing is to carefully check every url before opening it.',
        'introPoint2': '2. Phishing sites often use similar domain names to deceive. Click to play the domain pronunciation to expose these deceptive domains.'
    }
};

// Get current language
function getCurrentLanguage() {
    return localStorage.getItem('preferredLanguage') || 'zh-CN';
}

// Get message text
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

// Switch language
function switchLanguage() {
    const currentLang = getCurrentLanguage();
    const newLang = currentLang === 'zh-CN' ? 'en' : 'zh-CN';
    
    // Save new language setting to localStorage
    localStorage.setItem('preferredLanguage', newLang);
    
    // Update all text on the page
    updateAllText();
    
    // Update language switch button
    updateLanguageButton();
}

// Update language switch button text
function updateLanguageButton() {
    const langSwitch = document.getElementById('langSwitch');
    const currentLangSpan = langSwitch.querySelector('.current-lang');
    const currentLang = getCurrentLanguage();
    
    currentLangSpan.textContent = currentLang === 'zh-CN' ? '中文' : 'English';
}

// Function to update all text
function updateAllText() {
    // Update all elements with data-i18n attribute
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

    // Update elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const messageName = element.getAttribute('data-i18n-placeholder');
        element.placeholder = i18n(messageName);
    });

    // Update page title
    document.title = i18n('pageTitle');
    
    // Update confirm button text
    updateConfirmButtonText();

    // Update confirm count label
    const clickCountLabel = document.querySelector('.settings-item span');
    if (clickCountLabel) {
        clickCountLabel.textContent = i18n('clickCountLabel');
    }

    // Update whitelist button text
    const whitelistBtn = document.getElementById('whitelistBtn');
    if (whitelistBtn) {
        whitelistBtn.innerHTML = `<i class="ri-shield-star-line"></i>${i18n('addToWhitelist')}`;
    }

    // Update whitelist list button text
    const whitelistListBtn = document.getElementById('whitelistListBtn');
    if (whitelistListBtn) {
        const badge = whitelistListBtn.querySelector('.badge');
        whitelistListBtn.innerHTML = `<i class="ri-list-check"></i>${i18n('whitelistButton')}`;
        if (badge) {
            whitelistListBtn.appendChild(badge);
        }
    }

    // Update whitelist modal title
    const modalTitle = document.querySelector('.modal-header h2');
    if (modalTitle) {
        modalTitle.textContent = i18n('whitelistModalTitle');
    }

    // Update import export button text
    const importBtn = document.getElementById('importWhitelistBtn');
    const exportBtn = document.getElementById('exportWhitelistBtn');
    if (importBtn) {
        importBtn.innerHTML = `<i class="ri-upload-2-line"></i>${i18n('importButton')}`;
    }
    if (exportBtn) {
        exportBtn.innerHTML = `<i class="ri-download-2-line"></i>${i18n('exportButton')}`;
    }

    // Update page info
    const pageInfo = document.querySelector('.page-info');
    if (pageInfo) {
        const currentPage = pageInfo.querySelector('#currentPage');
        const totalPages = pageInfo.querySelector('#totalPages');
        if (currentPage && totalPages) {
            pageInfo.innerHTML = i18n('pageInfo', [
                `<span id="currentPage">${currentPage.textContent}</span>`,
                `<span id="totalPages">${totalPages.textContent}</span>`
            ]);
        }
    }
}

// Initialize page text
function initializeI18n() {
    updateAllText();
    updateLanguageButton();
    
    // Add language switch button event listener
    const langSwitch = document.getElementById('langSwitch');
    if (langSwitch) {
        langSwitch.addEventListener('click', switchLanguage);
    }
}

// Function to extract main domain
function extractMainDomain(hostname) {
    // Remove trailing dot (if exists)
    hostname = hostname.replace(/\.$/, '');
    
    // Check if it's an IP address
    const hostWithoutPort = hostname.split(':')[0].replace(/[\[\]]/g, '');
    if (isIpAddress(hostWithoutPort)) {
        return hostWithoutPort;
    }
    
    // Process normal domain
    const parts = hostname.split('.');
    
    // If there are only two or fewer parts, return immediately (without port)
    if (parts.length <= 2) {
        return hostname.split(':')[0];
    }
    
    // Return last two parts (without port)
    return parts.slice(-2).join('.').split(':')[0];
}

function isIpAddress(domain){
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F:]+)$/;
    return ipv4Regex.test(domain) || ipv6Regex.test(domain);
}

// Voice announcement function
function speakDomain(domain) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance();
        // Split domain into single characters and join with commas, keep suffixes like .com intact
        
        const parts = domain.split('.');
        const prefix = parts[0].split('').join(',');
        utterance.text = prefix + ',.' + parts[1];

        // If it's an IP address, read each number or character separately
        if (isIpAddress(domain)) {
            utterance.text = domain;
        }
        
        // Set voice based on current language
        utterance.lang = 'en-US';
        utterance.rate = 0.5;
        utterance.pitch = 1;
        utterance.volume = 1;

        window.speechSynthesis.speak(utterance);
    }
}

// Function to highlight domain
function highlightDomain(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        const mainDomain = extractMainDomain(hostname);
        
        // Build regex to match main domain exactly
        const regex = new RegExp(`(${mainDomain.replace('.', '\\.')})`, 'g');
        
        // Replace main domain in URL with highlighted version, add data-domain attribute for binding click event
        return url.replace(regex, `<span class="domain" data-domain="$1">$1</span>`);
    } catch (e) {
        return url; // If URL parsing fails, return original URL
    }
}

// Get target URL from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const targetUrl = urlParams.get('url');

// Initialize target URL display
async function initializeTargetUrl() {
    const targetUrl = urlParams.get('url');
    const targetUrlElement = document.getElementById('targetUrl');
    const urlSection = document.querySelector('.url-section');
    const buttonGroup = document.querySelector('.button-group');
    const container = document.querySelector('.container');

    if (targetUrl && targetUrlElement) {
        // Show URL related content when URL parameter exists
        urlSection.style.display = 'block';
        buttonGroup.style.display = 'flex';
        targetUrlElement.innerHTML = highlightDomain(decodeURIComponent(targetUrl));
        
        // Check if domain is in whitelist
        try {
            const urlObj = new URL(decodeURIComponent(targetUrl));
            const domain = extractMainDomain(urlObj.hostname);
            const db = await openDatabase();
            const transaction = db.transaction(['domains'], 'readonly');
            const store = transaction.objectStore('domains');
            
            const getRequest = store.get(domain);
            getRequest.onsuccess = () => {
                if (getRequest.result) {
                    confirmCount = requiredClicks;
                    updateConfirmButtonText();

                    const whitelistBtn = document.getElementById('whitelistBtn');
                    whitelistBtn.innerHTML = `<i class="ri-information-line"></i>${i18n('domainInWhitelist')}`;
                    whitelistBtn.style.color = 'var(--warning-color)';
                }
            };
        } catch (error) {
            console.error('Failed to check whitelist:', error);
        }

        // Add click event for domain
        document.querySelectorAll('.domain').forEach(domainElement => {
            domainElement.addEventListener('click', () => {
                const domain = domainElement.getAttribute('data-domain');
                speakDomain(domain);
                
                // Add click animation effect
                domainElement.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    domainElement.style.transform = 'scale(1)';
                }, 200);
            });
        });
    } else {
        // Show introduction page when no URL parameter
        container.innerHTML = `
            <div class="intro-page">
                <h1 class="intro-title" data-i18n="pageTitle">${i18n('pageTitle')}</h1>
                <div class="intro-content">
                    <div class="intro-point" data-i18n="introPoint1">
                        <span>01</span>
                        ${i18n('introPoint1')}
                    </div>
                    <div class="intro-point" data-i18n="introPoint2">
                        <span>02</span>
                        ${i18n('introPoint2')}
                    </div>
                </div>
            </div>
        `;
        container.style.display = 'block';
    }
}

let confirmCount = 0;
let requiredClicks = 3; // Default value
const confirmBtn = document.getElementById('confirmBtn');
const visitBtn = document.getElementById('visitBtn');
const confirmCountSpan = document.getElementById('confirmCount');
const requiredClicksSpans = document.querySelector('.requiredClicks');

// Get required clicks
chrome.runtime.sendMessage({ type: 'getRequiredClicks' }, (response) => {
    if (response && typeof response.clicks === 'number') {
        requiredClicks = response.clicks;
        
        // Update all elements displaying click counts
        document.querySelectorAll('.requiredClicks').forEach(span => {
            if (span) {
                span.textContent = requiredClicks.toString();
            }
        });
        
        // Update confirm button text
        updateConfirmButtonText();
    }
});

// Function to update confirm button text
function updateConfirmButtonText() {
    const confirmBtn = document.getElementById('confirmBtn');
    const visitBtn = document.getElementById('visitBtn');
    
    if (!confirmBtn || !visitBtn) {
        return; // Exit if buttons don't exist
    }

    // Ensure confirmCount and requiredClicks are numbers
    const currentCount = Number(confirmCount) || 0;
    const requiredCount = Number(requiredClicks) || 0;

    confirmBtn.textContent = i18n('confirmButton', [
        currentCount.toString(), 
        requiredCount.toString()
    ]);

    if (currentCount >= requiredCount) {
        confirmBtn.style.display = 'none';
        visitBtn.style.display = 'inline-block';
    } else {
        confirmBtn.style.display = 'inline-block';
        visitBtn.style.display = 'none';
    }
}

// Handle confirm button click
confirmBtn.addEventListener('click', () => {
    confirmCount++;
    updateConfirmButtonText();
    
    if (confirmCount >= requiredClicks) {
        confirmBtn.style.display = 'none';
        visitBtn.style.display = 'inline-block';
    }
});

// Handle visit button click
visitBtn.addEventListener('click', () => {
    // First send message to background to add URL to confirmed list
    chrome.runtime.sendMessage({
        type: 'confirmUrl',
        url: decodeURIComponent(targetUrl)
    }, (response) => {
        if (response.success) {
            // Visit target URL after confirmation
            window.location.href = decodeURIComponent(targetUrl);
        }
    });
});

// Initialize settings
function initializeSettings() {
    const clickNumber = document.getElementById('clickNumber');
    
    // Get settings from storage
    chrome.storage.local.get('requiredClicks', (result) => {
        // if (result.requiredClicks) {
            clickNumber.value = result.requiredClicks||0;
            requiredClicks = result.requiredClicks;
            
            // Update all elements displaying click counts
            document.querySelectorAll('.requiredClicks').forEach(span => {
                span.textContent = result.requiredClicks;
            });
            
            // Update confirm button text
            updateConfirmButtonText();
        // }
    });
    
    // Add input event listener to update in real time
    clickNumber.addEventListener('input', () => {
        let value = parseInt(clickNumber.value);
        
        // Validate input value
        if (isNaN(value) || value < 0) value = 0;
        if (value > 9) value = 9;
        
        // Update input field value
        clickNumber.value = value;
        
        // Update settings
        requiredClicks = value;
        
        // Update all elements displaying click counts
        document.querySelectorAll('.requiredClicks').forEach(span => {
            span.textContent = value;
        });
        
        // Update confirm button text
        updateConfirmButtonText();
        
        // Save to storage
        chrome.storage.local.set({ requiredClicks: value });
        
        // If current click count has reached new requirement
        
    });
}

// Handle whitelist button click
document.getElementById('whitelistBtn').addEventListener('click', async () => {
    try {
        const urlObj = new URL(decodeURIComponent(targetUrl));
        const domain = extractMainDomain(urlObj.hostname);
        
        // Open database connection
        const request = indexedDB.open('DomainWhitelist', 1);
        
        request.onerror = () => console.error('Failed to open database');
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['domains'], 'readwrite');
            const store = transaction.objectStore('domains');
            
            // Add domain to whitelist
            const addRequest = store.add({
                domain,
                dateAdded: new Date().toISOString()
            });
            
            addRequest.onsuccess = () => {
                // Update button status
                const whitelistBtn = document.getElementById('whitelistBtn');
                whitelistBtn.innerHTML = `<i class="ri-check-line"></i>${i18n('addedToWhitelist')}`;
                whitelistBtn.style.color = 'var(--success-color)';
                
                // Update whitelist count
                updateWhitelistCount();

                confirmCount = requiredClicks;
                updateConfirmButtonText();
            };
            
            addRequest.onerror = () => {
                if (addRequest.error.name === 'ConstraintError') {
                    // Domain already exists
                    whitelistBtn.innerHTML = `<i class="ri-information-line"></i>${i18n('domainInWhitelist')}`;
                    whitelistBtn.style.color = 'var(--warning-color)';

                    confirmCount = requiredClicks;
                    updateConfirmButtonText();
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
        console.error('Failed to add to whitelist:', error);
    }
});

// Whitelist list related functions
const whitelistListBtn = document.getElementById('whitelistListBtn');
const whitelistModal = document.getElementById('whitelistModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const whitelistItems = document.getElementById('whitelistItems');
const whitelistCount = document.getElementById('whitelistCount');

// Pagination related variables
const PAGE_SIZE = 10; // Number of items to display per page
let currentPage = 1;
let totalPages = 1;

// Update whitelist count badge
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
        console.error('Failed to get whitelist count:', error);
        whitelistCount.textContent = '0';
    }
}

// Helper function to open database
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

// Update whitelist list items
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
                whitelistItems.innerHTML = `<div class="whitelist-item">${i18n('noWhitelistData')}</div>`;
                updatePagination(0);
                return;
            }

            // Sort by date descending
            domains.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

            // Calculate pagination
            totalPages = Math.ceil(domains.length / PAGE_SIZE);
            const start = (currentPage - 1) * PAGE_SIZE;
            const end = Math.min(start + PAGE_SIZE, domains.length);
            const pageItems = domains.slice(start, end);

            // Display data for current page
            pageItems.forEach(item => {
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

            // Bind delete button event
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const domain = e.currentTarget.dataset.domain;
                    removeFromWhitelist(domain);
                });
            });

            // Update pagination controls
            updatePagination(domains.length);
        };

        request.onerror = () => {
            console.error('Failed to get whitelist:', request.error);
            whitelistItems.innerHTML = `<div class="whitelist-item">${i18n('loadWhitelistFailed')}</div>`;
            updatePagination(0);
        };
    } catch (error) {
        console.error('Failed to access database:', error);
        whitelistItems.innerHTML = `<div class="whitelist-item">${i18n('loadWhitelistFailed')}</div>`;
        updatePagination(0);
    }
}

// Update pagination controls
function updatePagination(totalItems) {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');

    totalPages = Math.ceil(totalItems / PAGE_SIZE);
    
    // Update page number display
    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages;

    // Update button status
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;

    // Update pagination info text
    const pageInfo = document.querySelector('.page-info');
    if (pageInfo) {
        pageInfo.innerHTML = i18n('pageInfo', [
            `<span id="currentPage">${currentPage}</span>`,
            `<span id="totalPages">${totalPages}</span>`
        ]);
    }
}

// Remove domain from whitelist
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
            console.error('Failed to delete domain:', request.error);
        };
    } catch (error) {
        console.error('Failed to access database:', error);
    }
}

// Export whitelist
async function exportWhitelist() {
    try {
        const db = await openDatabase();
        const transaction = db.transaction(['domains'], 'readonly');
        const store = transaction.objectStore('domains');
        const domains = await new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        // Create export data
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            domains: domains
        };

        // Create and download file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `whitelist-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Failed to export whitelist:', error);
    }
}

// Import whitelist
async function importWhitelist(file) {
    try {
        const content = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });

        const importData = JSON.parse(content);
        
        // Validate import data format
        if (!importData.domains || !Array.isArray(importData.domains)) {
            throw new Error('Invalid import file format');
        }

        const db = await openDatabase();
        const transaction = db.transaction(['domains'], 'readwrite');
        const store = transaction.objectStore('domains');

        // Import all domains
        for (const item of importData.domains) {
            if (item.domain && typeof item.domain === 'string') {
                try {
                    await new Promise((resolve, reject) => {
                        const request = store.put(item);
                        request.onsuccess = () => resolve();
                        request.onerror = () => reject(request.error);
                    });
                } catch (error) {
                    console.warn(`Failed to import domain ${item.domain}:`, error);
                }
            }
        }

        // Update interface
        updateWhitelistItems();
        updateWhitelistCount();
    } catch (error) {
        console.error('Failed to import whitelist:', error);
    }
}

// 添加搜索和清空功能
let searchTimeout;
let currentSearchTerm = '';

// 搜索白名单
async function searchWhitelist(searchTerm) {
    try {
        const db = await openDatabase();
        const transaction = db.transaction(['domains'], 'readonly');
        const store = transaction.objectStore('domains');
        const domains = await new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        // 过滤域名
        const filteredDomains = domains.filter(item => 
            item.domain.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // 更新分页和显示
        currentPage = 1;
        updateWhitelistDisplay(filteredDomains);
    } catch (error) {
        console.error('搜索白名单失败:', error);
    }
}

// 更新白名单显示
function updateWhitelistDisplay(domains) {
    whitelistItems.innerHTML = '';

    if (domains.length === 0) {
        whitelistItems.innerHTML = `<div class="whitelist-item">${i18n('noWhitelistData')}</div>`;
        updatePagination(0);
        return;
    }

    // 计算分页
    totalPages = Math.ceil(domains.length / PAGE_SIZE);
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, domains.length);
    const pageItems = domains.slice(start, end);

    // 显示当前页数据
    pageItems.forEach(item => {
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

    // 更新分页控件
    updatePagination(domains.length);
}

// 清空白名单
async function clearWhitelist() {
    if (!confirm(i18n('clearWhitelistConfirm'))) {
        return;
    }

    try {
        const db = await openDatabase();
        const transaction = db.transaction(['domains'], 'readwrite');
        const store = transaction.objectStore('domains');
        
        await new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        // 更新界面
        updateWhitelistItems();
        updateWhitelistCount();
        alert(i18n('clearWhitelistSuccess'));
    } catch (error) {
        console.error('清空白名单失败:', error);
        alert(i18n('clearWhitelistFailed'));
    }
}

// 修改初始化白名单函数
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

    // 绑定导入导出按钮事件
    const importBtn = document.getElementById('importWhitelistBtn');
    const exportBtn = document.getElementById('exportWhitelistBtn');
    const clearBtn = document.getElementById('clearWhitelistBtn');
    const fileInput = document.getElementById('whitelistFileInput');
    const searchInput = document.getElementById('whitelistSearch');

    if (importBtn && exportBtn && fileInput && clearBtn && searchInput) {
        // 导入按钮点击事件
        importBtn.addEventListener('click', () => {
            fileInput.click();
        });

        // 文件选择事件
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                importWhitelist(file);
                fileInput.value = '';
            }
        });

        // 导出按钮点击事件
        exportBtn.addEventListener('click', exportWhitelist);

        // 清空按钮点击事件
        clearBtn.addEventListener('click', clearWhitelist);

        // 搜索输入事件
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            currentSearchTerm = searchTerm;
            
            // 清除之前的定时器
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            
            // 设置新的定时器
            searchTimeout = setTimeout(() => {
                searchWhitelist(searchTerm);
            }, 300);
        });
    }

    // 绑定分页按钮事件
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            if (currentSearchTerm) {
                searchWhitelist(currentSearchTerm);
            } else {
                updateWhitelistItems();
            }
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            if (currentSearchTerm) {
                searchWhitelist(currentSearchTerm);
            } else {
                updateWhitelistItems();
            }
        }
    });
}

// Show whitelist list
function showWhitelistModal() {
    whitelistModal.classList.add('show');
    currentPage = 1; // Reset page number
    updateWhitelistItems();
}

// Hide whitelist list
function hideWhitelistModal() {
    whitelistModal.classList.remove('show');
}

// Initialize all functions after page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize internationalization
    initializeI18n();
    
    // Initialize settings
    initializeSettings();
    
    // Initialize whitelist functions
    initializeWhitelist();
    
    // Initialize target URL display
    initializeTargetUrl();
}); 