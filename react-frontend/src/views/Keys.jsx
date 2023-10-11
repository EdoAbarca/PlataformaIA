import React from "react";

function dropdownFunction(element) {
  var dropdowns = document.getElementsByClassName("dropdown-content");
  var i;
  let list = element.parentElement.parentElement.getElementsByClassName("dropdown-content")[0];
  list.classList.add("target");
  for (i = 0; i < dropdowns.length; i++) {
    if (!dropdowns[i].classList.contains("target")) {
      dropdowns[i].classList.add("hidden");
    }
  }
  list.classList.toggle("hidden");
}

function Keys() {
  return (
    <div>
      <div className="w-full sm:px-6">
        <div className="bg-white px-4 py-4 md:px-8 md:py-7 xl:px-10">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-2xl mt-4">Llaves</h1>
            <button className="rounded-xl mt-4 inline-flex items-start justify-start bg-indigo-700 px-6 py-3 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 sm:mt-0">
              <p className="text-sm font-medium leading-none text-white">Agregar</p>
            </button>
          </div>

          <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    Código
                  </th>
                  <th scope="col" class="px-6 py-3">
                    IA
                  </th>
                  <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Opciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Código 1
                  </th>
                  <td class="px-6 py-4">
                    IA 1
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button class="text-white font-bold bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 rounded-full px-3 py-2">...</button>
                  </td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Código 2
                  </th>
                  <td class="px-6 py-4">
                    IA 2
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button class="text-white font-bold bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 rounded-full px-3 py-2">...</button>
                  </td>
                </tr>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Código 3
                  </th>
                  <td class="px-6 py-4">
                    IA 3
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button class="text-white font-bold bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 rounded-full px-3 py-2">...</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Keys;