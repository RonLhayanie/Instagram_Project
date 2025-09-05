const Map = L.map('map-modal', {
    maxBounds: [[-85, -180], [85, 180]],
    maxBoundsViscosity: 0.5
}).setView([31.77, 35.21], 2);

// initial light-mode tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    minZoom: 2,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(Map)


// create markers + erase if one already exists
let currentMarker = null, lastMarker = null
const debounced_mark = debounce( async (e) => {
    const {lat, lng} = e.latlng

    if(currentMarker)
        Map.removeLayer(currentMarker)

    const placeName = await getPlaceName(lat, lng)
    currentMarker = L.marker([lat, lng]).addTo(Map).bindPopup(placeName).openPopup()
}, 300)
Map.on('click', async (e) => {
    debounced_mark(e)
})

// get name of coordinates with Nominatim API
async function getPlaceName(lat, lng) {
    // reverse geocoding url - nominatim
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`

    try {
        const res = await fetch(url, {
            headers: { 
                'User-Agent': 'LeafletExample/1.0',
                'Accept-Language': 'en'
            }
        });
        const data = await res.json()

        if (data && data.display_name) 
            return data.display_name

        else 
            return `${lat.toFixed(5)}, ${lng.toFixed(5)}`

    } 
    catch (err) {
        console.error(err);
        return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
}

let currentController = null
async function searchPlace(query) {
    if(currentController)
        currentController.abort()


    // signal to shut off fetchs which take too long
    currentController = new AbortController()
    const signal = currentController.signal

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
    try {
        const res = await fetch(url, {
            headers: { 
                'User-Agent': 'LeafletExample/1.0',
                'Accept-Language': 'en'
            },
            signal: signal
        });
        const data = await res.json()
        return data;
    } 
    catch (err) {
        // if we caught an abort - its ok we sent it
        if(err.name ==="AbortError") return []

        console.error(err);
        return []
    }
}

// to ease the search for the server - send the last req 0.4s after the user stop typing
function debounce(fn, delay_MS) {
    let timer;

    // return f with some arguments, every time debounce gets called - clear timer
    // if debounce doesn't get called in delay_MS milisecends fn will be called
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay_MS)
    }
}

async function uploadLocations() {
    const places =  await searchPlace(document.getElementById('location-input').value)
    const datalist = document.getElementById('places')
    const input =  document.getElementById('location-input')

    datalist.innerHTML = ``
    places.forEach(item => {
        const option = document.createElement('option')
        option.value = item.display_name
        option.innerText = item.display_name.length > 40 ? item.display_name.slice(0, 40) + '...' : item.display_name

        option.classList.add('location-suggestion')
        datalist.appendChild(option)

        option.addEventListener('click', () => {
            input.value = '📍 ' + option.value
            datalist.style.display = 'none'

            // mark the map
            if(currentMarker)
                Map.removeLayer(currentMarker)
            currentMarker = L.marker([item.lat, item.lon]).addTo(Map).bindPopup(item.display_name).openPopup()
            currentMarker = currentMarker

            const hebrewRegex = /[\u0590-\u05FF]/
            if (hebrewRegex.test(input.value)) 
                input.setAttribute('lang', 'he')
            
            else 
                input.setAttribute('lang', 'en')
        })
    })

    if(places.length > 0)
            datalist.style.display = 'block'

    else
        datalist.style.display = 'none'
}

// listeners
document.querySelector('.switch-toggle').addEventListener('click', () => {
    // render dark mode tiles
    if(document.querySelector('.switch-toggle input').checked)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 18,
            minZoom: 2,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        }).addTo(Map);

    // render light mode tiles
    else
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 2,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(Map)
})

document.getElementById('exit-map').addEventListener('click', () => {
    document.getElementById('map-overlay').style.display = 'none'
    if(lastMarker !== currentMarker) {
        Map.removeLayer(currentMarker)
        currentMarker = lastMarker
    }
})

// save marker
document.getElementById('save-map-marker').addEventListener('click', async () => {
    if(currentMarker) {
        const {lat, lng} = currentMarker.getLatLng()
        const placeName  = await getPlaceName(lat, lng)
        document.getElementById('location-input').value = '📍 ' + placeName
    }
    lastMarker = currentMarker

    document.getElementById('map-overlay').style.display = 'none'
})

document.querySelector('.post-form-side .input-field-container svg').addEventListener('click', () => {
    document.getElementById('map-overlay').style.display = 'block'
    Map.invalidateSize()
})

const debounced_search = debounce(uploadLocations, 400)
document.getElementById('location-input').addEventListener('input', () => {
    debounced_search()
})

// close map and initialize it
document.getElementById('discardBtn').addEventListener('click', () => {
    Map.setView([31.77, 35.21], 2);
    Map.removeLayer(currentMarker)
    currentMarker = null
})

