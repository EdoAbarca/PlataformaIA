import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AddTag() {
  const [tag, setTag] = useState("");
  const [formPass, setFormPass] = useState(false);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3333/beta/final/tag")
      .then((response) => response.json())
      .then((data) => setTags(data))
      .catch((error) => console.log(error));
  }, []);

  function goBack() {
    navigate("/tags");
  }

  useEffect(() => {
    const tagPass = tag.length > 0;
    const nameTagPass = !tags.find((item) => item.name === tag);
    setFormPass(tagPass && nameTagPass);
  }, [tag, tags]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {

      if (formPass) {
        // Perform the desired action when the tag doesn't exist
        console.log("Tag doesn't exist, proceed to create it");
        const response = await fetch("http://localhost:3333/beta/final/tag", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name: tag })
        });
        const data = await response.json();
        console.log(data);
        goBack();
      } else {
        // Perform the desired action when the tag already exists
        console.log("Tag already exists or is empty");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agregar categoría</h2>
          <form className="flex flex-col">
            <input
              type="text"
              className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              placeholder="Etiqueta"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className={`w-full py-2 border rounded-xl ${formPass ? "border-green-500 bg-white text-green-500 transition duration-500 ease-in-out hover:bg-green-500 hover:text-white" : "border-gray-300 bg-gray-300 text-gray-500"}`}
              disabled={!formPass}
            >
              Crear
            </button>
            <Link
              to={"/tags"}
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