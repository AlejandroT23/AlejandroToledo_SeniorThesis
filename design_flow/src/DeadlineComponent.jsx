// 

function DeadlineComponent({deadlines}) {
    return(
        <div>
            {deadlines.map((dl, index) => (
                <div>
                    <p>{dl.name}</p>
                    <p>{dl.deadline}</p>
                    <p>{dl.desc}</p>
                    <p>{dl.team_id}</p>
                    <p>{dl.assigned_to}</p>
                    <p>{dl.folder_location}</p>
                </div>
            ))}
        </div>
    );
}

export default DeadlineComponent;

// name
// deadline
// desc
// team_id
// assigned_to
// folder_location