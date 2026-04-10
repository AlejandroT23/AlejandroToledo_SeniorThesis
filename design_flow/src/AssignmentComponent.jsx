function AssignmentComponent({assignments, onAssignmentClick}) {
    return(
        <div>
            {assignments.map((assignment, index) => (
                <div key={index} onClick={()=>onAssignmentClick(assignment.team_id, assignment.id)}>
                    <p>{assignment.id}</p>
                    <p>{assignment.created_at}</p>
                    <p>{assignment.name}</p>
                    <p>{assignment.deadline}</p>
                    <p>{assignment.id}</p>
                    <p>{assignment.desc}</p>
                    <p>{assignment.team_id}</p>
                    <p>{assignment.id}</p>
                    <p>{assignment.assigned_to}</p>
                    <p>{assignment.folder_location}</p>
                    <p>{assignment.drive_folder_id}</p>
                </div>
            ))}
        </div>
    )
}

export default AssignmentComponent;