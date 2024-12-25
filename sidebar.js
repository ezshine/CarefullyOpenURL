// 当页面加载完成时，加载保存的设置
document.addEventListener('DOMContentLoaded', async () => {
    // 获取输入框和保存按钮元素
    const clickCountInput = document.getElementById('clickCount');
    const saveButton = document.getElementById('saveSettings');

    // 从 chrome.storage 中加载保存的设置
    try {
        const result = await chrome.storage.sync.get(['requiredClicks']);
        if (result.requiredClicks) {
            clickCountInput.value = result.requiredClicks;
        }
    } catch (error) {
        console.error('加载设置失败:', error);
    }

    // 添加保存按钮点击事件
    saveButton.addEventListener('click', async () => {
        const newClickCount = parseInt(clickCountInput.value);

        // 保存设置到 chrome.storage
        try {
            await chrome.storage.sync.set({
                requiredClicks: newClickCount
            });
            alert('设置已保存');
        } catch (error) {
            console.error('保存设置失败:', error);
            alert('保存设置失败，请重试');
        }
    });
}); 