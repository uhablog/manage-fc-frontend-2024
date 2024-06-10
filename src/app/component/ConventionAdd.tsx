import { Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";

const ConventionAdd = () => {

  const router = useRouter();

  const validateForm = () => {
    return true
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    router.push('/conventions');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          label="test"
        />
        <Button type="submit" variant="contained" color="primary">
          大会を登録
        </Button>
      </form>
    </>
  )
};

export default ConventionAdd;