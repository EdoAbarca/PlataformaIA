import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HoverText from "../components/HoverText.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../components/Modal.jsx";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function returnGuest() {
  return "Usuario de prueba";
}

function LoggedIn() {
  const [analysis, setAnalysis] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  //const [showText, setShowText] = useState(false);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await fetch("http://localhost:3333/beta/final/analysis");
        const data = await response.json();
        setAnalysis(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchAnalysis();
  }, []);

  async function handleDocumentDelete(id) {
    try {
      const response = await fetch(`http://localhost:3333/beta/final/analysis/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      console.log(data);
      // Remove the deleted analysis from the state
      setAnalysis(analysis.filter(item => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="mx-6">
      <div className="mx-auto flex max-w-screen-sm items-center justify-center mt-10">
        <div className="h-32 w-full rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1 ">
          <div className="flex h-full w-full items-center justify-center bg-gray-800 rounded-full">
            <h1 className="text-2xl font-bold text-white">Bienvenido, {returnGuest()}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-10 md:py-20 px-0 md:p-10 md:px-0">
        <div className="flex items-center mb-10">
          <div className="flex items-center">
            <h1 className="text-5xl font-semibold align-middle">Historial</h1>
            <HoverText />
          </div>
          <div className="ml-auto">
            <Link to="/analysis-form">
              <button className="p-2 rounded-xl mx-3 border border-green-500 text-green-500 bg-white transform ease-in-out duration-500 hover:bg-green-500 hover:text-white">Nuevo análisis</button>
            </Link>
            <Link to="/keys">
              <button className="p-2 rounded-xl mx-3 border border-blue-500 text-blue-500 bg-white transform ease-in-out duration-500 hover:bg-blue-500 hover:text-white">Gestionar llaves de acceso</button>
            </Link>
          </div>
        </div>
        <div id="tarjetas analisis" className="p-5 md:p-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 items-start">
          {analysis && analysis.map((item) => (
            <div key={item.id} className="p-5 shadow-lg transition-transform duration-500 hover:scale-105 bg-gray-100 rounded-2xl">
              <h2 className="font-semibold my-3 text-gray-600 text-xl text-center">{item.title}</h2>
              <div className="flex flex-row justify-between mt-2 font-semibold text-md text-gray-600">
                <span>Fecha</span>
                <span>{item.created.substring(0, 10)}</span>
              </div>
              <div className="flex flex-row justify-between mt-2 font-semibold text-md text-gray-600">
                <span>Archivos</span>
                <span>{item.documents.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 justify-between px-4 gap-4">
                <Link to={`/analysis/${item.id}`} state={{item}} className="text-center mt-4 p-2 text-blue-500 bg-white border border-blue-500 rounded-xl transition ease-in-out duration-500 hover:bg-blue-500 hover:text-white">
                  <button>Ver</button>
                </Link>
                <button onClick={() => {
                  setOpen(true);
                  setSelectedId(item.id);
                }} className="text-center mt-4 p-2 text-red-500 bg-white rounded-xl border border-red-500 transition ease-in-out duration-500 hover:bg-red-500 hover:text-white">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
        {selectedId && (
          <Modal open={open} onClose={() => setOpen(false)} className="flex items-center justify-center min-h-screen">
            <div className="text-center w-56">
              <FontAwesomeIcon icon={faTrashCan} size="xl" className="mx-auto text-red-500" />
              <div className="mx-auto my-4 w-48">
                <h3 className="text-lg font-black text-gray-800">¿Estás seguro?</h3>
                <p className="text-sm text-gray-500">Esta acción es irreversible</p>
              </div>
              <div className="flex gap-4">
                <button onClick={handleDocumentDelete} className="w-full bg-red-500 shadow-red-400/40 text-white flex gap-2 items-center justify-center py-2 px-4 font-semibold shadow-md rounded-xl">Eliminar</button>
                <button className="w-full border bg-white flex gap-2 items-center justify-center py-2 px-4 font-semibold shadow-md rounded-xl" onClick={() => setOpen(false)}>Volver</button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default LoggedIn;