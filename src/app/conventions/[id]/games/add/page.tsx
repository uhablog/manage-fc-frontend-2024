import GameAdd from "@/app/component/GameAdd";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default withPageAuthRequired(async function GameAddPage() {
  return (
    <>
      <GameAdd/>
    </>
  )
}); 