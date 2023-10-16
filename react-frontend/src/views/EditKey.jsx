import React, { useState } from "react";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";

function EditKey() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [key, setKey] = useState("");
  const ia = useLocation().state.ia;

  async function handleSubmit(event, id) {
    event.preventDefault();
    console.log(key);
    try {
      const response = await fetch(`http://localhost:3333/alpha/final/key/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ key })
      });
      const data = await response.json();
      console.log(data);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingrese la clave</h2>
          <form className="flex flex-col" onSubmit={handleSubmit(event, id)}>
            <input
              type="text"
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="Llave"
              value={key}
              onChange={(event) => setKey(event.target.value)}
            />
            <input
              type="text"
              disabled
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="IA"
              value={ia}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-xl mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
            >
              Aplicar
            </button>
            <Link
              to={"/"}
              className="text-black py-2 px-4 mt-4 rounded-xl shadow-md text-center font-semibold"
            >
              Volver
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditKey;