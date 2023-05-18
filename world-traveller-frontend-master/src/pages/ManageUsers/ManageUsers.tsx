import React from "react";

import { Dialog } from "@headlessui/react";
import { LockClosedIcon, LockOpenIcon, TrashIcon } from "@heroicons/react/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { AuthenticatedUserResponse } from "../../api/auth/types";
import paths from "../../api/paths";
import ActionButton from "../../components/ActionButton/ActionButton";
import Card from "../../components/Card/Card";
import { useClient } from "../../components/ClientProvider/ClientProvider";
import DataTable, { TableItem } from "../../components/DataTable/DataTable";
import { parseError } from "../../components/Formik/FormWrapper";

export default function ManageUsers() {
  const { client } = useClient();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<AuthenticatedUserResponse[], string>({
    queryKey: ["allUsers"],
    queryFn: () => client.get(paths.user.all),
    enabled: !!client.token,
  });

  const { mutate: deleteMutation } = useMutation<void, string, { id: string | number }>({
    mutationKey: ["deleteUser"],
    mutationFn: ({ id }) => client.delete(paths.user.delete(id)),
    onSuccess: () => {
      queryClient.refetchQueries(["allUsers"]);
      toast.dismiss();
      toast.success("Korisnik izbrisan");
      setChangeOngoing(false);
    },
    onError: (error) => parseError(error),
  });

  const { mutate: activateMutation } = useMutation<void, string, { id: string | number; active: boolean }>({
    mutationKey: ["activateUser"],
    mutationFn: ({ id, active }) =>
      active ? client.put(paths.user.activate(id)) : client.put(paths.user.deactivate(id)),
    onSuccess: () => {
      queryClient.refetchQueries(["allUsers"]);
      toast.dismiss();
      toast.success("Aktivnost korisničkog računa promijenjena");
      setChangeOngoing(false);
    },
    onError: (error) => parseError(error),
  });

  const { mutate: assignRoleMutation } = useMutation<void, string, { user: AuthenticatedUserResponse; role: string }>({
    mutationKey: ["assignRole"],
    mutationFn: ({ user, role }) =>
      !user.roles.includes(role)
        ? client.put(paths.user.assignRole(user.id), { role })
        : client.put(paths.user.removeRole(user.id), { role }),
    onSuccess: () => {
      queryClient.refetchQueries(["allUsers"]);
      toast.dismiss();
      toast.success("Korisnička uloga promijenjena");
      setChangeOngoing(false);
    },
    onError: (error) => parseError(error),
  });

  const [changeOngoing, setChangeOngoing] = React.useState(false);

  const [modal, setModal] = React.useState<{
    show: boolean;
    user: AuthenticatedUserResponse;
    title: string;
    text: string;
    confirmAction?: () => void;
  }>({
    show: false,
    user: {} as AuthenticatedUserResponse,
    title: "",
    text: "",
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const deleteAction = (user: TableItem<AuthenticatedUserResponse>) => (
    <div
      className="mx-auto bg-red-400 w-fit h-fit p-2 rounded-xl cursor-pointer hover:opacity-50"
      onClick={() =>
        setModal({
          show: true,
          user: user,
          title: `Brisanje korisnika ${user.username}`,
          text: `Jeste li sigurni da želite obrisati korisnika ${user.username}?`,
          confirmAction: () => {
            if (changeOngoing) return;

            setChangeOngoing(true);
            toast.loading(`Brisanje korisnika ${user.username}`);
            deleteMutation({ id: user.id });
          },
        })
      }
    >
      <TrashIcon className="w-4 h-4 text-white" />
    </div>
  );

  const activateAction = (user: TableItem<AuthenticatedUserResponse>) => (
    <div
      className={`mx-auto ${
        user.active ? "bg-amber-600" : "bg-emerald-300"
      } w-fit h-fit p-2 rounded-xl cursor-pointer hover:opacity-50`}
      onClick={() =>
        setModal({
          show: true,
          user: user,
          title: `Postavljanje korisnika ${user.username} kao ${user.active ? "neaktivnog" : "aktivnog"}`,
          text: `Jeste li sigurni da želite postaviti korisnika ${user.username} kao ${
            user.active ? "neaktivnog" : "aktivnog"
          }?`,
          confirmAction: () => {
            if (changeOngoing) return;

            setChangeOngoing(true);
            toast.loading(`Postavljanje korisnika ${user.username} kao ${user.active ? "neaktivnog" : "aktivnog"}`);
            activateMutation({ id: user.id, active: !user.active });
          },
        })
      }
    >
      {user.active ? (
        <LockClosedIcon className="w-4 h-4 text-white" />
      ) : (
        <LockOpenIcon className="w-4 h-4 text-white" />
      )}
    </div>
  );

  const resetModal = () => setModal({ show: false, user: {} as AuthenticatedUserResponse, title: "", text: "" });

  return (
    <div className="flex flex-col mt-20 items-center p-6">
      <DataTable
        data={data}
        frontendPagination={true}
        columnNames={{
          name: "Ime",
          surname: "Prezime",
          username: "Korisničko ime",
          active: "Aktivan",
          email: "Email",
          roles: "Uloge",
        }}
        searchBy={["name", "surname", "email"]}
        filterBy={"roles"}
        filterByNames={{
          ADMIN: "Administrator",
          CARTOGRAPHER: "Kartograf",
          USER: "Korisnik",
        }}
        commaSeparatedFilter={true}
        commaSeparatedFilterOnClick={(user, val) => {
          if (changeOngoing) return;

          setChangeOngoing(true);
          assignRoleMutation({ user, role: val as string });
          resetModal();
          queryClient.refetchQueries(["allUsers"]);
        }}
        actions={[deleteAction, activateAction]}
      />
      <Dialog open={modal.show} onClose={() => resetModal()} style={{ zIndex: 9999, position: "relative" }}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Card className="w-96 flex flex-col justify-center">
            <Dialog.Panel className="py-6 px-10 flex flex-col items-center gap-4">
              <Dialog.Title className="text-lg font-bold gap-2 text-center break-words w-full">
                {modal.title}
              </Dialog.Title>
              <p className="text-sm text-gray-500 text-center break-words w-full">{modal.text}</p>
              <div className="flex flex-row w-full gap-8 mt-10">
                <ActionButton text="Odustani" onClick={() => resetModal()} className="bg-gray-500 w-full" />
                <ActionButton
                  text="Potvrdi"
                  onClick={() => {
                    modal.confirmAction?.();
                    resetModal();
                  }}
                  className="w-full bg-red-500"
                />
              </div>
            </Dialog.Panel>
          </Card>
        </div>
      </Dialog>
    </div>
  );
}
