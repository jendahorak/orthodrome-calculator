
window.onload = function () {
    let dmsToDec = document.getElementById("dmsToDec")
    function printResults(result, where) {
        let printResult = document.createElement('p')
        printResult.innerHTML = result
        document.getElementById(where).appendChild(printResult)
    }

    function toRadians(angle) {
        return angle * (Math.PI / 180);
    }

    function toDegrees(angle) {
        return angle * (180 / Math.PI);
    }



    function orto(A_lat, A_lon, B_lat, B_lon) {
        let A = [1.57079633 - toRadians(A_lat), toRadians(A_lon)]
        let B = [1.57079633 - toRadians(B_lat), toRadians(B_lon)]
        let dif_lon = B[1] - A[1]
        let R = 6371
        let c = Math.acos(Math.cos(A[0]) * Math.cos(B[0]) + Math.sin(A[0]) * Math.sin(B[0]) * Math.cos(dif_lon))
        let d = toDegrees(c) * Math.PI * R / 180
        return d.toFixed(2)
    }


    function clearPage() {
        document.getElementById('decResult').innerHTML = ''
        document.getElementById('decResults').innerHTML = ''
    }
    function clearPage2() {
        document.getElementById('ablenght').innerHTML = ''
        document.getElementById('ortoresult').innerHTML = ''
        document.getElementById('globeViz').innerHTML = ''
    }

    // nutná funkce pro vypočtení ortodromy, nutné počítat s decimálními čísly, pro "uživatele vhodná pomůcka, aby nemusel konvertovat jinde"
    function dmsToDecimal(deg, min, sec) {
        if (isNaN(deg)) {
            deg = 0
        }
        if (isNaN(min)) {
            min = 0
        }
        if (isNaN(sec)) {
            sec = 0
        }
        let degree = deg + (min / 60) + (sec / 3600)
        return degree.toFixed(5)
    }



    // let dmsToDec = document.getElementById('dmsToDec')
    // konverze na decimální
    dmsToDec.addEventListener('submit', (e) => {
        let deg = parseInt(document.getElementById('deg').value)
        let min = parseInt(document.getElementById('min').value)
        let sec = parseInt(document.getElementById('sec').value)
        document.getElementById('decResult').innerHTML = dmsToDecimal(deg, min, sec) + '°'
        printResults(dmsToDecimal(deg, min, sec), 'decResults')
        e.preventDefault();
    })

    // const arcsData = []

    // výpočet ortodromy
    ortoToKm.addEventListener('submit', (e) => {
        let A_lat = parseFloat(document.getElementById('latA').value)
        let A_lon = parseFloat(document.getElementById('lonA').value)
        let B_lat = parseFloat(document.getElementById('latB').value)
        let B_lon = parseFloat(document.getElementById('lonB').value)
        let ortdistance = orto(A_lat, A_lon, B_lat, B_lon)
        document.getElementById('ablenght').innerHTML = ortdistance + ' Km'
        printResults(ortdistance, 'ortoresult')
        // let random_color = '#'+Math.floor(Math.random()*16777215).toString(16);
        // arcsData.push({startLat: A_lat, startLng: A_lon, endLat: B_lat, endLng: B_lon, color: random_color})



        // vykreslí globe s ortodromou na zadaných souřadnicích, kód půjčený z https://github.com/vasturiano/three-globe a trochu upravený
        // zatím to generuje při každym submitu novou zeměkouli, chtěl jsem to udělat tak aby to jen vykreslovalo nový ortodromy na tu samou, ale na to už nebyl čas :D
        const arcsData = [{ startLat: A_lat, startLng: A_lon, endLat: B_lat, endLng: B_lon, color: 'red' }]

        const Globe = new ThreeGlobe()
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-water.png')
            .arcsData(arcsData)
            .arcColor('color')
            .arcAltitude(0)
            .arcStroke(1)

        // Setup renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(1000, 1000);
        document.getElementById('globeViz').appendChild(renderer.domElement);

        // Setup scene
        const scene = new THREE.Scene();
        scene.add(Globe);
        scene.add(new THREE.AmbientLight(0xbbbbbb));
        scene.add(new THREE.DirectionalLight(0xffffff, 0.6));
        scene.background = new THREE.Color(0x0093AF);


        // Setup camera
        const camera = new THREE.PerspectiveCamera();
        camera.aspect = 1000 / 1000;
        camera.updateProjectionMatrix();
        camera.position.z = 500;

        // Add camera controls
        const tbControls = new THREE.TrackballControls(camera, renderer.domElement);
        tbControls.minDistance = 101;
        tbControls.rotateSpeed = 5;
        tbControls.zoomSpeed = 0.8;

        // Kick-off renderer
        (function animate() { // IIFE
            // Frame cycle
            tbControls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        })();
        e.preventDefault();
    })

    // mazání uložených hodnot
    dmsToDec.addEventListener('reset', (e) => {
        clearPage();
    })
    ortoToKm.addEventListener('reset', (e) => {
        clearPage2();
    })

}




