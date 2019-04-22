export default {
    firebase: {
        apiKey: 'AIzaSyAZgFjHuUby8EF7zolsDuNDGRfF_5Tr2Uc',
        authDomain: 'weblocater-d1e0c.firebaseapp.com',
        databaseURL: 'https://weblocater-d1e0c.firebaseio.com',
        projectId: 'weblocater-d1e0c',
        storageBucket: 'weblocater-d1e0c.appspot.com',
        messagingSenderId: '108688984694',
    },
    locationIQ: {
        apiKey: 'fa2af1934257a0',
        url: 'https://us1.locationiq.com/v1/reverse.php',
    },
    maps: {
        tileSets: {
            esriDeLorme: {
                label: 'Esri DeLorme',
                attribution:
                    'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
            },
            openStreetMap: {
                label: 'Open Street Map',
                attribution: '&amp;copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            },
            stamenTerrain: {
                label: 'Stamen Terrain',
                attribution:
                    'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
            },
            wikiMedia: {
                label: 'WikiMedia',
                attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
                url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png',
            },
            openTopoMap: {
                label: 'Open TopoMap',
                attribution:
                    'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
                url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            },
        },
    },
};
