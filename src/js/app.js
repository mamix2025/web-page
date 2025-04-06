// Конфигурация приложения
const config = {
    user: {
        name: "Fomgleb",
        avatar: "../imgs/fomgleb.png",
        role: "Диспетчер"
    },
    menu: [
        { id: "home", icon: "dashboard", title: "Главная", path: "/" },
        { id: "requests", icon: "warning", title: "Заявки", path: "/requests" },
        { id: "settings", icon: "settings", title: "Настройки", path: "/settings" }
    ]
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    initLayout();
    loadPage(window.location.pathname || '/');
    window.addEventListener('popstate', () => loadPage(window.location.pathname));
});

// Инициализация layout
function initLayout() {
    // Сайдбар
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = `
        <div class="sidebar-menu">
            <div class="logo">
                <h2>ЖКУ Диспетчер</h2>
            </div>
            <ul class="menu">
                ${config.menu.map(item => `
                    <li class="menu-item" data-path="${item.path}">
                        <i class="material-icons menu-icon">${item.icon}</i>
                        ${item.title}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    // Хедер
    const header = document.getElementById('header');
    header.innerHTML = `
        <div class="search-bar">
            <i class="material-icons">search</i>
            <input type="text" placeholder="Поиск...">
        </div>
        <div class="user-info">
            <img src="${config.user.avatar}" alt="${config.user.name}">
            <span>${config.user.name}</span>
            <small>${config.user.role}</small>
        </div>
    `;

    // Обработчики меню
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const path = item.getAttribute('data-path');
            navigateTo(path);
        });
    });
}

// Навигация
function navigateTo(path) {
    window.history.pushState({}, path, window.location.origin + path);
    loadPage(path);
}

// Загрузка страницы
async function loadPage(path) {
    try {
        // Обновляем активный пункт меню
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-path') === path) {
                item.classList.add('active');
            }
        });

        // Загружаем контент страницы
        let content = '';
        switch(path) {
            case '/requests':
                content = await loadRequestsPage();
                break;
            case '/settings':
                content = await loadSettingsPage();
                break;
            default:
                content = await loadHomePage();
        }

        document.getElementById('content').innerHTML = content;
        initPageEvents(path);
    } catch (error) {
        console.error('Ошибка загрузки страницы:', error);
        document.getElementById('content').innerHTML = `
            <div class="card">
                <h2>Ошибка загрузки страницы</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Страницы
async function loadHomePage() {
    return `
        <div class="card">
            <h2 class="card-title">Главная панель</h2>
            <div class="stats-grid">
                <!-- Статистика будет здесь -->
            </div>
        </div>
    `;
}

async function loadRequestsPage() {
    return `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Управление заявками</h2>
                <button class="btn btn-primary" id="newRequestBtn">
                    <i class="material-icons">add</i>
                    Новая заявка
                </button>
            </div>
            
            <div class="filters">
                <!-- Фильтры будут здесь -->
            </div>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Тип заявки</th>
                        <th>Адрес</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#12458</td>
                        <td>Протечка воды</td>
                        <td>ул. Ленина, 15, кв. 42</td>
                        <td><span class="status status-new">Новая</span></td>
                        <td class="actions">
                            <button class="action-btn view"><i class="material-icons">visibility</i></button>
                            <button class="action-btn edit"><i class="material-icons">edit</i></button>
                        </td>
                    </tr>
                    <!-- Другие строки таблицы -->
                </tbody>
            </table>
        </div>
    `;
}

async function loadSettingsPage() {
    return `
        <div class="card">
            <h2 class="card-title">Настройки системы</h2>
            
            <div class="settings-section">
                <h3>Профиль пользователя</h3>
                <form id="profileForm">
                    <div class="form-group">
                        <label class="form-label">Имя пользователя</label>
                        <input type="text" class="form-control" value="${config.user.name}">
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <i class="material-icons">save</i>
                        Сохранить
                    </button>
                </form>
            </div>
            
            <div class="settings-section">
                <h3>Безопасность</h3>
                <button id="logoutBtn" class="btn btn-danger">
                    <i class="material-icons">exit_to_app</i>
                    Выйти из системы
                </button>
            </div>
        </div>
    `;
}

// Инициализация событий страницы
function initPageEvents(path) {
    switch(path) {
        case '/settings':
            document.getElementById('profileForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Изменения сохранены');
            });
            
            document.getElementById('logoutBtn')?.addEventListener('click', () => {
                if (confirm('Вы уверены, что хотите выйти?')) {
                    alert('Вы вышли из системы');
                    navigateTo('/');
                }
            });
            break;
            
        case '/requests':
            document.getElementById('newRequestBtn')?.addEventListener('click', () => {
                alert('Создание новой заявки');
            });
            break;
    }
}