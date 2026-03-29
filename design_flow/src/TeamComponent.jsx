// 

function TeamComponent({teams}) {
    return(
        <div>
            {teams.map((team, index) => (
                <div>
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
