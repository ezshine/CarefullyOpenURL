// IndexedDB 配置
const DB_NAME = 'DomainWhitelist';
const DB_VERSION = 1;
const STORE_NAME = 'domains';
const PAGE_SIZE = 10;

let db;
let currentPage = 1;
let totalPages = 1;

// 初始化数据库
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'domain' });
                store.createIndex('dateAdded', 'dateAdded', { unique: false });
            }
        };
    });
}

// 添加域名到白名单
async function addDomain(domain) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add({
            domain,
            dateAdded: new Date().toISOString()
        });

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// 从白名单移除域名
async function removeDomain(domain) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(domain);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// 获取指定页码的域名列表
async function getDomains(page) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('dateAdded');

        // 获取总数
        const countRequest = store.count();
        countRequest.onsuccess = () => {
            const total = countRequest.result;
            totalPages = Math.ceil(total / PAGE_SIZE);

            // 获取当前页的数据
            const request = index.getAll();
            
            request.onsuccess = () => {
                const allDomains = request.result;
                const start = (page - 1) * PAGE_SIZE;
                const domains = allDomains
                    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
                    .slice(start, start + PAGE_SIZE);
                resolve({ domains, total });
            };
        };
        
        countRequest.onerror = () => reject(countRequest.error);
    });
}

// 渲染域名列表
async function renderDomainList() {
    const domainList = document.getElementById('domainList');
    const { domains, total } = await getDomains(currentPage);

    if (domains.length === 0) {
        domainList.innerHTML = `
            <div class="empty-state">
                <i class="ri-inbox-line"></i>
                <div>暂无白名单域名</div>
            </div>
        `;
        return;
    }

    domainList.innerHTML = domains.map(({ domain }) => `
        <div class="domain-item">
            <span class="domain-name">${domain}</span>
            <button class="remove-btn" onclick="handleRemoveDomain('${domain}')">
                <i class="ri-delete-bin-line"></i>
            </button>
        </div>
    `).join('');

    renderPagination(total);
}

// 渲染分页按钮
function renderPagination(total) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(total / PAGE_SIZE);

    let buttons = [];
    
    // 添加数字按钮
    for (let i = 1; i <= totalPages; i++) {
        buttons.push(`
            <button class="page-btn ${currentPage === i ? 'active' : ''}"
                    onclick="handlePageChange(${i})">
                ${i}
            </button>
        `);
    }

    pagination.innerHTML = buttons.join('');
}

// 处理页码变化
async function handlePageChange(page) {
    currentPage = page;
    await renderDomainList();
}

// 处理域名删除
async function handleRemoveDomain(domain) {
    await removeDomain(domain);
    await renderDomainList();
}

// 处理导入
async function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const domains = JSON.parse(e.target.result);
                for (const domain of domains) {
                    await addDomain(domain);
                }
                await renderDomainList();
            } catch (error) {
                console.error('导入失败:', error);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// 处理导出
async function handleExport() {
    const { domains } = await getDomains(1);
    const domainList = domains.map(d => d.domain);
    const blob = new Blob([JSON.stringify(domainList, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'domain-whitelist.json';
    a.click();
    
    URL.revokeObjectURL(url);
}

// 初始化页面
async function init() {
    await initDB();
    await renderDomainList();
    
    // 添加导入导出事件监听
    document.getElementById('importBtn').addEventListener('click', handleImport);
    document.getElementById('exportBtn').addEventListener('click', handleExport);
}

// 启动应用
init(); 