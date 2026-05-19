using System.Text.Json;
using PharmacyApp.Models;

namespace PharmacyApp.Services;

public class JsonDataService
{
    private readonly string _medicinesPath;
    private readonly string _salesPath;

    private static readonly JsonSerializerOptions _options = new()
    {
        PropertyNameCaseInsensitive = true,
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public JsonDataService(IWebHostEnvironment env)
    {
        var dataDir = Path.Combine(env.ContentRootPath, "Data");
        _medicinesPath = Path.Combine(dataDir, "medicines.json");
        _salesPath = Path.Combine(dataDir, "sales.json");
    }

    // ── Medicines ──────────────────────────────────────────────

    public List<Medicine> GetMedicines()
    {
        var json = File.ReadAllText(_medicinesPath);
        return JsonSerializer.Deserialize<List<Medicine>>(json, _options) ?? [];
    }

    public Medicine? GetMedicine(Guid id) =>
        GetMedicines().FirstOrDefault(m => m.Id == id);

    public Medicine AddMedicine(Medicine medicine)
    {
        var list = GetMedicines();
        medicine.Id = Guid.NewGuid();
        list.Add(medicine);
        SaveMedicines(list);
        return medicine;
    }

    public bool UpdateMedicine(Medicine updated)
    {
        var list = GetMedicines();
        var idx = list.FindIndex(m => m.Id == updated.Id);
        if (idx < 0) return false;
        list[idx] = updated;
        SaveMedicines(list);
        return true;
    }

    public bool DeleteMedicine(Guid id)
    {
        var list = GetMedicines();
        var removed = list.RemoveAll(m => m.Id == id);
        if (removed == 0) return false;
        SaveMedicines(list);
        return true;
    }

    private void SaveMedicines(List<Medicine> list) =>
        File.WriteAllText(_medicinesPath, JsonSerializer.Serialize(list, _options));

    // ── Sales ──────────────────────────────────────────────────

    public List<SaleRecord> GetSales()
    {
        var json = File.ReadAllText(_salesPath);
        return JsonSerializer.Deserialize<List<SaleRecord>>(json, _options) ?? [];
    }

    public SaleRecord? AddSale(Guid medicineId, int quantity)
    {
        var medicine = GetMedicine(medicineId);
        if (medicine == null || medicine.Quantity < quantity) return null;

        // Deduct stock
        medicine.Quantity -= quantity;
        UpdateMedicine(medicine);

        // Record sale
        var sale = new SaleRecord
        {
            Id = Guid.NewGuid(),
            MedicineId = medicineId,
            MedicineName = medicine.FullName,
            QuantitySold = quantity,
            UnitPriceAtSale = medicine.Price,
            SaleDate = DateTime.UtcNow
        };

        var sales = GetSales();
        sales.Add(sale);
        File.WriteAllText(_salesPath, JsonSerializer.Serialize(sales, _options));
        return sale;
    }
}