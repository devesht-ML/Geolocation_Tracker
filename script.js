let map, marker;
let currentLatLng = null;

document.getElementById('currentYear').textContent = new Date().getFullYear();

document.getElementById('locateBtn').addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
    timeout: 10000, //Maximum time to return a location(if my location is not fetched in 10 sec it will return error)
    maximumAge: 0  //Maximum age of previous location(if it is 60000 it will fetch 1 min ago location)
  });
});

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  currentLatLng = { lat, lng: lon };

  const locationInfo = `
    <p><strong>Latitude:</strong> ${lat}</p>
    <p><strong>Longitude:</strong> ${lon}</p>
  `;
  document.getElementById('locationInfo').innerHTML = locationInfo;

  if (!map) {
    map = new google.maps.Map(document.getElementById('map'), {
      center: currentLatLng,
      zoom: 15,
    });
  } else {
    map.setCenter(currentLatLng);
    map.setZoom(15);
  }

  if (marker) {
    marker.setMap(null);
  }

  marker = new google.maps.Marker({
    position: currentLatLng,
    map: map,
    title: "You are here"
  });

  const infowindow = new google.maps.InfoWindow({
    content: "Hey there! You are here"
  });
  infowindow.open(map, marker);
}

function error(err) {
  alert("Unable to retrieve your location: " + err.message);
}

document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('locationInfo').innerHTML = "<p>Click \"Find My Location\" to detect your current position</p>";
  if (marker) {
    marker.setMap(null);
    marker = null;
  }
});

document.getElementById('shareBtn').addEventListener('click', () => {
  if (!currentLatLng) {
    alert("Please find your location first!");
    return;
  }

  const locationUrl = `https://www.google.com/maps?q=${currentLatLng.lat},${currentLatLng.lng}`;
  navigator.clipboard.writeText(locationUrl).then(() => {
    showToast("Location link copied to clipboard!");
  });
});

document.getElementById('zoomInBtn').addEventListener('click', () => {
  if (map) map.setZoom(map.getZoom() + 1);
});

document.getElementById('zoomOutBtn').addEventListener('click', () => {
  if (map) map.setZoom(map.getZoom() - 1);
});

document.getElementById('locateOnMapBtn').addEventListener('click', () => {
  if (map && currentLatLng) {
    map.setCenter(currentLatLng);
    map.setZoom(15);
  }
});

function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  toastMessage.textContent = message;
  toast.style.display = "flex";

  setTimeout(() => {
    toast.style.display = "none";
  }, 4000);
}
