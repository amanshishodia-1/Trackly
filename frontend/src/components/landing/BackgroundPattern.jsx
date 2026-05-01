const BackgroundPattern = () => {
  return (
    <>
      {/* Gradient Glows */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 80% 60%, rgba(139, 92, 246, 0.1), transparent),
            radial-gradient(ellipse 50% 30% at 20% 80%, rgba(236, 72, 153, 0.08), transparent)
          `,
        }}
      />

      {/* Geometric Grid Pattern */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.25) 1px, transparent 1px),
            linear-gradient(45deg, transparent 49.5%, rgba(255, 255, 255, 0.15) 49.5%, rgba(255, 255, 255, 0.15) 50.5%, transparent 50.5%),
            linear-gradient(-45deg, transparent 49.5%, rgba(255, 255, 255, 0.15) 49.5%, rgba(255, 255, 255, 0.15) 50.5%, transparent 50.5%)
          `,
          backgroundSize: "40px 40px, 40px 40px, 20px 20px, 20px 20px",
        }}
      />
    </>
  );
};

export default BackgroundPattern;
