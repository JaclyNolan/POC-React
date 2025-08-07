using AutoMapper;
using backend.Dtos;
using backend.Models;
using backend.Validation;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IValidator<VehicleCreateDto> _createValidator;
        private readonly IValidator<VehicleUpdateDto> _updateValidator;

        public VehiclesController(
            DataContext context, 
            IMapper mapper,
            IValidator<VehicleCreateDto> createValidator,
            IValidator<VehicleUpdateDto> updateValidator)
        {
            _context = context;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        // GET: api/vehicles
        [HttpGet]
        public async Task<ActionResult<object>> GetVehicles([FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            var query = _context.Vehicles.OrderByDescending(x => x.CreatedAt);
            var total = await query.CountAsync();
            var vehicles = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            return Ok(new { 
                vehicles = _mapper.Map<List<VehicleReadDto>>(vehicles), 
                total 
            });
        }

        // GET: api/vehicles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleReadDto>> GetVehicle(Guid id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
            {
                return NotFound(new { error = "Vehicle not found" });
            }
            return _mapper.Map<VehicleReadDto>(vehicle);
        }

        // POST: api/vehicles
        [HttpPost]
        public async Task<ActionResult<VehicleReadDto>> CreateVehicle(VehicleCreateDto dto)
        {
            // Check if license plate is already in use
            if (await _context.Vehicles.AnyAsync(v => v.LicensePlate == dto.LicensePlate))
            {
                return BadRequest(new { 
                    error = "Validation failed",
                    details = new[] {
                        new { field = "licensePlate", error = "License plate must be unique" }
                    }
                });
            }

            // Basic validation
            if (string.IsNullOrWhiteSpace(dto.LicensePlate) || dto.LicensePlate.Length > 20)
            {
                return BadRequest(new { 
                    error = "Validation failed",
                    details = new[] {
                        new { field = "licensePlate", error = "License plate is required and must not exceed 20 characters" }
                    }
                });
            }

            if (!Enum.IsDefined(typeof(VehicleType), dto.Type))
            {
                return BadRequest(new { 
                    error = "Validation failed",
                    details = new[] {
                        new { field = "type", error = "Invalid vehicle type" }
                    }
                });
            }

            if (!Enum.IsDefined(typeof(VehicleStatus), dto.Status))
            {
                return BadRequest(new { 
                    error = "Validation failed",
                    details = new[] {
                        new { field = "status", error = "Invalid vehicle status" }
                    }
                });
            }

            var vehicle = _mapper.Map<Vehicle>(dto);
            vehicle.Id = Guid.NewGuid();
            vehicle.CreatedAt = DateTime.UtcNow;
            vehicle.UpdatedAt = DateTime.UtcNow;
            
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetVehicle), 
                new { id = vehicle.Id }, 
                _mapper.Map<VehicleReadDto>(vehicle)
            );
        }

        // PUT: api/vehicles/5
        [HttpPut("{id}")]
        public async Task<ActionResult<VehicleReadDto>> UpdateVehicle(Guid id, VehicleUpdateDto dto)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
            {
                return NotFound(new { error = "Vehicle not found" });
            }

            // Check if license plate is already in use by another vehicle
            if (await _context.Vehicles.AnyAsync(v => v.LicensePlate == dto.LicensePlate && v.Id != id))
            {
                return BadRequest(new { 
                    error = "Validation failed",
                    details = new[] {
                        new { field = "licensePlate", error = "License plate must be unique" }
                    }
                });
            }

            // Basic validation
            if (string.IsNullOrWhiteSpace(dto.LicensePlate) || dto.LicensePlate.Length > 20)
            {
                return BadRequest(new { 
                    error = "Validation failed",
                    details = new[] {
                        new { field = "licensePlate", error = "License plate is required and must not exceed 20 characters" }
                    }
                });
            }

            if (!Enum.IsDefined(typeof(VehicleType), dto.Type))
            {
                return BadRequest(new { 
                    error = "Validation failed",
                    details = new[] {
                        new { field = "type", error = "Invalid vehicle type" }
                    }
                });
            }

            if (!Enum.IsDefined(typeof(VehicleStatus), dto.Status))
            {
                return BadRequest(new { 
                    error = "Validation failed",
                    details = new[] {
                        new { field = "status", error = "Invalid vehicle status" }
                    }
                });
            }

            _mapper.Map(dto, vehicle);
            vehicle.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Vehicles.AnyAsync(e => e.Id == id))
                {
                    return NotFound(new { error = "Vehicle not found" });
                }
                throw;
            }

            return Ok(_mapper.Map<VehicleReadDto>(vehicle));
        }

        // DELETE: api/vehicles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(Guid id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
            {
                return NotFound(new { error = "Vehicle not found" });
            }

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
