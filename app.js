window.addEventListener("load", function () {
    //Capturamos los elementos del formulario en este caso como son id ponemos # antes del nombre
    const formulario = document.querySelector("#formulario");
    const nombre = document.querySelector("#nombre");
    const apellidos = document.querySelector("#apellidos");
    const numeroCIP = document.querySelector("#numeroCIP");
    const numTarjeta = document.querySelector("#numTarjeta");
    const datepicker = document.querySelector("#datepicker");
    const hora = document.querySelector("#hora");

    //declaramos el array
    var citas_medicas = [];

    //para que funcione correctamente el datepicker
    const today = new Date();
    //el dia de hoy mas 1 ( a partir de mañana)
    today.setDate(today.getDate() + 1);

    //le damos formato 
    datepicker.min = today.toISOString().split('T')[0];



    /////////////////////////////////////////////////////////////////////
    // función de validación del formulario asociada al evento submit //
    ///////////////////////////////////////////////////////////////////

    formulario.addEventListener("submit", ev => {
        //inicializamos el flag valido a true
        let valido = true;

        //prevenimos el envío del formulario
        ev.preventDefault();
        ev.stopPropagation();

        //llamo a las funciones de validación y si encuentro
        //alguna que devuelve false ponemos el flag a false
        if (!validaNombre(nombre)) {
            valido = false;
        }
        if (!validaApellidos(apellidos)) {
            valido = false;
        }
        if (!validaNumeroCIP(numeroCIP)) {
            valido = false;
        }
        if (!validaNumTarjeta(numTarjeta)) {
            valido = false;
        }
        if (!validaDatepicker(datepicker)) {
            valido = false;
        }
        if (!validaHora(hora)) {
            valido = false;
        }

        // si no hemos encontrado ningún campo incorrecto guardamos los datos en el array con la funcion guardarCitaMedica() y lo pintamos
        if (valido) {
            guardaCitaMedica();

            pintaCitasMedicas(citas_medicas);

            // formulario.submit();   ( para forzar el envio)

        }
    });

    //eventos blur para cuando pinchemos en otro campo el anterior se valide  y salga el error si esta completado incorrectamente

    nombre.addEventListener("blur", e => {
        validaNombre(nombre);

    })


    apellidos.addEventListener("blur", e => {
        validaApellidos(apellidos);

    })

    numeroCIP.addEventListener("blur", e => {
        validaNumeroCIP(numeroCIP);

    })

    numTarjeta.addEventListener("blur", e => {
        validaNumTarjeta(numTarjeta);

    })

    datepicker.addEventListener("blur", e => {
        validaDatepicker(datepicker);

    })

    hora.addEventListener("blur", e => {
        validaHora(hora);

    })



    /////////////////////////////////////////////////////////
    // a partir de aquí pondremos funciones de validación //
    ///////////////////////////////////////////////////////

    //valida el nombre con expresiones regulares
    function validaNombre(el) {
        const nombre = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s']+$/;

        if (!nombre.test(el.value)) {
            marcaError(el, "El nombre no es válido");
            return false;
        } else {
            marcaValido(el);
            return true;
        }
    }

    //validar apellidos
    function validaApellidos(el) {
        const apellidos = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s']+$/;

        if (!apellidos.test(el.value)) {
            marcaError(el, "Apellidos no válidos");
            return false;
        } else {
            marcaValido(el);
            return true;
        }
    }


    //validar cip
    function validaNumeroCIP(el) {
        const numeroCIP = /^clm\d{10}$/i;

        if (!numeroCIP.test(el.value)) {
            marcaError(el, "Número CIP no válido");
            return false;
        } else {
            marcaValido(el);
            return true;
        }
    }


    //valida el número de la tarjeta con expresiones regulares
    function validaNumTarjeta(el) {
        const valorTarjeta = el.value.trim();
        const opt = document.querySelector("input[name='pasaporteNIF']:checked").value;

        if (fValidarTarjeta(valorTarjeta, opt)) {
            marcaValido(el);
            return true;
        } else {
            marcaError(el, "Número de tarjeta inválido");
            return false;
        }
    }

    //esta funcion fValidarTarjeta es una funcion aparte para el pasaporte o el nif (dni o nie), basandose en el ultimo numero del nif y la letra que tenga

    function fValidarTarjeta(codigo, opt) {
        var msg = "Valor incorrecto";
        var validChars = 'TRWAGMYFPDXBNJZSQVHLCKET';
        var nifRexp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
        var nieRexp = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
        var pasaporteRexp = /^[A-Za-z0-9]{6,20}$/;

        var str = codigo.toString().toUpperCase();

        if (opt === "nif" || opt === "nie") {
            if (!nifRexp.test(str) && !nieRexp.test(str)) {
                console.log("Formato incorrecto de DNI o NIE");
                return false;
            }

            var nie = str
                .replace(/^[X]/, '0')
                .replace(/^[Y]/, '1')
                .replace(/^[Z]/, '2');

            var letter = str.substr(-1);
            var charIndex = parseInt(nie.substr(0, 8)) % 23;

            if (validChars.charAt(charIndex) === letter) {
                return true;
            }
        } else if (opt === "pasaporte" && pasaporteRexp.test(str)) {
            return true;
        }

        console.log("Formato incorrecto de documento");
        return false;
    }


    //validar fecha
    function validaDatepicker(el) {
        if (el.value === "") {
            marcaError(el, "Selecciona una fecha");
            return false;
        } else {
            marcaValido(el);
            return true;
        }
    }

    //validar la hora
    function validaHora(el) {
        if (el.value === "") {
            marcaError(el, "Selecciona una hora");
            return false;
        } else {
            marcaValido(el);
            return true;
        }
    }




    /////////////////////////////
    // funciones de utilidad: //              
    ///////////////////////////

    //pone un mensaje pasado al parrafo de error asociado al elemento pasado 
    //y pone la clase de error al padre
    function marcaError(el, mensaje) {
        el.parentNode.querySelector(".error-feedback").textContent = mensaje;
        el.parentNode.classList.add("error");
        el.classList.add("input-error");
    }

    //quita el mensaje de error al elemento pasado y quita la clase de error al padre 
    function marcaValido(el) {
        el.parentNode.querySelector(".error-feedback").textContent = "";
        el.parentNode.classList.remove("error");
        el.classList.remove("input-error");
    }



    //funcion para que funcione correctamente el datepicker
    $(function () {
        $("#datepicker").datepicker();
    });




    // Función para obtener el tipo de tarjeta seleccionado
    function obtenerTipoTarjeta() {
        const opciones = document.querySelectorAll("input[name='pasaporteNIF']");
        for (const opcion of opciones) {
            if (opcion.checked) {
                return opcion.value;
            }
        }

        return "";

    }

    function guardaCitaMedica() {
        // Verificar que todos los campos estén llenos y válidos antes de agregar la forma de pago
        const nombreValido = validaNombre(nombre);
        const apellidosValido = validaApellidos(apellidos);
        const numCIPValido = validaNumeroCIP(numeroCIP);
        const numTarjetaValido = validaNumTarjeta(numTarjeta);
        const fechaValida = validaDatepicker(datepicker);
        const horaValida = validaHora(hora);

        if (nombreValido && apellidosValido && numCIPValido && numTarjetaValido && fechaValida && horaValida) {
            //nos quedamos con el valor de cada uno menos en el tipo de documento que tenemos que seleccionar entre dos
            const datos = {
                nombre: nombre.value,
                apellidos: apellidos.value,
                CIP: numeroCIP.value,
                tipo_documento: obtenerTipoTarjeta(),
                id: numTarjeta.value,
                dia_cita: datepicker.value,
                hora_cita: hora.value
            };

            citas_medicas.push(datos);

            // Puedes imprimir el array de formas de pago en la consola para verificar
            console.log(citas_medicas);

            // También puedes reiniciar el formulario si es necesario
            formulario.reset();
        }
    }


    // Llama a esta función cada vez que se inserta una nueva forma de pago
    function pintaCitasMedicas(citas_medicas) {
        const container = document.getElementById("pintaCitasMedicas");

        // Limpia el contenido existente en el contenedor
        container.innerHTML = "";

        // Recorre el array de formas de pago y pinta cada una en una caja tipo card
        citas_medicas.forEach((citaMedica, index) => {
            const card = document.createElement("div");
            card.classList.add("card");

            //ponemos literalmente lo que seria el html del card
            card.innerHTML = `
            <h3>Datos cita médica</h3>
                <p><strong>Nombre:</strong> ${citaMedica.nombre}</p>
                <p><strong>Apellidos:</strong> ${citaMedica.apellidos}</p>
                <p><strong>CIP:</strong> ${citaMedica.CIP}</p>
                <p><strong>Tipo de documento:</strong> ${citaMedica.tipo_documento}</p>
                <p><strong>ID:</strong> ${citaMedica.id}</p>
                <p><strong>Dia cita:</strong> ${citaMedica.dia_cita}</p>
                <p><strong>Hora cita:</strong> ${citaMedica.hora_cita}</p>

            `;

            container.appendChild(card);
        });

        //modificamos las cards para que salgan con el display block ( unas al lado de otras)
        const cards = container.getElementsByClassName("card");
        Array.from(cards).forEach((card) => {
            card.style.display = "inline-block";
            card.style.marginRight = "10px"; // Ajusta el margen entre las tarjetas según tus preferencias
        });
    }






})
