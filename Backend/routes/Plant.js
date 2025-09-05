const router = require("express").Router();
let Plant = require("../models/plant");

// POST /Plant/add
router.post("/add", async (req, res) => {
  try {
    const {
      crop_id,
      plantingDate,
      type,
      location,
      harvestDate,
      waterIntake,
      fertilizerIntake,
      employee_id
    } = req.body;

    const newPlant = new Plant({
      crop_id,
      plantingDate: new Date(plantingDate),
      type,
      location,
      harvestDate: new Date(harvestDate),
      waterIntake,
      fertilizerIntake,
      employee_id
    });

    await newPlant.save();
    res.json({ message: "Plant is added!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error: " + error });
  }
});

// GET /Plant
router.get("/", async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// PUT /Plant/update/:id
router.put("/update/:id", async (req, res) => {
  const plantId = req.params.id;

  const { crop_id, plantingDate, type, location, harvestDate, waterIntake, fertilizerIntake, employee_id } = req.body;

  try {
    const update = await Plant.findOneAndUpdate(
      { crop_id: plantId },
      {
        crop_id,
        plantingDate,
        type,
        location,
        harvestDate,
        waterIntake,
        fertilizerIntake,
        employee_id
      },
      { new: true }
    );

    if (!update) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.status(200).json({ message: "Plant updated successfully", data: update });
  } catch (error) {
    res.status(500).json({ message: "Error updating plant", error: error.message });
  }
});

// DELETE /Plant/delete/:id
router.delete("/delete/:id", async (req, res) => {
  const plantId = req.params.id;

  try {
    const deletedItem = await Plant.findOneAndDelete({ crop_id: plantId });

    if (!deletedItem) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.status(200).json({ message: "Plant deleted successfully", data: deletedItem });
  } catch (error) {
    res.status(500).json({ message: "Error deleting plant", error: error.message });
  }
});

module.exports = router;
