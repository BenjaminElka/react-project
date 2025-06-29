// src/pages/CreateCard.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
} from "@mui/material";
import axios from "axios";

/* ---------- types ---------- */
interface FormState {
  title: string;
  subtitle: string;
  description: string;
  phone: string;
  email: string;
  web: string;
  image: { url: string; alt: string };
  address: {
    country: string;
    state: string;
    city: string;
    street: string;
    houseNumber: string;
    zip: string;
  };
}

/* ---------- tiny layout helper ---------- */
const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      gap: 2,
      width: "100%",
    }}
  >
    {children}
  </Box>
);

/* ---------- component ---------- */
const CreateCard = () => {
  const [open, setOpen] = useState(true);

  const [formData, setFormData] = useState<FormState>({
    title: "",
    subtitle: "",
    description: "",
    phone: "",
    email: "",
    web: "",
    image: { url: "", alt: "" },
    address: {
      country: "",
      state: "",
      city: "",
      street: "",
      houseNumber: "",
      zip: "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("image.")) {
      setFormData((prev) => ({
        ...prev,
        image: { ...prev.image, [name.split(".")[1]]: value },
      }));
    } else if (name.startsWith("address.")) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name.split(".")[1]]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards",
        formData
      );
      alert("Card created successfully!");
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error creating card — see console for details.");
    }
  };

  /* ---------- render ---------- */
  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={() => setOpen(false)}>
      <DialogTitle>Create Card</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Row>
            <TextField name="title" label="Title" fullWidth onChange={handleChange} />
            <TextField name="subtitle" label="Subtitle" fullWidth onChange={handleChange} />
          </Row>

          <TextField
            name="description"
            label="Description"
            fullWidth
            onChange={handleChange}
          />

          <Row>
            <TextField name="phone" label="Phone" fullWidth onChange={handleChange} />
            <TextField name="email" label="Email" type="email" fullWidth onChange={handleChange} />
          </Row>

          <TextField name="web" label="Website" fullWidth onChange={handleChange} />

          <Row>
            <TextField name="image.url" label="Image URL" fullWidth onChange={handleChange} />
            <TextField name="image.alt" label="Image Alt" fullWidth onChange={handleChange} />
          </Row>

          <Row>
            <TextField
              name="address.country"
              label="Country"
              fullWidth
              onChange={handleChange}
            />
            <TextField name="address.state" label="State" fullWidth onChange={handleChange} />
            <TextField name="address.city" label="City" fullWidth onChange={handleChange} />
          </Row>

          <Row>
            <TextField
              name="address.street"
              label="Street"
              fullWidth
              onChange={handleChange}
            />
            <TextField
              name="address.houseNumber"
              label="House #"
              fullWidth
              onChange={handleChange}
            />
            <TextField name="address.zip" label="ZIP" fullWidth onChange={handleChange} />
          </Row>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCard;




