import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/hooks/typed-hooks";
import {
  IChat,
  clearChat,
  saveChat,
  updateChat,
  deleteChat,
  incrementVote,
  decrementVote,
  selectChats,
} from "@/features/chats.slice";
import { getTimeStamp } from "@/utils";

interface IFormInput {
  message: string;
}

const Home = () => {
  const chats = useAppSelector(selectChats);
  const dispatch = useAppDispatch();
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<IFormInput>();
  const [editMode, setEditMode] = useState<{ id: number | null; message: string | null }>({ id: null, message: null });

  const onSubmit: SubmitHandler<IFormInput> = ({ message }) => {
    if (editMode.id !== null) {
      dispatch(updateChat({ id: editMode.id, message, timestamp: getTimeStamp() }));
      setEditMode({ id: null, message: null });
    } else {
      const userImage = `https://i.pravatar.cc/48?img=${Math.floor(Math.random() * 70) + 1}`;
      const request: IChat = {
        id: chats.length + 1,
        message,
        author: "user",
        timestamp: getTimeStamp(),
        userImage,
        votes: 0,
      };
      dispatch(saveChat(request));
    }
    reset();
  };

  const handleEdit = (id: number, message: string) => {
    setEditMode({ id, message });
    setValue("message", message);
  };

  const handleReply = (message: string) => {
    setValue("message", `@${message}: `);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteChat(id));
  };

  const handleIncrementVote = (id: number) => {
    dispatch(incrementVote(id));
  };

  const handleDecrementVote = (id: number) => {
    dispatch(decrementVote(id));
  };

  // listen for chat changes and scroll the view
  useEffect(() => {
    chatBoxRef?.current?.scrollBy({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chats]);

  return (
    <>
      <Head>
        <title>Chat</title>
        <meta name="description" content="Generated for create next chat app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-gray-100 min-h-screen flex flex-col items-center py-8">

        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl mx-auto">
          <div
            ref={chatBoxRef}
            className="overflow-y-auto h-80 mb-4 border rounded p-4"
          >
            {chats.map(({ id, author, message, timestamp, userImage, votes }, index) => (
              <div
                key={index}
                className={`flex justify-end mb-1`}
              >
                <div className={`flex flex-row-reverse items-center w-4/5`}>
                  <img
                    src={userImage}
                    alt={author}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-end space-x-2">
                        <button
                          className="text-blue-500 text-sm"
                          onClick={() => handleReply(message)}
                        >
                          Reply
                        </button>
                        <button
                          className="text-green-500 text-sm"
                          onClick={() => handleEdit(id, message)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 text-sm"
                          onClick={() => handleDelete(id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex flex-col items-center">
                        <button
                          className="text-green-500"
                          onClick={() => handleIncrementVote(id)}
                        >
                          +
                        </button>
                        <span className="mx-2">{votes}</span>
                        <button
                          className="text-red-500"
                          onClick={() => handleDecrementVote(id)}
                        >
                          -
                        </button>
                      </div>
                      <p
                        className={`p-4 rounded-lg bg-blue-500 text-white ml-4 flex-1`}
                      >
                        {message}
                      </p>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat input */}
          <form
            className="flex items-center border-t border-gray-200 pt-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              {...register("message", { required: true })}
              placeholder="Add a Comment"
              className="flex-1 p-2 border rounded-l-lg"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-r-lg flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </form>
          {errors.message && <span className="text-red-500">This field is required</span>}
        </div>
      </main>
    </>
  );
};

export default Home;
