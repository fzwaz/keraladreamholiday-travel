"use client";

import { useState } from "react";
import PackagesExplorer from "@/components/PackagesExplorer";
import { ChipRow } from "@/components/packages-ui";
import { PACKAGE_GROUPS, type TourPackage } from "@/lib/site";

export default function PackagesBrowser({
  packages,
  allDestinations,
}: {
  packages: TourPackage[];
  allDestinations: string[];
}) {
  const [group, setGroup] = useState("kerala");
  return (
    <>
      <ChipRow groups={PACKAGE_GROUPS} value={group} onChange={setGroup} />
      <PackagesExplorer packages={packages} allDestinations={allDestinations} group={group} />
    </>
  );
}
