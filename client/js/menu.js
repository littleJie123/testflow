// 菜单配置
const menus = [
  { name: '测试用例', url: 'index.html' }
];

// 初始化菜单
function initMenu() {
  const menuContainer = document.getElementById('menuContainer');
  if (!menuContainer) return;

  // 获取当前页面路径（不含查询参数）
  const currentPath = window.location.pathname.split('?')[0];
  // 获取当前页面的文件名
  const currentPage = currentPath.split('/').pop() || 'index.html';

  // 创建菜单HTML
  const menuHtml = menus.map(menu => {
    const isActive = currentPage.toLowerCase() === menu.url.toLowerCase();
    return `
      <div class="menu-item ${isActive ? 'active' : ''}" onclick="location.href='${menu.url}'">
        ${menu.name}
      </div>
    `;
  }).join('');

  // 渲染菜单
  menuContainer.innerHTML = menuHtml;
}

// 页面加载完成后初始化菜单
document.addEventListener('DOMContentLoaded', initMenu);