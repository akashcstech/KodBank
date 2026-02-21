import bankingIllustration from "@/assets/banking-illustration.png";
import GlassLoginCard from "@/components/GlassLoginCard";
import FloatingParticles from "@/components/FloatingParticles";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1a0933] via-[#2a0f5c] to-[#3c1b8f] animate-gradient">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full bg-pink-500/20 blur-3xl animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-3xl animate-blob animation-delay-4000" />

      <div className="absolute inset-0 flex items-center justify-center opacity-20 blur-sm pointer-events-none">
        <img src={bankingIllustration} alt="" className="w-full h-full object-cover" />
      </div>

      <FloatingParticles />

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            {/* Left side - Hero text */}
            <div className="flex-1 max-w-xl animate-fade-in-up">
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-xs font-medium text-white/70 tracking-wider uppercase">
                Next-Gen Banking
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Mobile & Online{" "}
                <span className="bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] bg-clip-text text-transparent">
                  Banking
                </span>{" "}
                Experience
              </h1>
              <p className="text-lg text-muted-foreground mb-8 animate-fade-in-up-delay leading-relaxed">
                Smart. Secure. Seamless financial control. Experience the future
                of digital banking with cutting-edge security and beautiful
                interfaces.
              </p>

              {/* Trust badges */}
              <div className="mt-8 flex items-center gap-8 text-white/40 text-sm animate-fade-in-up-delay-2">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  256-bit SSL
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Bank-grade Security
                </div>
              </div>
            </div>

            {/* Right side - Glass login card */}
            <div className="flex-shrink-0 w-full max-w-md animate-fade-in-up-delay">
              <GlassLoginCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
