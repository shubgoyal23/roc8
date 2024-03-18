import Link from "next/link";

export default function Home() {
  return (
    <div className="mt-10">

      <Link className="mx-3" href={"/"} >home Page</Link>
      <Link className="mx-3" href={"/login"} >Login</Link>
      <Link className="mx-3" href={"/register"}>Register</Link>
      <Link className="mx-3" href={"/dashboard"}>Dashboard</Link>
    </div>
  );
}
