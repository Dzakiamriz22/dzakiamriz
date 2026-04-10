import Image from 'next/image';
import portfolio from '@/data/portfolio';

const Contact = () => {
  const { contact } = portfolio;

  return (
    <section id="contact" className="py-20 bg-gray-900 text-center">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-100 mb-6">{contact.title}</h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
          {contact.subtitle}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-center">
          {contact.platforms.map(({ name, href, iconSrc, iconAlt }, index) => (
            <div key={index} className="flex flex-col items-center">
              <a href={href} target="_blank" rel="noopener noreferrer">
                <button
                  className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 rounded-full border-2 border-gray-800 hover:bg-gray-700 transition-all duration-300 ease-in-out shadow-xl transform hover:scale-110 hover:shadow-2xl"
                >
                  <Image
                    src={iconSrc}
                    alt={iconAlt}
                    width={28}
                    height={28}
                    className="transition-all duration-300 ease-in-out filter invert"
                  />
                </button>
              </a>
              <p className="text-gray-300 mt-4 text-sm font-semibold">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;