"use client";

import { useSession } from "next-auth/react";
import useGetMe from "./hooks/useGetMe";

function InitUser() {
  const { status } = useSession();
  // console.log(status);
  // if (status == "authenticated") {
  //   useGetMe();
  // }
  useGetMe(status == "authenticated");
  return null;
}

export default InitUser;
