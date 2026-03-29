// 

function TeamComponent({teams}) {
    return(
        <div>
            {teams.map((team, index) => (
                <div key={index}>
                    <p>{team.teams?.team_name}</p>
                    <p>{team.teams?.deadline}</p>
                    <p>{team.teams?.desc}</p>
                    <p>{team.teams?.admin}</p>
                    <p>{team.teams?.icon}</p>
                    <p>{team.teams?.color}</p>
                </div>
            ))}
        </div>
    );
}

export default TeamComponent;
