import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { faFileWord, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FormAnalysis() {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [keys, setKeys] = useState([]);
  const [keyOptions, setKeyOptions] = useState([]);
  const [freeAIs, setFreeAIs] = useState([]);
  const [freeAIsOptions, setFreeAIsOptions] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);
  //const [error, setError] = useState("");
  const [formPass, setFormPass] = useState(false);
  const [processStarted, setProcessStarted] = useState(false);
  const [processFinished, setProcessFinished] = useState(false);
  //const [analysisCreated, setAnalysisCreated] = useState(false);
  const [badProcessEnding, setBadProcessEnding] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [originalityCount, setOriginalityCount] = useState(0);
  const [chatGPTCount, setChatGPTCount] = useState(0);
  const [fastDetectGPTCount, setFastDetectGPTCount] = useState(0);
  const [lmWatermarkingCount, setLmWatermarkingCount] = useState(0);
  const [pocCount, setPocCount] = useState(0);
  const [item, setItem] = useState(null); //Análisis creado
  const [usedAIs, setUsedAIs] = useState([]);
  /*** 
  const formatAIs = () => {
    const keysIAs = keys.map(key => key.ai.name);
    const freeAIsNames = freeAIs.map(ai => ai.name);
    const allAIs = keysIAs.concat(freeAIsNames);
    setUsedAIs(allAIs); //Esto causó el re-render infinite loop error
    return allAIs.join(" ");
  }*/

  useEffect(() => {
    const keysIAs = keys.map(key => key.ai.name);
    const freeAIsNames = freeAIs.map(ai => ai.name);
    const allAIs = keysIAs.concat(freeAIsNames);
    setUsedAIs(allAIs);
  }
    , [keys, freeAIs])

  const formatTags = () => {
    const tagsNames = tags.map(tag => tag.name);
    return tagsNames.join(" ");
  }
  const formatAIs = () => {
    return usedAIs.join(" ");
  }

  useEffect(() => {
    fetch("http://localhost:3333/beta/final/key")
      .then((response) => response.json())
      .then((data) => setKeyOptions(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3333/beta/final/ai/free")
      .then((response) => response.json())
      .then((data) => setFreeAIsOptions(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3333/beta/final/tag")
      .then((response) => response.json())
      .then((data) => setTagsOptions(data))
      .catch((error) => console.log(error));
  }, []);

  const handleTitleChange = (event) => {
    const t = event.target.value;
    setTitle(t);
  };

  const handleKeyChange = (event) => {
    const id = event.target.id;
    const checked = event.target.checked;

    if (checked) {
      setKeys([...keys, keyOptions.find(key => key.id.toString() === id.toString())]);
    } else {
      setKeys(keys.filter(key => key.id.toString() !== id.toString()));
    }
  };

  const handleFreeAIChange = (event) => {
    const id = event.target.id;
    const checked = event.target.checked;

    if (checked) {
      setFreeAIs([...freeAIs, freeAIsOptions.find(ai => ai.id.toString() === id.toString())]);
    } else {
      setFreeAIs(freeAIs.filter(ai => ai.id.toString() !== id.toString()));
    }
  };

  const handleTagChange = (event) => {
    const id = event.target.id;
    const checked = event.target.checked;

    if (checked) {
      setTags([...tags, tagsOptions.find(tag => tag.id.toString() === id.toString())]);
    } else {
      setTags(tags.filter(tag => tag.id.toString() !== id.toString()));
    }
  };

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    setFiles(files);
  };

  useEffect(() => {
    const AI_count = freeAIs.length + keys.length;
    const isTitleEmpty = title === "";
    const isFilesEmpty = files.length === 0;
    const pass = AI_count > 0 && !isTitleEmpty && !isFilesEmpty;
    setFormPass(pass);
  }, [title, files, keys, freeAIs]);

  //FUNCION PRINCIPAL: PROCESO DE ANÁLISIS
  async function handleSubmit(event) {
    event.preventDefault();
    setProcessStarted(true);
    const date = new Date();
    setCurrentDate(date.toLocaleDateString());
    setCurrentTime(date.toLocaleTimeString());
    try {
      //Crear formData
      let formData = new FormData();
      formData.append("title", title);
      formData.append("keys", JSON.stringify(keys));
      formData.append("freeAIs", JSON.stringify(freeAIs));
      formData.append("tags", JSON.stringify(tags));

      for (let i = 0; i < files.length; i++) {
        formData.append("documents", files[i]);
      }

      console.log(formData.get("title"));
      console.log(formData.get("keys"));
      console.log(formData.get("freeAIs"));
      console.log(formData.get("tags"));
      console.log(formData.getAll("documents"));

      //Inicio proceso
      //Rescatar identificadores
      const api_originality = keys.find(key => key.ai.name === "Originality").api_key;
      const api_chatGPT = keys.find(key => key.ai.name === "ChatGPT (GPT-4)").api_key;

      const originality_id = keys.find(key => key.ai.name === "Originality").ai.id;
      const chatgpt_id = keys.find(key => key.ai.name === "ChatGPT (GPT-4)").ai.id;
      const fastDetectGPT_id = freeAIs.find(ai => ai.name === "fastDetectGPT").id;
      const lmWatermarking_id = freeAIs.find(ai => ai.name === "lmWatermarking D.").id;
      const poc_id = freeAIs.find(ai => ai.name === "PoC AI Detector").id;

      
      /*
      let verifyOriginality = null;
      try {
        verifyOriginality = await fetch("http://localhost:3333/beta/final/check/originality", {
          method: "POST",
          body: JSON.stringify({
            api_key: api_originality
          })
        });
        const dataVerifyOriginality = await verifyOriginality.json();
        console.log(dataVerifyOriginality);
      } catch (error) {
        console.log("Error:", error);
        console.log("Error de disponibilidad en Originality. Código: " + error.code);
        IAs = usedAIs.filter(ia => ia !== "Originality");
        setUsedAIs(IAs);
      }
      let verifyChatGPT = null;
      try {
        verifyChatGPT = await fetch("http://localhost:3333/beta/final/check/chatgpt", {
          method: "POST",
          body: JSON.stringify({
            api_key: api_chatGPT
          })
        });
        const dataVerifyChatGPT = await verifyChatGPT.json();
        console.log(dataVerifyChatGPT);
      } catch (error) {
        console.log("Error:", error);
        console.log("Error de disponibilidad en ChatGPT.");
        IAs = usedAIs.filter(ia => ia !== "ChatGPT (GPT-4)");
        setUsedAIs(IAs);
      }
       */
      var timeTextExtraction = performance.now();
      let textsExtracted = null;
      try {
        textsExtracted = await fetch("http://localhost:3333/beta/final/files", {
          method: "POST",
          body: formData
        });
      } catch (error) {
        console.log("Error:", error);
        //No puede fallar esta parte
        //Si falla, se bota todo el proceso
        //Sin los textos, es imposible proceder
        setProcessFinished(true);
        setBadProcessEnding(true);
        setResultMessage("Proceso finalizado con errores: " + error);
        return;
      }

      const dataTexts = await textsExtracted.json();
      const texts = dataTexts.texts;
      //const texts_200 = dataTexts.texts_200; //A considerar apenas estén listos los detectores

      var timeTextExtractionEnd = performance.now();
      console.log("Tiempo de extracción de texto: " + (timeTextExtractionEnd - timeTextExtraction) + " ms");

      //Si la extracción de texto fué exitosa, se crea el análisis
      let new_analysis = null;
      try {
        new_analysis = await fetch("http://localhost:3333/beta/final/analysis", {
          method: "POST",
          body: formData
        });
      } catch (error) {
        //Creación fallida, no se puede continuar
        console.log("Error:", error);
        setProcessFinished(true);
        setBadProcessEnding(true);
        setResultMessage("Proceso finalizado con errores: " + error);
        return;
      }
      const analysis = new_analysis.json();
      console.log(analysis);
      setItem(analysis);
      const analysis_id = analysis.id;
      var fullTimeAnalysis = performance.now();
      
      for (let i = 0; i < texts.length; i++) {

        //Algoritmo de prueba
        var timeTextAnalysis = performance.now();

        //Se crea el documento
        let new_document = null;
        try {
          new_document = await fetch("http://localhost:3333/beta/final/document", {
            method: "POST",
            body: JSON.stringify({
              title: texts[i].title,
              analysis_id: analysis_id
            })
          });
        } catch (error) {
          console.log("Error:", error);
          setProcessFinished(true);
          setBadProcessEnding(true);
          setResultMessage("Proceso finalizado con errores: " + error);
          return;
        }

        const document_id = new_document.json().id;

        //Resultados
        if (usedAIs.includes("Originality")) {
          const ai_score_originality = Math.random() * (100 - 0) + 0;
          const result_originality = ai_score_originality < 50 ? "Human" : "AI";
          //Se crea el resultado
          let new_result = null;
          try {
            new_result = await fetch("http://localhost:3333/beta/final/result", {
              method: "POST",
              body: JSON.stringify({
                ai_score: ai_score_originality,
                ai_result: result_originality,
                document_id: document_id,
                ai_id: originality_id,
              })
            });
          } catch (error) {
            console.log("Error:", error);
            setProcessFinished(true);
            setBadProcessEnding(true);
            setResultMessage("Proceso finalizado con errores: " + error);
            return;
          }
          if (new_result.status === 200) {
            const originalityCurrentCount = originalityCount + 1;
            setOriginalityCount(originalityCurrentCount);
          }
        }

        if (usedAIs.includes("ChatGPT")) {
          const ai_score_chatGPT = Math.random() * (100 - 0) + 0;
          const result_chatGPT = ai_score_chatGPT < 50 ? "Human" : "AI";
          //Se crea el resultado
          let new_result = null;
          try {
            new_result = await fetch("http://localhost:3333/beta/final/result", {
              method: "POST",
              body: JSON.stringify({
                ai_score: ai_score_chatGPT,
                ai_result: result_chatGPT,
                document_id: document_id,
                ai_id: chatgpt_id,
              })
            });
          } catch (error) {
            console.log("Error:", error);
            setProcessFinished(true);
            setBadProcessEnding(true);
            setResultMessage("Proceso finalizado con errores: " + error);
            return;
          }
          if (new_result.status === 200) {
            const chatGPTCurrentCount = chatGPTCount + 1;
            setChatGPTCount(chatGPTCurrentCount);
          }
        }

        if (usedAIs.includes("Fast Detect GPT")) {
          //Temporal
          const ai_score_fastDetectGPT = Math.random() * (100 - 0) + 0;
          const result_fastDetectGPT = ai_score_fastDetectGPT < 50 ? "Human" : "AI";
          //Se crea el resultado
          let new_result = null;
          try {
            new_result = await fetch("http://localhost:3333/beta/final/result", {
              method: "POST",
              body: JSON.stringify({
                ai_score: ai_score_fastDetectGPT,
                ai_result: result_fastDetectGPT,
                document_id: document_id,
                ai_id: fastDetectGPT_id,
              })
            });
          } catch (error) {
            console.log("Error:", error);
            setProcessFinished(true);
            setBadProcessEnding(true);
            setResultMessage("Proceso finalizado con errores: " + error);
            return;
          }
          if (new_result.status === 200) {
            const fastDetectGPTCurrentCount = fastDetectGPTCount + 1;
            setFastDetectGPTCount(fastDetectGPTCurrentCount);
          }
        }

        if (usedAIs.includes("Lm Watermarking")) {
          const ai_score_lmWatermarking = Math.random() * (100 - 0) + 0;
          const result_lmWatermarking = ai_score_lmWatermarking < 50 ? "Human" : "AI";
          //Se crea el resultado
          let new_result = null;
          try {
            new_result = await fetch("http://localhost:3333/beta/final/result", {
              method: "POST",
              body: JSON.stringify({
                ai_score: ai_score_lmWatermarking,
                ai_result: result_lmWatermarking,
                document_id: document_id,
                ai_id: lmWatermarking_id,
              })
            });
          } catch (error) {
            console.log("Error:", error);
            setProcessFinished(true);
            setBadProcessEnding(true);
            setResultMessage("Proceso finalizado con errores: " + error);
            return;
          }
          if (new_result.status === 200) {
            const lmWatermarkingCurrentCount = lmWatermarkingCount + 1;
            setLmWatermarkingCount(lmWatermarkingCurrentCount);
          }
        }

        if (usedAIs.includes("PoC AI Detector")) {
          const ai_score_poc = Math.random() * (100 - 0) + 0;
          const result_poc = ai_score_poc < 50 ? "Human" : "AI";
          //Se crea el resultado
          let new_result = null;
          try {
            new_result = await fetch("http://localhost:3333/beta/final/result", {
              method: "POST",
              body: JSON.stringify({
                ai_score: ai_score_poc,
                ai_result: result_poc, 
                document_id: document_id,
                ai_id: poc_id,
              })
            });
          } catch (error) {
            console.log("Error:", error);
            setProcessFinished(true);
            setBadProcessEnding(true);
            setResultMessage("Proceso finalizado con errores: " + error);
            return;
          }
          if (new_result.status === 200) {
            const pocCurrentCount = pocCount + 1;
            setPocCount(pocCurrentCount);
          }
        }
        
        var timeTextAnalysisEnd = performance.now();
        console.log("Tiempo de análisis de texto "+ texts[i].title+": " + (timeTextAnalysisEnd - timeTextAnalysis) + " ms");

        //Algoritmo principal
        /* 
        //ORIGINALITY
        if (usedAIs.includes("Originality")) {
          const responseOriginality = await fetch("http://localhost:3333/beta/final/detect/originality", {
            method: "POST",
            body: {
              title: texts[i].title,
              text: texts[i].text,
              api_key: api_originality
            }
          });

          const dataOriginality = await responseOriginality.json();
          if (dataOriginality.status === "OK") {
            const originalityCurrentCount = originalityCount + 1;
            setOriginalityCount(originalityCurrentCount);
          }
        }
        //CHATGPT (GPT-4)
        if (usedAIs.includes("ChatGPT (GPT-4)")) {
          const responseChatGPT = await fetch("http://localhost:3333/beta/final/detect/chatgpt", {
            method: "POST",
            body: {
              title: texts[i].title,
              text: texts[i].text,
              api_key: api_chatGPT
            }
          });
          const dataChatGPT = await responseChatGPT.json();
          if (dataChatGPT.status === "OK") {
            const chatGPTCurrentCount = chatGPTCount + 1;
            setChatGPTCount(chatGPTCurrentCount);
          }
        }

        //fastDetectGPT (DESCARTADO, SE USARÁ FAST DETECT GPT)
        if (usedAIs.includes("fastDetectGPT")) {
          const responsefastDetectGPT = await fetch("http://localhost:3333/beta/final/fastDetectGPT", {
            method: "POST",
            body: texts[i].text
          });
          const datafastDetectGPT = await responsefastDetectGPT.json();
          if (datafastDetectGPT.status === "OK") {
            const fastDetectGPTCurrentCount = fastDetectGPTCount + 1;
            F(fastDetectGPTCurrentCount);
          }
        }

        //lmWATERMARKING D.
        if (usedAIs.includes("lmWatermarking D.")) {
          const responselmWatermarking = await fetch("http://localhost:3333/beta/final/lmWatermarking", {
            method: "POST",
            body: texts[i].text
          });
          const datalmWatermarking = await responselmWatermarking.json();
          if (datalmWatermarking.status === "OK") {
            const lmWatermarkingCurrentCount = lmWatermarkingCount + 1;
            setlmWatermarkingCount(lmWatermarkingCurrentCount);
          }
        }

        //PoC AI Detector
        if (usedAIs.includes("PoC AI Detector")) {
          const responsePoC = await fetch("http://localhost:3333/beta/final/poc", {
            method: "POST",
            body: texts_200[i]
          });
          const dataPoC = await responsePoC.json();
          if (dataPoC.status === "OK") {
            const pocCurrentCount = pocCount + 1;
            setPocCount(pocCurrentCount);
          }
        }*/

        //Parte final: Guardado de información en BD
        /*
                try {
          const analysisCreation = await fetch("http://localhost:3333/beta/final/analysis", {
            method: "POST",
            body: formData
          });
          const data = await analysisCreation.json();
          console.log(data);
          setAnalysisCreated(true);
          const id_analysis = data.id;

          for (let i = 0; i < files.length; i++) {
            const documentCreation = await fetch("http://localhost:3333/beta/final/document", {
              method: "POST",
              body: formData
            });
            const dataDocument = await documentCreation.json();
            console.log(dataDocument);
            for (let j = 0; j < dataDocument.length; j++) {
              const resultCreation = await fetch("http://localhost:3333/beta/final/result", {
                method: "POST",
                body: JSON.stringify({
                })
              });
              const dataResult = await resultCreation.json();
              console.log(dataResult);
            }
          }
          setProcessFinished(true);
          setResultMessage("Proceso finalizado exitósamente");
        } catch (error) {
          console.log("Error inesperado:");
          console.log(error);
          setProcessFinished(true);
          setBadProcessEnding(true);
          setResultMessage("Proceso finalizado con errores: " + error);
        } */
      }
      var fullTimeAnalysisEnd = performance.now();
      console.log("Tiempo total de análisis: " + (fullTimeAnalysisEnd - fullTimeAnalysis) + " ms");
      setProcessFinished(true);
      setBadProcessEnding(false);
      setResultMessage("Proceso finalizado exitósamente")
    } catch (error) { //No debería llegar aquí, es sólo para evitar una posible caida del sistema
      console.log("Error inesperado:");
      console.log(error);
      setProcessFinished(true);
      setBadProcessEnding(true);
      setResultMessage("Proceso finalizado con errores: " + error);
      return;
    }
  }
  return (
    !processStarted ? (
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
                API keys (IAs pagadas)
              </label>
              {keyOptions.map((option) => (
                <div key={option.id}>
                  <input
                    type="checkbox"
                    id={option.id}
                    name={option.api_key}
                    value={option}
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
              <label className="block text-gray-600">
                IAs gratuitas
              </label>
              {freeAIsOptions.map((option) => (
                <div key={option.id}>
                  <input
                    type="checkbox"
                    id={option.id}
                    name={option.name}
                    value={option}
                    checked={freeAIs.some(key => key.id.toString() === option.id.toString())}
                    onChange={handleFreeAIChange}
                  />
                  <label htmlFor={option.id} className="ml-2">
                    {`${option.name}`}
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-gray-600">
                Categorías
              </label>
              {tagsOptions.map((option) => (
                <div key={option.id}>
                  <input
                    type="checkbox"
                    id={option.id}
                    name={option.name}
                    value={option}
                    checked={tags.some(key => key.id.toString() === option.id.toString())}
                    onChange={handleTagChange}
                  />
                  <label htmlFor={option.id} className="ml-2">
                    {`${option.name}`}
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
              className={`w-full py-2 border rounded-xl ${formPass ? "border-green-500 bg-white text-green-500 transition duration-500 ease-in-out hover:bg-green-500 hover:text-white" : "border-gray-300 bg-gray-300 text-gray-500"}`}
              disabled={!formPass}
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
    ) : (
      <>
        <div className="container mx-auto py-6">
          <div className="flex justify-center text-2xl font-bold">¡Análisis inicializado!</div>
        </div>
        <div className="container mx-auto py-3">
          <div className="font-bold">Información del análisis</div>
          <div>
            <ul>
              <li>Título: <span className="font-semibold">{title}</span></li>
              <li>Fecha inicio: <span className="font-semibold">{currentDate}</span></li>
              <li>Hora inicio: <span className="font-semibold">{currentTime}</span></li>
              <li>Número archivos: <span className="font-semibold">{files.length}</span></li>
              <li>IAs usadas: <span className="font-semibold">{formatAIs()}</span></li>
              <li>Categorías: <span className="font-semibold">{formatTags()}</span></li>
              <li>Estado: <span className="font-semibold">{!processFinished ? ("En proceso") : ("Finalizado")}</span></li>
              <li>Resultado: <span className="font-semibold">{resultMessage}</span></li>
            </ul>
          </div>
        </div>
        <div className="mx-8">

            <div className="flex justify-between mb-1 py-2">
              <span className="text-base font-medium text-purple-700 dark:text-white">Originality</span>
              <span className="text-sm font-medium text-purple-700 dark:text-white">{files.length > 0 ? originalityCount * 100 / files.length + "%" : 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: files.length > 0 ? originalityCount * 100 / files.length + "%" : 0 }}></div>
            </div>

            <div className="flex justify-between mb-1 py-2">
              <span className="text-base font-medium text-green-700 dark:text-white">ChatGPT (GPT-4)</span>
              <span className="text-sm font-medium text-green-700 dark:text-white">{files.length > 0 ? chatGPTCount * 100 / files.length + "%" : 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: files.length > 0 ? chatGPTCount * 100 / files.length + "%" : 0 }}></div>
            </div>

            <div className="flex justify-between mb-1 py-2">
              <span className="text-base font-medium text-red-700 dark:text-white">Fast Detect GPT (Soon)</span>
              <span className="text-sm font-medium text-red-700 dark:text-white">{files.length > 0 ? fastDetectGPTCount * 100 / files.length + "%" : 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-red-600 h-2.5 rounded-full" style={{ width: files.length > 0 ? fastDetectGPTCount * 100 / files.length + "%" : 0 }}></div>
            </div>

            <div className="flex justify-between mb-1 py-2">
              <span className="text-base font-medium text-sky-700 dark:text-white">Lm Watermarking (Soon)</span>
              <span className="text-sm font-medium text-sky-700 dark:text-white">{files.length > 0 ? lmWatermarkingCount * 100 / files.length + "%" : 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-sky-600 h-2.5 rounded-full" style={{ width: files.length > 0 ? lmWatermarkingCount * 100 / files.length + "%" : 0 }}></div>
            </div>

            <div className="flex justify-between mb-1 py-2">
              <span className="text-base font-medium text-black dark:text-white">PoC AI Detector (Soon)</span>
              <span className="text-sm font-medium text-black dark:text-white">{files.length > 0 ? pocCount * 100 / files.length + "%" : 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-black h-2.5 rounded-full" style={{ width: files.length > 0 ? pocCount * 100 / files.length + "%" : 0 }}></div>
            </div>
          </div>
        {processFinished && (
          <div className="grid grid-cols-1 sm:grid-cols-2 justify-between px-4 gap-4">
            <Link to={`/analysis/${item.id}`} state={{ item }} visible={processFinished && !badProcessEnding} className="text-center mt-4 p-2 text-blue-500 bg-white border border-blue-500 rounded-xl transition ease-in-out duration-500 hover:bg-blue-500 hover:text-white">
              <button>Ver análisis</button>
            </Link>
            <Link to={`/logged in`} className="text-center mt-4 p-2 text-blue-500 bg-white border border-blue-500 rounded-xl transition ease-in-out duration-500 hover:bg-blue-500 hover:text-white">
              <button>Volver</button>
            </Link>
          </div>
        )}
      </>
    )
  );
}
