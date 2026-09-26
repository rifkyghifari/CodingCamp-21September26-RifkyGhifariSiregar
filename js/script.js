const balanceEl = document.getElementById('total-balance');
const listEl = document.getElementById('transaction-list');
const formEl = document.getElementById('transaction-form');
const itemEl = document.getElementById('item-name');
const amountEl = document.getElementById('amount');
const categoryEl = document.getElementById('category');
const ctx = document.getElementById('expense-chart').getContext('2d');

// Mengambil data dari Local Storage atau membuat array kosong jika belum ada
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let expenseChart;

// Fungsi untuk menginisialisasi aplikasi
function init() {
    listEl.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
    updateChart();
}

// Menambahkan transaksi baru
function addTransaction(e) {
    e.preventDefault();
    if (itemEl.value.trim() === '' || amountEl.value.trim() === '') return;

    const transaction = {
        id: Math.floor(Math.random() * 100000000),
        name: itemEl.value,
        amount: parseFloat(amountEl.value),
        category: categoryEl.value
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateChart();
    updateLocalStorage();

    itemEl.value = '';
    amountEl.value = '';
}

// Merender elemen transaksi ke dalam daftar HTML
function addTransactionDOM(transaction) {
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
}

// Memperbarui total saldo
function updateValues() {
    const total = transactions.reduce((acc, item) => (acc += item.amount), 0);
    balanceEl.innerText = `Rp${total.toLocaleString('id-ID')}`;
}

// Menghapus transaksi berdasarkan ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

// Menyimpan data ke Local Storage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Memperbarui grafik Chart.js
function updateChart() {
    // Sesuaikan kategori dengan bahasa Indonesia yang ada di HTML
    const categories = { Makanan: 0, Transportasi: 0, Hiburan: 0 };
    transactions.forEach(t => {
        if(categories[t.category] !== undefined) {
            categories[t.category] += t.amount;
        }
    });

    const data = [categories.Makanan, categories.Transportasi, categories.Hiburan];

    // Menghapus instance chart lama agar tidak tumpang tindih
    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Makanan', 'Transportasi', 'Hiburan'],
            datasets: [{
                data: data,
                backgroundColor: ['#2ecc71', '#3498db', '#e67e22']
            }]
        }
    });
}

// Event Listener
formEl.addEventListener('submit', addTransaction);

// Menjalankan inisialisasi awal
init();