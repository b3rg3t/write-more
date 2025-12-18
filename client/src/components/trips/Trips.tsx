import { Container } from "@mui/material";
import { TripFormModal } from "../modal/TripFormModal";
import { DeleteTripModal } from "../modal/DeleteTripModal";
import { TripList } from "./TripList";

export const Trips = () => (
  <>
    <TripFormModal />
    <DeleteTripModal />
    <Container maxWidth="md" sx={{ px: 0, py: 2 }}>
      <TripList />
    </Container>
  </>
);
