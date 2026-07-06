import { HeroButtons } from "./hero-buttons";

export function HeroSection() {
  return (
    <section
      id="hero-section"
      className="relative flex flex-col items-center px-5 pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden"
    >
      {/* 프리미엄 배경 장식 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] size-[40%] bg-frog-100/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-5%] size-[30%] bg-frog-200/20 rounded-full blur-[80px]" />
      </div>

      <div className="flex flex-col items-center max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="display-medium md:display-large text-center text-gray-1000 mb-8 tracking-tight font-bold">
          자소서 첫 줄에 버리는 3시간,
          <br />
          PROG에서는 <span className="text-frog-600">단 1초면 충분</span>합니다.
        </h1>

        <p className="body-large text-gray-600 text-center max-w-2xl mb-12 leading-relaxed">
          PROG는 현직자들이 실제로 사용한 프롬프트를 공유하는 커뮤니티입니다.
          당신의 커리어가 멈추지 않고 도약할 수 있도록 수만 건의 합격 로그를
          공개합니다.
        </p>

        <HeroButtons />
      </div>
    </section>
  );
}
