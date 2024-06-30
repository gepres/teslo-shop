
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { UsersTable } from './ui/UsersTable';
import { getPaginatedUsers } from '@/actions';

export default async function UsersPage() {

  const {ok, users = []} = await getPaginatedUsers()

  if (!ok) {
    redirect('/')
  }




  return (
    <>
      <Title title="Mantenimientos de usuarios" />

      <div className="mb-10">
        <UsersTable users={users} />
      </div>
    </>
  );
}