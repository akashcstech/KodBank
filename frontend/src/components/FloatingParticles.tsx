const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  delay: `${Math.random() * 4}s`,
  size: Math.random() * 3 + 2,
}));

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {particles.map((p) => (
      <div
        key={p.id}
        className="particle"
        style={{
          left: p.left,
          top: p.top,
          animationDelay: p.delay,
          width: p.size,
          height: p.size,
        }}
      />
    ))}
  </div>
);

export default FloatingParticles;
