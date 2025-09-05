const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
    const { lat, lon } = req.body;
    const apiKey = "1eb080d3f6f9f79f36ccb367c3bfa2dd";
    try {
        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=he&appid=${apiKey}`);
        res.json({
            city: data.name,
            temp: data.main.temp,
            description: data.weather[0].description
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "שגיאה בקבלת מזג האוויר" });
    }
});

module.exports = router;
