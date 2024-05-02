/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Button} from "reactstrap"



function XSTable(props) {
  const { columns, data, progressPending, pagination, paginationComponentOptions, customStyles, suppliers } = props

  const handleRowClick = (rowData) => {
    // Lógica para manejar el clic en una fila, por ejemplo, notificar al componente padre
    if (props.onRowClick) {
      props.onRowClick(rowData);
    }
  };

  const onActionButtonClickHandler = (action, row) =>{
     props.onActionButtonClick(action, row)
  }

  const devolverNombre = (nit) => {
    // Buscar el proveedor cuyo valor coincida con el nit
    const proveedor = suppliers.find(supplier => supplier.value === nit.toString());

    const nombre = proveedor.label.split(' - ');

    return nombre[1];
  }

  const openModalHandler = (row) => {
    console.log("abrir modal")
  }

  const deleteProduct = (idProduct) => {
    console.log("Eliminar Producto")
  }

  useEffect(() => {
    console.log(columns, data)
  }, [])

  return (
    <div className="" >
      {data.map((d, i) =>
        <div className="w-100 border rounded d-flex flex-wrap w-100 my-2 border-primary" key={i}>
          <div className="border  col-4">
            <div className="font-weight-bold">Código</div>
            <div>{d.codigo}</div>
          </div>
          <div className="border  col-4 ">
            <div className="font-weight-bold">Nombre</div>
            <div>{d.nombre}</div>
          </div>
          <div className="border col-4 ">
            <div className="font-weight-bold">Valor</div>
            <div>{d.valor}</div>
          </div>
          <div className="border col-6">
            <div className="font-weight-bold">Fecha Creación</div>
            <div>{d.fechaCreacion}</div>
          </div>
          <div className="border col-6">
            <div className="font-weight-bold">Proveedor</div>
            <div>{devolverNombre(d.nitProveedor)}</div>
          </div>
          <div className="border col-12 d-flex justify-content-center pt-2 py-2">
            <Button color="primary" size="sm" className="mr-2"
              onClick={() => onActionButtonClickHandler("VIEW",d)}
            >
              <i className="fas fa-eye"></i>
            </Button>

            <Button color="primary" size="sm" className="mr-2"
              onClick={() => onActionButtonClickHandler("EDIT",d)}
            >
              <i className="fas fa-pen-alt"></i>
            </Button>

            <Button color="danger" size="sm"
              onClick={() => onActionButtonClickHandler("DELETE",d)}
            >
              <i className="fas fa-trash-alt"></i>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

XSTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  progressPending: PropTypes.bool,
  pagination: PropTypes.bool,
  paginationComponentOptions: PropTypes.object,
  customStyles: PropTypes.object,
  suppliers: PropTypes.array,
  onActionButtonClick: PropTypes.func
};

export default XSTable;

// columns={columns}
// data={productos}
// progressPending={pendiente}
// pagination
// paginationComponentOptions={paginationComponentOptions}
// customStyles={customStyles}