import { useContext } from "react";
import { AuthorsContext } from "@/providers/AuthorsProvider";

const useAuthors = () => {
  const context = useContext(AuthorsContext);
  if (context === undefined) {
    throw new Error("useAuthors must be used within an AuthorsProvider");
  }
  return context;
};

export default useAuthors;
