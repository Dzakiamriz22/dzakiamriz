import portfolio from '@/data/portfolio';

const Footer = () => {
  const { site } = portfolio;

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-sm text-center sm:text-base">
          &copy; {new Date().getFullYear()} {site.copyrightName}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;