import { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

function EditKey() {
  //const navigate = useNavigate();
  const { id } = useParams();
  const [key, setKey] = useState("");
  const ia = useLocation().state;
  console.log(ia);

  async function handleSubmit(event, id) {
    event.preventDefault();
    console.log(key);
    
    try {
      const response = await fetch(`http://localhost:3333/beta/final/key/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ key })
      });
      const data = await response.json();
      console.log(data);
      //Mostrar modal de éxito y retornar a la página keys
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Editar llave</h2>
          <form className="flex flex-col">
            <input
              type="text"
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="Nueva llave"
              value={key}
              onChange={(event) => setKey(event.target.value)}
            />
            <input
              type="text"
              disabled
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="IA"
              value={ia.item.ai.name}
            />
            <button
              type="submit"
              onClick={(event) => handleSubmit(event, id)}
              className="font-bold py-2 px-4 rounded-xl mt-4 text-green-500 border border-green-500 bg-white transition ease-in-out duration-500 hover:bg-green-500 hover:text-white"
            >
              Aplicar
            </button>
            <Link
              to={"/keys"}
              className="text-black py-2 px-4 mt-4 rounded-xl border border-black text-center font-semibold"
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