import type { Metadata } from "next";
import { TopPageComponent } from "./component/TopPage";

export const metadata: Metadata = {
  title: "MaeMob | サッカー大会・試合管理アプリ",
  description: "MaeMobは、大会登録・試合結果入力・個人成績の集計までを一元管理できるサッカー大会運営向けアプリです。",
};

const TopPage = () => {
  return (
    <>
      <TopPageComponent/>
    </>
  )
};

export default TopPage;
