import axios from 'axios';
import * as L from 'leaflet';

const map = L.map('map').setView([0, 0], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const form = document.querySelector("form")! as HTMLFormElement;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const OPEN_CAGE_API_KEY = "1a51a4fe293a47eaa9745245b41039e5";

type OpenCageGeocodingResponse = {
  results: { annotations: { DMS: { lat: string; lng: string } } }[];
  status: "OK" | 200;
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAdress = addressInput.value;

  axios
    .get<OpenCageGeocodingResponse>(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        encodeURI(enteredAdress)
      )}&key=${OPEN_CAGE_API_KEY}`
    )
    .then((response) => {
      const data = response.data;
      if (data.results.length > 0) {
        const result = data.results[0];
        const lat = parseFloat(result.annotations.DMS.lat);
        const lng = parseFloat(result.annotations.DMS.lng);

        map.setView([lat, lng], 8);
        L.marker([lat, lng]).addTo(map);
        console.log(lat, lng);
      } else {
        alert("Address not found!");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

form.addEventListener("submit", searchAddressHandler);
