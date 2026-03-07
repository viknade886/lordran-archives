function checkAuth() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  const loginLink = document.getElementById('loginLink');
  const logoutLink = document.getElementById('logoutLink');
  const dashLink = document.getElementById('dashLink');
  const sidebarAuth = document.getElementById('sidebarAuth');
  const sidebarUser = document.getElementById('sidebarUser');
  const sidebarUsername = document.getElementById('sidebarUsername');

  if (token) {
    if (loginLink) loginLink.style.display = 'none';
    if (logoutLink) {
      logoutLink.style.display = 'inline';
      logoutLink.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
      });
    }
    if (dashLink && (role === 'operator' || role === 'admin')) {
      dashLink.style.display = 'inline';
    }
    if (sidebarAuth) sidebarAuth.style.display = 'none';
    if (sidebarUser) sidebarUser.style.display = 'block';
    if (sidebarUsername) sidebarUsername.textContent = `👤 ${username} (${role})`;
  }
}
