using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SeleneSolution.Server.Models;

namespace SeleneSolution.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolController : ControllerBase
    {
        private readonly SelenedbContext _context;
        public RolController(SelenedbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Lista() {
            List<Roles> lista = new List<Roles>();
            try {
                lista = await _context.Roles.ToListAsync();
                return StatusCode(StatusCodes.Status200OK, lista);
            }
            catch {
                return StatusCode(StatusCodes.Status500InternalServerError, lista);
            }
        }

    }
}
