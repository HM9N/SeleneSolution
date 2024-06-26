/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Button } from "reactstrap"
import convertirAMoneda from '../../public/js/tools'

function TablaProductosVentas(props) {
  const { productos } = props

  const onActionButtonClickHandler = (action, row) =>{
     props.onActionButtonClick(action, row)
  }

  useEffect(() => {
    console.log(productos)
  }, [])

  return (
    <div className="">
      {productos.map((d, i) => (
        <div className="border rounded d-flex flex-wrap w-100 my-2 border-primary" key={i}>
          <div className="border col-6">
            <div className="font-weight-bold">Nombre</div>
            <div>{d.nombre}</div>
          </div>
          <div className="border col-6">
            <div className="font-weight-bold">Cantidad</div>
            <div>{d.cantidad}</div>
          </div>
          <div className="w-100 d-flex flex-wrap">
            <div className="border col-6">
              <div className="font-weight-bold">Valor</div>
              <div>{convertirAMoneda(d.valor)}</div>
            </div>
            <div className="border col-6">
              <div className="font-weight-bold">Total</div>
              <div>{convertirAMoneda(d.total)}</div>
            </div>
          </div>
          <div className="border col-12 d-flex justify-content-center pt-2 py-2">
            <Button color="danger" size="sm" onClick={() => onActionButtonClickHandler(d.codigo)}>
              <i className="fas fa-trash-alt"></i>
            </Button>
          </div>
        </div>
      ))}
    </div>
);

  
}

TablaProductosVentas.propTypes = {
  productos: PropTypes.array,
  progressPending: PropTypes.bool,
  onActionButtonClick: PropTypes.func
};

export default TablaProductosVentas;

// columns={columns}
// data={productos}
// progressPending={pendiente}
// pagination
// paginationComponentOptions={paginationComponentOptions}
// customStyles={customStyles}