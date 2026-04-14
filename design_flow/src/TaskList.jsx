function TaskList({tasks, onToggle, deleteMode, onSelectTask}) {
    return(
        <div>
            {tasks.map((task, index) => (
                <div
                    key={index}
                    onClick={() => deleteMode ? onSelectTask(task) : null}
                    style={{ cursor: deleteMode ? "pointer" : "default" }}
                >
                    {task.name}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!deleteMode) onToggle(task);
                        }}
                        disabled={deleteMode}
                        style = {{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            border: "2px solid gray",
                            backgroundColor: task.is_completed ? "grey" : "transparent",
                        }}
                    />
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