// Varriables y selectores
const formulario = document.querySelector('#agregar-gasto')
const gastoListado  = document.querySelector('#gastos ul')

// Eventos
function eventListeners(){
    document.addEventListener('DOMContentLoaded', PreguntarPresupuesto)
    formulario.addEventListener('submit', AgregarGasto)
}

eventListeners()


// Classes
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0 )
        this.restante = this.presupuesto - gastado
      
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id)   
        this.calcularRestante()
    }
}


class UI {
    insertarPresupuesto(cantidad){
        const {presupuesto, restante} = cantidad
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante
    }

    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div')
        divMensaje.classList.add('text-center','alert')


        switch (tipo){
            case 'correcto':
                divMensaje.classList.add('alert-success')
                break
            case 'error':
                divMensaje.classList.add('alert-danger')
                break
            case 'warning':
                divMensaje.classList.add('alert-warning')
                break
        }

        divMensaje.textContent = mensaje

        document.querySelector('.primario').insertBefore(divMensaje, formulario)

        setTimeout(()=>{
            divMensaje.remove()
        },3000)
    }

    mostrarGastos(gastos){

        this.limpiarHtml()

        // iterar gastos
        gastos.forEach(gasto => {
            const {cantidad, nombre, id} = gasto
            // crear LI
            const nuevoGasto = document.createElement('li')
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'
            nuevoGasto.dataset.id = id
            // Agregar HTML
            nuevoGasto.innerHTML = `${nombre} <span class='badge badge-primary badge-pill'>${cantidad} €</span>`

            //Borrar gasto
            const btnBorrar = document.createElement('button')
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
            btnBorrar.innerHTML = 'Borrar &times'
            btnBorrar.onclick = () => {
                EliminarGasto(id)
            }

            nuevoGasto.appendChild(btnBorrar)

            gastoListado.appendChild(nuevoGasto)
        })
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj

        const restanteDiv = document.querySelector('.restante')

        // Comprobar 25%, gatado el > 75%
        if ( (presupuesto / 4) > restante ){
            restanteDiv.classList.remove('alert-success', 'alert-warning')
            restanteDiv.classList.add('alert-danger')
        }else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning')
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning')
            restanteDiv.classList.add('alert-success')
        }

        if (restante <= 0 ){
            formulario.querySelector('button[type="submit"]').disabled = true
        }
    }

    limpiarHtml(){
        while (gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }
}




// Funciones
function PreguntarPresupuesto(){
    const presupuestoUsuario = prompt('Cual es tu presupuesto?')

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        // window.location.reload()
         PreguntarPresupuesto()
    }

    // Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario)

    ui.insertarPresupuesto(presupuesto)
}


function AgregarGasto(e){
    e.preventDefault();

    // leer datos formulario
    const nombre = document.querySelector('#gasto').value
    const cantidad = Number(document.querySelector('#cantidad').value)

    if(nombre ==='' || cantidad === ''){
        ui.imprimirAlerta ('Ambos campos son obligatorios.', 'warning')
        return
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta ('Cantidad no válida.', 'error')
        return
    }

    // Generar objeto con el gasto
    const gasto = {nombre, cantidad, id: Date.now()}    

    presupuesto.nuevoGasto(gasto)

    ui.imprimirAlerta('Gasto agregado correctamente.','correcto')

    ui.mostrarGastos(presupuesto.gastos)
    ui.actualizarRestante(presupuesto.restante)
    ui.comprobarPresupuesto(presupuesto)

    formulario.reset()
}

function EliminarGasto(id){
    // console.log('eliminar ', id)
    presupuesto.eliminarGasto(id)
    ui.mostrarGastos(presupuesto.gastos)
    ui.actualizarRestante(presupuesto.restante)
    ui.comprobarPresupuesto(presupuesto)
}


// Instancias
const ui = new UI()
let presupuesto
