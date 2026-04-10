import Image from "next/image";
import portfolio from "@/data/portfolio";

const Hero = () => {
  const { personal } = portfolio;

  return (
    <section className="relative flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen text-white overflow-hidden px-6">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 blur-2xl opacity-20 -z-10 animate-gradient-slow"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left space-y-6 md:space-y-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            {personal.heroTitlePrefix}{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">{personal.name}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light max-w-xl mx-auto md:mx-0 opacity-90">
            {personal.headline}
          </p>
          <p className="text-md text-gray-300 font-light max-w-xl mx-auto md:mx-0 opacity-80">
            {personal.summary}
          </p>

          <div className="pt-2">
            <a
              href="/cv.pdf"
              download="Dzaki-Amri-Zaidaan-CV.pdf"
              className="inline-flex items-center justify-center rounded-full bg-white text-gray-900 px-6 py-3 text-sm font-semibold transition-all duration-300 hover:bg-gray-100"
            >
              Download CV (PDF)
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end relative mt-8 md:mt-0">
          <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden shadow-xl border-4 border-gray-800 transition-all duration-500 ease-in-out transform hover:scale-110 hover:shadow-2xl hover:border-blue-400">
            <Image
              src={personal.profileImage}
              alt={personal.profileImageAlt}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;