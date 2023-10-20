import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { faFileWord, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FormAnalysis() {
  const [formValues, setFormValues] = useState({
    title: "",
    semester: "",
    ai1: false,
    ai2: false,
    ai3: false,
    files: [],
  });
  const [aiOptions, setAiOptions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3333/alpha/final/ai")
      .then((response) => response.json())
      .then((data) => setAiOptions(data))
      .catch((error) => console.log(error));
  }, []);

  const handleTitleChange = (event) => {
    setFormValues({
      ...formValues,
      title: event.target.value,
    });
  };

  const handleSemesterChange = (event) => {
    setFormValues({
      ...formValues,
      semester: event.target.value,
    });
  };

  const handleAiChange = (event) => {
    const target = event.target;
    const value = target.checked;
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
              onChange={handleTitleChange}
            />
          </div>

          <div className="mb-4 hidden">
            <label className="block text-gray-600">Semestre</label>
            <div>
              <input
                type="radio"
                id="semester1"
                name="semester"
                value="Primer semestre"
                checked={formValues.semester === "Primer semestre"}
                onChange={handleSemesterChange}
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
                onChange={handleSemesterChange}
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
            {aiOptions.map((option) => (
              <div key={option.id}>
                <input
                  type="checkbox"
                  id={option.id}
                  name={`ai${option.id}`}
                  value={option.name}
                  checked={formValues[`ai${option.id}`]}
                  onChange={handleAiChange}
                />
                <label htmlFor={option.id} className="ml-2">
                  {option.name}
                </label>
              </div>
            ))}
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
              Documentos <FontAwesomeIcon icon={faFileWord} />{" "} <FontAwesomeIcon icon={faFilePdf} />
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
            className="w-full py-2 border border-green-500 bg-white text-green-500 rounded-xl transition duration-500 ease-in-out hover:bg-green-500 hover:text-white"
          >
            Realizar análisis
          </button>
          <Link
            to="/loggedin"
            className="w-full py-2 mt-2 rounded-xl border border-black text-black text-center block"
          >
            Volver
          </Link>
        </form>
      </div>
    </div>
  );
}