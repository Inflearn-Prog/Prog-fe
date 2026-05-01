import { Heart, Timer, UserCheck } from "lucide-react";

import { STATS_DATA } from "./constant";

const ICON_MAP = {
  UserCheck,
  Timer,
  Heart,
} as const;

export function StatsSection() {
  return (
    <section id="stats-section" className="px-5 pb-16 md:pb-20">
      <div className="inner grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS_DATA.map((stat) => {
          const Icon = ICON_MAP[stat.icon as keyof typeof ICON_MAP];
          return (
            <div
              key={stat.id}
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white py-8 px-4 transition-300 hover:shadow-md"
            >
              <div className="flex items-center gap-1.5 text-gray-500">
                <Icon className="size-4" />
                <span className="caption-medium font-bold">{stat.label}</span>
              </div>
              <span className="heading-large text-frog-600 font-bold">
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
