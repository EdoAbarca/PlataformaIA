import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AddKey() {

  const [key, setKey] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    // Fetch data from API to get all IAs registered
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3333/alpha/final/ai");
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(key, selectedOption);
    /*
    try {
        const response = await fetch("http://localhost:3333/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
    */
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agregar llave de acceso</h2>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              type="text"
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="Llave"
              value={key}
              onChange={(event) => setKey(event.target.value)}
            />
            <select
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              value={selectedOption}
              onChange={(event) => setSelectedOption(event.target.value)}
            >
              <option value="">Inteligencia Artificial</option>
              {options.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-xl mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
            >
              Crear
            </button>
            <Link to={"/keys"} className="text-black py-2 px-4 mt-4 rounded-xl shadow-md text-center font-semibold">
              Volver
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddKey;