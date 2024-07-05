import { MetaFunction } from "@remix-run/node";
import tabledata from "./tabeldata";
import Page from "./tabeldata";

export const meta: MetaFunction = () => {
  return [
    { title: "CRUD" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="bg-black w-screen h-screen text-white">
      <Page tabledata={tabledata} />
    </div>
  );
}
