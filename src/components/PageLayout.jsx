import { Outlet } from "react-router-dom";
import BackButton from "./BackButton";

export default function PageLayout() {
  return (
    <>
      
      <BackButton />
      <Outlet />
    </>
  );
}
