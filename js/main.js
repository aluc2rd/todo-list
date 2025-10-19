const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(event) {
	/*отмена стандартного поведения (обновление страницы по кнопке)*/
	event.preventDefault();

	/*текст задачи из input*/
	const taskText = taskInput.value;

	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	};

	tasks.push(newTask); /*добавление в массив новой задачи*/

	saveToLocalStorage(); //хранилище

	renderTask(newTask);

	/*добавление задачи на страницу*/
	tasksList.insertAdjacentHTML('beforeend', taskHTML);

	/*очистка поля ввода и фокус на него*/
	taskInput.value = '';
	taskInput.focus();

	checkEmptyList();
}

function deleteTask(event) {
	/*клик не по кноке удаления*/
	if (event.target.dataset.action !== 'delete') return; /*функция закончит свою работу*/

	const parentNode = event.target.closest('list-group-item');

	const id = Number(parentNode.id); /*т.к. далее придется сравнивать строку и число, а этого избегаем*/

	/*версия через фильтрацию*/
	tasks = tasks.filter((task) => task.id !== id);

	saveToLocalStorage();

	parentNode.remove();

	checkEmptyList();
}

function doneTask(event) {
	/*клик не по кноке выполнения*/
	if (event.target.dataset.action !== 'done') return;

	const parentNode = event.target.closest('list-group-item'); /*родительский li*/

	//определение id задачи
	const id = Number(parentNode.id);
	const task = tasks.find((task) => task.id === id);
	task.done = !task.done; //смена состояния

	saveToLocalStorage();

	/*поиск внутри*/
	const taskTitle = parentNode.querySelector('task-title');
	/*добавление или удаление класса с помощью toggle*/
	taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
									<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
									<div class="empty-list__title">Список дел пуст</div>
								</li>`;
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList');
		emptyListEl ? emptyListEl.remove() : null;
	}
}

function saveToLocalStorage() {
	//пара ключ значение
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

	/*HTML разметка для новой задачи с применением интерполяции*/
	const taskHTML = `
					<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
						<span class="${cssClass}">${task.text}</span>
						<div class="task-item__buttons">
							<button type="button" data-action="done" class="btn-action">
								<img src="./img/tick.svg" alt="Done" width="18" height="18" />
							</button>
							<button type="button" data-action="delete" class="btn-action">
								<img src="./img/cross.svg" alt="Done" width="18" height="18" />
							</button>
						</div>
					</li>`;

	/*добавление задачи на страницу*/
	tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
