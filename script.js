var temp;

var City = sessionStorage.getItem("City");
console.log(City);
var Area = sessionStorage.getItem("fieldArea");
var Soil = sessionStorage.getItem("soil_moisture");
var Days = sessionStorage.getItem("Days");
var Crop = sessionStorage.getItem("crop");

const apiURL1 = 'https://api.tomorrow.io/v4/weather/forecast?location=';
const apiURL2 = '&timesteps=1d&apikey=foEHGrylkuKp2HZBuZEX4mXvMHug8D7p';
const fullUrl=apiURL1 + City + apiURL2;
console.log(fullUrl);

const options = {method: 'GET', headers: {accept: 'application/json'}};

// fetch('https://api.tomorrow.io/v4/weather/forecast?location=delhi&timesteps=1d&apikey=foEHGrylkuKp2HZBuZEX4mXvMHug8D7p', options)
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err));

// function api(){
//     fetch(fullUrl)
//     .then(res => res.json()
// .then(data => console.log(data.current.temp_c)))
// }
// api();


// Define an object to store crop information
var crops = {
    "Wheat":{
        "name": "Wheat",
        "kc_table":{
            "initial_stage": {"kc": [0.3, 0.4], "days": [15, 20] },
            "development_stage": { "kc": [0.7, 0.8], "days": [25, 30] },
            "mid_season_stage": { "kc": [1.05, 1.2], "days": [50, 65] },
            "late_season_stage": { "kc": [0.65, 0.7], "days": [30, 40] },
            "harvest_stage": { "kc": [0.2, 0.25], "days": [40, 150] } // No specific days for harvest stage
        },
        "desired_soil_moisture": 40
        }

    ,
    "Rice": {
        "name": "Rice",
        "kc_table": {
            "initial_stage": { "kc": [0.1, 0.2], "days": [1, 10] },
            "development_stage": { "kc": [0.7, 1.0], "days": [10, 40] },
            "mid_season_stage": { "kc": [1.0, 1.2], "days": [40, 70] },
            "late_season_stage": { "kc": [0.5, 0.7], "days": [70, 100] },
            "harvest_stage": { "kc": [0.2, 0.25], "days": [100, 120] } // No specific days for harvest stage
        },
        "desired_soil_moisture": 60 // Desired soil moisture content in percentage
    },
    "Cotton": {
        "name": "Cotton",
        "kc_table": {
            "initial_stage": { "kc": [0.2, 0.4], "days": [1, 20] },
            "vegetative_stage": { "kc": [0.5, 0.7], "days": [20, 60] },
            "reproductive_stage": { "kc": [0.8, 1.0], "days": [60, 120] },
            "ripening_stage": { "kc": [0.4, 0.6], "days": [120, 160] }
        },
        "desired_soil_moisture": 70 // Desired soil moisture content in percentage
    },
    "Sugarcane": {
        "name": "Sugarcane",
        "kc_table": {
            "initial_stage": { "kc": [0.2, 0.4], "days": [1, 30] },
            "vegetative_stage": { "kc": [0.5, 0.7], "days": [30, 90] },
            "grand_growth_stage": { "kc": [0.8, 1.0], "days": [90, 270] },
            "maturation_stage": { "kc": [0.6, 0.8], "days": [270, 360] }
        },
        "desired_soil_moisture": 65 // Desired soil moisture content in percentage
    },
    "Maize": {
        "name": "Maize",
        "kc_table": {
            "initial_stage": { "kc": [0.2, 0.4], "days": [1, 20] },
            "vegetative_stage": { "kc": [0.5, 0.7], "days": [20, 60] },
            "grand_growth_stage": { "kc": [0.8, 1.0], "days": [60, 120] },
            "maturation_stage": { "kc": [0.6, 0.8], "days": [120, 160] }
        },
        "desired_soil_moisture": 65 // Desired soil moisture content in percentage
    }
};

// Function to get crop coefficient (kc) for a given crop and number of days
function getKcForCropAndDays(Crop, Days) {
    // Check if the crop exists in the crops object
    if (crops.hasOwnProperty(Crop)) {
        // Get the kc table for the specified crop
        var kcTable = crops[Crop].kc_table;

        // Loop through each growth stage in the kc table
        for (var stage in kcTable) {
            if (kcTable.hasOwnProperty(stage)) {
                // Check if the number of days falls within the range of the current growth stage
                var stageDays = kcTable[stage].days;
                if (Days >= stageDays[0] && Days <= stageDays[1]) {
                    // Return the kc value for the current growth stage
                    return kcTable[stage].kc;
                }
            }
        }
        // If the number of days doesn't match any growth stage, return null or handle as needed
        return null; // or return a default value, or throw an error, etc.
    } else {
        // If the crop doesn't exist in the crops object, return null or handle as needed
        return null; // or return a default value, or throw an error, etc.
    }
}

var deficit = 0;

if(crops["desired_soil_moisture"] - Soil > 0)
deficit = crops["desired_soil_moisture"] - Soil;

// var ET = 0.0023(10)*(temp+17.8);

// var ETc = getKcForCropAndDays(Crop, Days)[0]*ET;

// var daily_water = (ETc + deficit)*(Area*1000000);

// Example usage:
// var cropName = "rice";
// var numberOfDays = 25; // For example, 25 days into the growth cycle

// var kcValues = getKcForCropAndDays(Crop, Days);
// console.log("Crop coefficient (kc) values for", cropName, "at", numberOfDays, "days:", kcValues);