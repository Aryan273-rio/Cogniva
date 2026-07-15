import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Documents() {

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchDocuments();

    }, []);

    async function fetchDocuments() {

        try {

            const response = await api.get("/documents");

            setDocuments(response.data);

        }

        catch(error){

            console.log(error);

        }

        finally{

            setLoading(false);

        }

    }

    if(loading){

        return(

            <div className="documents-page">

                <h2>Loading Documents...</h2>

            </div>

        );

    }

    return(

        <div className="documents-page">

            <div className="documents-header">

                <h1>My Study Documents</h1>

                <Link to="/upload">

                    <button>

                        Upload New PDF

                    </button>

                </Link>

            </div>

            {

                documents.length===0 ?

                (

                    <div className="empty-state">

                        <h2>No Documents Uploaded</h2>

                        <p>

                            Upload your first study material.

                        </p>

                    </div>

                )

                :

                (

                    <div className="documents-grid">

                        {

                            documents.map((document)=>(

                                <div

                                    className="document-card"

                                    key={document.id}

                                >

                                    <h2>

                                        📄

                                    </h2>

                                    <h3>

                                        {document.filename}

                                    </h3>

                                    <p>

                                        Uploaded

                                    </p>

                                    <p>

                                        {

                                            new Date(

                                                document.created_at

                                            ).toLocaleDateString()

                                        }

                                    </p>

                                    {

                                        document.summary ?

                                        (

                                            <span className="badge success">

                                                Summary Available

                                            </span>

                                        )

                                        :

                                        (

                                            <span className="badge pending">

                                                No Summary

                                            </span>

                                        )

                                    }

                                    <Link

                                        to={`/documents/${document.id}`}

                                    >

                                        <button>

                                            Open Document

                                        </button>

                                    </Link>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}

export default Documents;