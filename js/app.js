const ingresarPresupuesto =  document.querySelector('#ingresoPresupuesto');
const formulario1 =  document.querySelector('#formulario1');

eventListeners();
function eventListeners() {
    ingresarPresupuesto.addEventListener('click', validarPresupuesto)
}

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = presupuesto;
        this.restante = presupuesto;
        this.gastos = [];
    }

}

class Ui {
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

    establecerPresupuesto(dinero){
        const campoRestantes = document.querySelector('#restantes');
        const campoPresupuesto = document.querySelector('#presupuesto')
        const campoRestante = document.querySelector('#restante')


        campoPresupuesto.textContent = dinero;
        campoRestante.textContent = dinero;
    }
    
}
const ui = new Ui();
let presupuesto;

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
        e.target.disabled = true;
        e.target.className = 'py-2 px-4 rounded text-violet-200 bg-violet-950'
    }

    presupuesto = new Presupuesto(valorIngresado);
    let {restante} = presupuesto
    
    ui.establecerPresupuesto(restante);
}