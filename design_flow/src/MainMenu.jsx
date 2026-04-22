import {useState, useEffect, useContext} from "react"
import {useNavigate} from 'react-router-dom'
import {supabase} from './supabaseClient.js'
import AuthContext from './AuthContext.jsx';
import {getUserTeams, getMostRecentDeadlines} from './database.js';

// Maybe edit in the future, at least location
import TeamComponent from "./TeamComponent.jsx";
import DeadlineComponent from "./DeadlineComponent.jsx";
import CreateTeamModal from "./CreateTeamModal.jsx";

import './styles/mainMenu.css';

function MainMenu() {
    
    const navigate = useNavigate();
    
    const [teams, setTeams] = useState([]);
    const [deadlines, setDeadlines] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    const user = useContext(AuthContext);

    const handleTeamCreated = (newTeam) => {
        setTeams((prev) => [...prev, newTeam]);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    }

    useEffect(() => {
        if(user) {
            getUserTeams(user.id).then(({data, error}) => {
                console.log("Teams data:", data);
                console.log("Teams error:", error);
                
                if (data) {
                    setTeams(data.map(item => item.teams))
                    
                    // setTeams(data);
                }
            });

            getMostRecentDeadlines(user.id).then(({data, error}) => {
                if (data) {
                    setDeadlines(data);
                }
            })
        }
    }, [user]);

    return (
        <div className="page">
            {/* profile */}
            <div className="profile">
                <div>
                    <button className="logout_btn" onClick={handleLogout}>Log Out</button>
                </div>
            </div>
            {/* Splash Text */}
            <div className="splash">
                <h1 className="splash_text">WELCOME BACK, {user?.first_name?.toUpperCase() || 'USER'}</h1>
            </div>
            {/* Main Body */}
            <div className="main_body">
                {/* Team Component Section */}
                <div className="teamComp_body">
                    <h2 className="teamComp_header">TEAMS</h2>
                    <div className="teamComp_list">
                        <TeamComponent
                            teams={teams}
                            onTeamClick={(teamId) => navigate(`/team/${teamId}/home`)}
                        />
                    </div>
                    <div className="createTeamBtn">
                        <button onClick={() => setShowCreateModal(true)}>
                            + Create Team
                        </button>
                        {user && (
                            <CreateTeamModal
                                isOpen={showCreateModal}
                                onClose={() => setShowCreateModal(false)}
                                userId={user.id}
                                onTeamCreated={handleTeamCreated}
                            />
                        )}
                    </div>
                </div>
                {/* Deadline Component */}
                <div className="deadlineComp_body">
                    <h2 className="teamComp_header">DEADLINES</h2>
                    <div>
                        <DeadlineComponent deadlines={deadlines}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainMenu;


// <div style="background-color: blueviolet" class="recents_sections"></div>
//