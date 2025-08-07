using System.Text.Json.Serialization;
using backend.Models;

namespace backend.Dtos
{
    public class VehicleCreateDto
    {
        public string LicensePlate { get; set; } = string.Empty;
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public VehicleType Type { get; set; }
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public VehicleStatus Status { get; set; } = VehicleStatus.Active;
    }

    public class VehicleUpdateDto
    {
        public string LicensePlate { get; set; } = string.Empty;
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public VehicleType Type { get; set; }
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public VehicleStatus Status { get; set; }
    }

    public class VehicleReadDto
    {
        public Guid Id { get; set; }
        public string LicensePlate { get; set; } = string.Empty;
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public VehicleType Type { get; set; }
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public VehicleStatus Status { get; set; }
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
