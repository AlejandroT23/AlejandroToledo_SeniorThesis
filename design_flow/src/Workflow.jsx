import {useState, useEffect} from 'react'
import {createWorkflowMessages, getWorkflowMessages, getTasks, createTasks, updateTask, deleteTask} from './database.js'
import {useParams, useNavigate} from 'react-router-dom'

import TaskList from './TaskList.jsx'
import CreateTaskListModal from './CreateTaskListModal.jsx'
import DeleteTaskModal from './DeleteTaskListModal.jsx'

function Workflow() {
    const navigate = useNavigate();
    
    const {assignment: assignment_str, team: team_str}  = useParams();
    const assignment_id = Number(assignment_str);
    const team_id = Number(team_str);
    
    const [chatlog, setChatlog] = useState([]);
    const [tasks, setTasks] = useState([]);
    
    // We don't use these here, so we might deleted once it works
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState(null);
    // ===========

    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);

    const handleSelectTask = (task) => {
        setSelectedTask(task);
        setShowDeleteTaskModal(true);
        setDeleteMode(false);
    }

    const toggleTask = async (task) => {
        const {data, error} = await updateTask(task.id, task.is_completed);

        if (error) {
            console.log("Update failed: ", error)
        }

        setTasks((prev) => prev.map((t) => {
            if (t.id === task.id) {
                return data;
            }
            return t;
        }))
    }

    const handleCreatedTask = (newTask) => {
        setTasks((prev) => [...prev, newTask])
    }

    const handleDeletedTask = (taskId) => {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        setSelectedTask(null)
    }

    useEffect(() => {
        getWorkflowMessages(assignment_id).then(({data, error}) => {
            if (data) {
                setChatlog(data)
            } else {
                console.log('error:', error)
            }
        })

        getTasks(assignment_id).then(({data, error}) => {
            if (data) {
                setTasks(data)
            } else {
                console.log('error:', error)
            }
        })

    }, [])

    return (<>
        <button onClick={() => navigate(`/team/${teamId}`)}>Back</button>
        <h1>THIS IS THE ASSIGNMENT WORKFLOW</h1>
        <div>
            {/* upload bar */}
            <div>

            </div>
            {/* chat log */}
            <div>

            </div>
            {/* assignment task checker */}
            <div>
                <TaskList 
                    tasks={tasks} 
                    onToggle={toggleTask}
                    deleteMode={deleteMode}
                    onSelectTask={handleSelectTask}
                />
                {/* create + delete tasks */}
                <div>
                    <button onClick = {() => setShowCreateTaskModal(true)}>
                        Create Task
                    </button>
                    {assignment_id && (
                        <CreateTaskListModal
                            isOpen = {showCreateTaskModal}
                            onClose = {() => setShowCreateTaskModal(false)}
                            assignmentId = {assignment_id}
                            onTaskCreated = {handleCreatedTask}
                        />
                    )}
                </div>
                <div>
                    <button onClick = {() => setDeleteMode(true)}>
                        Delete Task
                    </button>
                    {assignment_id && (
                        <DeleteTaskModal 
                            isOpen = {showDeleteTaskModal}
                            onClose = {() => setShowDeleteTaskModal(false)}
                            task = {selectedTask}
                            onTaskDeleted = {handleDeletedTask}
                        />
                    )}
                </div>
            </div>
        </div>
    </>)
}

export default Workflow