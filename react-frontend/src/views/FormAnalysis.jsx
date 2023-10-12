import { Link } from "react-router-dom";
import React, { useState } from "react";

export default function FormAnalysis() {
  const [formValues, setFormValues] = useState({
    title: "",
    semester: "",
    ai1: false,
    ai2: false,
    ai3: false,
    files: [],
  });

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    setFormValues({
      ...formValues,
      files: files,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formValues);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/3 bg-white p-8 rounded-lg shadow-2xl transition duration-500 hover:scale-105">
        <h1 className="text-2xl font-semibold text-center mb-6">Realizar análisis</h1>

        <form onSubmit={handleSubmit} className="align-items-center">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-600">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              value={formValues.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Semestre</label>
            <div>
              <input
                type="radio"
                id="semester1"
                name="semester"
                value="Primer semestre"
                checked={formValues.semester === "Primer semestre"}
                onChange={handleInputChange}
              />
              <label htmlFor="semester1" className="ml-2">
                Primer semestre
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="semester2"
                name="semester"
                value="Segundo semestre"
                checked={formValues.semester === "Segundo semestre"}
                onChange={handleInputChange}
              />
              <label htmlFor="semester2" className="ml-2">
                Segundo semestre
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">
              Inteligencias artificiales
            </label>
            <div>
              <input
                type="checkbox"
                id="ai1"
                name="ai1"
                value="IA 1"
                checked={formValues.ai1}
                onChange={handleInputChange}
              />
              <label htmlFor="ai1" className="ml-2">
                IA 1
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="ai2"
                name="ai2"
                value="IA 2"
                checked={formValues.ai2}
                onChange={handleInputChange}
              />
              <label htmlFor="ai2" className="ml-2">
                IA 2
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="ai3"
                name="ai3"
                value="IA 3"
                checked={formValues.ai3}
                onChange={handleInputChange}
              />
              <label htmlFor="ai3" className="ml-2">
                IA 3
              </label>
            </div>
          </div>

          <div className="mb-4 hidden">
            <label htmlFor="dropdownSelect" className="block text-gray-600">
              Dropdown Options
            </label>
            <select
              id="dropdownSelect"
              name="dropdownSelect"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="Option 1">Option 1</option>
              <option value="Option 2">Option 2</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="files" className="block text-gray-600">
              Documentos
            </label>
            <input
              type="file"
              id="files"
              name="files"
              multiple
              accept=".pdf, .docx"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              onChange={handleFileInputChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            Realizar análisis
          </button>
          <Link
            to="/loggedin"
            className="w-full py-2 mt-2 shadow-xl rounded-lg border text-center block"
          >
            Volver
          </Link>
        </form>
      </div>
    </div>
  );
}