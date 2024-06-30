import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CheckoutLayout({
 children
}: {
 children: React.ReactNode;
}) {

  // const session = await auth()

  // if(!session?.user) {
  //   redirect('/auth/login')
    
  // }


  return (
    <>
      { children }    
    </>
  );
}