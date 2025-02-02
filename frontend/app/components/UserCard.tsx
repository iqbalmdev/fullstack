import { User } from "../../types";

interface Props {
  user: User;
}

export default function UserCard({ user }: Props) {
  return (
    <div className="card bg-white shadow-md p-4">
      <h2 className="font-bold">{'Admin'}</h2>
      <p>{user.email}</p>
    </div>
  );
}
