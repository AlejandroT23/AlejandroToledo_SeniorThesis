import {useState, useEffect, useContext} from 'react'
import {getWorkflowMessages, getTasks, createTasks, updateTask, deleteTask, getAssignmentDriveFolderLocation, getVersionsByAssignment} from './database.js'
import {useParams, useNavigate} from 'react-router-dom'

import TaskList from './TaskList.jsx'
import CreateTaskListModal from './CreateTaskListModal.jsx'
import DeleteTaskModal from './DeleteTaskListModal.jsx'
import UploadModal from './UploadModal.jsx'
import Chatlog from './Chatlog.jsx'
import AuthContext from './AuthContext.jsx'

import './styles/workflow.css'

function Workflow() {
    const navigate = useNavigate();
    const user = useContext(AuthContext)
    
    const {teamId: team_str, assignment: assignment_str}  = useParams();
    const assignment_id = Number(assignment_str);
    const team_id = Number(team_str);

    console.log("assignment id: ", assignment_id)
    console.log("team id: ", team_id);
    
    const [messages, setMessages] = useState([]);
    const [versions, setVersions] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [assignmentFolder, setAssignmentFolder] = useState(null);
    
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

    const handleUpload = (newUpload) => {
        setVersions((prev) => [...prev, newUpload])
    }

    useEffect(() => {
        // getWorkflowMessages(assignment_id).then(({data, error}) => {
        //     if (data) {
        //         setChatlog(data)
        //     } else {
        //         console.log('error:', error)
        //     }
        // })

        getWorkflowMessages(assignment_id).then(({data, error}) => {
            if (data) {
                setMessages(data)
            } else {
                console.log('error: ', error)
            }
        })

        getVersionsByAssignment(assignment_id).then(({data, error}) => {
            if (data) {
                setVersions(data)
            } else {
                console.log('error: ', error)
            }
        })

        getTasks(assignment_id).then(({data, error}) => {
            if (data) {
                setTasks(data)
            } else {
                console.log('error:', error)
            }
        })

        getAssignmentDriveFolderLocation(assignment_id).then(({data, error}) => {
            if (data) {
                setAssignmentFolder(data)
            } else {
                console.log('error: ', error)
            }
        })

    }, [])

    return (<>
        <div className="backBtnSection">
            <button onClick={() => navigate(`/team/${team_id}/home`)}>Back</button>
        </div>
        <div className="splashTitle"> 
            <h1>THIS IS THE ASSIGNMENT WORKFLOW</h1>
        </div>
        <div className="mainWorkspace">
            {/* upload bar */}
            <div className="uploadSection">
                <UploadModal
                    assignment_id={assignment_id}
                    assignmentDriveFolder_id={assignmentFolder}
                    userId={user?.id}
                    onUpload_complete={handleUpload}
                />
            </div>
            {/* chat log */}
            <div className="chatLogSection">
                <Chatlog 
                    versions={versions}
                    messages={messages}
                    assignment_id={assignment_id}
                    onMessageSent={(newMsg) => setMessages(prev => [...prev, newMsg])}
                />
            </div>
            {/* assignment task checker */}
            <div className="taskSection">
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