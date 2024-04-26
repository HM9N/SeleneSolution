using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SeleneSolution.Server.Models;
using SeleneSolution.Server.Models.DTO;

namespace SeleneSolution.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly SelenedbContext _context;
        public SessionController(SelenedbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] Dtosesion request)
        {
            Usuarios usuario = new Usuarios();
            try
            {
                usuario = _context.Usuarios.Include(u => u.IdRolNavigation).Where(u => u.Correo == request.Correo && u.Clave == request.Clave).FirstOrDefault();

                if(usuario == null)
                    usuario = new Usuarios();

                return StatusCode(StatusCodes.Status200OK, usuario);
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError, usuario);
            }
        }
    }
}
