const btnPresupuesto =  document.querySelector('#ingreso-presupuesto');
const campoPresupuesto = document.querySelector('#campo-presupuesto');
const formulario1 =  document.querySelector('#formulario1');
const agregarGasto =  document.querySelector('#agregar-gasto');
const campoNombre =  document.querySelector('#campo-nombre');
const campoGasto =  document.querySelector('#campo-gasto');
const reiniciar =  document.querySelector('#reiniciar');
const listaGastos =  document.querySelector('#listado-gastos');


eventListeners();
function eventListeners() {
    // Funcion por defecto
    document.addEventListener('DOMContentLoaded', funcionesPorDefecto)
    btnPresupuesto.addEventListener('click', validarPresupuesto)
    agregarGasto.addEventListener('click', validarGasto)

}





// Clases

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = presupuesto;
        this.restante = presupuesto;
        this.gastos = [];
    }

    actualizarRestante(gasto) {
        this.restante -= gasto;
        this.gastos = [...this.gastos, gasto]
    }

}

class Ui {
    gastosToggle(bandera) {
        const elements = [campoNombre, campoGasto, agregarGasto, reiniciar]
        elements.forEach(element => {
            element.disabled = bandera;
            element.classList.toggle('cursor-not-allowed', bandera)
            element.classList.toggle('opacity-50',bandera)
        });
    }

    presupuestoToggle(bandera) {
        const elements = [campoPresupuesto, btnPresupuesto]
        elements.forEach(element => {
            element.disabled = bandera;
            element.classList.toggle('cursor-not-allowed', bandera)
            element.classList.toggle('opacity-50',bandera)
        });
    }

    generarAlerta(mensaje,tipo) {
        formulario1.reset();
        const alerta = document.createElement('div');
        alerta.id = 'alerta';
        alerta.textContent = mensaje;
        alerta.className = 'py-2 px-4 text-white mt-2 text-center'

        if(tipo === 'error') {
            alerta.classList.add('bg-red-500')
        }
        else {
            alerta.classList.add('bg-green-600')
        }

        if(!formulario1.querySelector('#alerta')){
            formulario1.appendChild(alerta)
        }


        setTimeout(() => {
            alerta.remove();
        }, 2000);
    }

    establecerPresupuesto(restante){
        const labelPresupuesto = document.querySelector('#presupuesto')
        const labelRestante = document.querySelector('#restante')
        labelPresupuesto.textContent = restante;
        labelRestante.textContent = restante;
    }

    ingresarGasto(nombre,valor,gastos){
        this.limpiarHtml();
        gastos.forEach(gasto => {
            const li = document.createElement('li');
            const cerrar = document.createElement('button');
            cerrar.textContent = 'X';
            cerrar.className = 'bg-red-500 text-white font-bold py-2 px-4 rounded-full';
            cerrar.onclick = () => {
                const index = gastos.indexOf(gasto);
                gastos.splice(index,1);
                this.actualizarRestante(gasto)
                this.ingresarGasto(nombre,valor,gastos)
            }
            listaGastos.classList.add('mt-2', 'mb-4')
            li.className = 'flex justify-between items-center py-2 px-4 bg-gray-200 mt-2';
            li.innerHTML = `
            <span class="font-bold">${nombre}</span>
            <span class="font-bold">${valor}</span>
            `   
            li.appendChild(cerrar)
            listaGastos.appendChild(li)
        })
    }

    limpiarHtml(){
        while(listaGastos.firstChild){
            listaGastos.removeChild(listaGastos.firstChild)
        }
    }

    actualizarRestante(restante) {
        const labelRestante = document.querySelector('#restante')
        labelRestante.textContent = restante;
        if(restante <= 0){
            this.generarAlerta('El presupuesto se ha agotado','error')
            this.gastosToggle(true);
        }
    }
}
const ui = new Ui();
let presupuesto;

// Funciones

function funcionesPorDefecto() {
    ui.gastosToggle(true);
}

function validarPresupuesto(e){
    e.preventDefault();
    const valorIngresado = e.target.previousElementSibling.value;
    
    if(valorIngresado === '' ||  isNaN(valorIngresado)){
        ui.generarAlerta('Ingrese un presupuesto valido','error');
        return;
    }
    else if(valorIngresado <= 0){
        ui.generarAlerta('El presupuesto no puede ser 0 o menor', 'error')
        return;
    }
    else {
        ui.generarAlerta('El valor ha sido ingresado')
        ui.establecerPresupuesto(valorIngresado);
        ui.gastosToggle(false);
        ui.presupuestoToggle(true);
    }

    presupuesto = new Presupuesto(valorIngresado);
    let {restante} = presupuesto
    ui.establecerPresupuesto(restante);
}

function validarGasto(e){
    const valorNombre = campoNombre.value;
    const valorGasto = campoGasto.value;


    if(valorNombre === '' || valorGasto === ''){
        ui.generarAlerta('Ingrese un nombre y un gasto','error')
        return;
    }
    if(valorGasto <= 0 || isNaN(valorGasto)){
        ui.generarAlerta('Ingrese un gasto valido','error')
        return;
    }
    else {
        presupuesto.actualizarRestante(valorGasto)
        let {gastos,restante} = presupuesto;
        ui.actualizarRestante(restante)
        ui.generarAlerta('El gasto ha sido ingresado')
        ui.ingresarGasto(valorNombre,valorGasto,gastos)
    }
}

