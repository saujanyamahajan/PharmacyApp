using Microsoft.AspNetCore.Mvc;
using PharmacyApp.Models;
using PharmacyApp.Services;

namespace PharmacyApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicinesController : ControllerBase
{
    private readonly JsonDataService _data;

    public MedicinesController(JsonDataService data) => _data = data;

    // GET /api/medicines?search=para
    [HttpGet]
    public IActionResult GetAll([FromQuery] string? search)
    {
        var medicines = _data.GetMedicines();

        if (!string.IsNullOrWhiteSpace(search))
            medicines = medicines
                .Where(m => m.FullName.Contains(search, StringComparison.OrdinalIgnoreCase))
                .ToList();

        return Ok(medicines);
    }

    // GET /api/medicines/{id}
    [HttpGet("{id:guid}")]
    public IActionResult GetById(Guid id)
    {
        var medicine = _data.GetMedicine(id);
        return medicine is null ? NotFound() : Ok(medicine);
    }

    // POST /api/medicines
    [HttpPost]
    public IActionResult Create([FromBody] Medicine medicine)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var created = _data.AddMedicine(medicine);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // DELETE /api/medicines/{id}
    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id)
    {
        var deleted = _data.DeleteMedicine(id);
        return deleted ? NoContent() : NotFound();
    }
}