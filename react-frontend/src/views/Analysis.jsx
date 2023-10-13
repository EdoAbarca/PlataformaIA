import React, {useState, useEffect} from "react";
import { Link, useParams } from "react-router-dom";

export default function Analysis() {
  const [analysis, setAnalysis] = useState(null);

  const { id } = useParams();
  
  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await fetch("http://localhost:3333/alpha/final/analysis/"+id);
        const data = await response.json();
        setAnalysis(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchAnalysis();
  }, [id]);
  return (
    <div>
      <div className="w-full sm:px-6">
        <div className="bg-white px-4 py-4 md:px-8 md:py-7 xl:px-10">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-5xl mt-4">Análisis / {analysis ? analysis.created.substring(0,10) : "10-10-2023"}</h1>
            <div className="flex-row-reverse">
              <button className="rounded-xl mt-4 inline-flex items-start justify-start bg-indigo-700 px-6 py-3 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:mt-0">
                <p className="text-sm font-medium leading-none text-white mx-2">Agregar</p>
              </button>
              <Link to={"/loggedin"}>
                <button className="border rounded-xl mt-4 px-6 py-3 sm:mt-0 mx-2">
                  <p className="text-sm font-medium leading-none">Volver</p>
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div id="grid" className="container mx-auto p-10 md:py-20 px-0 md:p-10 md:px-0">
          <div id="grid-form" className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 items-start">
            {analysis && analysis.documents.map((document) => (
              <div key={document.id} id="card" className="overflow-hidden rounded-xl border-2 bg-gradient-to-r from-sky-200 p-5 transition-transform duration-500 hover:scale-105 shadow-lg">
                <div id="bottom-section" className="">
                  <div id="title" className="text-md block overflow-x-auto text-center font-bold tracking-wide text-black">{document.title}</div>
                  {document.results.map((result) => (
                    <div key={result.id} id="row row1" className="mt-6 flex justify-between">
                    <div id="item" className="flex-grow pt-1 text-center text-indigo-800">
                      <span id="big-text" className="block">{result.ia_score}%</span>
                      <span id="regular-text" className="text-xs">{result.ai.name}</span>
                    </div>
                  </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}