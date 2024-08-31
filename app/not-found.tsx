import NotFound from "@/components/NotFound/NotFound";

export default function Error404() {
  return (
    <NotFound 
      title="404 - Page non trouvée"
      description="Oops! La page que vous recherchez n'existe pas. Retournez à la page d'accueil pour continuer à naviguer."
      linkText="Retourner à la page d'Accueil"
      linkHref="/"
    />
  );
}
