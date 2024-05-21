
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AuthLayout({
 children
}: {
 children: React.ReactNode;
}) {
  const session = await auth();
console.log({session});

if(session?.user) {
  redirect('/')
}

  return (


    <main className="flex justify-center">
      <div className="w-full sm:w-[350px] px-1">

      {children}
      </div>
    </main>
  );
}