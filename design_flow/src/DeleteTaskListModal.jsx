import { useState } from 'react'
import { deleteTask } from './database.js'

function DeleteTaskModal({ isOpen, onClose, task, onTaskDeleted }) {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen || !task) {
        return null;
    }

    const handleDelete = async () => {
        setError(null);
        setIsLoading(true);

        const { error } = await deleteTask(task.id);

        if (error) {
            setError('Failed to delete task. Please try again.');
            setIsLoading(false);
            return;
        }

        if (onTaskDeleted) {
            onTaskDeleted(task.id);
        }

        onClose();
        setIsLoading(false);
    }

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Delete Task</h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-form">
                    <p>Are you sure you want to delete <strong>{task.name}</strong>?</p>

                    {error && <div className="form-error">{error}</div>}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn-create"
                            onClick={handleDelete}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteTaskModal
