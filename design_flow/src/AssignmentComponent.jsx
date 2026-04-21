import './styles/assignmentComponent.css'

function AssignmentComponent({assignments, onAssignmentClick}) {
    return(
        <div className="assignment_list">
            <div className="assignment_list_body">
                {assignments.map((assignment, index) => (
                    <div key={index} className="assignment_card" onClick={()=>onAssignmentClick(assignment.team_id, assignment.id)}>
                        <p className="assignment_card_name">{assignment.name}</p>
                        <p className="assignment_card_deadline">{assignment.deadline}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AssignmentComponent;