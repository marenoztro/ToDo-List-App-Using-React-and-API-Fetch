import React, { useState, useEffect } from "react";

//create your first component
const Home = () => {
  //OJO: ACÁ DECLARAMOS LOS ESTADOS:
  //UNO PARA EL STRING DEL INPUT (LA NUEVA TAREA A ESCRIBIR) / OTRO PARA EL ARRAY (LA LISTA DE TAREAS QUE SE VA SUMANDO)
  const [tarea, setTarea] = useState(""); // dato de tipo string
  const [list, setList] = useState([]); // dato de tipo Array


  //ACÁ CREAMOS UNA FUNCIÓN PARA AGREGAR LA NUEVA TAREA AL ARRAY DE LA LISTA DE TAREAS AL DARLE ENTER
  function addTarea(e) {
    //ACÁ COMO LA FUNCIÓN ESTÁ ASOCIADA A UN "evento"... LA FUNCIÓN TIENE COMO PARÁMETRO LA e De evento ASÍ: (e)
    if (e.key === "Enter") {
      //ACÁ PLANTEAMOS LA CONDICIONAL... SI LA TECLA DEL EVENTO ES IGUAL A "Enter"
      setList([...list, {label:tarea, done: false}]); //QUE "setList" SUME UNA COPIA DE LA LISTA Y LE SUME LA NUEVA "tarea" ENTRANTE (ESTO SE USA PARA SUMAR AL ARRAY EN VEZ DEL METODO PUS)
      setTarea(""); //ACÁ HACEMOS QUE LUEGO DE AGREGAR LA NUEVA TAREA, SE LIMPIE TODO Y QUEDE VACÍO PARA ESCRIBIR UNA NUEVA ENTRADA
    }
  }

  useEffect(() => {
	if (list.length === 0) return  // ACÁ EVITAMOS QUE EL CÓDIGO SE ROMPA SI LIST VIENE VACÍO CON ESTE CONDICIONAL
	fetch('https://assets.breatheco.de/apis/fake/todos/user/marlon', { //ACÁ ESTAMOS HACIENDO EL FETCH HACIA EL API TAL Y COMO LO INDICA LA DOCUMENTACIÓN DEL API (la dirección y las propiedadades que pide: method, body, headers)
      method: "PUT",
      body: JSON.stringify(list),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(resp => {
        console.log(resp.ok); // Será true (verdad) si la respuesta es exitosa.
        console.log(resp.status); // el código de estado = 200 o código = 400 etc.
        console.log(resp.text()); // Intentará devolver el resultado exacto como cadena (string)
        return resp.json(); // (regresa una promesa) will try to parse the result as json as return a promise that you can .then for results
    })
    .then(data => {
        //Aquí es donde debe comenzar tu código después de que finalice la búsqueda
        console.log(data); //esto imprimirá en la consola el objeto exacto recibido del servidor
    })
    .catch(error => {
        ///aquí captás el reporte del error... si se presenta
        console.log(error);
    });
  }, [list]); //ACÁ INDICAMOS QUE LA DEPENDENCIA PARA QUE ARRANQUE ESTE "EFECTO SECUNDARIO" DEL FETCH ES A PARTIR DE QUE OCURRA UN CAMBIO EN LIST.




  
// AQUÍ CREÁS UN useEffect COMO UN PRO: CON UNA VALIDACIÓN QUE TE GARANTICE UN ESPACIO EN EL SERVIDOR PARA TENER ESPACIO PARA TUS DATOS Y QUE NO PERDAS INFORMACIÓN. HACE QUE:
// 1) Ó SE HACE UN GET (que es la acción por default que hace un Fetch) LA LISTA DEL API QUE LE INDICAMOS Y PODAMOS ACCEDER AL SERVIDOR
// 2 Ó SE HACE UN NUEVO POST CREANDO ENTONCES UN NUEVO ESPACIO EN EL API PARA QUE PODAMOS ACCEDER AL SERVIDOR


  useEffect(() => { 
	fetch('https://assets.breatheco.de/apis/fake/todos/user/marlon') //PEDIS UNA LISTA A UNA API (PODRÍA EXISTIR O NO...) SI LA API EXISTE, LA EJECUTA. 
	.then ((resp) => {
		return resp.ok ? resp.json(): fetch('https://assets.breatheco.de/apis/fake/todos/user/marlon', { //CON EL OPERADOR TERNARIO LE DECIMOS: SI LA RESPUESTA ESTÁ OK.... MOSTRAME EL JSON DE RESPUESTA... SINO.... ENTONCES EJECUTA ESTE FETCH CON "POST" PARA CREAR UN ESPACIO Y ASEGURARSE ACCESO AL SERVIDOR
			method: "POST",
			body: JSON.stringify([]), // ESTO NOS PERMITE CUMPLIR CON QUE EN EL BODY HALLA UN ARRAY VACÍO EN FORMATO json (QUE ES OBJETO CON PROPIEDAD BODY: Y SU VALOR ES UN [] VACÍO... OJO... .stringify NOS AYUDA A DAR LA PROPIEDAD JSON AL ARRAY VACÍO)
			headers: {
				"Content-Type": "application/json" //ESTO NOS PERMITE CUMPLIR CON LO QUE PIDE LA DOCUMENTACIÓN EN LA PARTE DE Content-Type... OJO: ESTO ES UN OBJETO CON UN OBJETO ADENTRO Y LO TENEMOS QUE HACER ASÍ PORQUE Content-Type TIENE LETRAS EN MAYÚSCULA Y UN CARACTER ESPECIAL COMO LO ES EL GUIÓN "-"
			}
		}) //ESTO NOS VA A VALIDAR SI LA LISTA DEL FETCH EXISTE Y SI NO CREARLA 
		//(ESTO NOS PUEDE DAR CUALQUIERA DE LAS 2 RESPUESTAS: 1- EL FETCH O 2- EL JSON)
		})
	.then ((data) => {
	 if (data.ok) return 
	setList(data) //ESTO LO TENDRÍA CUANDO LA RESPUESTA ES EL JSON
	})
  }, []) //OJO QUE INTERESANTE, ESTE useState NOOOO TIENE DEPENDENCIA PORQUE NO LA INDICAMOS EN ESTE ARRAY QUE ESTÁ VACÍO. YYYYY.... POR LO TANTO... AUNQUE ESTÉ ESCRITO DESPUÉS DEL OTRO useState, COMO ESTE NO DEPENDE DE DE NADA, SE EJECUTA DE INMEDIATO AL CARGAR LA PÁGINA.





  
  //ACÁ CREAMOS LA FUNCIÓN PARA ELIMINAR LA TAREA CUMPLIDA
  const deleteTarea = (index) => {
    setList((prevState) =>
      prevState.filter((item, indexFiltered) => indexFiltered !== index)
    );
    console.log(index); // ESTO SOLO LO PUSE AQUÍ PARA CONFIRMAR QUE SE MUESTRA EL ÍNDICE DEL ITEM QUE ELIMINO
    //ACÁ FILTRAS EL setList (que es lo que debe cambiar) USAMOS prevState PARA REFERIRNOS AL ESTADO PREVIO QUE QUEREMOS CAMBIAR (USAMOS COMO PARAMETROS item y indexFiltered -en lugar de index- Y LOS COMPARAMOS: SI EL ESTADO indexFiltered ES DIIIFERENTE A index (el original) ENTONCES.... ACTÚA COMO UN LOOP Y EN CADA RECORRIDO... HACE EL FILTER BORRANDO DE LA LISTA LA TAREA ELIMINADA)
  };

  return (
    <>
      <div className="container col-8 text-center">
        {" "}
        {/* ESTE ES EL DIV QUE ENCAPSULA TODO: INPUT Y LISTADO DE TAREAS */}
        <h1>My To-Do List</h1>
        {/* ACÁ INSERTAMOS EL EL DIV CORRESPONDIENTE AL FORM/INPUT DONDE INSERTAREMOS LAS NUEVAS TAREAS DEL TO-DO LIST */}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="AGREGA UNA TAREA, VAGO..."
            onChange={(e) => setTarea(e.target.value)}
            onKeyDown={addTarea}
            value={tarea}
          />{" "}
          {/* ACÁ CREAMOS EL EVENTO PARA DETONAR LA FUNCIÓN A PARTIR DE "onChange" ES DECIR, A PARTIR DE QUE SE INTRODUZCA UNA NUEVA TAREA */}
        </div>
      </div>

      <div className="container col-8 text-center">
        <ul>
          {/* ACÁ INSERTAMOS LA LISTA DE TAREAS DEBAJO DEL INPUT QUE VA AGREGANDO CADA NUEVA TAREA QUE ESCRIBIMOS */}
          {list?.map((item, index) => { //ACÁ ESE SIGNO DE INTERROCACIÓN ADVIERTE QUE EL MAP PODRIA SER NULO... ES DECIR QUE PUEDE NO TENER CONTENIDO Y ESO NOS SIRVE PARA QUE EL PROGRAMA NO SE CORTE SI EL ARRAY NO TIENE CONTENIDO INICIALMENTE
            return (
              <li key={index}> 
                {" "}
                {item.label}  {/* ACÁ INDICAMOS item.label PORQUE ESO "LABEL" (objeto.label) ES LO QUE TIENE EL VALOR QUE BUSCAMOS MOSTRAR */}
                <span>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => deleteTarea(index)}
                  >
                    ❌
                  </button>
                </span>
              </li> // ACÁ INCLUIMOS UN BOTÓN PARA ELIMINAR TAREAS QUE HACE REFERENCIA A LA FUNCIÓN deleteTarea QUE TENEMOS ARRIBA
            );
          })}
        </ul>
      </div>
    </>
  );
};
export default Home;

// ASI RECOMIENDA REACT Y ROSI AGREGAR ELEMENTOS AL ARRAY EN REACT
// setFruits(fruits.concat('Manzana'))

{
  /* {items.map(item => {return( <li key={item.id}>{item.value} </li> )})} */
}
