import { useMemo, useState } from "react";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { Button, Card, Flex, Stack, Text, TextInput } from "@sanity/ui";
import { set, unset, useFormValue } from "sanity";

const GOOGLE_LIBRARIES = ["places"];

export function GooglePlacesGeopointInput(props) {
  const { onChange, value, renderDefault } = props;
  const addressValue = useFormValue(["address"]);
  const apiKey =
    process.env.SANITY_STUDIO_GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    "";

  const [autocomplete, setAutocomplete] = useState(null);
  const [query, setQuery] = useState(
    typeof addressValue === "string" ? addressValue : ""
  );
  const [statusMessage, setStatusMessage] = useState("");

  const currentCoordinates = useMemo(() => {
    if (!value?.lat || !value?.lng) return null;
    return `${value.lat.toFixed(6)}, ${value.lng.toFixed(6)}`;
  }, [value]);

  const handlePlaceChanged = () => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    const location = place?.geometry?.location;

    if (!location) {
      setStatusMessage(
        "Nu am putut extrage coordonate. Selecteaza o adresa din lista Google."
      );
      return;
    }

    const lat = typeof location.lat === "function" ? location.lat() : location.lat;
    const lng = typeof location.lng === "function" ? location.lng() : location.lng;

    onChange(set({ _type: "geopoint", lat, lng }));
    setStatusMessage("Coordonatele au fost completate automat.");

    if (place?.formatted_address) {
      setQuery(place.formatted_address);
    }
  };

  const clearCoordinates = () => {
    onChange(unset());
    setStatusMessage("Coordonatele au fost sterse.");
  };

  return (
    <Stack space={3}>
      <Card tone="transparent" border padding={3} radius={2}>
        <Stack space={3}>
          <Text size={1}>
            Cauta adresa prin Google si selecteaza o sugestie pentru a completa
            automat coordonatele.
          </Text>

          {!apiKey ? (
            <Text size={1} muted>
              Lipseste cheia Google Maps. Configureaza{" "}
              <code>SANITY_STUDIO_GOOGLE_MAPS_API_KEY</code> (sau{" "}
              <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>).
            </Text>
          ) : (
            <LoadScript googleMapsApiKey={apiKey} libraries={GOOGLE_LIBRARIES}>
              <Autocomplete
                onLoad={setAutocomplete}
                onPlaceChanged={handlePlaceChanged}
              >
                <TextInput
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  placeholder="Ex: Strada, numar, localitate"
                />
              </Autocomplete>
            </LoadScript>
          )}

          <Flex gap={2} align="center">
            <Button
              mode="ghost"
              text="Sterge coordonatele"
              tone="critical"
              onClick={clearCoordinates}
            />
            {currentCoordinates && (
              <Text size={1}>Curent: {currentCoordinates}</Text>
            )}
          </Flex>

          {statusMessage ? <Text size={1}>{statusMessage}</Text> : null}
        </Stack>
      </Card>

      {renderDefault(props)}
    </Stack>
  );
}
