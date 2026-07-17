import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Bookmarks() {

    const navigate = useNavigate();

    const [bookmarks, setBookmarks] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        loadBookmarks();

    }, []);

    async function loadBookmarks() {

        try {

            const response = await api.get(

                "/bookmarks"

            );

            setBookmarks(

                response.data.bookmarks

            );

        }

        catch (error) {

            setError(

                error.response?.data?.detail ||

                "Unable to load bookmarks."

            );

        }

        finally {

            setLoading(false);

        }

    }

    async function deleteBookmark(id) {

        const confirmDelete = window.confirm(

            "Delete this bookmark?"

        );

        if (!confirmDelete) {

            return;

        }

        try {

            await api.delete(

                `/bookmarks/${id}`

            );

            setBookmarks(

                bookmarks.filter(

                    bookmark =>

                        bookmark.id !== id

                )

            );

        }

        catch (error) {

            alert(

                error.response?.data?.detail ||

                "Unable to delete bookmark."

            );

        }

    }

    if (loading) {

        return (

            <div className="bookmarks-page">

                <h2>

                    Loading Bookmarks...

                </h2>

            </div>

        );

    }

    if (error) {

        return (

            <div className="bookmarks-page">

                <h2>

                    {error}

                </h2>

            </div>

        );

    }

    return (

        <div className="bookmarks-page">

            <div className="bookmarks-header">

                <h1>

                    ⭐ My Bookmarks

                </h1>

                <button

                    onClick={() =>

                        navigate("/dashboard")

                    }

                >

                    Dashboard

                </button>

            </div>

            {

                bookmarks.length === 0

                ?

                (

                    <div className="empty-bookmarks">

                        <h2>

                            No Bookmarks Yet

                        </h2>

                        <p>

                            Bookmark flashcards while studying to
                            see them here.

                        </p>

                    </div>

                )

                :

                (

                    <div className="bookmark-list">

                        {

                            bookmarks.map(

                                bookmark => (

                                    <div

                                        key={bookmark.id}

                                        className="bookmark-card"

                                    >

                                        <h3>

                                            {bookmark.question}

                                        </h3>

                                        <p>

                                            {bookmark.answer}

                                        </p>

                                        <div className="bookmark-actions">

                                            <button

                                                onClick={() =>

                                                    navigate(

                                                        `/flashcards/${bookmark.document_id}`

                                                    )

                                                }

                                            >

                                                Open Flashcards

                                            </button>

                                            <button

                                                onClick={() =>

                                                    deleteBookmark(

                                                        bookmark.id

                                                    )

                                                }

                                            >

                                                Delete

                                            </button>

                                        </div>

                                    </div>

                                )

                            )

                        }

                    </div>

                )

            }

        </div>

    );

}

export default Bookmarks;