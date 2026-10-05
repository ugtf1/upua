"use client";

import React from "react";
import Image from "next/image";

interface Officer {
  id: string;
  name: string;
  role: string;
  image: string;
}

const OFFICERS: Officer[] = [
  {
    id: "ec-1",
    name: "Chief (Dr.) Mrs. Eunice Eruvwetere",
    role: "National Vice President",
    image: "/assets/Eruvwetere.jpg",
  },
  {
    id: "ec-2",
    name: "Chief Godwin Ikporo",
    role: "Secretary-General",
    image: "/assets/ikporo.jpg",
  },
  {
    id: "ec-3",
    name: "Ms. Eguonor Tuoyo",
    role: "Assistant Secretary",
    image: "/assets/tuoyo.jpg",
  },
  {
    id: "ec-4",
    name: "Mrs. Evelyn Obire-Egbe (Sosime)",
    role: "Director of Membership & Welfare",
    image: "/assets/Obire-Egbe.jpg",
  },
  {
    id: "ec-5",
    name: "Dr. Abel Okuma",
    role: "Director of Research & Culture",
    image: "/assets/okuma.jpg",
  },
  {
    id: "ec-6",
    name: "Mr. Efe Shemi",
    role: "National Treasurer",
    image: "/assets/shemi.jpg",
  },
  {
    id: "ec-7",
    name: "Hon. Oghenetega JohnGold",
    role: "Speaker",
    image: "/assets/johnGold.jpg",
  },
  {
    id: "ec-8",
    name: "Chief Eric Ogbafedje Okoko",
    role: "Director of Publicity",
    image: "/assets/okoko.jpg",
  },
  {
    id: "ec-9",
    name: "Mrs. Betty Ajueyitsi",
    role: "Director of Development",
    image: "/assets/ajueyitsi.jpg",
  },
  {
    id: "ec-10",
    name: "Chief (Dr.) Mrs. Louisa Ukochovwera",
    role: "Deputy BOT Chair / President, UPU Ohio",
    image: "https://upuamerica.org/wp-content/uploads/2026/06/Ohio-1.jpg",
  },
];

export default function ExecutiveCommitteeGrid() {
  return (
    <section className="executive-committee-section" id="executive-committee" aria-labelledby="ec-heading">
      <div className="ec-container">
        <div className="ec-header">
          <h2 id="ec-heading" className="ec-title">
            Meet The Executive Committee (EC)
          </h2>
          <p className="ec-subtitle">
            Elected officers managing day-to-day administrative and developmental portfolios.
          </p>
        </div>

        <div className="ec-grid">
          {OFFICERS.map((officer) => (
            <article className="ec-officer-card" key={officer.id}>
              <div className="ec-card-media">
                <Image
                  src={officer.image}
                  alt={officer.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="ec-card-img"
                />
              </div>
              <div className="ec-card-body">
                <h3 className="ec-officer-name">{officer.name}</h3>
                <p className="ec-officer-role">{officer.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
