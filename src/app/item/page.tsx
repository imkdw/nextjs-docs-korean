import { getUserData } from "../actions/getItem";

export default async function ItemPage() {
  const userData = getUserData();

  return (
    <div>
      <h1>Item Page</h1>
      <p>User Data: {JSON.stringify(userData)}</p>
    </div>
  );
}
