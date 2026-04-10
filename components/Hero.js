import Image from "next/image";
import portfolio from "@/data/portfolio";

const Hero = () => {
  const { personal } = portfolio;

  return (
    <section className="relative bg-[var(--color-bg)] text-white overflow-hidden pt-24">
      {/* Background geometric elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)] opacity-5 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-secondary)] opacity-5 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left side - Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-[var(--color-primary)] font-black text-sm tracking-widest uppercase">Welcome</p>
              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
                {personal.heroTitlePrefix}
                <br />
                <span className="text-[var(--color-accent)]">{personal.name}</span>
              </h1>
            </div>

            <div className="border-l-4 border-[var(--color-primary)] pl-6">
              <h2 className="text-2xl font-black tracking-wide mb-4">{personal.headline}</h2>
              <p className="text-[var(--color-text-muted)] text-lg leading-relaxed">
                {personal.summary}
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <a
                href="/cv.pdf"
                download="Dzaki-Amri-Zaidaan-CV.pdf"
                className="bg-[var(--color-primary)] text-white px-8 py-4 font-black text-sm tracking-wide uppercase hover:bg-[var(--color-secondary)] transition border-2 border-[var(--color-primary)]"
              >
                Download CV
              </a>
              <a
                href="#contact"
                className="border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-8 py-4 font-black text-sm tracking-wide uppercase hover:bg-[var(--color-primary)] hover:text-white transition"
              >
                Get in Touch
              </a>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80 border-4 border-[var(--color-primary)]">
              {/* Inner border accent */}
              <div className="absolute inset-0 border-2 border-[var(--color-secondary)] m-2"></div>
              
              <Image
                src={personal.profileImage}
                alt={personal.profileImageAlt}
                fill
                style={{ objectFit: "cover" }}
                className="relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;