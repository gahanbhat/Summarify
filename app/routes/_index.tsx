// app/routes/index.tsx
import { FC } from "react";
import Editor from "~/components/Editor";

const Home: FC = () => {
  return (
    <div className="min-h-screen max-w-screen flex flex-col overflow-hidden items-center justify-center bg-gray-100 dark:bg-neutral-700">
      <Editor />
    </div>
  );
};

export default Home;
