import React from "react";

import { Form, useFormikContext } from "formik";
import { Map } from "leaflet";
import { useNavigate } from "react-router-dom";

import { WishlistEntryRequest } from "../../api/WishlistEntry/types";
import DatePicker from "../../components/Formik/DatePicker";
import FormikAutocompleteField from "../../components/Formik/FormikAutocompleteField";
import { FullLocationResponse } from "../Locations/types";
import FormButtonWishlist from "./FormButtonWishlist";

export default function WishlistForm({ map, locations }: { map?: Map; locations: FullLocationResponse[] }) {
  const navigate = useNavigate();
  const { errors, touched, handleSubmit, isSubmitting, setFieldValue } = useFormikContext<WishlistEntryRequest>();
  const [selectedItem, setSelectedItem] = React.useState<FullLocationResponse>({
    id: 0,
    name: "",
  } as FullLocationResponse);

  React.useEffect(() => {
    if (map && selectedItem && selectedItem.id !== 0) {
      map.flyTo({ lat: selectedItem.lat, lng: selectedItem.lng }, 11);
    }
  }, [map, selectedItem]);

  return (
    <Form className="flex w-full flex-row p-6">
      <div className="flex-col w-full">
        <div className="flex mb-5">
          <FormikAutocompleteField
            name="locationId"
            label="Location"
            data={locations}
            filterBy="name"
            id="id"
            value={selectedItem}
            onChange={setSelectedItem}
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="flex">
          <p className="mt-2">Until: </p>
          <div className="ml-4 mt-2" style={{ zIndex: 9999 }}>
            <DatePicker
              selected={new Date()}
              dateFormat="dd.MM.yyyy"
              className="form-control"
              name="visitBefore"
              onChange={(date) => setFieldValue("visitBefore", date && date.toISOString())}
            />
          </div>
        </div>
        <div className="flex flex-row justify-end mt-4">
          <FormButtonWishlist
            text="Odbaci"
            className="w-auto mr-3 bg-[#FF708B]"
            onClick={() => navigate("/wishlist")}
            isDisabled={false}
            isSubmit={false}
          />
          <FormButtonWishlist
            text="Spremi"
            className="w-auto ml-3 bg-[#383874]"
            onClick={() => handleSubmit()}
            isDisabled={isSubmitting}
          />
        </div>
      </div>
    </Form>
  );
}
