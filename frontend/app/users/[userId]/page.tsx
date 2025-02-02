"use client";

import UserForm from "@/app/components/UserForm";
import { useParams } from "next/navigation";

export default function UserDetailPage() {
  const params = useParams();
  const userId = params?.userId as string;

  return (
    <div>
      <h1>Edit User: {userId}</h1>
      <UserForm userId={userId}/>
    </div>
  );
}
