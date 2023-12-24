import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AddTag() {

    const [tag, setTag] = useState("");
    
    useEffect(() => {
        // Fetch data from API to get all IAs registered
        async function fetchData() {
            try {
                const response = await fetch("http://localhost:3333/beta/final/tag");
                const data = await response.json();
                setOptions(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [])

    async function handleSubmit(event) {
        event.preventDefault();
        console.log(body);
        
        try {
            const response = await fetch("http://localhost:3333/beta/final/tag", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ body })
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
        // Fetch all tags
        try {
            const response = await fetch("http://localhost:3333/beta/final/tag");
            const data = await response.json();

            // Check if the input doesn't equal any tag name retrieved
            const tagExists = data.some((tagData) => tagData.name === tag);
            if (!tagExists) {
                // Perform the desired action when the tag doesn't exist
                console.log("Tag doesn't exist");
            } else {
                // Perform the desired action when the tag already exists
                console.log("Tag already exists");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Agregar etiqueta</h2>
                    <form className="flex flex-col">
                        <input
                            type="text"
                            className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                            placeholder="Etiqueta"
                            value={tag}
                            onChange={(event) => setTag(event.target.value)}
                        />
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={!selectedOption}
                            className="font-bold py-2 px-4 rounded-xl mt-4 text-green-500 border border-green-500 bg-white transition ease-in-out duration-500 hover:bg-green-500 hover:text-white"
                        >
                            Crear
                        </button>
                        <Link to={"/keys"} className="text-black py-2 px-4 mt-4 rounded-xl border border-black text-center font-semibold">
                            Volver
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddTag;
