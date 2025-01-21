import Image from 'next/image';

const platforms = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/62895361078490',
    iconSrc: '/icons/whatsapp.svg',
    iconAlt: 'WhatsApp',
    iconColor: 'gray-800',
  },
  {
    name: 'Email',
    href: 'mailto:dzakiamriz12@gmail.com',
    iconSrc: '/icons/email.svg',
    iconAlt: 'Email',
    iconColor: 'gray-800',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/dzakiamriz',
    iconSrc: '/icons/linkedin.svg',
    iconAlt: 'LinkedIn',
    iconColor: 'gray-800',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/dzakiamriz_',
    iconSrc: '/icons/instagram.svg',
    iconAlt: 'Instagram',
    iconColor: 'gray-800',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/dzakiamriz22',
    iconSrc: '/icons/github.svg',
    iconAlt: 'GitHub',
    iconColor: 'gray-800',
  },
];

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gray-900 text-center">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-100 mb-6">Contact Me</h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
          Lets connect! You can reach out to me on any of the platforms below.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-center">
          {platforms.map(({ name, href, iconSrc, iconAlt, iconColor }, index) => (
            <div key={index} className="flex flex-col items-center">
              <a href={href} target="_blank" rel="noopener noreferrer">
                <button
                  className={`relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 rounded-full 
                    border-2 border-${iconColor} hover:bg-${iconColor} transition-all duration-300 ease-in-out 
                    shadow-xl transform hover:scale-110 hover:shadow-2xl`}
                >
                  <Image
                    src={iconSrc}
                    alt={iconAlt}
                    width={28}
                    height={28}
                    className={`transition-all duration-300 ease-in-out ${iconColor === 'gray-800' ? 'filter invert' : ''}`}
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