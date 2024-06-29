import { Squad } from "@/types/Squads";
import { useEffect, useState } from "react";
import DisplaySquad from "./Squad";

type Props = {
  user_id: string
}

const UserSquad = ({user_id}: Props) => {

  const [ squads, setSquads ] = useState<Squad[]>([]);

  useEffect(() => {
    const fetchSquads = async () => {
      const res = await fetch(`/api/user/squads?user_id=${user_id}`, {method: 'GET'});
      const json = await res.json();
      setSquads(json.squads);
    };
    fetchSquads()
  }, [user_id]);

  return (
    <DisplaySquad squad={squads} />
  )
}

export default UserSquad;