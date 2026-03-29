import {useState, useEffect, useContext} from "react"
import AuthContext from './AuthContext.jsx';
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
            <body>
                <div className="side_bar">
                    <div className="side_bar_name_section">
                        <div className="profile_picture">
                            <div className="circle"></div>
                        </div>    
                        <div className="profile_name">
                            <h1 style={{fontSize: '12pt', fontFamily: 'Helvetica, sans-serif'}}>Alejandro Toledo</h1>
                        </div>            
                    </div>
                </div>
                <div className="main">
                    <div className="search">
                        <div className="search_bar">
                            <search>
                                <form>
                                    <input name="fsrch" id="fsrch" placeholder="Search"></input>
                                </form>
                            </search>
                        </div>
                    </div>
                    <div className="splash">
                    
                    </div>
                    <div className="recents">
                        <div style={{backgroundColor: 'blueviolet'}} className="recents_sections">
                            <div>
                                <TeamComponent teams={teams}/>    
                            </div> 
                        </div>
                        <div style={{backgroundColor: 'rgb(200, 128, 128)'}} className="recents_sections">
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


// <div style="background-color: blueviolet" class="recents_sections"></div>
//