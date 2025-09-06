const router = require("express").Router();
const Customer = require("../models/Customer");

// Add customer
router.route("/add").post((req, res) => {
    const { customer_id, firstName, lastName, phone, inventory_id } = req.body;

    const newCustomer = new Customer({
        customer_id,
        firstName,
        lastName,
        phone,
        inventory_id
    });

    newCustomer.save()
        .then(() => res.json("Customer details saved successfully"))
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Error: " + error.message });
        });
});

// Get all customers
router.route("/").get((req, res) => {
    Customer.find()
        .then((customers) => res.json(customers))
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});

// Update customer by ID
router.route("/update/:id").put(async (req, res) => {
    const customerId = req.params.id;
    const { customer_id, firstName, lastName, phone, inventory_id } = req.body;

    const updateCustomer = {
        firstName,
        lastName,
        phone,
        inventory_id
    };

    await Customer.findByIdAndUpdate(customerId, updateCustomer, { new: true })
        .then((updated) => {
            res.status(200).send({ status: "Customer details updated", customer: updated });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ status: "Error with updating data", error: err.message });
        });
});

// Delete customer by ID
router.route("/delete/:id").delete(async (req, res) => {
    const customerId = req.params.id;

    await Customer.findByIdAndDelete(customerId)
        .then(() => res.status(200).send({ status: "Customer deleted" }))
        .catch((err) => {
            console.error(err);
            res.status(500).send({ status: "Error with deleting customer", error: err.message });
        });
});

module.exports = router;
