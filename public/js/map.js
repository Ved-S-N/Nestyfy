<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
     <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>
<script>
        var map = L.map('map').setView([19.0474, 73.0698], 13);
        L.tileLayer('https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=XbU87rKNl8rtBf3oktcO', {
  attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a>'
}).addTo(map);
    </script>