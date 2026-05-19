using Microsoft.AspNetCore.Mvc;
using PharmacyApp.Services;

namespace PharmacyApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly JsonDataService _data;

    public SalesController(JsonDataService data) => _data = data;

    // GET /api/sales
    [HttpGet]
    public IActionResult GetAll() => Ok(_data.GetSales());

    // POST /api/sales
    // Body: { "medicineId": "...", "quantity": 5 }
    [HttpPost]
    public IActionResult RecordSale([FromBody] SaleRequest req)
    {
        if (req.Quantity <= 0)
            return BadRequest(new { error = "Quantity must be greater than zero." });

        var sale = _data.AddSale(req.MedicineId, req.Quantity);

        if (sale is null)
            return BadRequest(new { error = "Insufficient stock or medicine not found." });

        return Ok(sale);
    }
}

public record SaleRequest(Guid MedicineId, int Quantity);