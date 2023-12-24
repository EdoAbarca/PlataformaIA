import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { faFileWord, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import * as mammoth from "mammoth";
//import pdfParse from "pdf-parse";
//import { readFile } from "fs/promises"
//import * as fs from 'fs';
//import pdfjs from "pdfjs-dist/es5/build/pdf";

export default function FormAnalysis() {
  const [title, setTitle] = useState("");
  const [keys, setKeys] = useState([]);
  const [files, setFiles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [keyOptions, setKeyOptions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3333/beta/final/key")
      .then((response) => response.json())
      .then((data) => setKeyOptions(data))
      .catch((error) => console.log(error));
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleKeyChange = (event) => {
    const id = event.target.id;
    const checked = event.target.checked;
    console.log(keys);
    console.log(keyOptions);
    console.log(id, checked);
    console.log(keyOptions.find(key => key.id.toString() === id.toString()));
    console.log(keyOptions.some(key => key.id.toString() === id.toString()));
    //console.log(keys.includes(keyOptions.find(key => key.id.toString() === id.toString()))); //No sirve
    
    if (checked) {
      setKeys([...keys, keyOptions.find(key => key.id.toString() === id.toString())]);
    } else {
      setKeys(keys.filter(key => key.id.toString() !== id.toString()));
    }
  };

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    setFiles(files);
  };
  /*
  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        const pdf = await pdfjs.getDocument(arrayBuffer).promise;
        let text = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(' ');
        }

        resolve(text);
      };

      reader.onerror = (error) => reject(error);

      reader.readAsArrayBuffer(file);
    });
  };

  const extractTextFromDocx = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      };

      reader.onerror = (error) => reject(error);

      reader.readAsArrayBuffer(file);
    });
  };
  */ 

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log({ title, keys, files, documents });
      /* const documents = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target.result;
          let document = { title, content: "" };

          if (file.type === "application/pdf") {
            const pdfData = await extractTextFromPDF(file);
            document.content = pdfData.text;
          } else {
            const docxData = await await extractTextFromDocx(file);;
            document.content = docxData.value;
          }

          documents.push(document);
        };
        reader.readAsArrayBuffer(file);
      }
      console.log(documents);
      const headers = {
        "Content-Type": "application/json",
        "X-OAI-API-KEY": "tjldnmapye4fshxrg6b0i9czqv3ou51k"
      };
      const OriginalityResponse = await fetch("https://api.originality.ai/api/v1/scan/ai",{
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          "title": 1,
          "content": documents
        })
      });
      const OriginalityData = await OriginalityResponse.json();
      console.log(OriginalityData);
      
      const response = await fetch("http://localhost:3333/beta/final/analysis", {
        method: "POST",
        body: JSON.stringify({
          title,
          keys,
          documents
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      console.log(data);*/
    } catch (error) {
      console.log(error);
    }
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
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">
              Llaves API
            </label>
            {keyOptions.map((option) => (
              <div key={option.id}>
                <input
                  type="checkbox"
                  id={option.id}
                  name={option.api_key}
                  value={option.api_key}
                  checked={keys.some(key => key.id.toString() === option.id.toString())}
                  onChange={handleKeyChange}
                />
                <label htmlFor={option.id} className="ml-2">
                  {`${option.api_key} (${option.ai.name})`}
                </label>
              </div>
            ))}
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