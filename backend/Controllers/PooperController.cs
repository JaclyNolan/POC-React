using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PooperController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Pooper");
        }
    }
}
