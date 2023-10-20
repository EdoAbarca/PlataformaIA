import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formValues);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Crear una cuenta</h2>
          <form className="flex flex-col">
            <input
              type="string"
              name="username"
              value={formValues.username}
              onChange={handleInputChange}
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="Usuario"
            />
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="Correo electrónico"
            />
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="Contraseña"
            />
            <div className="flex items-center justify-between flex-wrap">
              <a href="#" className="text-sm text-blue-500 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
              <p className="text-gray-900">
                {" "}
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-sm text-blue-500 -200 hover:underline">
                  Iniciar sesión
                </Link>
              </p>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="border border-green-500 text-green-500 bg-white font-bold py-2 px-4 rounded-xl mt-4 hover:text-white hover:bg-green-500 transition ease-in-out duration-500"
            >
              Crear
            </button>
            <Link
              to={"/"}
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

export default Register;
