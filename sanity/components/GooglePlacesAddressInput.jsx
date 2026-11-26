import { useEffect, useMemo, useState } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { Button, Card, Flex, Stack, Text, TextInput } from "@sanity/ui";
import { set, unset, useClient, useFormValue } from "sanity";

const GOOGLE_LIBRARIES = ["places"];

export function GooglePlacesAddressInput(props) {
  const { onChange, value } = props;

  const client = useClient({ apiVersion: "2025-05-08" });
  const documentId = useFormValue(["_id"]);
  const coordinatesValue = useFormValue(["coordinates"]);
  const apiKey =
    process.env.SANITY_STUDIO_GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    "";

  const [autocomplete, setAutocomplete] = useState(null);
  const [query, setQuery] = useState(typeof value === "string" ? value : "");
  const [statusMessage, setStatusMessage] = useState("");
  const [authError, setAuthError] = useState("");

  const { isLoaded, loadError } = useJsApiLoader({
    id: "studio-google-places-address",
    googleMapsApiKey: apiKey || "missing-key",
    libraries: GOOGLE_LIBRARIES,
    preventGoogleFontsLoading: true,
  });

  useEffect(() => {
    if (typeof value === "string" && value !== query) setQuery(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const previousAuthFailure = window.gm_authFailure;
    window.gm_authFailure = () => {
      setAuthError(
        "Google auth failed (gm_authFailure). Verifica cheia, referrer restrictions si billing."
      );
    };

    return () => {
      window.gm_authFailure = previousAuthFailure;
    };
  }, []);

  const currentCoordinates = useMemo(() => {
    const lat = coordinatesValue?.lat;
    const lng = coordinatesValue?.lng;
    if (typeof lat !== "number" || typeof lng !== "number") return null;
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }, [coordinatesValue]);

  const handlePlaceChanged = async () => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    const location = place?.geometry?.location;
    const formattedAddress = place?.formatted_address || "";

    if (!location || !formattedAddress) {
      setStatusMessage(
        "Selecteaza o sugestie Google care contine geometrie (lat/lng)."
      );
      return;
    }

    const lat = typeof location.lat === "function" ? location.lat() : location.lat;
    const lng = typeof location.lng === "function" ? location.lng() : location.lng;

    onChange(set(formattedAddress));
    setQuery(formattedAddress);

    if (!documentId || typeof documentId !== "string") {
      setStatusMessage(
        "Adresa a fost salvata. Salveaza documentul o data pentru a putea scrie automat coordonatele."
      );
      return;
    }

    try {
      await client
        .patch(documentId)
        .set({ coordinates: { _type: "geopoint", lat, lng } })
        .commit();
      setStatusMessage("Adresa si coordonatele au fost completate automat.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Eroare necunoscuta";
      setStatusMessage(
        `Adresa a fost salvata, dar coordonatele nu au putut fi scrise: ${message}`
      );
    }
  };

  const clearAll = async () => {
    onChange(unset());
    setQuery("");

    if (!documentId || typeof documentId !== "string") {
      setStatusMessage("Adresa a fost stearsa.");
      return;
    }

    try {
      await client.patch(documentId).unset(["coordinates"]).commit();
      setStatusMessage("Adresa si coordonatele au fost sterse.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Eroare necunoscuta";
      setStatusMessage(
        `Adresa a fost stearsa, dar coordonatele nu au putut fi sterse: ${message}`
      );
    }
  };

  const debugError = loadError?.message || authError;
  const debugHint = (() => {
    const message = String(debugError || "").toLowerCase();
    if (!message) return "";
    if (message.includes("referernotallowed")) {
      return "Referrer blocat: adauga `http://localhost:3000/*` in API key restrictions.";
    }
    if (message.includes("billingnotenabled")) {
      return "Billing neactiv: activeaza Billing pe proiectul Google Cloud.";
    }
    if (message.includes("apinotactivated")) {
      return "API inactiva: activeaza `Maps JavaScript API` si `Places API`.";
    }
    if (message.includes("invalidkeymaperror") || message.includes("apikey")) {
      return "Cheie invalida sau nepotrivita: verifica valoarea cheii si proiectul Google Cloud.";
    }
    return "Verifica consola browser pentru detalii complete Google Maps.";
  })();

  return (
    <Stack space={3}>
      <Card tone="transparent" border padding={3} radius={2}>
        <Stack space={3}>
          <Text size={1}>
            Introdu adresa si selecteaza o sugestie. Coordonatele se salveaza
            automat.
          </Text>

          {!apiKey ? (
            <Text size={1} muted>
              Lipseste cheia Google Maps. Configureaza{" "}
              <code>SANITY_STUDIO_GOOGLE_MAPS_API_KEY</code> (sau fallback{" "}
              <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>).
            </Text>
          ) : debugError ? (
            <Stack space={2}>
              <Text size={1}>
                Eroare Google Maps: <code>{debugError}</code>
              </Text>
              <Text size={1}>{debugHint}</Text>
            </Stack>
          ) : !isLoaded ? (
            <Text size={1}>Se incarca Google Places...</Text>
          ) : (
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
          )}

          <Flex gap={2} align="center" justify="space-between">
            <Button
              mode="ghost"
              text="Sterge adresa"
              tone="critical"
              onClick={clearAll}
            />
            {currentCoordinates && <Text size={1}>Coordonate: {currentCoordinates}</Text>}
          </Flex>

          {statusMessage ? <Text size={1}>{statusMessage}</Text> : null}
        </Stack>
      </Card>
    </Stack>
  );
}
