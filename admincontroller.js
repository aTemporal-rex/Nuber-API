const express = require('express');
const DriverModel = require('./driver');
const RiderModel = require('./rider');
const AdminModel = require('./admin');
const router = express.Router();
const locations = require('./locationData.json');
router.use(express.json());

const carColors = ["white", "black", "grey", "yellow", "red", "blue", "green", "brown", "pink", "orange", "purple"];
const carTypes = ["suv", "truck", "sedan", "van", "coupe", "wagon", "convertible", "sport","diesel", "crossover", "luxury", "hybrid"];

// GET ALL ADMINS
router.get('/', (req, res) => {
    AdminModel.find({}, (err, admins) => {
        if (err) return res.send(500);
        return res.send(admins);
    });
});

// ADD A NEW RIDER
router.post('/newRider', async (req, res) => {
    const {firstName, lastName, email} = req.body;

    const newRider = {
        firstName,
        lastName,
        email,
        location: null,
        destination: null,
        assignedDriver: null
    };

    await RiderModel.create(newRider, (err, rider) => {
        if (err) return res.send(500);
        return res.send(rider);
    });
});

// REMOVE RIDER WITH ID
router.delete('/removeRider/:riderId', async (req, res) => {

    await RiderModel.findById(req.params.riderId, (err, rider) => {
        if (err) return res.send(500);
        return rider;
    });

    try {
        await RiderModel.findByIdAndDelete(req.params.riderId);

        return res.json({ msg: `Rider with ID: ${req.params.riderId} has been deleted` });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send('A server error has occured...');
    }
});

// ADD A NEW DRIVER
router.post('/newDriver', async (req, res) => {
    const {firstName, lastName, email} = req.body;

    const newDriver = {
        firstName,
        lastName,
        email,
        available:true,
        location:null,
        wallet: 0,
        rating: 0,
        numberOfRatings: 0,
        carType: carTypes[Math.floor(Math.random() * carTypes.length)],
        carColor: carColors[Math.floor(Math.random() * carColors.length)],
        assignedRider: null
    };

    DriverModel.create(newDriver, (err, driver) => {
        if (err) return res.send(500);
        return res.send(driver);
    });
});

// REMOVE DRIVER WITH ID
router.delete('/removeDriver/:driverId', async (req, res) => {

    await DriverModel.findById(req.params.driverId, (err,driver) => {
        if (err) return res.send(500);
        return driver;
    });

    try {
        await DriverModel.findByIdAndDelete(req.params.driverId);

        return res.json({ msg: `Driver with ID: ${req.params.driverId} has been deleted` });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send('A server error has occured...');
    }
});

// ADD A NEW ADMIN
router.post('/newAdmin', async (req, res) => {
    const {firstName, lastName, email} = req.body;

    const newAdmin = {
        firstName,
        lastName,
        email
    };

    await AdminModel.create(newAdmin, (err, admin) => {
        if (err) return res.send(500);
        return res.send(admin);
    });
});

// REMOVE AN ADMIN
router.delete('/:adminId', async (req, res) => {

    await AdminModel.findById(req.params.adminId, (err, admin) => {
        if (err) return res.send(500);
        return admin;
    });

    try {
        await AdminModel.findByIdAndDelete(req.params.adminId);

        return res.json({ msg: `Admin with ID: ${req.params.adminId} has been deleted` });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send('A server error has occured...');
    }
});

module.exports = router;
