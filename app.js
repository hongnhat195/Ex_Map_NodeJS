var mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
const asyncRequest = require("async-request");

const getLocation = async (location) => {
  const accessToken =
    "pk.eyJ1IjoiaW1lbHZpcyIsImEiOiJja3BxeTN0cjcwZDAxMnFtdXhzazc0d3IwIn0.HbghDHuex7t6x-_f1NoN6w";
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?limit=1&access_token=${accessToken}`;
  try {
    const places = await asyncRequest(url);
    const res = JSON.parse(places.body);

    const location = {
      isSuccess: true,
      minLongitude: res.features[0].bbox[0],
      minLatitude: res.features[0].bbox[1],
      maxLongitude: res.features[0].bbox[2],
      maxLatitude: res.features[0].bbox[3],
      centerLongitude: res.features[0].center[0],
      centerLatitude: res.features[0].center[1],
    };
    console.log(location);
    return location;
  } catch (err) {
    console.log(err);
    return false;
  }
};
const express = require("express");
const app = express();
const path = require("path");
const pathPublic = path.join(__dirname, "./public");
app.use(express.static(pathPublic));
app.get("/", async (req, res) => {
  const params = req.query;
  console.log(params);
  const location = params.address;
  const place = await getLocation(location);
  if (place) {
    res.render("map", {
      status: true,
      minLongitude: place.minLongitude,
      minLatitude: place.minLatitude,
      maxLongitude: place.maxLongitude,
      maxLatitude: place.maxLatitude,
      centerLongitude: place.centerLongitude,
      centerLatitude: place.centerLatitude,
    });
  } else {
    res.render("map", {
      status: false,
    });
  }
});
app.set("view engine", "hbs");
const port = 7000;
app.listen(port, () => {
  console.log("App run port 7000");
});
