import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function DocumentDetails() {

    const { documentId } = useParams();

    const [document, setDocument] = useState(null);

    const [loading, setLoading] = useState(true);

    const [summaryLoading, setSummaryLoading] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {

        fetchDocument();

    }, []);

    async function fetchDocument() {

        try {

            const response = await api.get(

                `/documents/${documentId}`

            );

            setDocument(response.data);

        }

        catch(error){

            setError(

                error.response?.data?.detail ||

                "Unable to load document."

            );

        }

        finally{

            setLoading(false);

        }

    }

    async function generateSummary(){

        try{

            setSummaryLoading(true);

            const response = await api.post(

                `/ai/summary/${documentId}`

            );

            setDocument({

                ...document,

                summary: response.data.summary

            });

        }

        catch(error){

            alert(

                error.response?.data?.detail ||

                "Summary generation failed."

            );

        }

        finally{

            setSummaryLoading(false);

        }

    }

    if(loading){

        return(

            <div className="document-page">

                <h2>Loading Document...</h2>

            </div>

        );

    }

    if(error){

        return(

            <div className="document-page">

                <h2>{error}</h2>

            </div>

        );

    }

    return(

        <div className="document-page">

            <Link to="/documents">

                ← Back to Documents

            </Link>

            <h1>

                {document.filename}

            </h1>

            <div className="summary-section">

                <div className="section-header">

                    <h2>

                        AI Summary

                    </h2>

                    {

                        !document.summary &&

                        <button

                            onClick={generateSummary}

                            disabled={summaryLoading}

                        >

                            {

                                summaryLoading

                                ?

                                "Generating..."

                                :

                                "Generate Summary"

                            }

                        </button>

                    }

                </div>

                {

                    document.summary ?

                    (

                        <div className="summary-box">

                            <pre>

                                {document.summary}

                            </pre>

                        </div>

                    )

                    :

                    (

                        <p>

                            No AI Summary Generated.

                        </p>

                    )

                }

            </div>

            <div className="text-section">

                <h2>

                    Extracted PDF Text

                </h2>

                <div className="text-box">

                    <pre>

                        {document.text}

                    </pre>

                </div>

            </div>

        </div>

    );

}

export default DocumentDetails;