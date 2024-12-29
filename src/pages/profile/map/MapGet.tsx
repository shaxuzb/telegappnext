import { TelegPage } from "@/components/TelegPage";
import { setHideNav } from "@/store/features/navbarBarSlice";
import { setHideSearch } from "@/store/features/searchBarSlice";
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

const MapGet = () => {
  const [queryParams] = useSearchParams();
  const [coordinates, _] = useState<[number, number]>([
      +queryParams.get("lat"),
    +queryParams.get("long"),
  ]);
  console.log(coordinates);
  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setHideSearch({ searchBar: false }));
    dispatch(setHideNav(false));

    return () => {
      dispatch(setHideSearch({ searchBar: true })); // Reset to visible if needed
      dispatch(setHideNav(true));
    };
  }, [dispatch]);
  return (
    <TelegPage back={true}>
      <div className="h-screen relative">
        <YMaps query={{ load: "geocode" }}>
          <Map
            defaultState={{
              center: coordinates,
              zoom: 10,
            }}
            width="100%"
            height="100%"
          >
            <Placemark
              geometry={coordinates}
            />
          </Map>
        </YMaps>
      </div>
    </TelegPage>
  );
};

export default MapGet;
