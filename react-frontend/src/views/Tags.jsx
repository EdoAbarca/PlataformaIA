//MODIFICAR PARA QUE SEA UNA TABLA CON TODOS LOS TAGS

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";
//import { faListUl, faExclamation } from "@fortawesome/free-solid-svg-icons";
import HoverText from "../components/HoverText.jsx";

function Keys() {
  const [keys, setKeys] = useState(null);

  useEffect(() => {
    async function fetchKeys() {
      try {
        const response = await fetch("http://localhost:3333/alpha/final/key");
        const data = await response.json();
        setKeys(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchKeys();
  }, []);

  const handleMenuClick = (index) => {
    const newKeys = [...keys];
    newKeys[index].showMenu = !newKeys[index].showMenu;
    setKeys(newKeys);
  };

  async function handleDelete(id) {
    try {
      await fetch(`http://localhost:3333/alpha/final/key/${id}`, {
        method: "DELETE",
      });
      setKeys(keys.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className="w-full sm:px-6">
        <div className="bg-white px-4 py-4 md:px-8 md:py-7 xl:px-10">
          <div className="flex items-center">
            <h1 className="font-bold text-5xl my-2">Llaves</h1>
            <HoverText />
            <div className="ml-auto">
              <Link to={"/keys/add"}>
                <button className="rounded-xl mt-4 mx-4 px-6 py-3 bg-white text-green-500 border border-green-500 transform ease-in-out duration-500 hover:bg-green-500 hover:text-white sm:mt-0">
                  <p className="text-sm font-medium leading-none">Agregar</p>
                </button>
              </Link>
              <Link to={"/loggedin"}>
                <button className="border border-black rounded-xl mt-4 px-6 py-3 sm:mt-0">
                  <p className="text-sm font-medium leading-none">Volver</p>
                </button>
              </Link>
            </div>
          </div>


          <div className="static overflow-x-auto shadow-md sm:rounded-lg mt-10">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Código
                  </th>
                  <th scope="col" className="px-6 py-3">
                    IA
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Opciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {keys && keys.map((item, index) => (
                  <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {item.ai_key}
                    </th>
                    <td className="px-6 py-4">
                      {item.ai.name}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button onClick={() => handleMenuClick(index)} className="text-white font-bold bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 rounded-full px-3 py-2">
                          <FontAwesomeIcon icon={faListUl} beat/>
                        </button>
                        {item.showMenu && (
                          <div className="fixed right-0 mt-2 w-auto bg-white rounded-md overflow-hidden shadow-xl z-10">
                            <Link to={`/keys/edit/${item.id}`} state={{item}}>
                              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">Editar</button>
                            </Link>
                            <button onClick={() => handleDelete(item.id)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-gray-900">Eliminar</button>
                          </div>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Keys;