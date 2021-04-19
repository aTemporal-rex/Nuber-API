const express = require('express');
const axios = require('axios');
const DriverModel = require('./driver');
const RiderModel = require('./rider');
const AdminModel = require('./admin');
const router = express.Router();
const locations = require('./locationData.json');
router.use(express.json());

// API key is added to get the random name data when initializing.
// const config = {
//     headers:{
//         'X-Api-Key': ''
//     }
// };

const carColors = ["white", "black", "grey", "yellow", "red", "blue", "green", "brown", "pink", "orange", "purple"];
const carTypes = ["suv", "truck", "sedan", "van", "coupe", "wagon", "convertible", "sport","diesel", "crossover", "luxury", "hybrid"];

const initDrivers = async () => {
    const drivers = [];
    const firstNames = await axios.get('https://randommer.io/api/Name?nameType=firstname&quantity=10', config);
    const lastNames = await axios.get('https://randommer.io/api/Name?nameType=surname&quantity=10', config);

    firstNames.data.forEach((firstName, index) => {

        const newDriver = {
            firstName: firstName,
            lastName: lastNames.data[index],
            email: firstName + lastNames.data[index] + "@gmail.com",
            available: true,
            location: locations[Math.floor(Math.random() * 50)].address,
            wallet: 0.00,
            rating: 0,
            numberOfRatings: 0,
            carType: carTypes[Math.floor(Math.random() * carTypes.length)],
            carColor: carColors[Math.floor(Math.random() * carColors.length)],
            assignedRider: null,
        }
        drivers.push(newDriver);

    });

    await DriverModel.create(drivers);
};

const initRiders = async () => {
    const riders = [];
    const firstNames = await axios.get('https://randommer.io/api/Name?nameType=firstname&quantity=50', config);
    const lastNames = await axios.get('https://randommer.io/api/Name?nameType=surname&quantity=50', config);

    firstNames.data.forEach((firstName, index) => {

        const newRider = {
            firstName: firstName,
            lastName: lastNames.data[index],
            email: firstName + lastNames.data[index] + "@gmail.com",
            location: locations[Math.floor(Math.random() * 50)].address,
            destination: "University of Texas at Austin",
            assignedDriver: null,

        }
        riders.push(newRider);

    });

    await RiderModel.create(riders);
};

const initAdmins = async () => {
    const admins = [];
    const firstNames = await axios.get('https://randommer.io/api/Name?nameType=firstname&quantity=5', config);
    const lastNames = await axios.get('https://randommer.io/api/Name?nameType=surname&quantity=5', config);

    firstNames.data.forEach((firstName, index) => {

        const newAdmin = {
            firstName: firstName,
            lastName: lastNames.data[index],
            email: firstName + lastNames.data[index] + "@gmail.com"
        }
        admins.push(newAdmin);

    });

    await AdminModel.create(admins);
};

// Uncomment all of these to refresh the data. Uncomment just the init functions to 
// add on to the currently existing data.
const init = async () => {
    //  await RiderModel.deleteMany();
    //  await DriverModel.deleteMany();
    //  await AdminModel.deleteMany();
    //  await initDrivers();
    //  await initRiders();
    //  await initAdmins();
}

init();

// GET ALL DRIVERS
router.get('/', (req, res) => {
    DriverModel.find({}, (err, users) => {
        if (err) return res.send(500);
        return res.send(users);
    });
});

// GET ASSIGNED RIDER LOCATION
router.get('/:driverId/assignedRider/location', async (req, res) => {
    const foundDriver = await DriverModel.findById(req.params.driverId, (err, driver) => {
        if (err) return res.send(500);
        return driver;
    });
    if(!foundDriver) return res.send(404);
    const foundRider = await RiderModel.findById(foundDriver.assignedRider);
    res.send(foundRider.location || 404);
});

// GET ASSIGNED RIDER DESTINATION
router.get('/:driverId/assignedRider/destination', async (req, res) => {
    const foundDriver = await DriverModel.findById(req.params.driverId, (err, driver) => {
        if (err) return res.send(500);
        return driver;
    });
    if(!foundDriver) return res.send(404);
    const foundRider = await RiderModel.findById(foundDriver.assignedRider);
    res.send(foundRider.destination || 404);
});

// UPDATE DRIVER POSITION
router.put('/:driverId/location', async (req, res) => {
    const foundDriver = await DriverModel.findById(req.params.driverId);
    if (!foundDriver) return res.send(404);
    foundDriver.location = req.body.location ? req.body.location : foundDriver.location;
    await DriverModel.updateOne({_id: req.params.driverId}, foundDriver);
    res.send(foundDriver);
});

// UPDATE DRIVER AVAILABILITY
router.put('/:driverId/availability', async (req, res) => {
    const foundDriver = await DriverModel.findById(req.params.driverId);
    if (!foundDriver) return res.send(404);
    foundDriver.available = !foundDriver.available;
    await DriverModel.updateOne({_id: req.params.driverId}, foundDriver);
    res.send(foundDriver);
});

// VIEW DRIVER WALLET
router.get('/:driverId/wallet', async (req,res)=>{
    const foundDriver = await DriverModel.findById(req.params.driverId);
    if (!foundDriver) return res.send(404);
    res.send('$' + foundDriver.wallet + " available for cashout!");
});

module.exports = router;
