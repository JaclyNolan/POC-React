using FluentValidation;
using backend.Dtos;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Validation
{
    public class VehicleCreateDtoValidator : AbstractValidator<VehicleCreateDto>
    {
        public VehicleCreateDtoValidator(DataContext context)
        {
            RuleFor(x => x.LicensePlate)
                .NotEmpty()
                .MaximumLength(20)
                .MustAsync(async (licensePlate, _) =>
                    !await context.Vehicles.AnyAsync(v => v.LicensePlate == licensePlate))
                .WithMessage("License plate must be unique");

            RuleFor(x => x.Type)
                .IsInEnum()
                .WithMessage("Invalid vehicle type");

            RuleFor(x => x.Status)
                .IsInEnum()
                .WithMessage("Invalid vehicle status");
        }
    }

    public class VehicleUpdateDtoValidator : AbstractValidator<VehicleUpdateDto>
    {
        public VehicleUpdateDtoValidator(DataContext context)
        {
            RuleFor(x => x.LicensePlate)
                .NotEmpty()
                .MaximumLength(20)
                .MustAsync(async (licensePlate, cancellation) =>
                    !await context.Vehicles
                        .AnyAsync(v => v.LicensePlate == licensePlate))
                .WithMessage("License plate must be unique");

            RuleFor(x => x.Type)
                .IsInEnum()
                .WithMessage("Invalid vehicle type");

            RuleFor(x => x.Status)
                .IsInEnum()
                .WithMessage("Invalid vehicle status");
        }
    }
}
