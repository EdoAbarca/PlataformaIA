import React from "react";

function returnGuest(){
    return "Anónimo";
}

function returnAnalysis(){
    let analysis = [

    ];
    return analysis;
}

function LoggedIn (){
    return (
        <div>
            <div id="titulo">
                <h1>Hola, {returnGuest()}.</h1>
            </div>

            <div id="box"> 
                <div id="presentacion y filtros">
                    <h3>Historial</h3>
                    <p>Aqui poner los futuros filtros</p>
                </div>
                <hr/>
                <div id="grid items">
                    <div id="grid item">
                        <p>Titulo / fecha</p>
                        <button>Ver</button>
                        <button>Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoggedIn;