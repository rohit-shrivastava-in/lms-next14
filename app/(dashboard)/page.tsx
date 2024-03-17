import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (<p className="text-3xl font-medium text-sky-700">
    <UserButton afterSignOutUrl="/" />
  </p>)
}
