import React from "react";


export default function FormAnalysis() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/3 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Realizar análisis</h1>

        <Link to="/" className="block text-blue-500 mb-4">Volver</Link>

        <form className="align-items-center">
          <div className="mb-4">
            <label htmlFor="textInput" className="block text-gray-600">Text Input</label>
            <input type="text" id="textInput" name="textInput" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Radio Button</label>
            <div>
              <input type="radio" id="radioOption1" name="radioOptions" value="Option 1" />
              <label htmlFor="radioOption1" className="ml-2">Option 1</label>
            </div>
            <div>
              <input type="radio" id="radioOption2" name="radioOptions" value="Option 2" />
              <label htmlFor="radioOption2" className="ml-2">Option 2</label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Checkbox Options</label>
            <div>
              <input type="checkbox" id="checkboxOption1" name="checkboxOptions" value="Option 1" />
              <label htmlFor="checkboxOption1" className="ml-2">Option 1</label>
            </div>
            <div>
              <input type="checkbox" id="checkboxOption2" name="checkboxOptions" value="Option 2" />
              <label htmlFor="checkboxOption2" className="ml-2">Option 2</label>
            </div>
            <div>
              <input type="checkbox" id="checkboxOption3" name="checkboxOptions" value="Option 3" />
              <label htmlFor="checkboxOption3" className="ml-2">Option 3</label>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="dropdownSelect" className="block text-gray-600">Dropdown Options</label>
            <select id="dropdownSelect" name="dropdownSelect" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500">
              <option value="Option 1">Option 1</option>
              <option value="Option 2">Option 2</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="fileInput" className="block text-gray-600">File Upload</label>
            <input type="file" id="fileInput" name="fileInput" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out">Realizar análisis</button>
        </form>
      </div>
    </div>
  );
}