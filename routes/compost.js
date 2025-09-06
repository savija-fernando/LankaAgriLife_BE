const router = require("express").Router();
const Compost = require("../models/Compost");

// Add compost
router.route("/add").post((req, res) => {
    const { compost_id, quantity, fermentingDate, employee_id, waste_id, inventory_id, compostStatus } = req.body;

    const newCompost = new Compost({
        compost_id,
        quantity: Number(quantity),
        fermentingDate: new Date(fermentingDate),
        employee_id,
        waste_id,
        inventory_id,
        compostStatus
    });

    newCompost.save()
        .then(() => res.json("Compost item added!"))
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Error: " + error.message });
        });
});

// Get all compost records
router.route("/").get((req, res) => {
    Compost.find()
        .then((compost) => res.json(compost))
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});

// Update compost by ID
router.route("/update/:id").put(async (req, res) => {
    const compostId = req.params.id;
    const { compost_id, quantity, fermentingDate, employee_id, waste_id, inventory_id } = req.body;

    const updateCompost = {
        compost_id,
        quantity,
        fermentingDate: new Date(fermentingDate),
        employee_id,
        waste_id,
        inventory_id
    };

    await Compost.findByIdAndUpdate(compostId, updateCompost, { new: true })
        .then((updated) => {
            res.status(200).send({ status: "Compost updated", compost: updated });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ status: "Error with updating data", error: err.message });
        });
});

// Delete compost by ID
router.route("/delete/:id").delete(async (req, res) => {
    const compostId = req.params.id;

    await Compost.findByIdAndDelete(compostId)
        .then(() => res.status(200).send({ status: "Compost deleted" }))
        .catch((err) => {
            console.error(err);
            res.status(500).send({ status: "Error with delete compost", error: err.message });
        });
});

module.exports = router;
