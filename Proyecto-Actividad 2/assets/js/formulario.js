
$(document).ready(function(){
    var estudiantes = [];

    // Cargar los municipios correspondientes al departamento seleccionado
    $("#departamento").change(function() {
        var departamento = $(this).val();
        var municipios = obtenerMunicipios(departamento);
        var municipioSelect = $("#municipio");
        municipioSelect.empty();
        $.each(municipios, function(index, municipio) {
            municipioSelect.append("<option value='" + municipio + "'>" + municipio + "</option>");
        });
    });

    // Función para agregar un estudiante
    $("#contact-form").submit(function(e) {
        e.preventDefault(); // Evitar que el formulario se envíe

        // Obtener los valores de los campos del formulario
        var nombreCompleto = $("#nombreCompleto").val();
        var email = $("#email").val();
        var genero = $("#genero").val();
        var telefono = $("#telefono").val();
        var comentario = $("#comentario").val();
        var departamento = $("#departamento").val();
        var municipio = $("#municipio").val();

        // Validar que los campos no estén vacíos
        if(nombreCompleto === '' || email === '' || genero === '' || telefono === '' || comentario === '' || departamento === '' || municipio === '') {
            alert("Por favor, complete todos los campos.");
            return;
        }

        // Crear el objeto estudiante
        var estudiante = {
            nombreCompleto: nombreCompleto,
            email: email,
            genero: genero,
            telefono: telefono,
            comentario: comentario,
            departamento: departamento,
            municipio: municipio
        };

        // Agregar el estudiante al array
        estudiantes.push(estudiante);
        
        // Mostrar los estudiantes
        mostrarEstudiantes();

        // Limpiar el formulario
        limpiarFormulario();

        // Mostrar mensaje de éxito
        alert("Estudiante registrado correctamente.");
    });

    // Función para mostrar los estudiantes en la tabla
    function mostrarEstudiantes() {
        $("#lista tbody").empty();
        $.each(estudiantes, function(index, estudiante) {
            $("#lista tbody").append("<tr><td>" + estudiante.nombreCompleto + "</td><td>" + estudiante.email + "</td><td>" + estudiante.genero + "</td><td>" + estudiante.telefono + "</td><td>" + estudiante.comentario + "</td><td>" + estudiante.departamento + "</td><td>" + estudiante.municipio + "</td><td><button class='btn btn-warning btn-editar' data-index='" + index + "'>Editar</button> <button class='btn btn-danger btn-eliminar' data-index='" + index + "'>Eliminar</button></td></tr>");
        });
    }

    // Función para limpiar el formulario después de enviar
    function limpiarFormulario() {
        $("#nombreCompleto").val("");
        $("#email").val("");
        $("#genero").val("");
        $("#telefono").val("");
        $("#comentario").val("");
        $("#departamento").val("");
        $("#municipio").empty(); // Vaciar el select de municipio
    }

    // Evento click para el botón "Listar Estudiantes"
    $("#btnListar").click(function() {
        $("#lista").toggle(); // Alternar la visibilidad de la tabla de estudiantes
    });

    // Evento click para el botón "Editar"
    $(document).on("click", ".btn-editar", function() {
        var index = $(this).data("index");
        var estudiante = estudiantes[index];
        $("#nombreCompleto").val(estudiante.nombreCompleto);
        $("#email").val(estudiante.email);
        $("#genero").val(estudiante.genero);
        $("#telefono").val(estudiante.telefono);
        $("#comentario").val(estudiante.comentario);
        $("#departamento").val(estudiante.departamento);
        $("#municipio").val(estudiante.municipio);
        estudiantes.splice(index, 1); // Eliminar el estudiante de la lista
        mostrarEstudiantes(); // Volver a mostrar la lista actualizada
    });

    // Evento click para el botón "Eliminar"
    $(document).on("click", ".btn-eliminar", function() {
        var index = $(this).data("index");
        estudiantes.splice(index, 1); // Eliminar el estudiante de la lista
        mostrarEstudiantes(); // Volver a mostrar la lista actualizada
    });

    // Función para obtener los municipios correspondientes a un departamento
    function obtenerMunicipios(departamento) {
        var municipiosPorDepartamento = {
            "1": ["Trinidad", "Riberalta", "Guayaramerin", "San Borja", "San Ignacio", "Rurrenabaque",
                "Santa Ana Del Yacuma", "Reyes", "San Andres", "Magdalena", "Santa Rosa",
                "San Joaquin", "Exaltacion", "Baures", "San Javier", "San Ramon", "Huacaraje", "Loreto",
                "Puerto Siles"],
            "2": ["Cochabamba", "Sacaba", "Quillacollo", "Villa Tunari", "Tiquipaya", "Colcapirhua",
                "Vinto", "Puerto Villaroel", "Sipe Sipe", "Entre Rios", "Punata", "Mizque", "Tapacari",
                "Independencia", "Aiquile", "Cliza", "Chimore", "Tiraque", "Shinahota", "Capinota",
                "Colomi", "Cocapata", "Arbieto", "Totora", "San Benito", "Morochata", "Pocona", "Arque",
                "Tacopaya", "Pojo"],
            "3": ["Sucre", "Yotala", "Poroma", "Presto", "El Villar", "Icla", "Tarabuco", "Villa Serrano",
                "Zudáñez", "Mojocoya", "Culpina", "Monteagudo", "Huacareta", "Villa Vaca Guzmán", "Camargo",
                "Villa Charcas", "Padilla", "Villa Alcalá", "Sopachuy", "Tomina", "Azurduy", "Macharetí",
                "Huacaya", "El Villar", "Icla", "San Lucas", "Huacareta", "Incahuasi", "Tarvita"],
            "4": ["Achacachi", "Achocalla", "Aucapata", "Batallas", "Cairoma", "Calacoto", "Calamarca", "Callapa",
                "Caquiaviri", "Charaña", "Chúa Cocani", "Collana", "Colquencha", "Colquiri", "Comanche", "Coripata",
                "Coro Coro", "Escoma", "Guanay", "Guaqui", "Huachacalla", "Huarina", "Humanata", "Ichoca",
                "Inquisivi", "Jesús de Machaca", "La Asunta", "Laja", "Licoma Pampa", "Malla", "Mecapaca", "Palca",
                "Palos Blancos", "Papel Pampa", "Pelechuco", "Pucarani", "Puerto Acosta", "Puerto Carabuco", "Puerto Pérez",
                "Quime", "San Andrés de Machaca", "San Buenaventura", "San Pedro de Curahuara", "Santiago de Callapa",
                "Sapahaqui", "Sica Sica", "Sorata", "Tacacoma", "Tacopaya", "Tambo Quemado", "Teoponte", "Tipuani",
                "Tito Yupanqui", "Umala", "Ventilla", "Viacha", "Villa Alota", "Yanacachi", "Yanahuaya", "Yolosa",
                "Zongo", "La Paz", "Copacabana", "Coroico", "Chulumani", "Irupana", "Caranavi", "Sorata", "Guanay",
                "Mapiri", "Teoponte", "San Buenaventura", "Puerto Acosta", "Aucapata", "Achocalla", "Chúa Cocani",
                "Batallas", "Sapahaqui", "Colquiri", "Huayllamarca", "Ayo Ayo", "Mecapaca", "San Pedro de Curahuara",
                "Charaña", "Viacha", "Luribay", "Charazani"],
            "5": ["Oruro", "Cercado", "Caracollo", "Huanuni", "Macha", "Santiago de Huari", "Eucaliptus", "Sabaya",
                "Turco", "Chipaya", "Choquecota", "Corque", "Andamarca", "Soracachi", "Santiago de Andamarca",
                "Pantijara", "Santuario de Quillacas", "Cruz de Machacamarca", "Poopó", "Challapata", "Mojinete",
                "Salinas de Garci Mendoza", "Curahuara de Carangas", "Challapata", "Salinas de Garci Mendoza",
                "Machacamarca", "La Rivera", "Esmeralda", "Pazña", "Antequera", "Huanuni", "Caracollo", "Poopó",
                "Santiago de Machaca"],
            "6": ["Cobija", "Porvenir", "Filotas", "Bolpebra", "El Sena", "Puerto Gonzalo Moreno", "Nueva Esperanza",
                "Santos Mercado", "Ingavi", "San Lorenzo", "Santa Rosa del Abuná", "Bella Flor", "Villa Nueva",
                "San Pedro", "San Pablo"],
            "7": ["Potosí", "Uyuni", "Villazón", "Villa Imperial de Potosí", "Colcha K", "Tupiza", "Yocalla",
                "Sacaca", "Tahua", "Tupiza", "San Pedro de Quemes", "Mojo", "Toro Toro", "Tinguipaya", "Tacobamba",
                "Pocoata", "Tomas Frias", "Yocalla", "Urmiri", "Uncía", "Tacobamba", "Tinguipaya", "Pocoata",
                "Ocurí", "Llallagua", "Colquechaca", "Acasio", "Betanzos", "Tacobamba", "Tinguipaya", "Pocoata",
                "Ocurí", "Llallagua", "Colquechaca", "Acasio", "Betanzos", "Atocha", "San Pedro de Buena Vista"],
            "8": ["Santa Cruz de la Sierra", "El Torno", "Porongo", "La Guardia", "Puerto Pailas", "Cotoca",
                "Warnes", "Yapacaní", "Fernández Alonso", "Colpa Bélgica", "Portachuelo", "Mineros", "Comarapa",
                "Samaipata", "Pampa Grande", "Mairana", "Camiri", "Charagua", "Gutierrez", "Cuevo", "Huacareta",
                "Roboré", "Chiquitos", "San Ignacio de Velasco", "San Matías", "San Rafael", "Concepción",
                "San Carlos", "San Javier", "Cuatro Cañadas", "San Ramón", "San Juan de Yapacaní",
                "San Antonio de Lomerío", "Ascensión de Guarayos", "El Puente", "San José de Chiquitos", "Lagunillas",
                "San Julián", "Saipina", "Cabezas", "San Pedro", "San Antonio de Oblitas", "Yotau", "San Pedro de Ycuamandiyú",
                "El Trigal", "Muyupampa", "Comarapa", "Cabezas", "San Pedro", "San Antonio de Oblitas", "Yotau",
                "San Pedro de Ycuamandiyú", "El Trigal", "Muyupampa"],
            "9": ["Tarija", "Yacuiba", "Villamontes", "Bermejo", "Caraparí", "Padcaya", "Entre Ríos", "Uriondo",
                "El Puente", "San Lorenzo", "Cercado"]
        };
        return municipiosPorDepartamento[departamento] || [];
    }
});
