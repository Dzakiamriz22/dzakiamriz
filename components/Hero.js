import Image from "next/image";

const Hero = () => {
  return (
    <section className="flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black h-screen text-white px-6">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Section */}
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            Hi, I’m <span className="text-blue-500">Dzaki Amri Zaidaan</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light max-w-lg mx-auto md:mx-0">
            Computer Engineering student building impactful hardware and software solutions.
          </p>
          <p className="text-md text-gray-300 font-light max-w-lg mx-auto md:mx-0">
            Focused on software and AI technologies, integrating hardware for real-world applications.
          </p>
        </div>

        {/* Image Section */}
        <div className="flex justify-center md:justify-end relative mt-8 md:mt-0">
          <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden shadow-2xl border-4 border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105">
            <Image
              src="/img/profile.png"
              alt="Profile Image"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="absolute inset-0 w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-3xl opacity-20 -z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;