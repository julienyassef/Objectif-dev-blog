import Head from "next/head";
import Link from "next/link";

interface NotFoundProps {
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

export const metadata = {
  title: "404 - Page non trouvée",
  description: "Oops! La page que vous recherchez n'existe pas. Retournez à la page d'accueil pour continuer à naviguer.",
};

const NotFound: React.FC<NotFoundProps> = ({ title, description, linkText, linkHref }) => {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-5xl font-bold text-black-800 mb-4">{title}</h1>
        <p className="text-lg text-black-600 mb-8">{description}</p>
        <Link 
        href={linkHref}
        className="text-white bg-primary hover:bg-[#e6b800] py-2 px-4 rounded transition duration-300"
        >
        {linkText}
        </Link>
      </div>
    </>
  );
};

export default NotFound;
