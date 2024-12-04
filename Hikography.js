console.log("javascript");

let gpxFileNames = [
    "Golden Ears Summit Trail",
    "Gros Morne Mountain Trail",
    "Hoch Fulen - Gross Spitzen",
    "Long Range Traverse",
    "Montagne Noire",
    "North Head Trail",
    "Red Heather Meadows to Elfin Lakes",
    "The Black Tusk",
    "West Coast Trail"
];

let gpxPathStart = [];

export let hikePhotos = {
    "Golden Ears Summit Trail": [
        {path: "./gpxFiles/Golden_Ears_Summit_Trail/1.jpg", coords: [49.3532, -122.4562]},
        {path: "./gpxFiles/Golden_Ears_Summit_Trail/2.jpg", coords: [49.3616, -122.4707]},
        {path: "./gpxFiles/Golden_Ears_Summit_Trail/3.jpg", coords: [49.3668, -122.4812]},
        {path: "./gpxFiles/Golden_Ears_Summit_Trail/4.jpg", coords: [49.3698, -122.5000]},
        {path: "./gpxFiles/Golden_Ears_Summit_Trail/5.jpg", coords: [49.3653, -122.4981]},
        {path: "./gpxFiles/Golden_Ears_Summit_Trail/6.jpg", coords: [49.3613, -122.5035]},
        {path: "./gpxFiles/Golden_Ears_Summit_Trail/7.jpg", coords: [49.3651, -122.5093]}
    ],
    "Gros Morne Mountain Trail": [
        {path: "./gpxFiles/Gros_Morne_Mountain_Trail/1.jpg", coords: [49.5948, -57.7824]}
    ],
    "Hoch Fulen - Gross Spitzen": [
        {path: "./gpxFiles/Hoch_Fulen_-_Gross_Spitzen/1.jpg", coords: [46.8280, 8.7297]},//
        {path: "./gpxFiles/Hoch_Fulen_-_Gross_Spitzen/2.jpg", coords: [46.8300, 8.7533]},//
        {path: "./gpxFiles/Hoch_Fulen_-_Gross_Spitzen/3.jpg", coords: [46.8350, 8.7133]},//
        {path: "./gpxFiles/Hoch_Fulen_-_Gross_Spitzen/4.jpg", coords: [46.8470, 8.7333]},//
        {path: "./gpxFiles/Hoch_Fulen_-_Gross_Spitzen/5.jpg", coords: [46.8400, 8.7533]},
        {path: "./gpxFiles/Hoch_Fulen_-_Gross_Spitzen/6.jpg", coords: [46.8250, 8.7453]},//
    ],
    "Long Range Traverse": [
        {path: "./gpxFiles/Long_Range_Traverse/1.jpg", coords: [49.6887, -57.6182]},
        {path: "./gpxFiles/Long_Range_Traverse/2.jpg", coords: [49.6284, -57.6477]}
    ],
    "Montagne Noire": [
        {path: "./gpxFiles/Montagne_Noire/1.jpg", coords: [46.2435, -74.2936]},
        {path: "./gpxFiles/Montagne_Noire/2.jpg", coords: [46.2521, -74.2827]}
    ],
    "North Head Trail": [
        {path: "./gpxFiles/North_Head_Trail/1.jpg", coords: [47.5696, -52.6845]},
        {path: "./gpxFiles/North_Head_Trail/2.jpg", coords: [47.5685, -52.6814]}
    ],
    "Red Heather Meadows to Elfin Lakes": [
        {path: "./gpxFiles/Red_Heather_Meadows_to_Elfin_Lakes/1.jpg", coords: [49.7819, -122.9912]},
        {path: "./gpxFiles/Red_Heather_Meadows_to_Elfin_Lakes/2.jpg", coords: [49.7618, -123.0481]},
        {path: "./gpxFiles/Red_Heather_Meadows_to_Elfin_Lakes/3.jpg", coords: [49.7509, -123.0493]}
    ],
    "The Black Tusk": [
        {path: "./gpxFiles/The_Black_Tusk/1.jpg", coords: [49.9506, -123.0713]},
        {path: "./gpxFiles/The_Black_Tusk/2.jpg", coords: [49.9670, -123.0390]},
        {path: "./gpxFiles/The_Black_Tusk/3.jpg", coords: [49.9480, -123.1045]}
    ],
    "West Coast Trail": [
        {path: "./gpxFiles/West_Coast_Trail/1.jpg", coords: [48.7277, -125.1014]},
        {path: "./gpxFiles/West_Coast_Trail/2.jpg", coords: [48.7178, -125.0389]}
    ],
};


//LOAD MAIN MAP exported to Hikography.html
export function MapWorking(){
    let map = L.map('map').setView([50, 0], 2);

    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 8, 
        minZoom: 2,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://opentopomap.org/about">OpenTopoMap</a>' 
    }).addTo(map);

    let bounds = [
        [5, -180],
        [65, 180]
    ]

    map.setMaxBounds(bounds);

    loadGPXFiles(map);

    map.on('zoom', function() {
        console.log('Map zoom level changed to: ' + map.getZoom()); 
    });
}

//LOAD ALL GPX FILES
function loadGPXFiles(map) {
    let promises = gpxFileNames.map((fileName, index) => {
        return new Promise((resolve) => {
            let gpxUrl = "/gpxFiles/" + fileName.replace(/\s+/g, "_").replace(/'/g, "") + "/" + fileName + ".gpx";

            new L.GPX(gpxUrl, {
                async: true,
                markers: {
                    endIcon: "/Resources/Images/Empty.png",
                    startIcon: "/Resources/Images/Empty.png"
                },
                polyline_options: {
                    color: 'red'
                },
            }).on("loaded", resolve)
              .on("addpoint", function (a) {
                if (a.point_type === "start") {
                    gpxPathStart[index] = `${a.point._latlng.lat}, ${a.point._latlng.lng}`;
                }
            }).addTo(map);
        });
    });
    
    Promise.all(promises)
        .then(() => {
            hikeSelect(map, gpxPathStart);
        })
        .catch(error => console.error('Error loading GPX files:', error));
}

//DETECT HOVER AND CLICK ON HIKE
function hikeSelect(map, gpxPathStart) {
    for (let i = 0; i < gpxPathStart.length; i++) {
        let marker = new L.marker(gpxPathStart[i].split(', ').map(Number), {
            riseOnHover: true,
        }).addTo(map).bindPopup(gpxFileNames[i]);

        marker.on('click', function() {
            markerClicked(gpxFileNames[i]);
        });

        // Show popup on hover
        marker.on('mouseover', function() {
            this.openPopup();
        });

        // Hide popup when no longer hovering
        marker.on('mouseout', function() {
            this.closePopup();
        });
        
        
        console.log(gpxFileNames[i]);
    }
}

//DETECT HIKE CLICK AND MOVE TO THAT PAGE
function markerClicked(hikeName) {
        const url = `./IndividualHike.html?hike=${hikeName}`;
        window.location.href = url;

        console.log(hikeName);
        return(hikeName);
}

//CREATE MINI MAP FOR EACH HIKE exported to IndividualHike.html
export function initializeMap(smallMap, gpxFilePath) {
    let map = L.map(smallMap).fitWorld(); 

    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 16,
        minZoom: 10,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://opentopomap.org/about">OpenTopoMap</a>' 
    }).addTo(map);

    map.on('zoom', function() {
        console.log('Map zoom level changed to: ' + map.getZoom()); 
    });
    
    new L.GPX(gpxFilePath, {
        async: true,
        polyline_options: {
            color: 'blue'
        } 
    }).on('loaded', function(e) {
        map.fitBounds(e.target.getBounds());
    }).addTo(map);

    return map;
}

//ADDING PHOTOS STUFF
export function addPhotoToMap(map, lat, lng, photoPath) {

    let icon = L.divIcon({
        html: `<img src="${photoPath}" class="map-thumbnail"/>`,
        iconSize: [50, 50],
        className: 'custom-div-icon'
    });
    
    let marker = L.marker([lat, lng], { icon: icon }).addTo(map);

    marker.on('click', function() {
        console.log('Marker clicked!');
        showImageModal(photoPath);
    });

    // Showing popup on hover
    marker.on('mouseover', function() {
        console.log("hello")
        this.openPopup("hello");
    });

    // Hiding popup when no longer hovering
    marker.on('mouseout', function() {
        this.closePopup();
    });
}

function showImageModal(photoPath) {
    let modal = document.getElementById('image-modal');
    let modalImage = document.getElementById('modal-image');

    modalImage.src = photoPath;
    modal.style.display = 'block';
}

export function closeImageModal() {
    let modal = document.getElementById('image-modal');
    modal.style.display = 'none';
}

document.addEventListener('click', function(event) {
    let modal = document.getElementById('image-modal');
    if (event.target === modal) {
        closeImageModal();
    }
});
