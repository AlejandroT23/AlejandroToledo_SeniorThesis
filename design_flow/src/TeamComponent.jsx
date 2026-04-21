import './styles/teamComponent.css' 

function TeamComponent({teams, onTeamClick}) {
    return(
        <div className="team_list">
            {/* <h2 className="team_list_header">Teams</h2> */}
            <div class="team_list_body">
                {teams.map((team, index) => (
                    <div key={index} className="team_card" onClick={()=>onTeamClick(team.id)}>
                        <div className="team_card_avatar"></div>
                        <div className="team_card_info">
                            <p className="team_card_name"> {team.team_name} </p>
                            <p className="team_card_desc">  {team.desc} </p>
                        </div>
                        <div className = "team_card_menu">:</div>
                        {/* <p>{team.team_name}</p>
                        <p>{team.deadline}</p>
                        <p>{team.desc}</p>
                        <p>{team.admin}</p>
                        <p>{team.icon}</p>
                        <p>{team.color}</p> */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TeamComponent;
