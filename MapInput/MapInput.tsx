import React, { useState } from "react";
import { Form, FormControlProps, Modal } from "react-bootstrap";
import LeafMap from "../LeafMap/LeafMap";
/*import Marker from '../../assets/icons/marker.svg'*/
import FeatherIcon from "feather-icons-react";
import "./MapInput.scss";

interface Types extends FormControlProps {
  onClick?: any;
  selectedPosition?: any;
  customMarkers?: MarkerItem[];
  className?: any;
}

interface MarkerItem {
  position: [number, number]; // [lat, lng]
  icon?: string | any; // url or item
  popup?: any; // ex: html element or fragment '<></>'
  label?: string;
}

const MapInput = ({ onClick, selectedPosition, customMarkers, className, ...props }: Types) => {
  const [show, setShow] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const handleCloseModal = () => {
    setShow(false);
  };

  return <div className={"map-main-container"}>
    <div className={"map-main-input"}>
      <Form.Control
        style={{ cursor: "pointer" }}
        readOnly
        type="text"
        placeholder={selectedAddress?.label || (selectedAddress?.lat ? selectedAddress?.lat + " - " + selectedAddress?.lng : null) || (customMarkers && customMarkers[0]?.label) || "Select Location"}
        onClick={() => {
          setShow(true);
          onClick && onClick();
        }}
        {...props}
        className={className}
      />
      <div className={"map-marker"}><FeatherIcon icon="map-pin" size={20} /></div>
      {/*<img className={"map-marker"} src={Marker} alt="marker" />*/}
    </div>
    <Modal
      size={"lg"}
      animation
      show={show}
      onHide={() => handleCloseModal()}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="bg-light" onHide={() => handleCloseModal()} closeButton>
        <Modal.Title className="m-0">Select Location</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {selectedAddress?.label || selectedAddress?.lat ? <div className="alert alert-info" role="alert">
          {selectedAddress?.label ? "Selected Location: " + selectedAddress?.label : null}
          {!selectedAddress?.label ? "Selected Position: " + selectedAddress?.lat + " - " + selectedAddress?.lng : null}
        </div> : null}
        <LeafMap
          startPosition={selectedAddress?.lat && selectedAddress?.lng ? [selectedAddress?.lat, selectedAddress?.lng] : undefined}
          customMarkers={customMarkers}
          selectedAddress={({ label, lat, lng }: any) => {
            setSelectedAddress({ lat, lng, label });
          }}
          clickedPos={(position: any) => {
            selectedPosition && selectedPosition(position);
            setSelectedAddress({ lat: position.lat, lng: position.lng, label: "" });
          }}
        />
      </Modal.Body>
    </Modal>
  </div>;
};

export default MapInput;
