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
    image: "/assets/slide2/5.jpeg",
  },
  {
    id: "ec-2",
    name: "Chief Godwin Ikporo",
    role: "Secretary-General",
    image: "/assets/slide2/6.jpeg",
  },
  {
    id: "ec-3",
    name: "Ms. Eguonor Tuoyo",
    role: "Assistant Secretary",
    image: "/assets/slide2/7.jpeg",
  },
  {
    id: "ec-4",
    name: "Mrs. Evelyn Obire-Egbe (Sosime)",
    role: "Director of Membership & Welfare",
    image: "/assets/slide2/8.jpeg",
  },
  {
    id: "ec-5",
    name: "Dr. Abel Okuma",
    role: "Director of Research & Culture",
    image: "/assets/slide2/10.jpeg",
  },
  {
    id: "ec-6",
    name: "Mr. Efe Shemi",
    role: "National Treasurer",
    image: "/assets/slide2/12.jpeg",
  },
  {
    id: "ec-7",
    name: "Hon. Oghenetega JohnGold",
    role: "Speaker",
    image: "/assets/slide2/13.jpeg",
  },
  {
    id: "ec-8",
    name: "Chief Eric Ogbafedje Okoko",
    role: "Director of Publicity",
    image: "/assets/slide2/14.jpeg",
  },
  {
    id: "ec-9",
    name: "Mrs. Betty Ajueyitsi",
    role: "Director of Development",
    image: "/assets/slide2/7.jpeg",
  },
  {
    id: "ec-10",
    name: "Chief (Dr.) Mrs. Louisa Ukochovwera",
    role: "Deputy BOT Chair / President, UPU Ohio",
    image: "/assets/slide2/3.jpeg",
  },
];

export default function ExecutiveCommitteeGrid() {
  return (
    <section className="executive-committee-section" id="executive-committee" aria-labelledby="ec-heading">
      <div className="ec-container">
        {/* Header */}
        <div className="ec-header">
          <h2 id="ec-heading" className="ec-title">
            Meet The Executive Committee (EC)
          </h2>
          <p className="ec-subtitle">
            Elected officers managing day-to-day administrative and developmental portfolios.
          </p>
        </div>

        {/* 10-Officer Grid (Cards with large portraits filling the width of each card) */}
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
