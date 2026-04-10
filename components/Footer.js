import portfolio from '@/data/portfolio';

const Footer = () => {
  const { site } = portfolio;

  return (
    <footer className="bg-[var(--color-bg)] border-t-2 border-[var(--color-border)] text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wide">
            &copy; {new Date().getFullYear()} {site.copyrightName}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest">
            Crafted with intention. Built with code.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;