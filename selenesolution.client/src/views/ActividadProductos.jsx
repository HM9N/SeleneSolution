/* eslint-disable no-unused-vars */

import { Card, CardBody, CardHeader, Col, FormGroup, Input, InputGroup, InputGroupText, Label, Row, Table, Button,Modal,ModalHeader,ModalBody,ModalFooter } from "reactstrap";
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2'

import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";


const ActividadProductos = () => {
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [fechaFin, setFechaFin] = useState(new Date());

    const [productos,setProductos] = useState([])

    const buscarProductos = () => {
        let options = { year: 'numeric', month: '2-digit', day: '2-digit' };

        let _fechaInicio = fechaInicio.toLocaleDateString('es-CO', options)
        let _fechaFin = fechaFin.toLocaleDateString('es-CO', options)

        const api = fetch(`api/actividad/ListarProductos?fechaInicio=${_fechaInicio}&fechaFin=${_fechaFin}`)
            .then((response) => {
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then((dataJson) => {
                var data = dataJson.$values;
                if (data.length < 1) {
                    Swal.fire(
                        'Opps!',
                        'No se encontraron resultados',
                        'warning'
                    )
                }
                setProductos(data);
            }).catch((error) => {
                setProductos([]);
                Swal.fire(
                    'Opps!',
                    'No se pudo encontrar información',
                    'error'
                )
            })

    }

    const limpiarTabla = () => {
        setProductos([]);
    };

    
    return (
        <>
            <Row>
                <Col sm={12}>
                    <Card>
                        <CardHeader style={{ backgroundColor: '#4e73df', color: "white" }}>
                            Productos más vendidos
                        </CardHeader>
                        <CardBody>
                            <Row className="align-items-end">
                                {
                                        <>
                                            <Col sm={3}>
                                                <FormGroup>
                                                    <Label>Fecha Inicio:</Label>
                                                    <DatePicker
                                                        className="form-control form-control-sm"
                                                        selected={fechaInicio}
                                                        onChange={(date) => {
                                                           setFechaInicio(date);
                                                           limpiarTabla(); // Limpia la tabla al cambiar la fecha de inicio
                                                         }}
                                                        dateFormat='dd/MM/yyyy'
                                                    />
                                                </FormGroup>
                                            </Col>

                                            <Col sm={3}>
                                                <FormGroup>
                                                    <Label>Fecha Fin:</Label>
                                                    <DatePicker
                                                        className="form-control form-control-sm"
                                                        selected={fechaFin}
                                                        onChange={(date) => {
                                                            setFechaFin(date);
                                                            limpiarTabla(); // Limpia la tabla al cambiar la fecha de fin
                                                        }}
                                                        dateFormat='dd/MM/yyyy'
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </>
                                }
                                <Col sm={3}>
                                    <FormGroup>
                                        <Button color="success" size="sm" block onClick={buscarProductos}>
                                            <i className="fa fa-search" aria-hidden="true"></i> Buscar
                                        </Button>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <hr></hr>
                            <Row>
                                <Col sm="12">
                                    <Table striped responsive size="sm">
                                        <thead>
                                            <tr>
                                                <th>Codigo</th>
                                                <th>Nombre</th>
                                                <th>Ventas</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (productos.length < 1) ? (
                                                    <tr>
                                                        <td colSpan="7" style={{ textAlign: "center" }}>
                                                            Sin resultados
                                                        </td>
                                                    </tr>
                                                ) : (

                                                        productos.map((item) => (
                                                            <tr key={item.nombre}>
                                                            <td>{item.codigoProducto}</td>
                                                            <td>{item.nombreProducto}</td>
                                                            <td>{item.cantidadVendida}</td>
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
        </>
        


    )
}

export default ActividadProductos;