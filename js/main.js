const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];
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

	/*формирование CSS класса*/
	const cssClass = newTask.done ? 'task-title task-title--done' : 'task-title';

	/*HTML разметка для новой задачи с применением интерполяции*/
	const taskHTML = `
					<li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
						<span class="${cssClass}">${newTask.text}</span>
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
