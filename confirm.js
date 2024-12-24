// 获取URL参数中的目标网址
const urlParams = new URLSearchParams(window.location.search);
const targetUrl = urlParams.get('url');

// 显示目标网址
document.getElementById('targetUrl').textContent = decodeURIComponent(targetUrl);

let confirmCount = 0;
const confirmBtn = document.getElementById('confirmBtn');
const visitBtn = document.getElementById('visitBtn');
const confirmCountSpan = document.getElementById('confirmCount');

// 处理确认按钮点击
confirmBtn.addEventListener('click', () => {
  confirmCount++;
  confirmCountSpan.textContent = confirmCount;
  
  if (confirmCount >= 3) {
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