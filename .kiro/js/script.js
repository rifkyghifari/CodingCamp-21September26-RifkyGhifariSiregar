const balanceEl = document.getElementById('total-balance');
const listEl = document.getElementById('transaction-list');
const formEl = document.getElementById('transaction-form');
const itemEl = document.getElementById('item-name');
const amountEl = document.getElementById('amount');
const categoryEl = document.getElementById('category');
const customCategoryEl = document.getElementById('custom-category');
const sortListEl = document.getElementById('sort-list');
const themeToggleBtn = document.getElementById('theme-toggle');
const ctx = document.getElementById('expense-chart').getContext('2d');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let isDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
let expenseChart;

// Inisialisasi Tema
if (isDarkMode) document.body.classList.add('dark-mode');

function init() {
    renderList();
    updateValues();
    updateChart();
}

function addTransaction(e) {
    e.preventDefault();
    if (itemEl.value.trim() === '' || amountEl.value.trim() === '') return;

    const finalCategory = customCategoryEl.value.trim() !== '' 
        ? customCategoryEl.value.trim() 
        : categoryEl.value;

    const transaction = {
        id: Math.floor(Math.random() * 100000000),
        name: itemEl.value,
        amount: parseFloat(amountEl.value),
        category: finalCategory
    };

    transactions.push(transaction);
    updateLocalStorage();
    init();

    itemEl.value = '';
    amountEl.value = '';
    customCategoryEl.value = '';
}

function renderList() {
    listEl.innerHTML = '';
    let sortedTransactions = [...transactions];
    
    if (sortListEl.value === 'highest') {
        sortedTransactions.sort((a, b) => b.amount - a.amount);
    } else if (sortListEl.value === 'lowest') {
        sortedTransactions.sort((a, b) => a.amount - b.amount);
    }

    sortedTransactions.forEach(transaction => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="list-info">
                <strong>${transaction.name}</strong>
                <span style="color:#3498db">Rp${transaction.amount.toLocaleString('id-ID')}</span>
                <br><small>${transaction.category}</small>
            </div>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">Hapus</button>
        `;
        listEl.appendChild(li);
    });
}

function updateValues() {
    const total = transactions.reduce((acc, item) => (acc += item.amount), 0);
    balanceEl.innerText = `Rp${total.toLocaleString('id-ID')}`;
}

function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateChart() {
    const categoryTotals = {};
    transactions.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const backgroundColors = labels.map((_, i) => {
        const colors = ['#2ecc71', '#3498db', '#e67e22', '#9b59b6', '#f1c40f', '#e74c3c'];
        return colors[i % colors.length];
    });

    if (expenseChart) expenseChart.destroy();

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors
            }]
        }
    });
}

// Event Listeners yang menghubungkan HTML dengan aksi Javascript
formEl.addEventListener('submit', addTransaction);
sortListEl.addEventListener('change', renderList);

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
});

init();