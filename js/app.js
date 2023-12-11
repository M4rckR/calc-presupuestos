// Seleccionar elementos del DOM
const btnPresupuesto = document.querySelector('#ingreso-presupuesto');
const campoPresupuesto = document.querySelector('#campo-presupuesto');
const formulario1 = document.querySelector('#formulario1');
const agregarGasto = document.querySelector('#agregar-gasto');
const campoNombre = document.querySelector('#campo-nombre');
const campoGasto = document.querySelector('#campo-gasto');
const reiniciar = document.querySelector('#reiniciar');
const listaGastos = document.querySelector('#listado-gastos');
const formulario2 = document.querySelector('#formulario2');

// Arreglo para almacenar los gastos
let itemsGasto = [];

// Agregar listeners a los elementos
eventListeners();

function eventListeners() {
    // Cargar funciones por defecto al cargar el DOM
    document.addEventListener('DOMContentLoaded', funcionesPorDefecto);

    // Validar presupuesto al hacer clic en el botón
    btnPresupuesto.addEventListener('click', validarPresupuesto);

    // Validar gasto al hacer clic en el botón
    agregarGasto.addEventListener('click', validarGasto);

    // Reiniciar la aplicación al hacer clic en el botón
    reiniciar.addEventListener('click', () => {
        // Habilitar campos y botones
        ui.gastosToggle(true);
        ui.presupuestoToggle(false);

        // Limpiar el HTML
        ui.limpiarHtml();

        // Reiniciar formulario
        formulario1.reset();

        // Reiniciar variables
        presupuesto = undefined;
        itemsGasto = [];
    });
}

// Clase Presupuesto
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = presupuesto;
        this.restante = presupuesto;
        this.gastos = [];
    }

    actualizarRestante(gasto) {
        this.restante -= gasto;
        this.gastos = [...this.gastos, gasto];
    }
}

// Clase UI
class Ui {
    // Deshabilitar/activar elementos relacionados con los gastos
    gastosToggle(bandera) {
        const elements = [campoNombre, campoGasto, agregarGasto, reiniciar];
        elements.forEach(element => {
            element.disabled = bandera;
            element.classList.toggle('cursor-not-allowed', bandera);
            element.classList.toggle('opacity-50', bandera);
        });
    }

    // Deshabilitar/activar elementos relacionados con el presupuesto
    presupuestoToggle(bandera) {
        const elements = [campoPresupuesto, btnPresupuesto];
        elements.forEach(element => {
            element.disabled = bandera;
            element.classList.toggle('cursor-not-allowed', bandera);
            element.classList.toggle('opacity-50', bandera);
        });
    }

    // Generar una alerta en el formulario
    generarAlerta(mensaje, tipo) {
        formulario1.reset();
        const alerta = document.createElement('div');
        alerta.id = 'alerta';
        alerta.textContent = mensaje;
        alerta.className = 'py-2 px-4 text-white mt-2 text-center';

        if (tipo === 'error') {
            alerta.classList.add('bg-red-500');
        } else {
            alerta.classList.add('bg-green-600');
        }

        if (!formulario1.querySelector('#alerta')) {
            formulario1.appendChild(alerta);
        }

        setTimeout(() => {
            alerta.remove();
        }, 2000);
    }

    // Establecer el presupuesto y el restante en el HTML
    establecerPresupuesto(restante) {
        const labelPresupuesto = document.querySelector('#presupuesto');
        const labelRestante = document.querySelector('#restante');
        labelPresupuesto.textContent = restante;
        labelRestante.textContent = restante;
    }

    // Mostrar los gastos en el HTML
    ingresarGasto() {
        this.limpiarHtml();
        itemsGasto.forEach(gasto => {
            const { nombre, valor, id } = gasto;
            const itemGasto = document.createElement('div');
            const btnCerrar = document.createElement('button');

            btnCerrar.textContent = 'X';
            btnCerrar.className =
                'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 ml-auto';
            btnCerrar.setAttribute('data-id', id);
            btnCerrar.onclick = () => {
                this.eliminarGasto(btnCerrar.getAttribute('data-id'));
                presupuesto.actualizarRestante(-valor);
                this.actualizarRestante(presupuesto.restante);
            };
            itemGasto.className = 'flex items-center bg-white py-2 px-4 mb-2';
            itemGasto.textContent = `${nombre} - $${valor}`;

            itemGasto.appendChild(btnCerrar);
            listaGastos.appendChild(itemGasto);
            formulario2.reset();
        });
    }

    // Limpiar el HTML de los gastos
    limpiarHtml() {
        while (listaGastos.firstChild) {
            listaGastos.removeChild(listaGastos.firstChild);
        }
    }

    // Actualizar el restante en el HTML
    actualizarRestante(restante) {
        const labelRestante = document.querySelector('#restante');
        labelRestante.textContent = restante;
    }

    // Eliminar un gasto del arreglo y actualizar el HTML
    eliminarGasto(id) {
        itemsGasto = itemsGasto.filter(gasto => gasto.id != id);
        this.ingresarGasto();
    }
}

// Instancia de la clase Ui
const ui = new Ui();

// Variable para almacenar el presupuesto
let presupuesto;

// Funciones

// Funciones por defecto al cargar el DOM
function funcionesPorDefecto() {
    ui.gastosToggle(true);
}

// Validar el presupuesto ingresado
function validarPresupuesto(e) {
    e.preventDefault();
    const valorIngresado = e.target.previousElementSibling.value;

    if (valorIngresado === '' || isNaN(valorIngresado)) {
        ui.generarAlerta('Ingrese un presupuesto válido', 'error');
        return;
    } else if (valorIngresado <= 0) {
        ui.generarAlerta('El presupuesto no puede ser 0 o menor', 'error');
        return;
    } else {
        ui.generarAlerta('El valor ha sido ingresado');
        ui.establecerPresupuesto(valorIngresado);
        ui.gastosToggle(false);
        ui.presupuestoToggle(true);
    }

    presupuesto = new Presupuesto(valorIngresado);
    let { restante } = presupuesto;
    ui.establecerPresupuesto(restante);
}

// Validar el gasto ingresado
function validarGasto(e) {
    const valorNombre = campoNombre.value;
    const valorGasto = campoGasto.value;

    if (valorNombre === '' || valorGasto === '') {
        ui.generarAlerta('Ingrese un nombre y un gasto', 'error');
        return;
    }
    if (valorGasto <= 0 || isNaN(valorGasto)) {
        ui.generarAlerta('Ingrese un gasto válido', 'error');
        return;
    } else {
        const gasto = {
            nombre: valorNombre,
            valor: valorGasto,
            id: Date.now()
        };
        itemsGasto.push(gasto);
        presupuesto.actualizarRestante(valorGasto);
        let { gastos, restante } = presupuesto;
        ui.actualizarRestante(restante);
        ui.generarAlerta('El gasto ha sido ingresado');
        ui.ingresarGasto();
    }
}
