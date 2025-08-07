using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Vehicle
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(20)]
        public string LicensePlate { get; set; } = string.Empty;

        public VehicleStatus Status { get; set; } = VehicleStatus.Active;

        [Required]
        public VehicleType Type { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum VehicleStatus
    {
        Active,
        Maintenance,
        Retired
    }

    public enum VehicleType
    {
        Truck,
        Van,
        Trailer
    }
}
