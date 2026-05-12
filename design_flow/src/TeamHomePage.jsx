import {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {getTeam, getMembers, getAssignments, getInviteCode, saveInviteCode} from './database.js'
import AssignmentComponent from './AssignmentComponent.jsx';
import CreateAssignmentModal from './CreateAssignmentModal.jsx'

import './styles/teamHomePage.css'

function TeamHomePage() {
    const [teams, setTeams] = useState(null);
    const [members, setMembers] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [invite_code, setInviteCode] = useState('');
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
                console.log("Team Array: ", data);
                setTeams(data);
            } else {
                console.log("Error: ", error);
            }
        })

        getMembers(teamId).then(({data, error}) => {
            if (data) {
                console.log(data);
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

        getInviteCode(teamId).then(async ({data, error}) => {
            if (error) {
                console.log("Error fetching invite code: ", error);
                return;
            }

            if (data?.invite_code) {
                setInviteCode(data.invite_code);
            } else {
                const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                const code = Array.from({length: 8}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
                const {data: saved, error: saveError} = await saveInviteCode(teamId, code);
                if (saveError) {
                    console.log("Error saving invite code: ", saveError);
                } else {
                    setInviteCode(saved.invite_code);
                }
            }
        })

    }, [teamId]);


    return(<>
        <div className="thPage_backBtnSection">
            <button className="thPage_backBtn" onClick={() => navigate(`/`)}>Back</button>
        </div>
        <div className="thPage_teamNameSection">
            <h2 className="thPage_header">{teams?.team_name?.toUpperCase() || 'TEAM NAME'}</h2>
        </div>
        {/* Main Body */}
        <div className="thPage_main">
            {/* Info Section */}
            <div className="thPage_info">
                <div>
                    <h2 className="thPage_mainHead">Team Description</h2>
                    <div className="thPage_mainBody">
                        {teams?.desc}
                    </div>
                </div>
                <div>
                    <h2 className="thPage_mainHead">Invite Code</h2>
                    <div className="thPage_inviteCode">
                        <span className="thPage_inviteCodeText">{invite_code || '—'}</span>
                        <button
                            className="thPage_copyBtn"
                            onClick={() => navigator.clipboard.writeText(invite_code)}
                            disabled={!invite_code}
                        >
                            Copy
                        </button>
                    </div>
                </div>
                <div>
                    <h2 className="thPage_mainHead">Team Members</h2>
                    <div className="thPage_memberSection">
                        {members.map((member, index) => (
                            <div className="thPage_memberCard" key={index}>
                                <span>{member.users?.first_name} {member.users?.last_name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* <div>
                </div> */}
            </div>
            {/* Assignment Section */}
            <div className="thPage_assignSection">
                <div>
                    <p className="thPage_mainHead">Assignments</p>
                    <AssignmentComponent 
                        assignments={assignments}
                        onAssignmentClick={(teamId, assignmentId) => navigate(`/team/${teamId}/${assignmentId}`)}
                    />
                </div>
                <div className="createAssignBtn">
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
