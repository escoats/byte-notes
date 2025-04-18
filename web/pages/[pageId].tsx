import { usePathname } from "next/navigation"

export default function Page() {
  const pathname = usePathname();
  const pageId = pathname.slice(1)
  return (
    <div>
      <p>This is a published page!</p>
      <p>page path: {pathname} </p>
      <p>page id: {pageId}</p>
    </div>
  );
}
