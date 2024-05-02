const convertirAMoneda = (valor) =>{
    const formattedAmount = parseInt(valor).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    return formattedAmount
}

export default convertirAMoneda;