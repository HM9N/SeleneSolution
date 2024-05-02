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
    public class ProductoController : ControllerBase
    {
        private readonly SelenedbContext _context;
        public ProductoController(SelenedbContext context)
        {
            _context = context;

        }
        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Lista()
        {
            List<Productos> lista = new List<Productos>();
            try
            {
                //lista = await _context.Productos.OrderByDescending(p => p.Codigo).ToListAsync();

                lista = await _context.Productos
                    .OrderByDescending(p => p.Codigo)
                    .ToListAsync();


                return StatusCode(StatusCodes.Status200OK, lista);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, lista);
            }
        }

        [HttpPost]
        [Route("Guardar")]
        public async Task<IActionResult> Guardar([FromBody] Productos request)
        {
            try
            {
                // Verificar si existe algún otro producto con el mismo código
                var existingProduct = await _context.Productos.FirstOrDefaultAsync(p => p.Codigo == request.Codigo);

                if (existingProduct != null)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "El código de producto ya está en uso.");
                }

                // Si el código no existe, guardar el nuevo producto
                await _context.Productos.AddAsync(request);
                await _context.SaveChangesAsync();

                return StatusCode(StatusCodes.Status200OK, "Producto guardado correctamente.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] Productos request)
        {
            try
            {
                // Verificar si existe algún otro producto con el mismo código
                var existingProduct = await _context.Productos.FirstOrDefaultAsync(p => p.Codigo == request.Codigo && p.IdProducto != request.IdProducto);

                if (existingProduct != null)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "El código de producto ya está en uso.");
                }

                _context.Productos.Update(request);
                await _context.SaveChangesAsync();

                return StatusCode(StatusCodes.Status200OK, "Producto editado exitosamente.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            try
            {
                Productos usuario = _context.Productos.Find(id);
                _context.Productos.Remove(usuario);
                await _context.SaveChangesAsync();
                return StatusCode(StatusCodes.Status200OK, "ok");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [Route("ListaProductosProveedores")]
        public async Task<IActionResult> ListarProductosProveedores()
        {

            string fechaInicio = HttpContext.Request.Query["fechaInicio"];
            string fechaFin = HttpContext.Request.Query["fechaFin"];

            DateTime _fechaInicio = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", CultureInfo.CreateSpecificCulture("es-CO"));
            DateTime _fechaFin = DateTime.ParseExact(fechaFin, "dd/MM/yyyy", CultureInfo.CreateSpecificCulture("es-CO"));

            List<DtoProductosProveedores> listaProductosProveedores = new List<DtoProductosProveedores>();
            try
            {
                using (SqlConnection con = new SqlConnection(_context.Database.GetConnectionString()))
                {
                    await con.OpenAsync();

                    SqlCommand cmd = new SqlCommand("ProductosYProveedores", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@fechaInicio", _fechaInicio);
                    cmd.Parameters.AddWithValue("@fechaFin", _fechaFin);

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            string codigoProducto = reader["CodigoProducto"].ToString();
                            string nombreProducto = reader["NombreProducto"].ToString();
                            decimal valorProducto = Convert.ToDecimal(reader["ValorProducto"]);
                            string nombreProveedor = reader["NombreProveedor"].ToString();
                            string correoProveedor = reader["CorreoProveedor"].ToString();
                            string celular = reader["CelularProveedor"].ToString();

                            listaProductosProveedores.Add(new DtoProductosProveedores
                            { NombreProducto = nombreProducto, 
                                CodigoProducto = codigoProducto,
                            ProductoValor= valorProducto,
                            NombreProveedor= nombreProveedor,
                            CorreoProveedor= correoProveedor,
                            CelularProveedor= celular}
                                  );
                        }
                    }
                }

                if (listaProductosProveedores.Count() > 0)
                {
                    return StatusCode(StatusCodes.Status200OK, listaProductosProveedores);
                }
                else
                {
                    return StatusCode(StatusCodes.Status204NoContent, "No se encontraron datos");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }


    }
}
