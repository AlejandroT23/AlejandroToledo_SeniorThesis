import {useState, useEffect, useContext} from "react"
import {useNavigate} from 'react-router-dom'
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

    useEffect(() => {
        if(user) {
            getUserTeams(user.id).then(({data, error}) => {
                console.log("Teams data:", data);
                console.log("Teams error:", error);
                
                if (data) {
                    setTeams(data);
                }
            });

            getMostRecentDeadlines(user.id).then(({data, error}) => {
                if (data) {
                    setDeadlines(data);
                }
            })
        }
    }, [user]);

    // Insert notifications
    return (
        <>
            <div>
                <h1>This would be the Main Menu Page</h1>
            </div>
            {/* Side Bar */}
            <div>
                    {/* Side Bar Name Section*/}
                    <div>
                        {/* Profile Pic: Pic then Profile */}
                        <div></div>    
                        <div></div>            
                    </div>
                </div>
                {/* Main */}
                <div>
                    {/* Search */}
                    <div>
                        {/* Search Bar */}
                        <div></div>
                    </div>
                    {/* Splash */}
                    <div></div>
                    {/* Component */}
                    <div>
                        {/* Team Component */}
                        <div>
                            <div>
                                <TeamComponent 
                                    teams={teams}
                                    onTeamClick={(teamId) => navigate(`/team/${teamId}`)}
                                /> 
                            </div>
                            <div>
                                <button onClick = {() => setShowCreateModal(true)}>
                                    + Create Team
                                </button>
                                <CreateTeamModal 
                                    isOpen={showCreateModal}
                                    onClose={() => setShowCreateModal(false)}
                                    userId={user.id}
                                    onTeamCreated={handleTeamCreated}
                                />
                            </div> 
                        </div>
                        {/* Deadline Component */}
                        <div>
                            <div>
                                <DeadlineComponent deadlines={deadlines}/>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}

export default MainMenu;


// <div style="background-color: blueviolet" class="recents_sections"></div>
//