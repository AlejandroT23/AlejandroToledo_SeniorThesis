import {useState, useEffect} from 'react'
import {createWorkflowMessages, getWorkflowMessages} from '/database.js'
import {useParams, useNavigate} from 'react-router-dom'

function Workflow() {
    
    const [chatlog, setChatlog] = useState([]);


    useEffect(() => {
        getWorkflowMessages().then(({data, error}) => {
            if (data) {
                setChatlog(data)
            } else {
                console.log('error:', error)
            }
        })
    }, [])

    return (<></>)
}