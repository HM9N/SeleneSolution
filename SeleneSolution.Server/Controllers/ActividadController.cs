using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SeleneSolution.Server.Models;
using SeleneSolution.Server.Models.DTO;
using System.Data;
using System.Globalization;

namespace SeleneSolution.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActividadController : ControllerBase
    {
        private readonly SelenedbContext _context;

        public ActividadController(SelenedbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("Listar")]
        public async Task<IActionResult> Listar()
        {

            string fechaInicio = HttpContext.Request.Query["fechaInicio"];
            string fechaFin = HttpContext.Request.Query["fechaFin"];

            DateTime _fechaInicio = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", CultureInfo.CreateSpecificCulture("es-CO"));
            DateTime _fechaFin = DateTime.ParseExact(fechaFin, "dd/MM/yyyy", CultureInfo.CreateSpecificCulture("es-CO"));

            List<DtoMejorVendedor> listaVendedores = new List<DtoMejorVendedor>();
            try
            {
                using (SqlConnection con = new SqlConnection(_context.Database.GetConnectionString()))
                {
                    await con.OpenAsync();

                    SqlCommand cmd = new SqlCommand("ObtenerMejoresVendedoresPorVentas", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@fechaInicio", _fechaInicio);
                    cmd.Parameters.AddWithValue("@fechaFin", _fechaFin);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            string nombreVendedor = reader["NombreVendedor"].ToString();
                            decimal totalVentas = Convert.ToDecimal(reader["TotalVentas"]);

                            listaVendedores.Add(new DtoMejorVendedor { Nombre = nombreVendedor, Total = totalVentas });
                        }
                    }
                }

             if(listaVendedores.Count() > 0)
                {
                    return StatusCode(StatusCodes.Status200OK, listaVendedores);
                }
                else
                {
                    return StatusCode(StatusCodes.Status204NoContent, "No se encontraron vendedores");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        [HttpGet]
        [Route("ListarProductos")]
        public async Task<IActionResult> ListarProductos()
        {

            string fechaInicio = HttpContext.Request.Query["fechaInicio"];
            string fechaFin = HttpContext.Request.Query["fechaFin"];

            DateTime _fechaInicio = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", CultureInfo.CreateSpecificCulture("es-CO"));
            DateTime _fechaFin = DateTime.ParseExact(fechaFin, "dd/MM/yyyy", CultureInfo.CreateSpecificCulture("es-CO"));

            List<DtoProductosVendidos> listaProductos = new List<DtoProductosVendidos>();
            try
            {
                using (SqlConnection con = new SqlConnection(_context.Database.GetConnectionString()))
                {
                    await con.OpenAsync();

                    SqlCommand cmd = new SqlCommand("ListarProductosMasVendidos", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@fechaInicio", _fechaInicio);
                    cmd.Parameters.AddWithValue("@fechaFin", _fechaFin);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            string nombreProducto = reader["NombreProducto"].ToString();
                            string codigoProducto = reader["CodigoProducto"].ToString();
                            int cantidadVendida = Convert.ToInt32(reader["CantidadVendida"]);

                            listaProductos.Add(new DtoProductosVendidos { NombreProducto = nombreProducto, CodigoProducto = codigoProducto, CantidadVendida = cantidadVendida });
                        }
                    }
                }

                if (listaProductos.Count() > 0)
                {
                    return StatusCode(StatusCodes.Status200OK, listaProductos);
                }
                else
                {
                    return StatusCode(StatusCodes.Status204NoContent, "No se encontraron productos");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }
    }
}
