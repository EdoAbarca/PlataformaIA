import React from "react";

function Register() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Crear una cuenta</h2>
          <form className="flex flex-col">
            <input type="string" className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Usuario" />
            <input type="email" className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Correo electrónico" />
            <input type="password" className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Contraseña" />
            <div className="flex items-center justify-between flex-wrap">
              <a href="#" className="text-sm text-blue-500 hover:underline">¿Olvidaste tu contraseña?</a>
              <p className="text-gray-900"> ¿Ya tienes cuenta? <a href="#" className="text-sm text-blue-500 -200 hover:underline">Iniciar sesión</a></p>
            </div>
            <button type="submit" className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150">Crear</button>
            <button className="text-black py-2 px-4 rounded-md shadow-md mt-4">Volver</button>
          </form>
        </div>
      </div>
    </div>
    );
}

export default Register;