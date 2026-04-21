import {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {getTeam, getMembers, getAssignments} from './database.js'
import AssignmentComponent from './AssignmentComponent.jsx';
import CreateAssignmentModal from './CreateAssignmentModal.jsx'

import './styles/teamHomePage.css'

function TeamHomePage() {
    const [teams, setTeams] = useState([]);
    const [members, setMembers] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // const {teamId} = useParams();
    
    const {teamId: team_str} = useParams();
    const teamId = Number(team_str);
    console.log('Team Id Type: ', typeof teamId);

    const handleAssignmentCreated = (newAssignment) => {
        setAssignments((prev) => [...prev, newAssignment])
    }

    const navigate = useNavigate();

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
                console.log("Assignment Data: ", data)
                console.log("Error: ", error)
            } else {
                console.log("Error: ", error)
            }
        })

        // set the members
        // set the assignments

    }, []);


    return(<>
        <div className="thPage_backBtnSection">
            <button className="thPage_backBtn" onClick={() => navigate(`/`)}>Back</button>
        </div>
        <div className="thPage_teamNameSection">
            <h2 className="thPage_header">TEAM NAME</h2>
        </div>
        {/* Main Body */}
        <div className="thPage_main">
            {/* Info Section */}
            <div className="thPage_info">
                <div>
                    <h2>Team Description</h2>
                    <div></div>
                </div>
                <div>
                    <h2>Team Members</h2>
                    <div></div>
                </div>
                {/* <div>
                </div> */}
            </div>
            {/* Assignment Section */}
            <div className="thPage_assignSection">
                <div>
                    <p>Assignments</p>
                    <AssignmentComponent 
                        assignments={assignments}
                        onAssignmentClick={(teamId, assignmentId) => navigate(`/team/${teamId}/${assignmentId}`)}
                    />
                </div>
                <div>
                    <button onClick = {() => setShowCreateModal(true)}>
                        + Create Assignment
                    </button>
                    {teams && (
                        <CreateAssignmentModal
                            isOpen={showCreateModal}
                            onClose={() => setShowCreateModal(false)}
                            teamId={teamId}
                            onAssignmentCreated={handleAssignmentCreated}
                        />
                    )}
                </div>
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


// ===========
// I NEED A WAY TO CREATE ASSIGNMENTS
// ===========