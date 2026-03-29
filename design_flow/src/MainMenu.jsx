import {useState, useEffect} from "react"
import {AuthContext} from './AuthContext.jsx';
import {getUserTeams, getMostRecentDeadlines} from './database.js';

// Maybe edit in the future, at least location
import TeamComponent from "./TeamComponent.jsx";
import DeadlineComponent from "./DeadlineComponent.jsx";

import './styles/styles.css';

function MainMenu() {
    const [teams, setTeams] = useState([]);
    const [deadlines, setDeadlines] = useState([]);
    //const [notifications, setNotify] = useState([]);

    const user = useContext(AuthContext);

    useEffect(() => {
        if(user) {
            getUserTeam(user.id).then(({data, error}) => {
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
            <body>
                <div class="side_bar">
                    <div class="side_bar_name_section">
                        <div class="profile_picture">
                            <div class="circle"></div>
                        </div>    
                        <div class="profile_name">
                            <h1 style="font-size: 12pt; font-family: Helvetica, sans-serif;">Alejandro Toledo</h1>
                        </div>            
                    </div>
                </div>
                <div class="main">
                    <div class="search">
                        <div class="search_bar">
                            <search>
                                <form>
                                    <input name="fsrch" id="fsrch" placeholder="Search"></input>
                                </form>
                            </search>
                        </div>
                    </div>
                <div class="splash"></div>
                <div class="recents">
                    <div style="background-color: blueviolet" class="recents_sections">
                        <div>
                            <TeamComponent teams={teams}/>    
                        </div> 
                    </div>
                    <div style="background-color: rgb(200, 128, 128)" class="recents_sections">
                        <div>
                            <DeadlineComponent deadlines={deadlines}/>
                        </div>
                        <div></div>
                    </div>
                </div>
                </div>
            </body>
        </>
    );
}

export default MainMenu;