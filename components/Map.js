import { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import getCenter from "geolib/es/getCenter";

function Map({ wpApiResults }) {
  const [selectedLocation, setSelectedLocation] = useState({});
  const coordinates = wpApiResults.map((result) => ({
    longitude: result["toolset-meta"]["field-group-for-stays"].long.raw,
    latitude: result["toolset-meta"]["field-group-for-stays"].lat.raw,
  }));

  const center = getCenter(coordinates);

  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: center.latitude,
    longitude: center.longitude,
    zoom: 11,
  });
  console.log(selectedLocation);
  return (
    <ReactMapGL
      mapStyle="mapbox://styles/jaaylight/cktivkwfo6lft17p5vo37blr9"
      mapboxApiAccessToken={process.env.mapbox_key}
      {...viewport}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      {wpApiResults.map((result) => (
        <div key={result.id}>
          <Marker
            longitude={Number(
              result["toolset-meta"]["field-group-for-stays"].long.raw
            )}
            latitude={Number(
              result["toolset-meta"]["field-group-for-stays"].lat.raw
            )}
            offsetLeft={0}
            offsetTop={-20}
          >
            <p
              role="img"
              onClick={() => setSelectedLocation(result)}
              className="cursor-pointer text-2xl animate-bounce"
              aria-label="push-pin"
            >
              📌
            </p>
          </Marker>

          {/* The popup that should show if we click on a marker */}
          {selectedLocation.id === result.id ? (
            <Popup
              onClose={() => setSelectedLocation({})}
              closeOnClick={true}
              latitude={Number(
                result["toolset-meta"]["field-group-for-stays"].lat.raw
              )}
              longitude={Number(
                result["toolset-meta"]["field-group-for-stays"].long.raw
              )}
            >
              {result["toolset-meta"]["field-group-for-stays"].location.raw}
            </Popup>
          ) : (
            false
          )}
        </div>
      ))}
    </ReactMapGL>
  );
}

export default Map;
