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
            max-width: 500px;
            padding: 10px 5px;
            padding-bottom: 20px;
        }

        .todo-app h1 {
            font-size: 24px;
            color: #fff;
            margin-bottom: 20px;
            margin-top: 20px;
        }

        #new-task {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border-radius: 5px;
            border: 1px solid #ddd;
            margin-bottom: 10px;
            transition: border-color 0.3s ease;
        }

        #new-task:focus {
            outline: none;
            border-color: #0067c0;
        }

        #error-message {
            font-size: 14px;
            color: #DB2B39;
            display: none;
            margin-bottom: 10px;
            opacity: 1;
            transition: opacity 0.3s ease;
        }

        #task-list {
            list-style: none;
            padding: 0;
        }

        .task-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 7px;
            background-color: #fafafa;
            border-radius: 5px;
            margin-bottom: 10px;
            opacity: 1;
            transition: opacity 0.3s ease, background-color 0.3s ease;
        }

        .task-item.done {
            text-decoration: line-through;
            color: #000;
        }

        .task-item .task-text {
            flex: 1;
            margin-left: 5px;
            font-size: 14px;
            cursor: pointer;
            color: #000;
            transition: color 0.3s ease;
        }

        .task-item .edit-mode input {
            width: 100%;
            padding: 5px;
            font-size: 16px;
        }

        .mark-done {
            cursor: pointer;
            margin-right: 10px;
            font-size: 16px;
        }

        .delete-task {
            cursor: pointer;
            font-size: 18px;
            color: #888;
            transition: color 0.3s ease;
        }

        .delete-task:hover {
            color: #DB2B39;
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

            const iconDone = \`
                <svg width="24px" height="24px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#e32400">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <title>done [#1477]</title>
                        <path d="M141.9,243 C141.9,242.448 141.4296,242 140.85,242 L126.15,242 C125.5704,242 125.1,242.448 125.1,243 L125.1,257 C125.1,257.552 125.5704,258 126.15,258 L140.85,258 C141.4296,258 141.9,257.552 141.9,257 L141.9,243 Z M144,242 L144,258 C144,259.105 143.06025,260 141.9,260 L125.1,260 C123.93975,260 123,259.105 123,258 L123,242 C123,240.895 123.93975,240 125.1,240 L141.9,240 C143.06025,240 144,240.895 144,242 L144,242 Z" />
                    </g>
                </svg>
            \`;
            
            const iconUnDone = \`
                <svg width="24px" height="24px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#e32400">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <title>done [#1477]</title>
                        <path d="M141.9,243 C141.9,242.448 141.4296,242 140.85,242 L126.15,242 C125.5704,242 125.1,242.448 125.1,243 L125.1,257 C125.1,257.552 125.5704,258 126.15,258 L140.85,258 C141.4296,258 141.9,257.552 141.9,257 L141.9,243 Z M144,242 L144,258 C144,259.105 143.06025,260 141.9,260 L125.1,260 C123.93975,260 123,259.105 123,258 L123,242 C123,240.895 123.93975,240 125.1,240 L141.9,240 C143.06025,240 144,240.895 144,242 L144,242 Z" />
                    </g>
                </svg>
            \`;

            function renderTasks() {
                $('#task-list').empty();
                tasks.forEach((task, index) => {
                    const taskHtml = \`
                        <li class="task-item \${task.done ? 'done' : ''}" data-index="\${index}">
                            <span class="mark-done">\${task.done ? '<svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#e32400"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>done [#1477]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -400.000000)" fill="#ffaa00"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M141.9,243 C141.9,242.448 141.4296,242 140.85,242 L126.15,242 C125.5704,242 125.1,242.448 125.1,243 L125.1,257 C125.1,257.552 125.5704,258 126.15,258 L140.85,258 C141.4296,258 141.9,257.552 141.9,257 L141.9,243 Z M144,242 L144,258 C144,259.105 143.06025,260 141.9,260 L125.1,260 C123.93975,260 123,259.105 123,258 L123,242 C123,240.895 123.93975,240 125.1,240 L141.9,240 C143.06025,240 144,240.895 144,242 L144,242 Z M137.72205,247.015 C138.1326,247.405 138.1326,248.039 137.72205,248.429 L133.63965,252.317 C133.0233,252.903 132.0258,252.903 131.40945,252.317 L129.5541,250.55 C129.1446,250.16 129.1446,249.527 129.5541,249.136 C129.96465,248.746 130.6293,248.746 131.0388,249.136 L131.7801,249.842 C132.19065,250.233 132.8574,250.233 133.269,249.842 L136.23735,247.015 C136.64685,246.624 137.31255,246.624 137.72205,247.015 L137.72205,247.015 Z" id="done-[#1477]"> </path> </g> </g> </g> </g></svg>' : '<svg width="20px" height="20px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#e32400"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Dribbble-Light-Preview" transform="translate(-179.000000, -400.000000)" fill="#ffaa00"><g id="icons" transform="translate(56.000000, 160.000000)"><path d="M141.9,243 C141.9,242.448 141.4296,242 140.85,242 L126.15,242 C125.5704,242 125.1,242.448 125.1,243 L125.1,257 C125.1,257.552 125.5704,258 126.15,258 L140.85,258 C141.4296,258 141.9,257.552 141.9,257 L141.9,243 Z M144,242 L144,258 C144,259.105 143.06025,260 141.9,260 L125.1,260 C123.93975,260 123,259.105 123,258 L123,242 C123,240.895 123.93975,240 125.1,240 L141.9,240 C143.06025,240 144,240.895 144,242 L144,242 Z" id="done-[#1477]"> </path></g></g></g></g></svg> '}</span>
                            <span class="task-text \${task.editMode ? 'edit-mode' : ''}">\${task.editMode ? '<input type="text" value="' + task.text + '">' : task.text}</span>
                            <span class="delete-task">🗑️</span>
                        </li>
                    \`;
                    $('#task-list').append(taskHtml);
                });
            }

            function showErrorMessage(message) {
                $('#error-message').text(message).fadeIn().css('opacity', '1');
                setTimeout(() => {
                    $('#error-message').fadeOut().css('opacity', '0');
                }, 2000);
            }

            $('#new-task').keypress(function (e) {
                if (e.which === 13) {
                    const taskText = $(this).val().trim();
                    if (!taskText) {
                        showErrorMessage("Task cannot be empty");
                        return;
                    }
                    if (tasks.some(t => t.text === taskText)) {
                        showErrorMessage("Task already exists");
                        return;
                    }
                    tasks.push({ text: taskText, done: false, editMode: false });
                    saveTasks();
                    renderTasks();
                    $(this).val('');
                }
            });

            $(document).on('click', '.mark-done', function () {
                const index = $(this).closest('.task-item').data('index');
                tasks[index].done = !tasks[index].done;
                saveTasks();
                renderTasks();
            });

            $(document).on('click', '.delete-task', function () {
                const index = $(this).closest('.task-item').data('index');
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            $(document).on('click', '.task-text', function () {
                const index = $(this).closest('.task-item').data('index');
                tasks[index].editMode = true;
                saveTasks();
                renderTasks();
            });

            $(document).on('blur', '.task-item .task-text input', function () {
                const index = $(this).closest('.task-item').data('index');
                const newText = $(this).val().trim();
                if (newText) {
                    tasks[index].text = newText;
                }
                tasks[index].editMode = false;
                saveTasks();
                renderTasks();
            });

            renderTasks();
        });
    </script>
</body>
</html>
`;
