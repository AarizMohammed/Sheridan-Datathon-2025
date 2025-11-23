from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import folium
from folium.plugins import HeatMap

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent="map_search_app")


@app.get("/search")
def search_locations(q: str):
    results = geolocator.geocode(q, exactly_one=False, limit=5, addressdetails=True)

    if not results:
        return []

    suggestions = []
    for r in results:
        suggestions.append({
            "display_name": r.address,
            "lat": r.latitude,
            "lng": r.longitude
        })

    return suggestions

def transform_csv_to_heatmap(csv_path: str):
    df = pd.read_csv(csv_path)

    df.columns = df.columns.str.strip()
    df['LAT_WGS84'] = pd.to_numeric(df['LAT_WGS84'], errors='coerce')
    df['LONG_WGS84'] = pd.to_numeric(df['LONG_WGS84'], errors='coerce')

    df = df[
        (df['LAT_WGS84'] > 40) & (df['LAT_WGS84'] < 45) &
        (df['LONG_WGS84'] > -90) & (df['LONG_WGS84'] < -70)
    ]

    df = df.dropna(subset=['LAT_WGS84', 'LONG_WGS84'])

    heat_data = df[['LAT_WGS84', 'LONG_WGS84']].values.tolist()
    return heat_data


# -------------------------------------------------
#  CLICK + MARKER + postMessage JS (working)
# -------------------------------------------------
CLICK_AND_MARKER_JS = """
<script>

// Find folium map variable dynamically
function findFoliumMap() {
    for (const key in window) {
        if (key.startsWith("map_")) {
            return window[key];
        }
    }
    return null;
}

let clickMarker = null;

function initializeClickHandler() {
    const map = findFoliumMap();
    if (!map) {
        console.log("Waiting for Folium map...");
        return setTimeout(initializeClickHandler, 200);
    }

    console.log("Folium map found:", map);

    map.on("click", function (e) {

        // Remove previous marker
        if (clickMarker) {
            map.removeLayer(clickMarker);
        }

        // Add marker at clicked location
        clickMarker = L.marker(e.latlng).addTo(map);

        // Send to Angular
        window.parent.postMessage(
            { lat: e.latlng.lat, lng: e.latlng.lng },
            "*"
        );

        console.log("Posted:", e.latlng);
    });
}

// Run after DOM loads
setTimeout(initializeClickHandler, 300);

</script>
"""
def attach_click_handler(m: folium.Map):
    m.get_root().html.add_child(folium.Element(CLICK_AND_MARKER_JS))


@app.get("/heatmap", response_class=HTMLResponse)
def heatmap_page():

    heat_data = transform_csv_to_heatmap("data/Traffic_Collisions_2023_and_later.csv")

    if not heat_data:
        m = folium.Map(location=[43.7, -79.4], zoom_start=12)
    else:
        lats = [p[0] for p in heat_data]
        lons = [p[1] for p in heat_data]

        m = folium.Map(tiles="CartoDB Positron")

        sw = [min(lats), min(lons)]
        ne = [max(lats), max(lons)]
        m.fit_bounds([sw, ne])

        HeatMap(heat_data, radius=12).add_to(m)

        # Inject JS into final HTML
        attach_click_handler(m)

    html = m.get_root().render()

    return HTMLResponse(
        content=html,
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    )

@app.get("/heatmap-cor", response_class=HTMLResponse)
def heatmap_page(lat: float | None = None, lng: float | None = None):

    heat_data = transform_csv_to_heatmap("data/Traffic_Collisions_2023_and_later.csv")

    m = folium.Map(tiles="CartoDB Positron")

    # Fit to heatmap by default
    if heat_data:
        lats = [p[0] for p in heat_data]
        lons = [p[1] for p in heat_data]
        sw = [min(lats), min(lons)]
        ne = [max(lats), max(lons)]
        m.fit_bounds([sw, ne])

    # If user searched → zoom & drop marker
    if lat is not None and lng is not None:
        m.location = [lat, lng]
        m.zoom_start = 15
        folium.Marker([lat, lng], tooltip="Search Result").add_to(m)

    attach_click_handler(m)  # keep your click handler if you still want it

    html = m.get_root().render()
    return HTMLResponse(content=html)