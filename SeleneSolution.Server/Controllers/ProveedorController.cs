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
    public class ProveedorController : ControllerBase
    {
        private readonly SelenedbContext _context;

        public ProveedorController(SelenedbContext context)
        {
            _context = context;
        }


        [HttpGet]
        [Route("Listar")]
        public async Task<IActionResult> Listar()
        {

            List<Proveedores> lista = new List<Proveedores>();
            try
            {
                lista = await _context.Proveedores
                   .OrderByDescending(p => p.Nombre)
                   .ToListAsync();
                return StatusCode(StatusCodes.Status200OK, lista);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, lista);
            }

        }
    }
}
