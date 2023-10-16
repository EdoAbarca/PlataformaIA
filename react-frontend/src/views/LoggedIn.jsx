import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HoverText from "../components/HoverText.jsx";

function returnGuest() {
  return "Usuario de prueba";
}

function LoggedIn() {
  const [analysis, setAnalysis] = useState(null);
  //const [showText, setShowText] = useState(false);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await fetch("http://localhost:3333/alpha/final/analysis");
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
      const response = await fetch(`http://localhost:3333/alpha/final/analysis/${id}`, {
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
      <div className="mx-auto flex max-w-screen-sm items-center justify-center">
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
              <button className=" p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 mx-3">Nuevo análisis</button>
            </Link>
            <Link to="/keys">
              <button className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 mx-3">Gestionar llaves de acceso</button>
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
                <Link to={`/analysis/${item.id}`} className="text-center mt-4 p-2 text-blue-500 bg-white border border-blue-500 rounded-xl transition ease-in-out duration-500 hover:bg-blue-500 hover:text-white">
                  <button>Ver</button>
                </Link>
                <button onClick={() => handleDocumentDelete(item.id)} className="text-center mt-4 p-2 text-red-500 bg-white rounded-xl border border-red-500 transition ease-in-out duration-500 hover:bg-red-500 hover:text-white">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoggedIn;