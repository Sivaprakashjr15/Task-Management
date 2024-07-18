import { auth, db } from './firebase.js';

// Authentication
document.getElementById('auth-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log('Logged in:', userCredential.user);
      document.querySelector('.auth-section').style.display = 'none';
      document.querySelector('.task-section').style.display = 'block';
      loadTasks();
    })
    .catch(error => {
      console.error('Error logging in:', error);
    });
});

document.getElementById('sign-up-btn').addEventListener('click', function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log('Signed up:', userCredential.user);
      document.querySelector('.auth-section').style.display = 'none';
      document.querySelector('.task-section').style.display = 'block';
      loadTasks();
    })
    .catch(error => {
      console.error('Error signing up:', error);
    });
});

// Load tasks
function loadTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = ''; // Clear existing tasks

  db.collection('tasks').get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const task = doc.data();
        addTaskToDOM(task, doc.id);
      });
    })
    .catch(error => {
      console.error('Error loading tasks:', error);
    });
}

// Add task to Firestore
document.getElementById('task-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const status = document.getElementById('status').value;

  db.collection('tasks').add({
    title: title,
    description: description,
    status: status
  })
  .then(docRef => {
    console.log('Task added:', docRef.id);
    addTaskToDOM({ title, description, status }, docRef.id);
    document.getElementById('task-form').reset();
  })
  .catch(error => {
    console.error('Error adding task:', error);
  });
});

// Add task to DOM
function addTaskToDOM(task, id) {
  const taskList = document.getElementById('task-list');
  const taskItem = document.createElement('div');
  taskItem.className = 'task-item';
  taskItem.setAttribute('data-id', id);
  taskItem.innerHTML = `
    <div>
      <h3>${task.title}</h3>
      <p>${task.description}</p>
    </div>
    <div>
      <select onchange="updateTaskStatus('${id}', this.value)">
        <option value="To Do" ${task.status === 'To Do' ? 'selected' : ''}>To Do</option>
        <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
        <option value="Done" ${task.status === 'Done' ? 'selected' : ''}>Done</option>
      </select>
      <button onclick="deleteTask('${id}')">Delete</button>
    </div>
  `;
  taskList.appendChild(taskItem);
}

// Update task status in Firestore
window.updateTaskStatus = function(id, status) {
  db.collection('tasks').doc(id).update({ status: status })
    .then(() => {
      console.log('Task updated:', id);
    })
    .catch(error => {
      console.error('Error updating task:', error);
    });
}

// Delete task from Firestore
window.deleteTask = function(id) {
  db.collection('tasks').doc(id).delete()
    .then(() => {
      console.log('Task deleted:', id);
      document.querySelector(`.task-item[data-id="${id}"]`).remove();
    })
    .catch(error => {
      console.error('Error deleting task:', error);
    });
}

// Filter tasks by status
document.getElementById('filter-status').addEventListener('change', function() {
  const filterStatus = this.value;
  const tasks = document.getElementsByClassName('task-item');

  for (let task of tasks) {
    const status = task.querySelector('select').value;
    if (filterStatus === 'All' || filterStatus === status) {
      task.style.display = '';
    } else {
      task.style.display = 'none';
    }
  }
});
