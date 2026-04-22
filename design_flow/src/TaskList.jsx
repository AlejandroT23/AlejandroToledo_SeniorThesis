import './styles/tasklist.css'

function TaskList({tasks, onToggle, deleteMode, onSelectTask}) {
    return(<div className="tasklist">
        <div className="tasklist-header">
            <h2>TASKS</h2>
        </div>
        <div className="tasklist-items">
            {tasks.map((task, index) => (
                <div
                    className="tasklist-row"
                    key={index}
                    onClick={() => deleteMode ? onSelectTask(task) : null}
                    style={{ cursor: deleteMode ? "pointer" : "default" }}
                >
                    <button
                        className="tasklist-toggle"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!deleteMode) onToggle(task);
                        }}
                        disabled={deleteMode}
                        style={{
                            backgroundColor: task.is_completed ? "grey" : "transparent",
                        }}
                    />
                    <span className={task.is_completed ? "tasklist-name completed" : "tasklist-name"}>
                        {task.name}
                    </span>
                </div>
            ))}
        </div>
    </div>)
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