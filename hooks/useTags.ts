import { useContext } from "react";
import { TagsContext } from "@/providers/TagsProvider";

const useTags = () => {
  const context = useContext(TagsContext);
  if (context === undefined) {
    throw new Error("useTags must be used within a TagsProvider");
  }
  return context;
};

export default useTags;
