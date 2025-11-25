export const reloadPage = async (callback, delay = 500) => {
  // Tạo overlay loading
  const loadingDiv = document.createElement('div');
  loadingDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(2px);
    opacity: 0;
    transition: opacity 0.3s;
  `;

  loadingDiv.innerHTML = `
    <div style="
      text-align: center;
      padding: 20px;
      border-radius: 8px;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    ">
      <img 
        src="/src/assets/logos/logo.png" 
        alt="Loading..." 
        style="
          width: 100px;
          height: auto;
          animation: bounce 1s infinite;
        "
      />
      <div style="
        margin-top: 15px; 
        color: #1890ff;
        font-size: 16px;
        font-weight: 500;
      ">
        Đang tải...
      </div>
    </div>
  `;

  // Thêm style cho animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(loadingDiv);

  // Animation fade in
  requestAnimationFrame(() => {
    loadingDiv.style.opacity = '1';
  });

  // Thực hiện callback để load lại dữ liệu
  if (typeof callback === 'function') {
    try {
      await callback();
    } catch (error) {
      console.error('Lỗi khi tải lại dữ liệu:', error);
    }
  }

  // Xóa loading sau delay
  setTimeout(() => {
    loadingDiv.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(loadingDiv);
      document.head.removeChild(style);
    }, 300);
  }, delay);
}; 