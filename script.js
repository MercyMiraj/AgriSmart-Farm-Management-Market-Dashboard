// Data State Management
let crops = JSON.parse(localStorage.getItem('agri_crops')) || [];
let expenses = JSON.parse(localStorage.getItem('agri_expenses')) || [];
let tasks = JSON.parse(localStorage.getItem('agri_tasks')) || [];

// DOM Elements
document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
});

// Tab Navigation Logic
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
  });
});

// CROP TRACKER LOGIC
const cropForm = document.getElementById('crop-form');
const cropList = document.getElementById('crop-list');

cropForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newCrop = {
    id: Date.now(),
    name: document.getElementById('crop-name').value,
    field: document.getElementById('crop-field').value,
    plantDate: document.getElementById('plant-date').value,
    harvestDate: document.getElementById('harvest-date').value
  };
  crops.push(newCrop);
  saveAndRender();
  cropForm.reset();
});

function renderCrops() {
  cropList.innerHTML = '';
  if (crops.length === 0) {
    cropList.innerHTML = '<p class="section-desc">No active crops logged yet.</p>';
    return;
  }

  crops.forEach(crop => {
    const start = new Date(crop.plantDate).getTime();
    const end = new Date(crop.harvestDate).getTime();
    const now = new Date().getTime();
    
    let progress = Math.round(((now - start) / (end - start)) * 100);
    progress = Math.max(0, Math.min(100, isNaN(progress) ? 0 : progress));

    const card = document.createElement('div');
    card.className = 'crop-card';
    card.innerHTML = `
      <div class="crop-card-header">
        <h3>${crop.name}</h3>
        <button onclick="deleteCrop(${crop.id})" class="btn-danger"><i class="fa-solid fa-trash"></i></button>
      </div>
      <p style="color: var(--accent-gold); font-size: 0.9rem;">📍 ${crop.field}</p>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${progress}%;"></div>
      </div>
      <div class="crop-meta">
        <span>Planted: ${crop.plantDate}</span>
        <span>Harvest: ${crop.harvestDate} (${progress}%)</span>
      </div>
    `;
    cropList.appendChild(card);
  });
}

function deleteCrop(id) {
  crops = crops.filter(c => c.id !== id);
  saveAndRender();
}

// EXPENSE LEDGER LOGIC
const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalExpensesEl = document.getElementById('total-expenses');

expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newExpense = {
    id: Date.now(),
    item: document.getElementById('expense-item').value,
    category: document.getElementById('expense-category').value,
    amount: parseFloat(document.getElementById('expense-amount').value)
  };
  expenses.push(newExpense);
  saveAndRender();
  expenseForm.reset();
});

function renderExpenses() {
  expenseList.innerHTML = '';
  let total = 0;

  expenses.forEach(exp => {
    total += exp.amount;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${exp.item}</td>
      <td><span class="priority-chip priority-Low">${exp.category}</span></td>
      <td class="gold-text">$${exp.amount.toFixed(2)}</td>
      <td><button onclick="deleteExpense(${exp.id})" class="btn-danger"><i class="fa-solid fa-trash"></i></button></td>
    `;
    expenseList.appendChild(tr);
  });

  totalExpensesEl.textContent = `$${total.toFixed(2)}`;
}

function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  saveAndRender();
}

// TASK CHECKLIST LOGIC
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTask = {
    id: Date.now(),
    desc: document.getElementById('task-desc').value,
    priority: document.getElementById('task-priority').value,
    completed: false
  };
  tasks.push(newTask);
  saveAndRender();
  taskForm.reset();
});

function renderTasks() {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="section-desc">No farm tasks added yet.</p>';
    return;
  }

  tasks.forEach(task => {
    const div = document.createElement('div');
    div.className = `task-item ${task.completed ? 'completed' : ''}`;
    div.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
        <span>${task.desc}</span>
        <span class="priority-chip priority-${task.priority}">${task.priority}</span>
      </div>
      <button onclick="deleteTask(${task.id})" class="btn-danger"><i class="fa-solid fa-trash"></i></button>
    `;
    taskList.appendChild(div);
  });
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveAndRender();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveAndRender();
}

// Global Persistence & Render
function saveAndRender() {
  localStorage.setItem('agri_crops', JSON.stringify(crops));
  localStorage.setItem('agri_expenses', JSON.stringify(expenses));
  localStorage.setItem('agri_tasks', JSON.stringify(tasks));

  renderCrops();
  renderExpenses();
  renderTasks();
}

// Initial Run
saveAndRender();
