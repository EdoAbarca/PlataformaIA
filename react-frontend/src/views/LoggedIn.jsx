import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function returnGuest() {
  return "Usuario de prueba";
}

function returnGuestLargo() {
  return "ksfhasjkhfsjahfkjsahgvasjhgjkashgkjssfsagfagaagfagaf";
}

function LoggedIn() {
  const [analysis, setAnalysis] = useState(null);

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


  return (
    <div className="mx-6">
      <div className="mx-auto flex max-w-screen-sm items-center justify-center">
        <div className="h-36 w-full rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1 ">
          <div className="flex h-full w-full items-center justify-center bg-gray-800 rounded-full">
            <h1 className="text-2xl font-bold text-white">Bienvenido, {returnGuest()}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-10 md:py-20 px-0 md:p-10 md:px-0">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-semibold">Historial</h1>
          <div className="flex-row-reverse">
            <Link to="/analysis-form">
              <button className="mt-4 p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 mx-3">Nuevo análisis</button>
            </Link>
            <Link to="/keys">
              <button className="mt-4 p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 mx-3">Gestionar llaves de acceso</button>
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
                <Link to={`/analysis/${item.id}`} className="text-center mt-4 p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600">
                  <button>Ver</button>
                </Link>
                <button className="mt-4 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoggedIn;