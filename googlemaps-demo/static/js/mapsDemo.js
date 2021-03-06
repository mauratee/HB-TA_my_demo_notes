'use strict';

// We use a function declaration for initMap because we actually *do* need
// to rely on value-hoisting in this circumstance.

// All code having to do with Google Maps *must* be in initMap fxn
function initMap() {
  const sfBayCoords = {
    lat: 37.601773,
    lng: -122.20287,
  };

  // Create new instance of Map class, select DOM element,
  // JS object configures map with center and zoom
  const basicMap = new google.maps.Map(document.querySelector('#map'), {
    center: sfBayCoords,
    zoom: 11,
  });

  // Create new Google Maps Marker instance and configure
  // configuration must have "postion" and "map" values
  const sfMarker = new google.maps.Marker({
    position: sfBayCoords,
    title: 'SF Bay',
    map: basicMap,
  });

    // Add Event Listener to Marker
  sfMarker.addListener('click', () => {
    alert('Hi!');
  });

  const sfInfo = new google.maps.InfoWindow({
    content: '<h1>San Francisco!</h1>',
  });

  // Must call .open on Info Window for it to open on a
  // psrticulr map and marker
  sfInfo.open(basicMap, sfMarker);

  const locations = [
    {
      name: 'Hackbright Academy',
      coords: {
        lat: 37.7887459,
        lng: -122.4115852,
      },
    },
    {
      name: 'Powell Street Station',
      coords: {
        lat: 37.7844605,
        lng: -122.4079702,
      },
    },
    {
      name: 'Montgomery Station',
      coords: {
        lat: 37.7894094,
        lng: -122.4013037,
      },
    },
  ];

  const markers = [];
  for (const location of locations) {
    markers.push(
      new google.maps.Marker({
        position: location.coords,
        title: location.name,
        map: basicMap,
        icon: {
          // custom icon
          url: '/static/img/marker.svg',
          scaledSize: {
            width: 30,
            height: 30,
          },
        },
      })
    );
  }

  // Create HMTL elements and infoWindow for each marker
  // Add event listener to each marker
  for (const marker of markers) {
    const markerInfo = `
      <h1>${marker.title}</h1>
      <p>
        Located at: <code>${marker.position.lat()}</code>,
        <code>${marker.position.lng()}</code>
      </p>
    `;

    const infoWindow = new google.maps.InfoWindow({
      content: markerInfo,
      maxWidth: 200,
    });

    marker.addListener('click', () => {
      infoWindow.open(basicMap, marker);
    });
  }
}
