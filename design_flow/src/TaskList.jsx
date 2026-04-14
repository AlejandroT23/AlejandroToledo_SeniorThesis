function TaskList({tasks}) {
    return(
        <div>
            {tasks.map((task, index) => (
                <div key={index}>
                    {task.name}
                    <button></button>
                </div>
            ))}
        </div>
    )
}

export default TaskList; 

// First thing tomorrow, work on button

{/* <div>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index}>{task.name}</li>
                ))}
            </ul>
        </div> */}