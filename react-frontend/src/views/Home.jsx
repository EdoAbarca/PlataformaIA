import React from "react";
import homeImg from "../assets/images/homeImg.png";

function Home(){
  return (
    <div>
      <div id="hero-section">
        <img src={homeImg} alt="homeImg" />
        <h1>No quieres esto, ¿Verdad?</h1>
        <p>El uso de IA para resolver evaluaciones es un hecho, mas no tiene porqué ser un problema</p>
      </div>
      <div id="why">
        <h1></h1>
        <p>PoC AI Detector nace como prueba de concepto de un integrador múltiple de detectores de IA, el que evidenciará si tus alumnos utilizaron IA para resolver sus evaluaciones, sin mayor esfuerzo y con evidencia de por medio</p>
      </div>
      <div id="flex-info">
        <div id="info">
          <h2>Beneficio 1</h2>
          <p>Parrafo beneficio 1</p>
        </div>
        <div id="info">
          <h2>Beneficio 2</h2>
          <p>Parrafo beneficio 2</p>
        </div>
        <div id="info">
          <h2>Beneficio 3</h2>
          <p>Parrafo beneficio 3</p>
        </div>
      </div>
      <div id="guest-options">
        <h2>¿Te interesa?</h2>
        <button>Regístrate</button>
        <h2>¿Ya tienes una cuenta?</h2>
        <button>Iniciar sesión</button>
      </div>
    </div>
  );
}

export default Home;