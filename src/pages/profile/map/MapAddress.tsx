import { TelegPage } from "@/components/TelegPage";
import { Button } from "@/components/ui/button";
import useAxios from "@/hooks/useAxios";
import { setHideNav } from "@/store/features/navbarBarSlice";
import { setHideSearch } from "@/store/features/searchBarSlice";
import { useAppDispatch } from "@/store/hooks";
import {
  Map,
  Placemark,
  YMaps,
} from "@pbe/react-yandex-maps";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaLocationArrow } from "react-icons/fa6";
import { useNavigate, useSearchParams } from "react-router-dom";
interface AddressProps {
  name: string;
  requiredLocation: boolean;
  selected: boolean;
  long_lat: string;
}
interface AddressComponentProps {
  name: string;
  kind: string;
}
const MapAddress = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation();
  const navigate = useNavigate();
  const axiosPrivate = useAxios();
  const [queryParams] = useSearchParams();
  const [coordinates, setCoordinates] = useState<[number, number]>([
    queryParams.get("lat") ? +queryParams.get("lat") : 41.311158,
    queryParams.get("long") ? +queryParams.get("long") : 69.279737,
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(10);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [loadingSend, setLoadingSend] = useState<boolean>(false);
  const [address, setAddress] = useState<AddressProps | null>({
    name: queryParams.get("name")
      ? queryParams.get("name")
      : "проспект Амира Темура, 13",
    requiredLocation: true,
    selected: false,
    long_lat: coordinates.join(","),
  });

  const handleDragEnd = async (coord: [number, number]) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://geocode-maps.yandex.ru/1.x/?apikey=1fefb563-821c-4a64-90d3-1db6133f51c8&geocode=${coord[1]},${coord[0]}&format=json`
      );
      if (response) {
        const featureMember =
          response.data.response.GeoObjectCollection.featureMember;
        if (featureMember && featureMember.length > 0) {
          const addresComponents =
            featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address
              .Components;
          setAddress({
            name: featureMember[0].GeoObject.name,
            requiredLocation: addresComponents.some(
              (item: AddressComponentProps) =>
                item.kind === "province" && item.name.includes("Ташкент")
            ),
            selected: true,
            long_lat: coord.join(","),
          });
          setLoading(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleBoundsChange = (e: any) => {
    const newCenter = e.get("target").getCenter(); // Get new center coordinates after drag
    handleDragEnd(newCenter);
    setCoordinates(newCenter); // Update state to reflect new center
  };

  const handleSendData = async () => {
    setLoadingSend(true);
    try {
      const response = await axiosPrivate.post(
        queryParams.get("id")
          ? `/editaddress/${queryParams.get("id")}`
          : "/addaddress",
        address,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.data) {
        setLoadingSend(false);
        navigate(-1);
      }
    } catch (err) {
      setLoadingSend(false);
      console.log(err);
    }
  };
  const handleGetLocation = () => {
    setLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates([latitude, longitude]);
          setLoadingLocation(false);
          setZoom(10)
        },
        (err) => {
          setCoordinates(null); // Clear location on error
          console.log(err);
          setLoadingLocation(false);
        }
      );
    } else {
      setLoadingLocation(false);

    }
  };

   useEffect(() => {
      document.body.classList.remove("pb-14");
      document.body.classList.remove("pb-20");
      dispatch(setHideSearch({ searchBar: false }));
      dispatch(setHideNav(false));
      return () => {
        dispatch(setHideSearch({ searchBar: true }));
        document.body.classList.add("pb-20");

        dispatch(setHideNav(true));
      };
    }, [dispatch]);

  return (
    <TelegPage back={true}>
      <div className="h-screen overflow-hidden relative">
        <img
          width={15}
          src="https://www.pngplay.com/wp-content/uploads/9/Map-Marker-Free-Picture-PNG.png"
          alt="place"
          className="absolute left-[calc(50%_-_5px)] top-[calc(50%_-_20px)] -translate-1/2 z-20 "
        />
        <YMaps query={{ load: "geocode" }}>
          <Map
            state={{
              center: coordinates,
              zoom: zoom,
            }}
            width="100%"
            height="100%"
            onBoundsChange={handleBoundsChange}
            onDragStart={() => setLoading(true)}
          >
            <Placemark
              geometry={coordinates}
              options={{
                iconLayout: "default#image",
                iconImageHref: "sd",
                iconImageSize: [40, 40], // Marker size
                iconImageOffset: [-20, -20], // Center the marker
              }}
              properties={{
                iconContent: "Center Marker",
              }}
              // onDragend={handleDragEnd} // Update map center when placemark is dragged
            />
            <div style={{ textAlign: "center", margin: "10px 0" }}></div>
          </Map>
          <Button className="absolute bottom-32 right-3 h-8 w-8 p-0 shadow" variant="secondary" onClick={handleGetLocation}>
            {loadingLocation?
            <span className="loader !border-ring !w-4 !h-4"></span>:
            <FaLocationArrow  fontSize="20px" />}
          </Button>

          <div className="absolute bottom-0 bg-white w-full z-30 min-h-28 px-3 flex justify-center items-center">
            {loading ? (
              <div className="w-full flex justify-center items-center">
                <span className="loader !border-ring"></span>
              </div>
            ) : address?.requiredLocation ? (
              <div className="flex flex-col items-center w-full">
                <p className="text-2xl text-center font-mono font-medium py-3 h-1/2">
                  {address?.name}
                </p>
                <div className="h-1/2 pb-4 w-full">
                  <Button
                    className={`w-full py-6 rounded-lg text-lg ${
                      !address.selected && "opacity-50 pointer-events-none"
                    }`}
                    disabled={loadingSend ? true : false}
                    onClick={handleSendData}
                  >
                    {loadingSend ? (
                      <span className="loader !w-8 !h-8"></span>
                    ) : queryParams.get("name") ? (
                      t("profile.map.button.change")
                    ) : (
                      t("profile.map.button.create")
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-2xl text-center font-mono font-medium">
                {t("profile.map.onlyRequiredAddress")}
              </div>
            )}
          </div>
        </YMaps>
      </div>
    </TelegPage>
  );
};

export default MapAddress;
