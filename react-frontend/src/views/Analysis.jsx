import React from "react";
//import { useParams } from "react-router-dom";

function dateAnalysis() {
  return "12/12/2021";
}

export default function Analysis() {
  //let { id } = useParams();
  return (
    <div>
      <div className="w-full sm:px-6">
        <div className="bg-white px-4 py-4 md:px-8 md:py-7 xl:px-10">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-3xl mt-4">Análisis / {dateAnalysis()}</h1>
            <button className="rounded-xl mt-4 inline-flex items-start justify-start bg-indigo-700 px-6 py-3 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:mt-0">
              <p className="text-sm font-medium leading-none text-white">Agregar</p>
            </button>
          </div>
        </div>
        <div id="grid" className="container mx-auto p-10 md:py-20 px-0 md:p-10 md:px-0">
          <div id="grid-form" className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 items-start">
            <div id="card" className="overflow-hidden rounded-xl border-2 bg-gradient-to-r from-sky-200 p-5 transition-transform duration-500 hover:scale-105 shadow-lg">
              <div id="bottom-section" className="">
                <div id="title" className="text-md block overflow-x-auto text-center font-bold tracking-wide text-black">AbarcaChavez_informe1.docx</div>
                <div id="row row1" className="mt-6 flex justify-between">
                  <div id="item" className="flex-grow pt-1 text-center text-indigo-800">
                    <span id="big-text" className="block">50%</span>
                    <span id="regular-text" className="text-xs">IA 1</span>
                  </div>
                  <div id="item" className="flex-grow pt-1 text-center text-indigo-800">
                    <span id="big-text" className="block">100%</span>
                    <span id="regular-text" className="text-xs">IA 2</span>
                  </div>
                  <div id="item" className="flex-grow pt-1 text-center text-indigo-800">
                    <span id="big-text" className="block">-</span>
                    <span id="regular-text" className="text-xs">IA 3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}