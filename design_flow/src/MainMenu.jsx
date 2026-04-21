import {useState, useEffect, useContext} from "react"
import {useNavigate} from 'react-router-dom'
import {supabase} from './supabaseClient.js'
import AuthContext from './AuthContext.jsx';
import {getUserTeams, getMostRecentDeadlines} from './database.js';

// Maybe edit in the future, at least location
import TeamComponent from "./TeamComponent.jsx";
import DeadlineComponent from "./DeadlineComponent.jsx";
import CreateTeamModal from "./CreateTeamModal.jsx";

// import './styles/styles.css';

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
        <>
            {/* profile */}
            <div>
                <div>
                    <button onClick={handleLogout}>Log Out</button>
                </div>
            </div>
            {/* Splash Text */}
            <div>
                <h1>Welcome Back, User</h1>
            </div>
            {/* Main Body */}
            <div>
                {/* Team Component Section */}
                <div>
                    <div>
                        <TeamComponent
                            teams={teams}
                            onTeamClick={(teamId) => navigate(`/team/${teamId}/home`)}
                        />
                    </div>
                    <div>
                        <button onClick = {() => setShowCreateModal(true)}>
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
                <div>
                    <div>
                        <DeadlineComponent deadlines={deadlines}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MainMenu;


// <div style="background-color: blueviolet" class="recents_sections"></div>
//