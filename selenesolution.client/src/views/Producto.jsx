/* eslint-disable no-debugger */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import DatePicker from "react-datepicker";
import { Card, CardBody, CardHeader, Button, Modal, ModalHeader, ModalBody, Label, Input, FormGroup, ModalFooter, Row, Col } from "reactstrap"
import Swal from 'sweetalert2';
import moment from 'moment';
import Select from 'react-select'
import convertirAMoneda from '../../public/js/tools'
import XSTable from "../componentes/XSTable";
import './css/Botones.css';


const modeloProducto = {
    codigo: "",
    nombre: "",
    fechaCreacion: new Date(),
    valor: 0,
    nitProveedor: 0,
    foto: ""
}


const Producto = () => {

    const [proveedores, setProveedores] = useState([]);
    const [producto, setProducto] = useState(modeloProducto);
    const [pendiente, setPendiente] = useState(true);
    const [productos, setProductos] = useState([]);
    const [verModal, setVerModal] = useState(false);
    const [verModalImagen, setVerModalImagen] = useState(false);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date()); // Estado para la fecha seleccionada

    const handleChange = (e) => {
        console.log(e.target.value)

        let value;

        if (e.target.name == "esActivo") {
            value = (e.target.value == "true" ? true : false)
        } else {
            value = e.target.value;
        }

        setProducto({
            ...producto,
            [e.target.name]: value
        })
    }

    const formatFecha = (date) => {
        return moment(date).format("YYYY-MM-DD")
    };

    const obtenerProductos = async () => {
        let response = await fetch("api/producto/Lista");

        await obtenerProveedores();

        if (response.ok) {
            let data = await response.json()
            setProductos(data.$values)
            console.log(data.$values)
            setPendiente(false)
        }
    }

    const obtenerProveedores = async () => {
        let response = await fetch("api/proveedor/Listar");

        if (response.ok) {
            let data = await response.json()
            setProveedores(data.$values)
        }
    }

    const [isScaled, setIsScaled] = useState(false);

    const handleMouseEnter = () => {
        setIsScaled(true);
    };

    const handleMouseLeave = () => {
        setIsScaled(false);
    };

    useEffect(() => {
        obtenerProductos();
    }, [])


    const suppliers = proveedores.map(supplier => ({
        label: `${supplier.nit} - ${supplier.nombre}`,
        value: `${supplier.nit}`
    }));

    const handleSelectChange = ({ value }) => {
        const selectedValue = parseInt(value)
        setProducto({
            ...producto,
            ["nitProveedor"]: selectedValue
        })
    }

    const devolverNombre = (nit) => {
        // Buscar el proveedor cuyo valor coincida con el nit
        const proveedor = suppliers.find(supplier => supplier.value === nit.toString());

        const nombre = proveedor.label.split(' - ');

        return nombre[1];
    }

    const columns = [
        {
            name: 'Codigo',
            selector: row => row.codigo,
            sortable: true,
        },
        {
            name: 'Nombre',
            selector: row => row.nombre,
            sortable: true,
        },
        {
            name: 'Valor',
            selector: row => convertirAMoneda(row.valor),
            sortable: true,
        },
        {
            name: 'Proveedor',
            selector: row => row.nitProveedor ? devolverNombre(row.nitProveedor) : "Proveedor no especificado",
            sortable: true,
        },
        {
            name: 'Fecha Creación',
            selector: row => row.fechaCreacion,
            sortable: true,
        },
        {
            name: '',
            cell: row => (
                <>
                    <Button color="primary" size="sm" className="mr-2"
                        onClick={() => abrirModalImagen(row)}
                    >
                        <i className="fas fa-eye"></i>
                    </Button>

                    <Button color="primary" size="sm" className="mr-2"
                        onClick={() => abrirEditarModal(row)}
                    >
                        <i className="fas fa-pen-alt"></i>
                    </Button>

                    <Button color="danger" size="sm"
                        onClick={() => eliminarProducto(row.idProducto)}
                    >
                        <i className="fas fa-trash-alt"></i>
                    </Button>
                </>
            ),
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                fontSize: '13px',
                fontWeight: 800,
            },
        },
        headRow: {
            style: {
                backgroundColor: "#eee",
            }
        }
    };

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };

    const abrirEditarModal = (data) => {
        setProducto(data);
        const partesFecha = data.fechaCreacion.split('-');
        const año = parseInt(partesFecha[0]);
        const mes = parseInt(partesFecha[1]) - 1; // Los meses en JavaScript van de 0 a 11
        const dia = parseInt(partesFecha[2]);
        const fecha = new Date(año, mes, dia);
        setFechaSeleccionada(fecha)
        setVerModal(!verModal);
    }

    const abrirModalImagen = (data) => {
        setProducto(data);
        setVerModalImagen(!verModalImagen);
    }

    const cerrarModalImagen = () => {
        setProducto(modeloProducto)
        setVerModalImagen(!verModalImagen);
    }

    const cerrarModal = () => {
        setProducto(modeloProducto)
        setVerModal(!verModal);
    }

    const dataChangeHandler = (date) => {
        setFechaSeleccionada(date)
    }

    const onActionButtonClickHandler = (action, row) => {
        if (action == "EDIT") {
            abrirEditarModal(row)
        } else if (action == "VIEW") {
            abrirModalImagen(row)
        } else if (action == "DELETE"){
            eliminarProducto(row.idProducto)
        }
    }

    // Función para buscar un proveedor por nit
    const buscarProveedorPorNit = (nit) => {
        // Buscar el proveedor cuyo valor coincida con el nit
        const proveedor = suppliers.find(supplier => supplier.value === nit.toString());

        return proveedor ? { label: proveedor.label, value: proveedor.value } : null;

    }

    const guardarCambios = async () => {
        const copyres = { ...producto }
        copyres.fechaCreacion = formatFecha(fechaSeleccionada)
        let response;
        if (producto.codigo == null) {
            response = await fetch("api/producto/Guardar", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(copyres)
            })

        } else {
            response = await fetch("api/producto/Editar", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(copyres)
            })
        }

        if (response.ok) {
            await obtenerProductos();
            setProducto(modeloProducto)
            setVerModal(!verModal);
            Swal.fire({
                title: "Completado",
                icon: "success"
            }

            );

        } else {
            const errorData = await response.text(); // Convertir el cuerpo de la respuesta en JSON
            console.log(errorData);
            Swal.fire(
                'Opps!',
                errorData, // Mostrar el mensaje de error recibido del backend
                'warning'
            );
        }

    }

    const eliminarProducto = async (id) => {

        Swal.fire({
            title: 'Esta seguro?',
            text: "Desea eliminar el producto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, continuar',
            cancelButtonText: 'No, volver'
        }).then((result) => {
            if (result.isConfirmed) {

                const response = fetch("api/producto/Eliminar/" + id, { method: "DELETE" })
                    .then(response => {
                        if (response.ok) {

                            obtenerProductos();

                            Swal.fire(
                                'Eliminado!',
                                'El producto fue eliminado.',
                                'success'
                            )
                        } else {
                            Swal.fire(
                                'Problema!',
                                'Ese producto está asociado a una factura. Revisa primero.',
                                'warning'
                            )
                        }
                    })
            }
        })
    }

    const defaultValue = { label: "indefinido", value: 0 };

    return (
        <>
            <div className="d-block d-sm-none">
                <XSTable columns={columns}
                    data={productos}
                    progressPending={pendiente}
                    pagination={true}
                    paginationComponentOptions={paginationComponentOptions}
                    customStyles={customStyles}
                    suppliers={suppliers}
                    onActionButtonClick={onActionButtonClickHandler}></XSTable>
            </div>
            {/* componente para pantallas sm en adelante */}
            <Card className='d-none d-sm-block'>
                <CardHeader style={{ backgroundColor: '#4e73df', color: "white" }}>
                    Lista de Productos
                </CardHeader>
                <CardBody>
                    <Button color="success" size="sm" onClick={() => setVerModal(!verModal)}>Nuevo Producto</Button>
                    <hr></hr>
                    <DataTable
                        columns={columns}
                        data={productos}
                        progressPending={pendiente}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        customStyles={customStyles}
                    />
                </CardBody>
            </Card>

            <Modal isOpen={verModalImagen}>
                <ModalBody>
                    <div className="w-100">
                        {/* Verificar si producto.foto es vacío o nulo */}
                        {producto.foto ? (
                            // Si producto.foto no está vacío o nulo, mostrar la imagen
                            <img className="w-100" src={producto.foto} alt="Producto" />
                        ) : (
                            // Si producto.foto es vacío o nulo, mostrar la imagen predeterminada
                            <img className="w-100" src="https://www.hostingplus.com.co/wp-content/uploads/2020/12/error404quees.jpg" alt="Error 404" />
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" color="danger" onClick={cerrarModalImagen}>Cerrar</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={verModal}>
                <ModalHeader>
                    Detalle Producto
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Codigo</Label>
                                <Input bsSize="sm" name="codigo" onChange={handleChange} value={producto.codigo} />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Nombre</Label>
                                <Input bsSize="sm" name="nombre" onChange={handleChange} value={producto.nombre} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Valor</Label>
                                <Input bsSize="sm" name="valor" onChange={handleChange} value={producto.valor} type="number" />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Foto</Label>
                                <Input bsSize="sm" name="foto" onChange={handleChange} value={producto.foto} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Fecha</Label>
                                <DatePicker
                                    className="form-control form-control-sm"
                                    name="fechaCreacion"
                                    selected={fechaSeleccionada}
                                    onChange={(date) => dataChangeHandler(date)}
                                    dateFormat='dd-MM-yyyy'
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Proveedor</Label>
                                <Select
                                    defaultValue={buscarProveedorPorNit(producto.nitProveedor) || defaultValue}
                                    options={suppliers}
                                    onChange={handleSelectChange}
                                />
                            </FormGroup>
                        </Col>
                    </Row>


                </ModalBody>
                <ModalFooter>
                    <Button size="sm" color="primary"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={guardarCambios}>Guardar</Button>
                    <Button size="sm" color="danger" onClick={cerrarModal}>Cerrar</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default Producto;