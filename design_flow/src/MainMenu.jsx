import {useState, useEffect} from "react"

import './styles/styles.css';

function MainMenu() {
    const [teams, setTeams] = useState([]);
    const [deadline, setDeadlines] = useState([]);
    const [notifications, setNotify] = useState([]);

    useEffect(() => {

    }, []);

    const getTeams = async() => {
        try {
            // Make sure we create index.js next
            const res = await fetch("route here")

            if (res.ok) {
                const data = await res.json();
                setTeams(data);

                // DEBUG check
                console.log(teams);
            } else {
                console.error("Couldn't fetch teams: ", res.statusText)
            }
        } catch (err) {
            console.error("Error fetching teams: ", err)
        }
    };

    // Make sure it's the route that only gets the top three upcoming deadlines
    const getDeadlines = async() => {
        try {
            const res = await fetch("route here")

            if (res.ok) {
                const data = await res.json();
                setDeadlines(data);

                // DEBUG check
                console.log(deadlines);
            } else {
                console.error("Couldn't fetch deadlines: ", res.statusText)
            }
        } catch(err) {
            console.error("Error fetching deadlines: ", err)
        }
    }

    // Make sure it's route for top 3 most recent notifications
    const getNotifications = async() => {
        try {
            const res = await fetch("route here")

            if (res.ok) {
                const data = await res.json();
                setNotify(data);

                // DEBUG check
                console.log(notifications);
            } else {
                console.error("Couldn't fetch notifcatiions: ", res.statusText)
            }

        } catch(err) {
            console.error("Error fetching notifications: ", err);
        }
    }


    // Insert teams
    // Insert deadlines
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
                        <div></div>
                    </div>
                    <div style="background-color: rgb(200, 128, 128)" class="recents_sections">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                </div>
            </body>
        </>
    );
}