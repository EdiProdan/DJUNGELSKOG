import React from "react";

import { Feature, FeatureCollection } from "geojson";
import { Icon, LatLng, LeafletMouseEvent, Map as LeafletMap, PathOptions, StyleFunction } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, GeoJSON, useMapEvents } from "react-leaflet";

import svgSrc from "../../../assets/location-marker.svg";
import Client from "../../api/RestClient";
import { FullLocationResponse, LocationCoordinatesResponse } from "../../api/location/types";
import "./style.css";
import getCountryISO3 from "../../constants/countryIso2To3";

export type MapProps<T> = {
  features: {
    style: PathOptions | StyleFunction<T> | undefined;
    countries: Feature[];
    onClick?: (e: LeafletMouseEvent) => void;
  }[];
  locations: LocationCoordinatesResponse[] | FullLocationResponse[];
  locationsContent?: (location: LocationCoordinatesResponse) => React.ReactNode;
  dynamicMarkerContent?: (latLng: LatLng) => React.ReactNode;
  onZoom?: (zoom: number) => void;
  className?: string;
  dragging?: boolean;
  locationLng?: number;
  locationLat?: number;
  zoom?: number;
  scrollWheelZoom?: boolean;
  onMount?: (map: LeafletMap) => void;
};

const getApiUrl = (lat: number, lng: number) =>
  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

export const reverseGetCountryAndCity = (
  client: Client,
  { lat, lng }: { lat: number; lng: number }
): Promise<{ cityName: string; name: string; countryISO3: string }> =>
  client.get(getApiUrl(lat, lng)).then((res) => {
    let cityName;
    if (res.address.city) cityName = res.address.city;
    else if (res.address.town) cityName = res.address.town;
    else if (res.address.village) cityName = res.address.village;
    else if (res.address.suburb) cityName = res.address.suburb;
    else if (res.address.county) cityName = res.address.county;
    else cityName = res.address.state;

    let name;
    if (res.name) name = res.name;
    else name = cityName;

    return { cityName: cityName, name: name, countryISO3: getCountryISO3(res.address.country_code.toUpperCase()) };
  });

const icon = new Icon({
  iconSize: [38, 95],
  iconAnchor: [18, 66],
  popupAnchor: [0, -40],
  iconUrl: svgSrc,
});

export default function Map<T>({
  features,
  locations,
  locationsContent,
  dynamicMarkerContent,
  onZoom,
  className,
  dragging,
  locationLng,
  locationLat,
  zoom,
  scrollWheelZoom,
  onMount,
}: MapProps<T>) {
  const [map, setMap] = React.useState<LeafletMap>();

  React.useEffect(() => {
    if (map) onMount?.(map);
  }, [map, onMount]);

  return (
    <MapContainer
      center={locationLng && locationLat ? { lat: locationLat, lng: locationLng } : { lat: 26, lng: -21 }}
      zoom={zoom ? zoom : 2.7}
      scrollWheelZoom={scrollWheelZoom === false ? false : true}
      maxBounds={[
        [-85, -180.0],
        [85, 180.0],
      ]}
      minZoom={3}
      className={`min-h-20 min-w-20 outline-none ${className}`}
      maxBoundsViscosity={1.0}
      doubleClickZoom={false}
      dragging={dragging === false ? false : true}
    >
      <>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((l) => (
          <Marker key={l.id} position={{ lat: l.lat, lng: l.lng }} icon={icon}>
            <Popup>
              <div>{locationsContent ? locationsContent(l) : l.name}</div>
            </Popup>
          </Marker>
        ))}
        {features.map((f, index) => (
          <GeoJSON
            key={index}
            data={{ type: "FeatureCollection", features: f.countries } as FeatureCollection}
            style={f.style}
            onEachFeature={(feature, layer) => {
              if (f.onClick) layer.on("click", f.onClick);
            }}
          />
        ))}
        <LocationMarker dynamicMarkerContent={dynamicMarkerContent} onZoom={onZoom} setMap={setMap} />
      </>
    </MapContainer>
  );
}

type LocationMarkerProps = {
  dynamicMarkerContent?: (latLng: LatLng) => React.ReactNode;
  onZoom?: (zoom: number) => void;
  setMap?: (map: LeafletMap) => void;
};

function LocationMarker({ dynamicMarkerContent, onZoom, setMap }: LocationMarkerProps) {
  const [position, setPosition] = React.useState<LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      // map.locate();
    },
    /* locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    }, */
    zoom() {
      if (onZoom) onZoom(map.getZoom());
    },
  });

  React.useEffect(() => {
    if (map) setMap?.(map);
  }, [map, setMap]);

  return position === null ? null : (
    <Marker position={position} icon={icon}>
      {dynamicMarkerContent && <Popup className="custom-popup">{dynamicMarkerContent(position)}</Popup>}
    </Marker>
  );
}
