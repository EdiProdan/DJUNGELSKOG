import React, { Fragment, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

import { UserResponse } from "../../api/userProfile/types";

type FriendsModalProps = {
  friendsList: UserResponse[];
};

export default function FriendsModal({ friendsList }: FriendsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <span className="ml-5">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-base px-4 py-2 text-sm font-medium text-white hover:bg-rose-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          {friendsList?.length}
        </button>
      </span>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full flex-col max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="w-full flex max-w-md">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 ml-40">
                      Prijatelji
                    </Dialog.Title>
                    <span className="ml-auto -mt-2">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        X
                      </button>
                    </span>
                  </div>
                  <hr className="mt-2" />
                  <div>
                    <ul className="mt-1">
                      {friendsList.map((friend) => (
                        <li key={friend.id} className="mt-1">
                          <button
                            onClick={() => {
                              closeModal();
                              navigate("/userProfile/" + friend.id);
                            }}
                          >
                            {"@" + friend.username}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
