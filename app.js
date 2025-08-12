const API_BASE = "https://tanid-zoriulsan-api.mn"; // энд таны API domain тавина
let authToken = null;

// Login
async function login(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!username || !password) {
        showNotification("Мэдээллээ бүрэн оруулна уу", "error");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (data.success) {
            authToken = data.token;
            document.getElementById('welcomePage').classList.add('hidden');
            document.getElementById('userPage').classList.remove('hidden');
            closeModal('loginModal');
            showNotification(`Сайн байна уу, ${data.username}!`, "success");
            loadCharts(); // Chart data API-аас авах
        } else {
            showNotification("Нэвтрэх мэдээлэл буруу байна", "error");
        }
    } catch (err) {
        showNotification("Сервертэй холбогдож чадсангүй", "error");
    }
}

// Chart data API-аас авах
async function loadCharts() {
    try {
        const res = await fetch(`${API_BASE}/api/statistics`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        const stats = await res.json();

        // Distribution Chart
        const ctx1 = document.getElementById('distributionChart');
        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: stats.distribution.map(d => d.country),
                datasets: [{
                    label: 'Машины тоо',
                    data: stats.distribution.map(d => d.count),
                    backgroundColor: '#3b82f6'
                }]
            }
        });

        // Age Chart
        const ctx2 = document.getElementById('ageChart');
        new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: stats.age.map(a => a.range),
                datasets: [{
                    data: stats.age.map(a => a.count),
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
                }]
            }
        });

    } catch (err) {
        showNotification("Статистикийн мэдээлэл авахад алдаа гарлаа", "error");
    }
}

// Logout
async function logout() {
    try {
        await fetch(`${API_BASE}/api/logout`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${authToken}` }
        });
    } catch {}
    authToken = null;
    document.getElementById('userPage').classList.add('hidden');
    document.getElementById('welcomePage').classList.remove('hidden');
    showNotification("Системээс гарлаа", "info");
}
