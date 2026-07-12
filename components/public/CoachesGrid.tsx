"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Coach {
  _id: string;
  name: string;
  position: string;
  experience?: string;
  biography?: string;
  photo?: string;
}

export default function CoachesGrid({ coaches }: { coaches: Coach[] }) {
  const [selected, setSelected] = useState<Coach | null>(null);

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [selected]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {coaches.map((coach) => (
          <button
            key={coach._id}
            onClick={() => setSelected(coach)}
            className="card group p-6 text-center cursor-pointer text-right w-full hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-dark-200 mb-4 border-2 border-dark-300 group-hover:border-primary transition-all duration-300">
              {coach.photo ? (
                <Image
                  src={coach.photo}
                  alt={coach.name}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
              )}
            </div>
            <h2 className="text-white font-bold text-lg mb-1 text-center">{coach.name}</h2>
            <p className="text-primary text-sm font-medium mb-3 text-center">{coach.position}</p>
            {coach.experience && (
              <p className="text-gray-500 text-xs mb-3 text-center">خبرة: {coach.experience}</p>
            )}
            {coach.biography && (
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 text-center">{coach.biography}</p>
            )}
            <span className="inline-block mt-4 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              عرض التفاصيل ←
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-dark-100 border border-dark-300 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              aria-label="إغلاق"
              className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-dark-200/80 hover:bg-primary text-white text-xl transition-colors"
            >
              ✕
            </button>

            <div className="md:flex">
              <div className="md:w-2/5 bg-dark-200 flex-shrink-0">
                {selected.photo ? (
                  <div className="relative w-full aspect-square md:h-full md:aspect-auto md:min-h-[380px]">
                    <Image
                      src={selected.photo}
                      alt={selected.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square md:min-h-[380px] flex items-center justify-center text-7xl">👤</div>
                )}
              </div>

              <div className="md:w-3/5 p-6 md:p-8 text-right">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{selected.name}</h2>
                <p className="text-primary font-medium mb-4">{selected.position}</p>

                {selected.experience && (
                  <div className="mb-5">
                    <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full">
                      خبرة: {selected.experience}
                    </span>
                  </div>
                )}

                {selected.biography && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 text-lg">نبذة والخبرات</h3>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
                      {selected.biography}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
