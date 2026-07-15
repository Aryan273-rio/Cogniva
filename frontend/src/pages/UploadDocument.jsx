import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function UploadDocument() {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Store selected file
    function handleFileChange(event) {

        setFile(event.target.files[0]);

    }

    // Upload PDF
    async function handleUpload(event) {

        event.preventDefault();

        if (!file) {

            setMessage("Please select a PDF.");

            return;
        }

        try {

            setLoading(true);
            setMessage("");

            const formData = new FormData();

            formData.append("file", file);

            const response = await api.post(

                "/documents/upload",

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            setMessage(response.data.message);

            // Go to Documents page after upload
            setTimeout(() => {

                navigate("/documents");

            }, 1200);

        }

        catch (error) {

            setMessage(

                error.response?.data?.detail ||

                "Upload Failed"

            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="upload-page">

            <h1>Upload Study Material</h1>

            <p>

                Upload your PDF notes and generate AI summaries.

            </p>

            <form

                className="upload-form"

                onSubmit={handleUpload}

            >

                <input

                    type="file"

                    accept=".pdf"

                    onChange={handleFileChange}

                />

                {

                    file &&

                    <div className="selected-file">

                        Selected File

                        <br />

                        <strong>

                            {file.name}

                        </strong>

                    </div>

                }

                <button

                    type="submit"

                    disabled={loading}

                >

                    {

                        loading

                        ?

                        "Uploading..."

                        :

                        "Upload PDF"

                    }

                </button>

            </form>

            {

                message &&

                <p className="message">

                    {message}

                </p>

            }

        </div>

    );

}

export default UploadDocument;