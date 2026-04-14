import {useState, useEffect} from 'react'
import {createWorkflowMessages, getWorkflowMessages, getTask, createTasks, updateTask, deleteTask} from './database.js'
import {useParams, useNavigate} from 'react-router-dom'

import TaskList from './TaskList.jsx'

function Workflow() {
    const {assignment_id: assignment_str}  = useParams();
    const assignment_id = Number(assignment_str);
    
    const [chatlog, setChatlog] = useState([]);
    const [task, setTasks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState(null);


    useEffect(() => {
        getWorkflowMessages(assignment_id).then(({data, error}) => {
            if (data) {
                setChatlog(data)
            } else {
                console.log('error:', error)
            }
        })

        getTask(assignment_id).then(({data, error}) => {
            if (data) {
                setTasks(data)
            } else {
                console.log('error:', error)
            }
        })

    }, [])

    return (<>
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
                <TaskList tasks={tasks}/>
            </div>
        </div>
    </>)
}

export default Workflow