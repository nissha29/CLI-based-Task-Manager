const fs = require('fs')
const path = require('path')
const {Command} = require('commander')
const program = new Command()

const file = path.join(__dirname, 'todos.json')

const writeBackToFile = (todos, message) => {
    const json = JSON.stringify(todos, null, 2);
        fs.writeFile(file, json, (err) => {
            if(err)console.log('error occurred')
            else console.log(message)
        })
}

const addTodo = (options) => {
    fs.readFile(file, 'utf-8', (err, data) => {
        if(err){
            console.log('There is no file exists with this name.')
        }else{
            const date = new Date()
            const sDate = date.toLocaleDateString()
            const sTime = date.toLocaleTimeString()
            const todos = JSON.parse(data)
            const title = options.title
            const description = options.desc
            todos.push({
                title,
                description,
                isDone: false,
                date: sDate,
                time: sTime,
            })
            const message = "todo added successfully"
            writeBackToFile(todos, message)
        }
    })
}

const deleteTodo = (option) => {
    fs.readFile(file, 'utf-8', (err, data) => {
        if(err){
            console.log('There is no file exists with this name.')
        }else{
            let todos = JSON.parse(data)
            const updatedtodos = todos.filter(entry => entry.title != option.title)
            if(todos.length === updatedtodos.length){
                console.log("Todo item not found")
                return
            }
            todos = updatedtodos
            const message = "todo deleted successfully"
            writeBackToFile(todos, message)
        }
    })
}

const updateTodo = (options) => {
    fs.readFile(file, 'utf-8', (err, data) => {
        if(err){
            console.log('There is no file exists with this name.')
        }else{
            let todos = JSON.parse(data)
            const index = todos.findIndex(entry => entry.title == options.find)
            if(index == -1){
                console.log("Todo item not found")
                return
            } 
            todos[index].title = options.title
            todos[index].description = options.desc
            const message = "todo updated successfully"
            writeBackToFile(todos, message)
        }
    })
}

const getAllTodos = () => {
    fs.readFile(file, 'utf-8', (err, data) => {
        const todos = JSON.parse(data)
        console.log(todos)
    })
}

const deleteAllTodos = () => {
    fs.readFile(file, 'utf-8', (err, data) => {
        const todos = []
        const message = "All todos are deleted successfully"
        writeBackToFile(todos, message)
    })
}

const markDone = (option) => {
    fs.readFile(file, 'utf-8', (err, data) => {
        const todos = JSON.parse(data)
        const index = todos.findIndex(entry => entry.title == option.title)
        if(index == -1){
            console.log('Todo item not found')
            return
        }
        todos[index].isDone = true
        const message = "todo completed successfully"
        writeBackToFile(todos, message)
    })
}

program
    .name('cli-todo')
    .description('A CLI to manage your tasks efficiently.')
    .version('0.5.0')


// ----------------------------------------------------------------add tasks
program
    .command('add')
    .description('To add new tasks in your list')
    .requiredOption('-t,--title <title>', 'title of todo')
    .requiredOption('-d,--desc <description>', 'description of the todo')
    .action( (options) => {
        addTodo(options)
    })


//-----------------------------------------------------------------remove tasks
program
    .command('delete')
    .description('To delete tasks from your list')
    .requiredOption('-t,--title <title>', 'title of todo')
    .action( (option) => {
        deleteTodo(option)
    })


// ----------------------------------------------------------update task
program
    .command('update')
    .description('To update a task from your list')
    .requiredOption('-f,--find, <find>', 'todo to find')
    .requiredOption('-t,--title <title>', 'title of todo')
    .requiredOption('-d,--desc <description>', 'description of the todo')
    .action( (options) => {
        updateTodo(options)
    })

// -----------------------------------------------------------get all todos
program
    .command('getall')
    .description('To get all todos in your list')
    .action( () => {
        getAllTodos()
    })


// ------------------------------------------------------------to delete all todos
program
    .command('deleteall')
    .description('To delet all of the todos fromm list')
    .action( () => {
        deleteAllTodos()
    })

// ------------------------------------------------------------to mark the todo as done
program
    .command('markdone')
    .description('To mark the todo as done!')
    .requiredOption('-t,--title <title>', 'title of todo')
    .action( (option) => {
        markDone(option)
    })

program.parse()