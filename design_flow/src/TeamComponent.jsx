// 

function TeamComponent({teams, onTeamClick}) {
    return(
        <div>
            {teams.map((team, index) => (
                <div key={index} onClick={()=>onTeamClick(team.teams?.id)}>
                    <p>{team.team_name}</p>
                    <p>{team.deadline}</p>
                    <p>{team.desc}</p>
                    <p>{team.admin}</p>
                    <p>{team.icon}</p>
                    <p>{team.color}</p>
                </div>
            ))}
        </div>
    );
}

export default TeamComponent;
