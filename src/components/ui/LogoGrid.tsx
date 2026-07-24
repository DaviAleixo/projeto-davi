
export default function LogoGrid() {
  const brands = [
    { name: "Google", logo: "Google" },
    { name: "Supabase", logo: "Supabase" },
    { name: "Stripe", logo: "Stripe" },
    { name: "Vercel", logo: "Vercel" }
  ];

  return (
    <div className="flex items-center gap-6 md:gap-10 opacity-40 grayscale hover:opacity-75 transition-opacity duration-300 pointer-events-auto">
      {brands.map((brand, i) => (
        <span 
          key={i} 
          className="text-xs md:text-sm font-bold tracking-widest text-neutral-800 uppercase"
        >
          {brand.name}
        </span>
      ))}
    </div>
  );
}
