import {useState, useEffect, useContext} from "react"
import AuthContext from './AuthContext.jsx';
import {getUserTeams, getMostRecentDeadlines} from './database.js';

// Maybe edit in the future, at least location
import TeamComponent from "./TeamComponent.jsx";
import DeadlineComponent from "./DeadlineComponent.jsx";

// import './styles/styles.css';

function MainMenu() {
    const [teams, setTeams] = useState([]);
    const [deadlines, setDeadlines] = useState([]);
    //const [notifications, setNotify] = useState([]);

    const user = useContext(AuthContext);

    useEffect(() => {
        if(user) {
            getUserTeams(user.id).then(({data, error}) => {
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
    }, []);

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
                                <TeamComponent teams={teams}/>    
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