import {useState, useEffect, useContext} from 'react'
import {createWorkflowMessage, getWorkflowMessages, getVersionsByAssignment} from './database.js'
import AuthContext from './AuthContext.jsx'

function Chatlog({versions, messages, assignment_id, onMessageSent}) {
    // const [versions, setVersions] = useState([])
    const [message, setMessage] = useState('')
    const user = useContext(AuthContext);
    // const [chatlog, setChatlog] = useState([])

    const chatlog = [
            ...versions.map(v => ({...v, _type: 'upload'})),
            ...messages.map(m => ({...m, _type: 'message'}))
        ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))


    const handleMessageUpload = async (newMessage) => {
        const {data, error} = await createWorkflowMessage({
            assignment_id,
            user_id: user.id,
            type: 'message',
            content: newMessage,
        })

        if (error) {
            console.log('error: ', error)
            return; 
        }

        if (onMessageSent) {
            onMessageSent(data)
        }

        setMessage('')
    }

    // useEffect(() => {
    //     // getWorkflowMessages(assign_id).then(({data, error}) => {
    //     //     if (data) {
    //     //         setChatlog(data)
    //     //     } else {
    //     //         console.log('error: ', error)
    //     //     }
    //     // })

        
    // }, [])

    return(<>
        {/* Display */}
        <div>
            {chatlog.map((chat, index) => (
                <div key={index}>
                    {chat._type === 'upload' ? (
                        <div>
                            <p>{chat.title}</p>
                            <p>{chat.description}</p>
                            <p>{chat.file_name?.join(', ')}</p>
                        </div>
                    ) : (
                        <div>
                            <p>{chat.content}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
        {/* Chat message */}
        <div>
            <label htmlFor="chat_message">Chatbox</label>
            <textarea
                id = "chat_message"
                value = {message}
                onChange = {(e) => setMessage(e.target.value)}
                placeholder = "message"
                row = {2}
                maxLength = {500}
            />
        </div>
        <button onClick={() => handleMessageUpload(message)}>Submit</button>
    </>)
}

export default Chatlog