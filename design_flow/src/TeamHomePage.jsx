import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {getTeam, getMembers, getAssignments} from './database.js'
import AssignmentComponent from './AssignmentComponent.jsx';

function TeamHomePage() {
    const [teams, setTeams] = useState([]);
    const [members, setMembers] = useState([]);
    const [assignments, setAssignments] = useState([]);

    const {teamId} = useParams();

    useEffect(() => {
        getTeam(teamId).then(({data, error}) => {
            if (data) {
                setTeams(data)
            } else {
                console.log("Error: ", error);
            }
        })

        getMembers(teamId).then(({data, error}) => {
            if (data) {
                setMembers(data)
            } else {
                console.log("Error: ", error)
            }
        })

        getAssignments(teamId).then(({data, error}) => {
            if (data) {
                setAssignments(data)
            } else {
                console.log("Error: ", error)
            }
        })

        // set the members
        // set the assignments

    }, []);


    return(<>
        <div>
            <p>HOME</p>
        </div>
        <div>
            <div>
                <p>Team Description</p>
                <p>{teams.teams?.desc}</p>
            </div>
            <div>
                <p>Important Documents</p>
            </div>
        </div>
        <div>
            <p>Assignments</p>
            <AssignmentComponent 
                assignments={assignments}
                onAssignmentClick={(teamId, assignmentId) => navigate(`/team/${teamId}/${assignmentId}`)}
            />
            {/* <button onClick = {() => navigate(`/team/${teamId}/home`)}>
                Go to Home Page
            </button> */}

            {/* <div onClick>
                {assignments.map((project, index) => (
                    <div> key={index}
                        {project}
                    </div>
                ))}
            </div> */}
        </div>
        <div>
            <p>Team Members</p>
            <div>
                {members.map((member, index) => (
                    <div key={index}>
                        <span>{member.users?.first_name} {member.users?.last_name}</span>
                    </div>
                ))}
            </div>
        </div>
    </>)
}

export default TeamHomePage




// {members.map((member, index) => (
//                     <div key={index}>
//                         <p>{member.team_members?.team_name}</p>
//                         <p>{team.teams?.deadline}</p>
//                         <p>{team.teams?.desc}</p>
//                         <p>{team.teams?.admin}</p>
//                         <p>{team.teams?.icon}</p>
//                         <p>{team.teams?.color}</p>
//                     </div>
//                 ))}