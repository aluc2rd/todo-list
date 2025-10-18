const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

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

	/*проверка на пустоту списка*/
	if (tasksList.children.length > 1) {
		emptyList.classList.add('none'); /*добавлен класс на скрытие из CSS*/
	}
}

function deleteTask(event) {
	/*клик не по кноке удаления*/
	if (event.target.dataset.action !== 'delete') return; /*функция закончит свою работу*/

	const parentNode = event.target.closest('list-group-item');

	const id = Number(parentNode.id); /*т.к. далее придется сравнивать строку и число, а этого избегаем*/

	const index = tasks.findIndex((task) => task.id === id);

	tasks.splice(index, 1);

	parentNode.remove();

	/*проверка на пустоту и вывод сообщения об этом*/
	if (tasksList.children.length === 1) {
		emptyList.classList.remove('none');
	}
}

function doneTask(event) {
	/*клик не по кноке выполнения*/
	if (event.target.dataset.action !== 'done') return;

	const parentNode = event.target.closest('list-group-item'); /*родительский li*/
	/*поиск внутри*/
	const taskTitle = parentNode.querySelector('task-title');
	/*добавление или удаление класса с помощью toggle*/
	taskTitle.classList.toggle('task-title--done');
}
