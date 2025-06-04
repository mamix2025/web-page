const token = localStorage.getItem("auth_token");
if (!token) {
    window.location.href = "login.html";
}

function logout() {
    localStorage.removeItem("auth_token");
    window.location.href = "login.html";
}

function switch_to_main() {
    localStorage.setItem("auth_token", token);
    window.location.href = "main_page.html";
  }

async function fetchRequests() {
    try {
    const response = await fetch("http://localhost:8000/api/requests", {
        method: "POST",
        headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const data = await response.json();
    renderRequests(data.requests);
    } catch (err) {
        alert("Ошибка при загрузке заявок: " + err.message);
    }
}

function renderRequests(requests) {
    const tbody = document.querySelector("#requests-table tbody");
    tbody.innerHTML = "";

    requests.forEach(request => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${request.request_id}</td>
        <td>${request.address}</td>
        <td>${request.apartment_id}</td>
        <td>${request.type}</td>
        <td>
        <select data-id="${request.request_id}" onchange="changeStatus(this)">
            <option ${request.status === 'Новая' ? 'selected' : ''}>Новая</option>
            <option ${request.status === 'В работе' ? 'selected' : ''}>В работе</option>
            <option ${request.status === 'Выполнено' ? 'selected' : ''}>Выполнено</option>
        </select>
        </td>
        <td>${new Date(request.created_at).toLocaleString()}</td>
        <td>${request.resident_name}</td>
        <td><button onclick="saveStatus(${request.request_id})">Сохранить</button></td>
    `;

    tbody.appendChild(row);
    });
}

fetchRequests();