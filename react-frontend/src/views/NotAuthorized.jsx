import React from "react";
import { Link, useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div class="bg-gray-200">
      <div class="w-4/5 m-auto py-16 min-h-screen flex items-center justify-center">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg pb-8">
          <div class="border-t border-gray-200 text-center pt-8">
            <h1 class="text-8xl font-bold text-red-600">Error 403</h1>
            <h1 class="text-6xl font-medium py-8">No autorizado.</h1>
            <p class="text-2xl pb-8 px-12 font-medium">No tienes los permisos necesarios para acceder a esta sección del sitio web.</p>
            <button class="bg-gradient-to-r from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-2xl mr-6">
              <Link to="/">Home</Link>
            </button>
            <button onClick={()=>navigate(-1)} class="font-semibold px-6 py-3 rounded-2xl border shadow-lg">
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;