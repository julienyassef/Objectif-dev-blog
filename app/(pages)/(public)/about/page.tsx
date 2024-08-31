import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>À Propos de Julien YASSEF - Développeur Web</title>
        <meta name="description" content="Découvrez le parcours de Julien YASSEF, développeur web passionné, qui partage son expérience et ses projets après une reconversion professionnelle." />
        <meta property="og:title" content="À Propos de Julien YASSEF - Développeur Web" />
        <meta property="og:description" content="Découvrez le parcours de Julien YASSEF, développeur web passionné, qui partage son expérience et ses projets après une reconversion professionnelle." />
        <meta property="og:image" content="/assets/picture/photoJulien.jpg" />
        <meta property="og:url" content="https://objectifdev.fr/about" />
        <link rel="canonical" href="https://objectifdev.fr/about" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8 mt-[166.88px] md:mt-[122.88px] lg:mt-[78.88px]">
        <div className="bg-primary rounded-lg px-4 py-2 shadow-md mb-10">
          <h1 className="text-3xl text-white font-bold p-2">À Propos de moi</h1>
        </div>
        <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg mb-10">
          <Image 
            src="/assets/picture/photoJulien.jpg" 
            alt="Photo de Julien YASSEF" 
            layout="fill"
            objectFit="cover"
          />
        </div>
        <p className="text-lg text-center max-w-prose">
          Développeur passionné, je souhaite partager mon expérience de développeur et mon parcours. En effet, j&apos;ai effectué une reconversion après des années dans le social. J&apos;aime partager mes connaissances et aider les autres à apprendre et à grandir dans le domaine du développement web.
        </p>
        <h3 className="text-2xl text-secondaire font-bold underline mb-10 mt-20">Découvrir mes différents projets à travers mes réseaux :</h3>
        <div className="flex gap-4 mb-10">
          <Link href="https://github.com/julienyassef" className="bg-primary p-3 rounded-full shadow-lg hover:bg-terciaire">
            <Image src="/assets/logoNav/icon_github.png" alt="GitHub" width={25} height={25} />
          </Link>
          <Link href="https://linkedin.com/in/julienyassef" className="bg-primary p-3 rounded-full shadow-lg hover:bg-terciaire">
            <Image src="/assets/logoNav/icon2_linkedin.png" alt="LinkedIn" width={25} height={25} />
          </Link>
        </div>
        <div className="text-center">
          <Link href="https://julienyassef.fr/" className="text-secondaire font-bold hover:text-primary hover:underline">
            Visitez mon portfolio pour plus de projets !
          </Link>
        </div>
      </div>
    </>
  );
}
