import Image from "next/image";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-colorBg  z-50">
      <div className="relative flex items-center justify-center">
        <Image
          src="/assets/favicon.png"
          alt="Logo"
          width={100}
          height={100}
          className="absolute pl-2" 
        />
        <div className="w-36 h-36 border-8 border-gray-300 border-t-primary rounded-full slow-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
