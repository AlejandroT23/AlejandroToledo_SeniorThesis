import {useState} from 'react'


function UploadModal({assignment_id, assignmentDriveFolder_id, userId, onUpload_complete}) {
    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null)

    const handleUpload = async (e) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError('Upload requires a title')
            return;
        }

        if (!description.trim()) {
            setError('Upload requires a description')
            return;
        }

        setLoading(true);

        // THIS IS WHERE THE DRIVE TOKEN WILL BE ADDED

        // DATA GOES HERE : WRITE FUNCTION TO HANDLE UPLOADS - I BELIEVE THIS IS VERSIONS BUT I WOULD NEED TO DOUBLE CHECK

        setTitle('');
        setDescription('');

        if (onUpload_complete) {
            onUpload_complete() // ADD DATA FROM IT'S LINE
        }

        setLoading(false);
    }

    return(<>
        <div>
            {/* file display */}
            <div>
                
            </div>
            {/* upload desc. hub */}
            <div>
                {/* title */}
                <div>

                </div>
                {/* desc. */}
                <div>

                </div>
                {/* submit button*/}
                <button> Submit </button>
            </div>
        </div>
    </>)
}