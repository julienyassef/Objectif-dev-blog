import { useContext } from "react";
import { ArticlesContext } from "@/providers/ArticlesProvider";

const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (context === undefined) {
    throw new Error("useArticles must be used within an ArticlesProvider");
  }
  return context;
};

export default useArticles;
