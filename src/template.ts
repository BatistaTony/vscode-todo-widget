export const todoTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VSCode To-Do</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background-color: #29335C;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            height: 100vh;
        }

        .todo-app {
            width: 100%;
            height: 100%;
            max-width: 100%;
            border-radius: 10px;
        }

        .todo-app h1 {
            font-size: 24px;
            color: #fff;
            margin-bottom: 20px;
            padding-top:20px;
        }

        #new-task,
        .input-sub-task input {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border-radius: 5px;
            border: 1px solid #ddd;
            margin-bottom: 10px;
            transition: border-color 0.3s ease;
        }

        .new-task {
            margin-top: 30px;
        }

        #new-task:focus {
            outline: none;
            border-color: #0067c0;
        }

        #error-message {
            font-size: 14px;
            display: none;
            margin-bottom: 10px;
            opacity: 1;
            transition: opacity 0.3s ease;
            color: #fff;
            border-radius: 5px;
            background-color: #DB2B39;
            padding: 10px;
        }

        #task-list {
            list-style: none;
            padding: 0;
        }

        .task-item,
        .sub-task-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 10px;
            background-color: #177bb920;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-bottom: 10px;
            opacity: 1;
            transition: opacity 0.3s ease, background-color 0.3s ease;
        }

        .task-item.done,
        .sub-task-item.done {
            background-color: #038aeaa1;
            text-decoration: line-through;
            color: #aaa;
        }

        .task-text,
        .sub-task-text {
            flex: 1;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: color 0.3s ease;
            color: #fff;

        }

        .edit-mode input {
            width: 95%;
            padding: 5px;
            font-size: 14px;
            color: #fff;
            background: #29335C;
        }

        .mark-done,
        .sub-task-mark-done {
            cursor: pointer;
            margin-right: 10px;
            fill: #F3A712;
            height: 24px;
        }

        .delete-task,
        .sub-task-delete-task {
            cursor: pointer;
            font-size: 13px;
            color: #888;
            transition: color 0.3s ease;
        }

        .delete-task:hover {
            color: #DB2B39;
        }

        .add-sub-tasks {
            width: 24px;
            height: 24px;
            margin-right: 10px;
            cursor: pointer;
        }

        .add-sub-tasks svg {
            fill: #fff;
        }

        .sub-task-items {
            list-style-type: none;
            display: flex;
            flex-direction: column;
        }

        .sub-container {
            padding-left: 45px;
        }

        .input-sub-task {
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="todo-app">
        <h1>Tasks To Do</h1>
        <ul id="task-list"></ul>
        <input type="text" id="new-task" placeholder="Add a new task..." autofocus>
        <div id="error-message"></div>
    </div>

    <!-- jQuery from CDN -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <script>
        $(document).ready(function () {

            let tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];

            function saveTasks() {
                localStorage.setItem('todoTasks', JSON.stringify(tasks));
            }


            function renderTasks() {
                $('#task-list').empty();
                tasks.forEach((task, index) => {
                    const taskHtml = \`
                    <li class="task-item \${task.done ? 'done' : ''}" data-index="\${index}">
                        <span class="add-sub-tasks"><svg viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44771 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44771 11 8 11H11V8Z" fill="#fff"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4Z" fill="#fff"></path> </g></svg></span>
<span class="mark-done">\${task.done ? '<svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#e32400"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>done [#1477]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -400.000000)" fill="#ffaa00"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M141.9,243 C141.9,242.448 141.4296,242 140.85,242 L126.15,242 C125.5704,242 125.1,242.448 125.1,243 L125.1,257 C125.1,257.552 125.5704,258 126.15,258 L140.85,258 C141.4296,258 141.9,257.552 141.9,257 L141.9,243 Z M144,242 L144,258 C144,259.105 143.06025,260 141.9,260 L125.1,260 C123.93975,260 123,259.105 123,258 L123,242 C123,240.895 123.93975,240 125.1,240 L141.9,240 C143.06025,240 144,240.895 144,242 L144,242 Z M137.72205,247.015 C138.1326,247.405 138.1326,248.039 137.72205,248.429 L133.63965,252.317 C133.0233,252.903 132.0258,252.903 131.40945,252.317 L129.5541,250.55 C129.1446,250.16 129.1446,249.527 129.5541,249.136 C129.96465,248.746 130.6293,248.746 131.0388,249.136 L131.7801,249.842 C132.19065,250.233 132.8574,250.233 133.269,249.842 L136.23735,247.015 C136.64685,246.624 137.31255,246.624 137.72205,247.015 L137.72205,247.015 Z" id="done-[#1477]"> </path> </g> </g> </g> </g></svg>' : '<svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#e32400"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Dribbble-Light-Preview" transform="translate(-179.000000, -400.000000)" fill="#ffaa00"><g id="icons" transform="translate(56.000000, 160.000000)"><path d="M141.9,243 C141.9,242.448 141.4296,242 140.85,242 L126.15,242 C125.5704,242 125.1,242.448 125.1,243 L125.1,257 C125.1,257.552 125.5704,258 126.15,258 L140.85,258 C141.4296,258 141.9,257.552 141.9,257 L141.9,243 Z M144,242 L144,258 C144,259.105 143.06025,260 141.9,260 L125.1,260 C123.93975,260 123,259.105 123,258 L123,242 C123,240.895 123.93975,240 125.1,240 L141.9,240 C143.06025,240 144,240.895 144,242 L144,242 Z" id="done-[#1477]"> </path></g></g></g></g></svg> '}</span>
                        <span class="task-text \${task.editMode ? 'edit-mode' : ''}">\${task.editMode ? '<input type="text" value="' + task.text + '">' : task.text}</span>
                        <span class="delete-task">🗑️</span>
                    </li>
                
                    <div class="sub-container">
                    \${task.subTasks.length >= 1 ? \`
                    
                    <ul class="sub-task-items">
                    \${task.subTasks.map((subTask, subIndex) => {

                        const item = \`
                             <li class="sub-task-item \${subTask.done ? 'done' : ''}" data-parent=\${index} data-index="\${subIndex}">
                                        <span class="sub-task-mark-done">\${subTask.done ? '<svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#e32400"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>done [#1477]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -400.000000)" fill="#ffaa00"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M141.9,243 C141.9,242.448 141.4296,242 140.85,242 L126.15,242 C125.5704,242 125.1,242.448 125.1,243 L125.1,257 C125.1,257.552 125.5704,258 126.15,258 L140.85,258 C141.4296,258 141.9,257.552 141.9,257 L141.9,243 Z M144,242 L144,258 C144,259.105 143.06025,260 141.9,260 L125.1,260 C123.93975,260 123,259.105 123,258 L123,242 C123,240.895 123.93975,240 125.1,240 L141.9,240 C143.06025,240 144,240.895 144,242 L144,242 Z M137.72205,247.015 C138.1326,247.405 138.1326,248.039 137.72205,248.429 L133.63965,252.317 C133.0233,252.903 132.0258,252.903 131.40945,252.317 L129.5541,250.55 C129.1446,250.16 129.1446,249.527 129.5541,249.136 C129.96465,248.746 130.6293,248.746 131.0388,249.136 L131.7801,249.842 C132.19065,250.233 132.8574,250.233 133.269,249.842 L136.23735,247.015 C136.64685,246.624 137.31255,246.624 137.72205,247.015 L137.72205,247.015 Z" id="done-[#1477]"> </path> </g> </g> </g> </g></svg>' : '<svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#e32400"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Dribbble-Light-Preview" transform="translate(-179.000000, -400.000000)" fill="#ffaa00"><g id="icons" transform="translate(56.000000, 160.000000)"><path d="M141.9,243 C141.9,242.448 141.4296,242 140.85,242 L126.15,242 C125.5704,242 125.1,242.448 125.1,243 L125.1,257 C125.1,257.552 125.5704,258 126.15,258 L140.85,258 C141.4296,258 141.9,257.552 141.9,257 L141.9,243 Z M144,242 L144,258 C144,259.105 143.06025,260 141.9,260 L125.1,260 C123.93975,260 123,259.105 123,258 L123,242 C123,240.895 123.93975,240 125.1,240 L141.9,240 C143.06025,240 144,240.895 144,242 L144,242 Z" id="done-[#1477]"> </path></g></g></g></g></svg> '}</span>
                                        <span class="sub-task-text  \${subTask.editMode ? 'edit-mode' : ''}">\${subTask.editMode ? '<input type="text" value="' + subTask.text + '">' : subTask.text}</span>
                                        <span class="sub-task-delete-task">🗑️</span>
                                </li>\`

                        return item;
                    }).join('')}
                    <ul>\`: " "}
         
                    \${task.addSubTasks ? \` 
                    <div class="input-sub-task">
                        <input type="text" data-index="\${index}" id="sub-task" placeholder="Add a new sub task..." autofocus>
                    </div> \`: ""}
                    
                    <div>\`

                        ;
                    $('#task-list').append(taskHtml);
                });
            }

           // Show dynamic error message
            function showErrorMessage(message) {
                $('#error-message').text(message).fadeIn().css('opacity', '1');
                setTimeout(() => {
                    $('#error-message').fadeOut().css('opacity', '0');
                }, 2000);
            }

            // Add new task
            $('#new-task').keypress(function (e) {
                if (e.which === 13) {
                    const taskText = $(this).val().trim();
                    if (!taskText) {
                        showErrorMessage("Task cannot be empty");
                        return;
                    }
                    
                    console.log("tasks", tasks);

                    if (tasks.some(t => t.text === taskText)) {
                        showErrorMessage("Task already exists");
                        return;
                    }

                    tasks.push({ text: taskText, done: false, editMode: false, addSubTasks: false, subTasks: [] });
                    saveTasks();
                    renderTasks();
                    $(this).val('');
                }
            });

            // Mark task as done/undone
            $(document).on('click', '.mark-done', function () {
                const taskIndex = $(this).closest('.task-item').data('index');
                tasks[taskIndex].done = !tasks[taskIndex].done;
                saveTasks();
                renderTasks();
            });

            $(document).on('click', '.sub-task-mark-done', function () {
                const taskIndex = $(this).closest('.sub-task-item').data('index');
                const parentIndex = $(this).closest('.sub-task-item').data('parent');
                tasks[parentIndex].subTasks[taskIndex].done = !tasks[parentIndex].subTasks[taskIndex].done;
                saveTasks();
                renderTasks();
            });

            // Delete task with smooth fade-out animation
            $(document).on('click', '.delete-task', function () {
                const taskIndex = $(this).closest('.task-item').data('index');
                $(this).closest('.task-item').fadeOut(300, function () {
                    tasks.splice(taskIndex, 1);
                    saveTasks();
                    renderTasks();
                });
            });

            $(document).on('click', '.sub-task-delete-task', function () {
                const taskIndex = $(this).closest('.sub-task-item').data('index');
                const parentIndex = $(this).closest('.sub-task-item').data('parent');
                const task = tasks[parentIndex].subTasks[taskIndex]
                tasks[parentIndex].subTasks = tasks[parentIndex].subTasks.filter((item) => item.text !== task.text);
                saveTasks();
                renderTasks();
            });

            $(document).on('click', '.add-sub-tasks', function () {
                const taskIndex = $(this).closest('.task-item').data('index');
                tasks[taskIndex].addSubTasks = !tasks[taskIndex].addSubTasks;
                saveTasks();
                renderTasks();

            });

            // Edit task
            $(document).on('dblclick', '.task-text', function () {
                const taskIndex = $(this).closest('.task-item').data('index');
                tasks[taskIndex].editMode = true;
                renderTasks();
                $(this).find('input').focus();
            });

            $(document).on('dblclick', '.sub-task-text', function () {
                const taskIndex = $(this).closest('.sub-task-item').data('index');
                const parentIndex = $(this).closest('.sub-task-item').data('parent');

                tasks[parentIndex].subTasks[taskIndex].editMode = true;
                renderTasks();
                $(this).find('input').focus();
            });

            // Save edited task
            $(document).on('keypress', '.task-text input', function (e) {
                if (e.which === 13) {
                    const taskIndex = $(this).closest('.task-item').data('index');
                    const newText = $(this).val().trim();
                    if (!newText) {
                        showErrorMessage("Task cannot be empty");
                        return;
                    }
                    if (tasks.some(t => t.text === newText && t !== tasks[taskIndex])) {
                        showErrorMessage("Task already exists");
                        return;
                    }
                    tasks[taskIndex].text = newText;
                    tasks[taskIndex].editMode = false;
                    saveTasks();
                    renderTasks();
                }
            });

            $(document).on('keypress', '.sub-task-text input', function (e) {
                if (e.which === 13) {
                    const taskIndex = $(this).closest('.sub-task-item').data('index');
                    const parentIndex = $(this).closest('.sub-task-item').data('parent');

                    const newText = $(this).val().trim();

                    if (!newText) {
                        showErrorMessage("Task cannot be empty");
                        return;
                    }
                    if (tasks.some(t => t.text === newText && t !== tasks[taskIndex])) {
                        showErrorMessage("Task already exists");
                        return;
                    }
                    tasks[parentIndex].subTasks[taskIndex].text = newText;
                    tasks[parentIndex].subTasks[taskIndex].editMode = false;
                    saveTasks();
                    renderTasks();
                }
            });



            $(document).on('keypress', '#sub-task', function (e) {
                if (e.which === 13) {
                    const taskIndex = $(this).closest('#sub-task').data('index');
                    const newText = $(this).val().trim();

                    if (!newText) {
                        showErrorMessage("Task cannot be empty");
                        return;
                    }

                    if (tasks[taskIndex].subTasks.some(t => t.text === newText)) {
                        showErrorMessage("Task already exists");
                        return;
                    }

                    const newTask = { text: newText, done: false, editMode: false };
                    tasks[taskIndex].subTasks.push(newTask);
                    tasks[taskIndex].addSubTasks = false;


                    saveTasks();
                    renderTasks();
                }
            });

            // Initial render
            renderTasks();
        });
    </script>
</body>
</html>
`;
