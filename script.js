import { TrackballControls } from '//unpkg.com/three/examples/jsm/controls/TrackballControls.js';

document.addEventListener('DOMContentLoaded', function () {
  Object.assign(THREE, { TrackballControls });

  function toRadians(angle) {
    return angle * (Math.PI / 180);
  }

  function toDegrees(angle) {
    return angle * (180 / Math.PI);
  }

  // Function to convert degrees, minutes, and seconds to decimal degrees
  function dmsToDecimal(deg, min, sec) {
    if (isNaN(deg)) {
      deg = 0;
    }
    if (isNaN(min)) {
      min = 0;
    }
    if (isNaN(sec)) {
      sec = 0;
    }
    let degree = deg + min / 60 + sec / 3600;
    return degree.toFixed(5);
  }

  // Function to handle the dmsToDec form submission
  function handleDmsToDecFormSubmit(event) {
    event.preventDefault();
    let deg = parseInt(document.getElementById('deg').value);
    let min = parseInt(document.getElementById('min').value);
    let sec = parseInt(document.getElementById('sec').value);
    document.getElementById('decResult').innerHTML = dmsToDecimal(deg, min, sec) + '°';
    printResults(dmsToDecimal(deg, min, sec), 'decResults');
  }

  // Function to calculate the distance between two points on a sphere
  function orto(A_lat, A_lon, B_lat, B_lon) {
    let A = [1.57079633 - toRadians(A_lat), toRadians(A_lon)];
    let B = [1.57079633 - toRadians(B_lat), toRadians(B_lon)];
    let dif_lon = B[1] - A[1];
    let R = 6371;
    let c = Math.acos(Math.cos(A[0]) * Math.cos(B[0]) + Math.sin(A[0]) * Math.sin(B[0]) * Math.cos(dif_lon));
    let d = (toDegrees(c) * Math.PI * R) / 180;
    return d.toFixed(2);
  }

  function handleClearButtonClick(event) {
    event.preventDefault();

    const buttonType = event.target.getAttribute('type');

    if (buttonType === 'reset1') {
      document.getElementById('decResult').innerHTML = '';
      document.getElementById('decResults').innerHTML = '';
    } else if (buttonType === 'reset2') {
      document.getElementById('ablenght').innerHTML = '';
      document.getElementById('ortoresult').innerHTML = '';
    }
  }

  // Function to clear the globe visualization container
  function clearGlobeVisualization() {
    document.getElementById('globeViz').innerHTML = '';
  }

  let orthodromes = [];

  // Function to handle the ortoToKm form submission
  function handleOrtoToKmFormSubmit(event) {
    event.preventDefault();
    let A_lat = parseFloat(document.getElementById('latA').value);
    let A_lon = parseFloat(document.getElementById('lonA').value);
    let B_lat = parseFloat(document.getElementById('latB').value);
    let B_lon = parseFloat(document.getElementById('lonB').value);
    let ortdistance = orto(A_lat, A_lon, B_lat, B_lon);
    document.getElementById('ablenght').innerHTML = ortdistance + ' Km';
    printResults(ortdistance, 'ortoresult');

    orthodromes.push({ startLat: A_lat, startLng: A_lon, endLat: B_lat, endLng: B_lon, color: 'red' });
    clearGlobeVisualization();
    renderGlobeVisualization();
  }

  // Function to render the globe visualization
  function renderGlobeVisualization() {
    console.log(orthodromes);
    // const arcsData = [{ startLat: A_lat, startLng: A_lon, endLat: B_lat, endLng: B_lon, color: 'red' }];
    const Globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-water.png')
      .arcsData(orthodromes)
      .arcColor('color')
      .arcAltitude(0)
      .arcStroke(1);
    // Setup renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(500, 500);
    document.getElementById('globeViz').appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6));
    scene.background = new THREE.Color(0x0093af);

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = 1000 / 1000;
    camera.updateProjectionMatrix();
    camera.position.z = 400;

    // Add camera controls
    const tbControls = new THREE.TrackballControls(camera, renderer.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 20;
    tbControls.zoomSpeed = 0.8;

    // Kick-off renderer
    function animate() {
      tbControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    // Call the animate function to start the rendering loop
    animate();
  }

  // Function to print results
  function printResults(result, where) {
    let printResult = document.createElement('p');
    printResult.innerHTML = result;
    document.getElementById(where).appendChild(printResult);
  }

  // Get the dmsToDec form and attach the submit event listener
  let dmsToDecForm = document.getElementById('dmsToDec');
  dmsToDecForm.addEventListener('submit', handleDmsToDecFormSubmit);

  // Get the ortoToKm form and attach the submit event listener
  let ortoToKmForm = document.getElementById('ortoToKm');
  ortoToKmForm.addEventListener('submit', handleOrtoToKmFormSubmit);
  // Function to handle the clear button click

  // Get the clear buttons and attach the click event listener
  let clearButtons = document.querySelectorAll('.form button[type^="reset"]');
  clearButtons.forEach((button) => {
    button.addEventListener('click', handleClearButtonClick);
  });
});
