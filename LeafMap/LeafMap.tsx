import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./LeafMap.scss";
/*import MarkerIcon from "../../assets/icons/marker.png";*/
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { /*OpenStreetMapProvider,*/ GeoSearchControl, GoogleProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

interface Types {
  startPosition?: [number, number]; // [lat, lng]
  selectedAddress?: any; // {label:string ,lat:number, lng:number}
  clickedPos?: any; // {lat:number, lng:number}
  clickedPosPopup?: any; // ex: html element or fragment '<></>'
  onClick?: any; // all events in 'e'
  zoom?: number; // default 13
  scrollWheelZoom?: boolean; // default true
  isLocationSearchDisabled?: boolean; // default false
  isClickableDisabled?: boolean; // default false
  customMarkers?: MarkerItem[];
}

interface MarkerItem {
  position: [number, number]; // [lat, lng]
  icon?: string | any; // url or item
  popup?: any; // ex: html element or fragment '<></>'
  label?: string;
}

/*
 !! IMPORTANT NOTICE
 Do not change or remove the 'attribution' and 'url' fields in the 'TileLayer'
 section below due to usage rights license!

 >> Ahmet YILDIZ
*/
const LeafMap = ({
                   startPosition,
                   clickedPos,
                   onClick,
                   customMarkers,
                   clickedPosPopup,
                   zoom,
                   scrollWheelZoom,
                   isLocationSearchDisabled = false,
                   isClickableDisabled = false,
                   selectedAddress
                 }: Types) => {
  let counter = 0;
  const position: any = [41.008469, 28.980261]; // Default Start Position Is Hagia Sophia (Istanbul/Turkiye)
  const icon = new Icon({
    iconUrl: MarkerIcon,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41]/*[38, 38]*/,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });
  const [clickedPosition, setClickedPosition] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const provider = new GoogleProvider({ apiKey: "___Your Google Maps Api Key Here___" });
  const [searchControl, setSearchControl] = useState<any>(null);


  useEffect(() => {
    // @ts-ignore
    setSearchControl(new GeoSearchControl({
      provider: /*new OpenStreetMapProvider()*/ provider,
      style: "bar", // bar or button
      notFoundMessage: "Sorry, that location could not be found.",
      searchLabel: "Search any location...",
      animateZoom: true,
      marker: {
        icon: icon,
        draggable: false
      }
      /*resultFormat: (result: any) => {
        console.log(result);
        return result?.result?.label;
      }*/
    }));
  }, []);

  useEffect(() => {
    if (counter === 0 && mapRef?.current && !isLocationSearchDisabled && searchControl) {
      mapRef?.current?.on("geosearch/showlocation", (data: any) => {
        const lat = data?.marker._latlng.lat;
        const lng = data?.marker._latlng.lng;
        setClickedPosition(null);
        clickedPos && clickedPos({ lat, lng });
        selectedAddress && selectedAddress({
          label: data?.location?.label,
          lat,
          lng
        });
        onClick && onClick(data);
        console.log(data);
      });

      mapRef?.current?.addControl(searchControl);
      counter++;
    }
  }, [mapRef?.current, searchControl]);

  const handleClick = (e: any) => {
    if (!isClickableDisabled) {
      const { lat, lng } = e?.latlng;
      setClickedPosition([lat, lng]);
      //props features
      clickedPos && clickedPos({ lat, lng });
      onClick && onClick(e);
      //clear search settings when clicked
      if (searchControl) {
        searchControl.clearResults(null, true);
      }
      console.log(mapRef?.current);
      console.log(searchControl && searchControl);
    }
  };

  const ClickEventWrapper = () => {
    useMapEvents({
      click: handleClick
    });
    return null;
  };

  // Not loading glitch fixing with this code
  const ComponentResize = () => {
    const map = useMap();
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
    return null;
  };

  useEffect(()=>{
    console.log(customMarkers);
  },[customMarkers])

  return (
    <div id={"map"}>
      <MapContainer
        className={""}
        ref={mapRef}
        center={startPosition || (customMarkers && customMarkers[0]?.position) || position}
        zoom={zoom || 13}
        scrollWheelZoom={scrollWheelZoom || true}
      >
        {/*BASIC SETTINGS*/}
        <ComponentResize />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/*ON CLICK MARKER*/}
        <ClickEventWrapper />
        {clickedPosition && !isClickableDisabled ? <Marker position={clickedPosition} icon={icon}>
          {clickedPosPopup ? <Popup>{clickedPosPopup}</Popup> : null}
        </Marker> : null}
        {/*CUSTOM MARKERS*/}
        {customMarkers && customMarkers?.map((item: MarkerItem, key: number) => (
          <Marker
            key={key}
            position={item.position}
            icon={item.icon || icon}
          >
            {item?.popup ? <Popup>{item.popup}</Popup> : null}
          </Marker>))}
      </MapContainer>
    </div>
  );
};

export default LeafMap;
