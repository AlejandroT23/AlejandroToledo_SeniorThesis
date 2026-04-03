import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {getMembers} from './database.js'

function TeamPlates() {
    const [assignments, setAssignments] = useState([]);
    const [members, setMembers] = useState([]);

    const {teamId} = useParams();

    useEffect(() => {
        getMembers(teamId).then(({data, error}) => {
            if (data) {
                setMembers(data)
            } else {
                console.log("Error: ", error)
            }
        })
    }, [])


    return(<>
        <div>PLATES</div>
        <div>
            {members.map((member, index) => (
                    <div key={index}>
                        <span>{member.users?.first_name} {member.users?.last_name}</span>
                    </div>
            ))}
        </div>
        <div>
            
        </div>
    </>)
}

export default TeamPlates