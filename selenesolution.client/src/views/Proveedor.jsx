/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import DatePicker from "react-datepicker";
import { Card, CardBody, CardHeader, Button, Modal, ModalHeader, ModalBody, Label, Input, FormGroup, ModalFooter, Row, Col } from "reactstrap"
import Swal from 'sweetalert2'


const modeloProveedor = {
    nit:"",
    nombre :"",
    ciudad : "",
    telefono: "",
    correo: "",
    celular: ""
}


const Proveedor = () => {

    const [proveedor, setProveedor] = useState(modeloProveedor);
    const [proveedores, setProveedores] = useState([]);
    const [pendiente, setPendiente] = useState(true);


    const handleChange = (e) => {

        console.log(e.target.value)

        let value;

        value = e.target.value;

        setProveedor({
            ...proveedor,
            [e.target.name]: value
        })
    }


    const obtenerProveedores = async () => {
        let response = await fetch("api/proveedor/Listar");

        if (response.ok) {
            let data = await response.json()
            setProveedores(data.$values)
            setPendiente(false)
        }
    }

    useEffect(() => {
        obtenerProveedores();
    }, [])


    const columns = [
        {
            name: 'NIT',
            selector: row => row.nit,
            sortable: true,
        },
        {
            name: 'Nombre',
            selector: row => row.nombre,
            sortable: true,
        },
        {
            name: 'Ciudad',
            selector: row => row.ciudad,
            sortable: true,
        },
        {
            name: 'Telefono',
            selector: row => row.telefono,
            sortable: true,
        },

        {
            name: 'Correo',
            selector: row => row.correo,
            sortable: true,
        },
        {
            name: 'Celular',
            selector: row => row.celular,
            sortable: true,
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


    return (
        <>
            <Card>
                <CardHeader style={{ backgroundColor: '#4e73df', color: "white" }}>
                    Proveedores
                </CardHeader>
                <CardBody>
                    <hr></hr>
                    <DataTable
                        columns={columns}
                        data={proveedores}
                        progressPending={pendiente}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        customStyles={ customStyles}
                    />
                </CardBody>
            </Card>

           
        </>
    )
}

export default Proveedor;