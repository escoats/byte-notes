import { usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();
  const pageId = pathname?.slice(1);
  return (
    <div>
      <p>This is a published page!</p>
      {pathname && <p>page path: {pathname}</p>}
      {pageId && <p>page id: {pageId}</p>}
    </div>
  );
}
