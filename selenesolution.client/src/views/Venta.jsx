﻿/* eslint-disable no-unused-vars */

import { Card, CardBody, CardHeader, Col, FormGroup, Input, InputGroup, InputGroupText, Label, Row, Table, Button } from "reactstrap";
import Swal from 'sweetalert2'
import Autosuggest from 'react-autosuggest';
import { useContext, useState } from "react";
import "./css/Venta.css"
import { UserContext } from "../context/UserProvider";

const modelo = {
    nombre: "",
    correo: "",
    idRolNavigation: {
        idRol: 0,
        descripcion: ""
    }
}

const Venta = () => {
    const { user } = useContext(UserContext)

    const [a_Productos, setA_Productos] = useState([])
    const [a_Busqueda, setA_Busqueda] = useState("")

    const [documentoCliente, setDocumentoCliente] = useState("")
    const [nombreCliente, setNombreCliente] = useState("")

    const [productos, setProductos] = useState([])
    const [total, setTotal] = useState(0)
    const [subTotal, setSubTotal] = useState(0)
    const [igv, setIgv] = useState(0)

    const reestablecer = () => {
        setDocumentoCliente("")
        setNombreCliente("")
        setProductos([])
        setTotal(0)
        setSubTotal(0)
        setIgv(0)
    }

    //para obtener la lista de sugerencias
    const onSuggestionsFetchRequested = ({ value }) => {
        const api = fetch("api/venta/Productos/" + value)
            .then((response) => {
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then((dataJson) => {
                setA_Productos(dataJson.$values)
            }).catch((error) => {
                console.log("No se pudo obtener datos, mayor detalle: ", error)
            })
        
    }

    //funcion que nos permite borrar las sugerencias
    const onSuggestionsClearRequested = () => {
        setA_Productos([])
    }

    //devuelve el texto que se mostrara en la caja de texto del autocomplete cuando seleccionas una sugerencia (item)
    const getSuggestionValue = (sugerencia) => {

        return sugerencia.codigo + " - " + sugerencia.nombre 
    }

    // Como se debe mostrar las sugerencias - código HTML
    const renderSuggestion = (sugerencia) => (
        <span>
            {`${sugerencia.codigo} - ${sugerencia.nombre}`}
        </span>
    )


    //evento cuando cambie el valor del texto de busqueda
    const onChange = (e, {newValue}) => {
        setA_Busqueda(newValue)
    }

    const inputProps = {
        placeholder : "Buscar producto",
        value: a_Busqueda,
        onChange
    }

    const sugerenciaSeleccionada = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
        console.log("hola")
        console.log(suggestion)
        Swal.fire({
            title: suggestion.codigo + " - " + suggestion.nombre,
            text:"Ingrese la cantidad",
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Volver',
            showLoaderOnConfirm: true,
            preConfirm: (inputValue) => {

                
                if (isNaN(parseFloat(inputValue))) {
                    setA_Busqueda("")
                    Swal.showValidationMessage(
                        "Debe ingresar un valor númerico"
                    )
                } else {

                    let producto = {
                        idProducto: suggestion.$id,
                        codigo: suggestion.codigo,
                        nombre: suggestion.nombre,
                        cantidad: parseInt(inputValue),
                        valor: suggestion.valor,
                        total: suggestion.valor * parseFloat(inputValue)
                    }
                    let arrayProductos = []
                    arrayProductos.push(...productos)
                    arrayProductos.push(producto)

                    setProductos((anterior) => [...anterior, producto])
                    calcularTotal(arrayProductos)
                }
                

            },
            allowOutsideClick: () => !Swal.isLoading()

        }).then((result) => {
            if (result.isConfirmed) {
                setA_Busqueda("")
            } else {
                setA_Busqueda("")
            }
        })
    }

    const eliminarProducto = (id) => {
        console.log(id)
        let listaproductos = productos.filter(p => p.codigo != id)

        setProductos(listaproductos)

        calcularTotal(listaproductos)
    }

    const calcularTotal = (arrayProductos) => {
        let total = 0;
        let subtotal = 0;
        let impuesto = 0;

        if (arrayProductos.length > 0) {
            // Calcular el total de la factura sumando los precios de los productos
            arrayProductos.forEach((producto) => {
                total += producto.total;
            });

            // Calcular el subtotal dividiendo el total entre 1 + la tasa de IVA (0.19)
            subtotal = total / (1 + 0.19);

            // Calcular el impuesto restando el subtotal del total
            impuesto = total - subtotal;
        }

        // Establecer los valores calculados
        setSubTotal(subtotal.toFixed(2));
        setIgv(impuesto.toFixed(2));
        setTotal(total.toFixed(2));
    }


    const terminarVenta = () => {

        if (productos.length < 1) {
            Swal.fire(
                'Opps!',
                'No existen productos',
                'error'
            )
            return
        }

        let venta = {
            documentoCliente: documentoCliente,
            nombreCliente: nombreCliente,
            idUsuario: JSON.parse(user).idUsuario,
            subTotal: parseFloat(subTotal),
            impuesto: parseFloat(igv),
            total:parseFloat(total),
            listaProductos: productos
        }


        const api = fetch("api/venta/Registrar", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(venta)
        })
            .then((response) => {
                return response.ok ? response.json() : Promise.reject(response);
            })
        .then((dataJson) => {
            reestablecer();
            var data = dataJson;
            Swal.fire(
                'Venta Creada!',
                'success'
            )

        }).catch((error) => {
            Swal.fire(
                'Opps!',
                'No se pudo crear la venta',
                'error'
            )
            console.log("No se pudo enviar la venta ", error)
        })

    }

    return (
        <Row>
            <Col sm={8}>

                <Row className="mb-2">
                    <Col sm={12}>
                        <Card>
                            <CardHeader style={{ backgroundColor: '#4e73df', color: "white" }}>
                                Cliente
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col sm={6}>
                                        <FormGroup>
                                            <Label>Nro Documento</Label>
                                            <Input bsSize="sm" value={documentoCliente} onChange={(e) => setDocumentoCliente(e.target.value)} type="number" />
                                        </FormGroup>
                                    </Col>
                                    <Col sm={6}>
                                        <FormGroup>
                                            <Label>Nombre</Label>
                                            <Input bsSize="sm" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)}/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardHeader style={{ backgroundColor: '#4e73df', color: "white" }}>
                                Productos
                            </CardHeader>
                            <CardBody>
                                <Row className="mb-2">
                                    <Col sm={12}>
                                        <FormGroup>
                                            <Autosuggest
                                                suggestions={a_Productos}
                                                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                                onSuggestionsClearRequested={onSuggestionsClearRequested}
                                                getSuggestionValue={getSuggestionValue}
                                                renderSuggestion={renderSuggestion}
                                                inputProps={inputProps}
                                                onSuggestionSelected={sugerenciaSeleccionada}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <Table striped size="sm">
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Producto</th>
                                                    <th>Cantidad</th>
                                                    <th>Precio</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    (productos.length < 1) ? (
                                                        <tr>
                                                            <td colSpan="5">Sin productos</td>
                                                        </tr>
                                                    ) :
                                                    (
                                                        productos.map((item) => (
                                                            <tr key={item.codigo}>
                                                                <td>
                                                                    <Button color="danger" size="sm"
                                                                        onClick={() => eliminarProducto(item.codigo)}
                                                                    >
                                                                        <i className="fas fa-trash-alt"></i>
                                                                    </Button>
                                                                </td>
                                                                <td>{item.nombre}</td>
                                                                <td>{item.cantidad}</td>
                                                                <td>{item.valor}</td>
                                                                <td>{item.total}</td>
                                                            </tr>
                                                        ))
                                                    )
                                                }
                                            </tbody>
                                        </Table>
                                    </Col>
                                    
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Col>

            <Col sm={4}>
                <Row className="mb-2">
                    <Col sm={12}>
                        <Card>
                            <CardHeader style={{ backgroundColor: '#4e73df', color: "white" }}>
                                Detalle
                            </CardHeader>
                            <CardBody>
                                <Row className="mb-2">
                                    <Col sm={12}>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col sm={12}>
                                        <InputGroup size="sm" >
                                            <InputGroupText>Sub Total:</InputGroupText>
                                            <Input disabled value={subTotal} />
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col sm={12}>
                                        <InputGroup size="sm" >
                                            <InputGroupText>IVA (19%):</InputGroupText>
                                            <Input disabled value={igv} />
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <InputGroup size="sm" >
                                            <InputGroupText>Total:</InputGroupText>
                                            <Input disabled value={total} />
                                        </InputGroup>
                                    </Col>
                                </Row>
                                
                                
                                
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <Button color="success" block onClick={terminarVenta} >
                                    <i className="fas fa-money-check"></i> Completar Venta</Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Venta;