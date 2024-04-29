using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Globalization;
using System.Xml.Linq;
using SeleneSolution.Server.Models;
using SeleneSolution.Server.Models.DTO;

namespace SeleneSolution.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VentaController : ControllerBase
    {
        private readonly SelenedbContext _context;
        public VentaController(SelenedbContext context)
        {
            _context = context;

        }

        [HttpGet]
        [Route("Productos/{busqueda}")]
        public async Task<IActionResult> Productos(string busqueda)
        {
            List<DtoProducto> lista = new List<DtoProducto>();
            try
            {
                lista = await _context.Productos
                .Where(p => string.Concat(p.Codigo.ToLower(), p.Codigo.ToLower(), p.Nombre.ToLower()).Contains(busqueda.ToLower()))
                .Select(p => new DtoProducto()
                {
                    IdProducto = p.IdProducto,
                    Codigo = p.Codigo,
                    Nombre = p.Nombre,
                    Valor = (decimal)p.Valor,
                    NitProveedor = (int)p.NitProveedor
                }).ToListAsync();


                return StatusCode(StatusCodes.Status200OK, lista);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, lista);
            }
        }

        [HttpPost]
        [Route("Registrar")]
        public IActionResult Registrar([FromBody] DtoVenta request)
        {
            try
            {
                XElement productos = new XElement("Productos");
                foreach (DtoProducto item in request.ListaProductos)
                {
                    productos.Add(new XElement("Item",
                        new XElement("IdProducto", item.IdProducto),
                        new XElement("Codigo", item.Codigo),
                        new XElement("Cantidad", item.Cantidad),
                        new XElement("Precio", item.Valor),
                        new XElement("Total", item.Total)
                        ));
                }

                using (SqlConnection con = new SqlConnection(_context.Database.GetConnectionString()))
                {
                    con.Open();
                    SqlCommand cmd = new SqlCommand("sp_RegistrarVenta", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("documentoCliente", SqlDbType.VarChar, 40).Value = request.DocumentoCliente;
                    cmd.Parameters.Add("nombreCliente", SqlDbType.VarChar, 40).Value = request.NombreCliente;
                    cmd.Parameters.Add("idUsuario", SqlDbType.Int).Value = request.IdUsuario;
                    cmd.Parameters.Add("subTotal", SqlDbType.Decimal).Value = request.SubTotal;
                    cmd.Parameters.Add("impuestoTotal", SqlDbType.Decimal).Value = request.Impuesto;
                    cmd.Parameters.Add("total", SqlDbType.Decimal).Value = request.Total;
                    cmd.Parameters.Add("productos", SqlDbType.Xml).Value = productos.ToString();
                    cmd.ExecuteNonQuery();
                }

                return StatusCode(StatusCodes.Status200OK, new { msj = "Creado Correctamente" });
            }
            catch (Exception ex)
            {
                var str = ex.Message;
                Console.WriteLine(str);
                return StatusCode(StatusCodes.Status500InternalServerError, new { msj = "str" });
            }

        }

        [HttpGet]
        [Route("Listar")]
        public async Task<IActionResult> Listar()
        {
            string buscarPor = HttpContext.Request.Query["buscarPor"];
            string numeroVenta = HttpContext.Request.Query["numeroVenta"];
            string fechaInicio = HttpContext.Request.Query["fechaInicio"];
            string fechaFin = HttpContext.Request.Query["fechaFin"];

            int numeroVentaInt = 0;

            if (!string.IsNullOrEmpty(numeroVenta))
            {
                int.TryParse(numeroVenta, out numeroVentaInt);
            }

            DateTime _fechainicio = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", CultureInfo.CreateSpecificCulture("es-PE"));
            DateTime _fechafin = DateTime.ParseExact(fechaFin, "dd/MM/yyyy", CultureInfo.CreateSpecificCulture("es-PE"));

            List<DtoHistorialVenta> lista_venta = new List<DtoHistorialVenta>();
            try
            {
                if (buscarPor == "fecha")
                {
                    lista_venta = await _context.Ventas
                        .Include(u => u.IdUsuarioNavigation)
                        .Include(d => d.DetalleVentas)
                        .ThenInclude(p => p.IdProductoNavigation)
                        .Where(v => v.FechaRegistro.Value.Date >= _fechainicio.Date && v.FechaRegistro.Value.Date <= _fechafin.Date)
                        .Select(v => new DtoHistorialVenta()
                        {
                            IdVenta = v.IdVenta,
                            FechaRegistro = v.FechaRegistro.Value.ToString("dd/MM/yyyy"),
                            DocumentoCliente = v.DocumentoCliente,
                            NombreCliente = v.NombreCliente,
                            UsuarioRegistro = v.IdUsuarioNavigation.Nombre,
                            SubTotal = v.SubTotal.ToString(),
                            Impuesto = v.ImpuestoTotal.ToString(),
                            Total = v.Total.ToString(),
                            Detalle = v.DetalleVentas.Select(d => new DtoDetalleVenta()
                            {
                                Producto = d.IdProductoNavigation.Nombre,
                                Cantidad = d.Cantidad.ToString(),
                                Precio = d.Precio.ToString(),
                                Total = d.Total.ToString()
                            }).ToList()
                        })
                        .ToListAsync();
                }
                else
                {
                    lista_venta = await _context.Ventas
                        .Include(u => u.IdUsuarioNavigation)
                        .Include(d => d.DetalleVentas)
                        .ThenInclude(p => p.IdProductoNavigation)
                        .Where(v => v.IdVenta == numeroVentaInt)
                        .Select(v => new DtoHistorialVenta()
                        {
                            IdVenta = v.IdVenta,
                            FechaRegistro = v.FechaRegistro.Value.ToString("dd/MM/yyyy"),
                            DocumentoCliente = v.DocumentoCliente,
                            NombreCliente = v.NombreCliente,
                            UsuarioRegistro = v.IdUsuarioNavigation.Nombre,
                            SubTotal = v.SubTotal.ToString(),
                            Impuesto = v.ImpuestoTotal.ToString(),
                            Total = v.Total.ToString(),
                            Detalle = v.DetalleVentas.Select(d => new DtoDetalleVenta()
                            {
                                Producto = d.IdProductoNavigation.Nombre,
                                Cantidad = d.Cantidad.ToString(),
                                Precio = d.Precio.ToString(),
                                Total = d.Total.ToString()
                            }).ToList()
                        })
                        .ToListAsync();
                }


                return StatusCode(StatusCodes.Status200OK, lista_venta);
            }
            catch (Exception ex)
            {
                var str = ex.Message;
                return StatusCode(StatusCodes.Status500InternalServerError, lista_venta);
            }


        }

    }
}
