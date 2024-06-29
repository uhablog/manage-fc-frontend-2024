import { Squad } from "@/types/Squads";
import { useEffect, useState } from "react";
import DisplaySquad from "./Squad";

type Props = {
  team_id: string
}

const TeamSquad = ({team_id}: Props) => {

  const [ squads, setSquads ] = useState<Squad[]>([]);

  useEffect(() => {
    const fetchSquads = async () => {
      const res = await fetch(`/api/team/squads?team_id=${team_id}`);
      const json = await res.json();
      setSquads(json.squads);
    };
    fetchSquads()
  }, [team_id]);

  return (
    <DisplaySquad squad={squads} />
  )
}

export default TeamSquad;