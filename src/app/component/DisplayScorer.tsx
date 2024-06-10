import { Scorer } from "@/types/Scorer";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type Props = {
  scorers: Scorer[]
}

const columns: GridColDef[] = [
  { field: 'rank', headerName: '順位', width: 70},
  { field: 'scorer_name', headerName: '選手', width: 150},
  { field: 'team_name', headerName: 'チーム', width: 150},
  { field: 'score', headerName: '得点数', width: 70},
]

const DisplayScorer = ({ scorers }: Props) => {

  return (
    <>
      <DataGrid
        rows={scorers}
        columns={columns}
      />
    </>
  )
};

export default DisplayScorer;