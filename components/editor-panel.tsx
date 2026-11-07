"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Type,
  AlignLeft,
  Tag,
  ExternalLink,
  Loader2,
  Info,
  Users,
  Shield,
  ShieldCheck,
  Building,
  Crown,
  Calendar,
  BookOpen,
  Sparkles,
  Upload,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Check,
  Send,
  Cloud,
  Layers,
  ShoppingBag,
  Edit2,
  X,
  Camera,
  MapPin,
  Mail,
  Phone,
  Clock,
  Award,
} from "lucide-react";

// =============================================================================
// INITIAL FALLBACK CONSTANTS — Ensures instant rendering with ZERO empty screens
// =============================================================================
const INITIAL_HOME = {
  hero: {
    badge: "Okugbe · Egba · Voyan Robaro",
    heading: "Urhobo Progress Union America",
    subheading: "Unity. Strength. Progress.",
    description:
      "The umbrella body of all Urhobo sons and daughters across North America — advocating for cultural pride, community development, and homeland progress.",
    ctaPrimaryLabel: "Explore Our Work",
    ctaPrimaryUrl: "#work",
    ctaSecondaryLabel: "Join UPUA",
    ctaSecondaryUrl: "/portal",
    carouselImages: [
      "/upuahero.png",
      "/assets/Congress-1.jpg",
      "/assets/slide2/3.jpeg",
      "/assets/slide2/7.jpeg",
    ],
  },
  stats: [
    { label: "Years of Service", value: "32+", subtext: "Continuous diaspora service" },
    { label: "Active Chapters", value: "20", subtext: "Across USA & Canada" },
    { label: "Community Impact", value: "15k+", subtext: "Families assisted annually" },
    { label: "Active Programs", value: "6", subtext: "Signature civic initiatives" },
  ],
  marquee: {
    title: "Women in Shelter Initiative",
    subtitle:
      "Across North America, UPU chapters are giving back, donating time, resources and love to women's shelters in their communities.",
  },
  mission: {
    eyebrow: "Why UPUA exists",
    heading: "Uniting Urhobo people across North America and advancing our ancestral homeland.",
    description:
      "For over three decades, Urhobo Progress Union America has stood as the unified voice and civic engine for tens of thousands of Urhobo immigrants, families, and professionals across the United States and Canada.",
    bulletPoints: [
      "Fostering deep cultural heritage and Urhobo language fluency across generations.",
      "Providing immediate humanitarian relief and healthcare missions to Urhoboland.",
      "Empowering youth through tech mentorship, scholarships, and professional networking.",
      "Promoting civic responsibility, brotherhood, and active philanthropy in our North American cities.",
    ],
  },
  work: {
    badge: "Our Mission",
    heading: "What We Do",
    description:
      "UPUA leads transformative programs across North America, serving as the strategic voice for Urhobo people in the diaspora.",
  },
  leadershipSection: {
    badge: "Union Governance",
    heading: "Leaders who keep the union moving",
    description:
      "Dedicated trustees, national executives, and chapter leaders committed to transparency, servant leadership, and the advancement of the Urhobo nation.",
  },
  updatesSection: {
    badge: "News & Stories",
    heading: "Updates from UPU America",
    description:
      "Stay informed on national initiatives, humanitarian relief missions, and community milestones from our chapters.",
  },
  eventsSection: {
    badge: "Convocations & Galas",
    heading: "Upcoming Events & Convention",
    description:
      "Connect with fellow Urhobo people at our annual national conventions, leadership symposiums, and regional cultural celebrations.",
  },
  worldwideCommunity: {
    heading: "Global Urhobo Community",
    description:
      "From Alaska to Florida, California to New York, UPUA connects Urhobo people in every corner of North America to our ancestral roots in Delta State, Nigeria.",
    newsletterTitle: "Stay Connected with UPUA",
    newsletterDescription:
      "Receive official announcements, convention registration alerts, and quarterly executive updates directly to your inbox.",
    newsletterButtonText: "Subscribe to Updates",
  },
};

const INITIAL_ABOUT = {
  hero: {
    badge: "About UPUA",
    heading: "Urhobo Progress Union America",
    subheading: "The supreme cultural and developmental body of Urhobo people resident across North America.",
    motto: "Okugbe, Egba, Voyan Robaro (Unity, Strength and Progress)",
  },
  history: {
    heading: "Our History & Purpose",
    accreditation:
      "UPUA is a duly incorporated 501(c)(3) non-profit tax-exempt cultural and humanitarian institution operating under the laws of the United States of America.",
    body: [
      "The Urhobo Progress Union America (UPUA) is the umbrella organization representing all Urhobo associations, chapters, families, and people residing across the United States and Canada.",
      "Rooted in the century-old lineage of the worldwide Urhobo Progress Union founded in 1931, UPUA serves as the supreme beacon of Urhobo culture, language, solidarity, and socio-economic advancement in North America.",
      "Over the decades, UPUA has built bridges of fraternity between diaspora communities and our ancestral homeland in Delta State, Nigeria — sponsoring schools, providing emergency humanitarian relief, advocating for indigenous environmental rights, and mentoring the next generation of global leaders.",
    ],
  },
  missionVision: {
    missionHeading: "Our Mission",
    mission:
      "To unite all Urhobo people and associations in North America into one cohesive, forward-looking brotherhood; to preserve and celebrate our rich monarchical heritage and language; and to mobilize human and financial capital for the educational, economic, and civic elevation of Urhoboland and our host communities.",
    visionHeading: "Our Vision",
    vision:
      "A vibrant, self-sustaining global Urhobo diaspora renowned for cultural pride, institutional excellence, academic achievement, and permanent developmental impact across North America and Urhoboland.",
  },
  nationalAnthem: {
    heading: "The Urhobo National Anthem",
    subheading: "The sacred anthem echoing the royal lineage and eternal bond of all Urhobo people.",
    urhoboLyrics: [
      "Urhobo eh, Orere r'Ivie sa-a.",
      "Urhobo eh, Orere r'Ivie sa-a.",
      "Urhobo kokore Ogbare eh,",
      "Urhobo eh, Orere r'Ivie sa-a.",
      "Obo r'Urhobo jevwe na,",
      "Aso 'fa jevwe otio ye-eh.",
      "Edefa me rhiakpo, Urhobo me wan rhe,",
      "Urhobo eh, Orere r'Ivie sa-a Anoma-a.",
    ],
    englishTranslation: [
      "Urhobo hail! Land of royal monarchies and dignity.",
      "Urhobo hail! Land of royal monarchies and dignity.",
      "Let all Urhobos gather in unbreakable unity,",
      "Urhobo hail! Land of royal monarchies and dignity.",
      "The boundless love I have for Urhobo,",
      "No other nation compares under the sun.",
      "When next I reincarnate into this mortal earth,",
      "It is through Urhobo that I shall surely return!",
    ],
  },
};

const INITIAL_LEADERSHIP = [
  {
    id: "leader-president",
    name: "Chief Samuel Ogaga",
    title: "National President, UPUA",
    tagline: "\"Okugbe, Egba, Voyan Robaro\" (Unity, Strength and Progress)",
    bio: "Serving as the National President of Urhobo Progress Union America, Chief Samuel Ogaga leads the association with a passion for uniting all Urhobo people across North America and preserving the core cultural values, languages, and development of Urhoboland.",
    image: "/assets/president.png",
    order: 1,
    featured: true,
  },
  {
    id: "leader-bot-chair",
    name: "Mr. Thomas Uwhubetine",
    title: "Chairman, Board of Trustees (BOT)",
    tagline: "MBA, Accountant, RN (retired), JP – President, Urhobo Association of Georgia",
    bio: "“My mission is to move our union forward as attested by our motto: Okugbe, Egba, Voyan Robaro and in the spirit embedded in our national anthem: Edefa me rh'akpo, Urhobo me warhe (when I reincarnate, I will come through Urhobo). It is time to move UPUA to its rightful place in the 21st century with its own permanent house, offices, and global impact.”",
    image: "/assets/chairman.png",
    order: 2,
    featured: true,
  },
];

const INITIAL_TRUSTEES = [
  { slug: "thomas-uwhubetine-chair", name: "Mr. Thomas Uwhubetine", title: "Chairman, Board of Trustees", chapter: "President, Urhobo Association of Georgia", localPath: "/assets/bot/thomas-uwhubetine-chair.jpg" },
  { slug: "samuel-ogaga", name: "Chief Samuel Ogaga", title: "National President, UPU America", chapter: "UPU America", localPath: "/assets/bot/samuel-ogaga.jpg" },
  { slug: "louisa-ukochovwera", name: "Chief (Dr.) Mrs. Louisa Ukochovwera", title: "Deputy BOT Chair", chapter: "President, UPU Ohio", localPath: "/assets/bot/louisa-ukochovwera.jpeg" },
  { slug: "godspower-oniovosa", name: "Chief Godspower Oniovosa", title: "Trustee", chapter: "President, Urhobo Progress Association, Houston", localPath: "/assets/bot/godspower-oniovosa.jpg" },
  { slug: "vivian-ikporo", name: "Chief Mrs. Vivian Ikporo", title: "Trustee", chapter: "President, UPU Midland/Odessa, Texas", localPath: "/assets/bot/vivian-ikporo.png" },
  { slug: "paul-warrence", name: "Mr. Paul Edirin Warrence", title: "Trustee", chapter: "President, UPU Michigan", localPath: "/assets/bot/paul-warrence.jpg" },
  { slug: "gabriel-oghwe-akateme", name: "Chief Gabriel Oghwe-Akateme", title: "Trustee", chapter: "President, UPU Northern California", localPath: "/assets/bot/gabriel-oghwe-akateme.jpg" },
  { slug: "felix-agbabune", name: "Mr. Felix Agbabune", title: "Trustee", chapter: "President, UPU Southern California", localPath: "/assets/bot/felix-agbabune.jpg" },
  { slug: "paul-otu", name: "Chief Paul Otu", title: "Trustee", chapter: "President, UPU DMV (DC, MD, VA)", localPath: "/assets/bot/paul-otu.jpg" },
  { slug: "joseph-odje", name: "Mr. Joseph Odje", title: "Trustee", chapter: "President, UPU Chicagoland", localPath: "/assets/bot/joseph-odje.jpg" },
  { slug: "anthony-orhorhoro", name: "Mr. Anthony Orhorhoro", title: "Trustee", chapter: "President, UPU Delaware Valley (PA, DE, NJ)", localPath: "/assets/bot/anthony-orhorhoro.jpg" },
  { slug: "augustine-arhagba", name: "Chief Augustine Arhagba", title: "Trustee", chapter: "President, UPU Dallas-Fort Worth, TX", localPath: "/assets/bot/augustine-arhagba.jpg" },
  { slug: "michael-ukwesan", name: "Chief Michael Ukwesan", title: "Trustee", chapter: "President, UPU Greater Kansas City", localPath: "/assets/bot/michael-ukwesan.jpg" },
  { slug: "peter-erharhe", name: "Mr. Peter Erharhe", title: "Trustee", chapter: "President, UPU Minnesota", localPath: "/assets/bot/peter-erharhe.jpg" },
  { slug: "victor-oghene", name: "Mr. Victor Oghene", title: "Trustee", chapter: "President, UPU Greater New York / New Jersey", localPath: "/assets/bot/victor-oghene.jpg" },
  { slug: "francis-ewherido", name: "Chief Francis Ewherido", title: "Trustee", chapter: "President, UPU Greater Boston / New England", localPath: "/assets/bot/francis-ewherido.jpg" },
  { slug: "edward-omoroh", name: "Mr. Edward Omoroh", title: "Trustee", chapter: "President, UPU Florida (Miami / Orlando)", localPath: "/assets/bot/edward-omoroh.jpg" },
  { slug: "emmanuel-efetobor", name: "Mr. Emmanuel Efetobor", title: "Trustee", chapter: "President, UPU Greater Toronto Area, Canada", localPath: "/assets/bot/emmanuel-efetobor.jpg" },
  { slug: "ochuko-eruvbetere", name: "Chief Ochuko Eruvbetere", title: "Trustee", chapter: "President, UPU Calgary & Western Canada", localPath: "/assets/bot/ochuko-eruvbetere.jpg" },
  { slug: "solomon-okotie", name: "Mr. Solomon Okotie", title: "Trustee", chapter: "President, UPU Arizona / Phoenix", localPath: "/assets/bot/solomon-okotie.jpg" },
  { slug: "kenneth-onokpise", name: "Dr. Kenneth Onokpise", title: "Trustee", chapter: "President, UPU Tallahassee / Panhandle", localPath: "/assets/bot/kenneth-onokpise.jpg" },
  { slug: "david-odiete", name: "Mr. David Odiete", title: "Trustee", chapter: "President, UPU Carolinas (NC / SC)", localPath: "/assets/bot/david-odiete.jpg" },
  { slug: "harrison-oghenekevwe", name: "Chief Harrison Oghenekevwe", title: "Trustee", chapter: "President, UPU Austin & Central Texas", localPath: "/assets/bot/harrison-oghenekevwe.jpg" },
  { slug: "grace-eduvie", name: "Mrs. Grace Eduvie", title: "Trustee", chapter: "President, UPU Las Vegas / Nevada", localPath: "/assets/bot/grace-eduvie.jpg" },
];

const INITIAL_EXECUTIVES = [
  { id: "ec-1", name: "Chief Samuel Ogaga", role: "National President", department: "Executive Leadership", image: "/assets/president.png", order: 1 },
  { id: "ec-2", name: "Chief Dr. Mrs. Eunice Eruvwetere", role: "Vice President", department: "Executive Leadership", image: "/assets/Eruvwetere.jpg", order: 2 },
  { id: "ec-3", name: "Chief Godwin Ikporo", role: "Secretary-General", department: "Secretariat", image: "/assets/ikporo.jpg", order: 3 },
  { id: "ec-4", name: "Ms. Eguonor Tuoyo", role: "Assistant Secretary", department: "Secretariat", image: "/assets/tuoyo.jpg", order: 4 },
  { id: "ec-5", name: "Mrs. Evelyn Obire-Egbe (Sosime)", role: "Director of Membership & Welfare", department: "Membership & Welfare", image: "/assets/Obire-Egbe.jpg", order: 5 },
  { id: "ec-6", name: "Dr. Abel Okuma", role: "Director of Research & Culture", department: "Research & Culture", image: "/assets/okuma.jpg", order: 6 },
  { id: "ec-7", name: "Chief Francis E. Omorogie", role: "Treasurer", department: "Treasury", image: "/assets/Omorogie.jpg", order: 7 },
  { id: "ec-8", name: "Mr. Ovie Akpomedaye", role: "Financial Secretary", department: "Finance", image: "/assets/Akpomedaye.jpg", order: 8 },
  { id: "ec-9", name: "Mr. Kelly Odiete", role: "Publicity Secretary", department: "Publicity & Media", image: "/assets/Odiete.jpg", order: 9 },
  { id: "ec-10", name: "Chief Moses Onomroba", role: "Legal Adviser", department: "Legal Advisory", image: "/assets/Onomroba.jpg", order: 10 },
  { id: "ec-11", name: "Chief Wilson Oki", role: "Auditor", department: "Audit", image: "/assets/Oki.jpg", order: 11 },
];

const INITIAL_YOUTH = [
  { id: "upuaya-1", name: "Oghenekevwe Ajueyitsi", role: "President", chapter: "UPU DMV", image: "/assets/upuaya/kevwe.jpg", order: 1 },
  { id: "upuaya-2", name: "Praise Asanudje", role: "Vice President", chapter: "Urhobo/Isoko Ass. Arizona", image: "/assets/upuaya/praise.jpg", order: 2 },
  { id: "upuaya-3", name: "Favour Okotie", role: "Secretary", chapter: "UPU Ohio", image: "/assets/upuaya/favour.jpg", order: 3 },
  { id: "upuaya-4", name: "Jess Oghenefejiro Ikporo", role: "Asst. Secretary", chapter: "UPU Midland/Odessa, TX", image: "/assets/upuaya/jess.jpg", order: 4 },
  { id: "upuaya-5", name: "Eguolor Sam-Ogaga", role: "Treasurer", chapter: "Urhobo/Isoko Ass of Middle Tennessee", image: "/assets/upuaya/eguolor.jpg", order: 5 },
  { id: "upuaya-6", name: "Ufuoma Agarin", role: "Social/Publicity Secretary", chapter: "UPU DMV", image: "/assets/upuaya/ufuoma.jpg", order: 6 },
  { id: "upuaya-7", name: "Tega Omene", role: "Financial Secretary", chapter: "UPU Chicago", image: "/assets/upuaya/tega.jpg", order: 7 },
  { id: "upuaya-8", name: "Ochuko Egbodje", role: "Welfare Officer", chapter: "UPU Dallas-Fort Worth", image: "/assets/upuaya/ochuko.jpg", order: 8 },
  { id: "upuaya-9", name: "Ejiro Oniovosa", role: "Director of Tech & Innovation", chapter: "UPU Houston", image: "/assets/upuaya/ejiro.jpg", order: 9 },
];

const INITIAL_CHAPTERS = [
  { id: "c-norcal", name: "Urhobo Progress Union, Northern California (UPUNC)", abbreviation: "UPUNC", president: "Chief Gabriel Oghwe-Akateme", region: "West Coast", location: "San Francisco & Bay Area, CA", website: "", image: "/assets/SolCal-4.jpg", order: 1 },
  { id: "c-socal", name: "Urhobo Progress Union of Southern California (UPUSC)", abbreviation: "UPUSC", president: "Mr. Felix Agbabune", region: "West Coast", location: "Los Angeles & San Diego, CA", website: "", image: "/assets/SolCal-4.jpg", order: 2 },
  { id: "c-houston", name: "Urhobo Progressive Association (UPA), Houston", abbreviation: "UPA Houston", president: "Chief Godspower Oniovosa", region: "Texas / South", location: "Houston, Texas", website: "https://upahouston.org/", image: "/assets/Congress-1.jpg", order: 3 },
  { id: "c-midessa", name: "Urhobo Progressive Union, Midland/Odessa, Texas", abbreviation: "UPU Midessa", president: "Chief Mrs. Vivian Ikporo", region: "Texas / South", location: "Midland & Odessa, TX", website: "https://upumidessa.org", image: "/assets/Congress-1.jpg", order: 4 },
  { id: "c-dmv", name: "Urhobo Progress Union of DC, Maryland & Virginia (UPUDMV)", abbreviation: "UPUDMV", president: "Chief Paul Otu", region: "Mid-Atlantic", location: "Washington DC, MD, VA", website: "https://upudmv.org/", image: "/assets/DMV-6.jpg", order: 5 },
  { id: "c-ohio", name: "Urhobo Progress Union (UPU), Ohio", abbreviation: "UPU Ohio", president: "Chief (Dr.) Mrs. Louisa Ukochovwera", region: "Midwest", location: "Columbus & Cleveland, OH", website: "", image: "/assets/Ohio-1.jpg", order: 6 },
  { id: "c-chicago", name: "Urhobo Progress Union, Chicagoland (UPUC)", abbreviation: "UPUC", president: "Mr. Joseph Odje", region: "Midwest", location: "Chicago, Illinois", website: "", image: "/assets/ChicagoLand-1x.jpg", order: 7 },
  { id: "c-michigan", name: "Urhobo Progress Union, Michigan (UPUMI)", abbreviation: "UPUMI", president: "Mr. Paul Edirin Warrence", region: "Midwest", location: "Detroit & Grand Rapids, MI", website: "", image: "/assets/Michigan-2.jpg", order: 8 },
  { id: "c-delaware", name: "Urhobo Progress Union, Delaware Valley (UPUDV)", abbreviation: "UPUDV", president: "Mr. Anthony Orhorhoro", region: "Mid-Atlantic", location: "PA, DE & Southern NJ", website: "", image: "/assets/Delaware-1.jpg", order: 9 },
  { id: "c-georgia", name: "Urhobo Association of Georgia (UAG)", abbreviation: "UAG", president: "Mr. Thomas Uwhubetine", region: "Southeast", location: "Atlanta, GA", website: "https://urhoboassociationofgeorgia.org", image: "/assets/slide2/3.jpeg", order: 10 },
  { id: "c-dfw", name: "Urhobo Progress Union, Dallas-Fort Worth (UPU DFW)", abbreviation: "UPU DFW", president: "Chief Augustine Arhagba", region: "Texas / South", location: "Dallas & Fort Worth, TX", website: "", image: "/assets/slide2/7.jpeg", order: 11 },
  { id: "c-kc", name: "Urhobo Community of Greater Kansas City (Waado)", abbreviation: "Waado KC", president: "Chief Michael Ukwesan", region: "Midwest", location: "Kansas City, MO / KS", website: "", image: "/assets/wadoo-1.jpg", order: 12 },
  { id: "c-minnesota", name: "Urhobo Progress Union, Minnesota (UPUM)", abbreviation: "UPUM", president: "Mr. Peter Erharhe", region: "Midwest", location: "Minneapolis & St. Paul, MN", website: "", image: "/assets/Minnesota-3.jpg", order: 13 },
  { id: "c-nynj", name: "UPU Greater New York & New Jersey", abbreviation: "UPU NY/NJ", president: "Mr. Victor Oghene", region: "Northeast", location: "New York City & North NJ", website: "", image: "/assets/DMV-6.jpg", order: 14 },
  { id: "c-boston", name: "UPU New England / Greater Boston", abbreviation: "UPU Boston", president: "Chief Francis Ewherido", region: "Northeast", location: "Boston, MA", website: "", image: "/assets/slide2/3.jpeg", order: 15 },
  { id: "c-florida", name: "UPU Florida Chapters (Miami / Orlando)", abbreviation: "UPU Florida", president: "Mr. Edward Omoroh", region: "Southeast", location: "Orlando & Miami, FL", website: "", image: "/assets/SolCal-4.jpg", order: 16 },
  { id: "c-toronto", name: "UPU Greater Toronto Area (Canada)", abbreviation: "UPU Toronto", president: "Mr. Emmanuel Efetobor", region: "Canada", location: "Toronto, Ontario", website: "", image: "/assets/Delaware-1.jpg", order: 17 },
  { id: "c-calgary", name: "UPU Western Canada (Calgary / Edmonton)", abbreviation: "UPU Calgary", president: "Chief Ochuko Eruvbetere", region: "Canada", location: "Calgary, Alberta", website: "", image: "/assets/ChicagoLand-1x.jpg", order: 18 },
  { id: "c-arizona", name: "Urhobo & Isoko Association of Arizona", abbreviation: "UIAA", president: "Mr. Solomon Okotie", region: "West Coast", location: "Phoenix, AZ", website: "", image: "/assets/SolCal-4.jpg", order: 19 },
  { id: "c-tennessee", name: "Urhobo Association of Middle Tennessee", abbreviation: "UAMT", president: "Chief Dr. E. Onokpise", region: "Southeast", location: "Nashville, TN", website: "", image: "/assets/slide2/7.jpeg", order: 20 },
];

const INITIAL_KINGDOMS = [
  { id: "k-1", name: "Owhorode of Olomu Kingdom", king: "HRM Richard Layeguen Ogbon, (JP), PhD, OON, Ogoni Oghoro I", emblem: "/assets/slide2/3.jpeg", order: 1 },
  { id: "k-2", name: "Ovie of Agbon Kingdom", king: "HRM Mike Omeru Ogurimerime, Ukori I, (CON)", emblem: "/assets/slide2/7.jpeg", order: 2 },
  { id: "k-3", name: "Ovie of Umiaghwa Abraka Kingdom", king: "HRM Air Vice Marshal Lucky Ochuko Ararile (RTD), Avwaeke I", emblem: "/assets/slide2/3.jpeg", order: 3 },
  { id: "k-4", name: "Okobaro of Ughievwen Kingdom", king: "HRM Matthew Ediri Egbi, (JP), FOD, Owawha II", emblem: "/assets/slide2/7.jpeg", order: 4 },
  { id: "k-5", name: "Osuivie of Agbarho Kingdom", king: "HRM Samson Owhe, Ogugu I", emblem: "/assets/slide2/3.jpeg", order: 5 },
  { id: "k-6", name: "Ovie of Oghara Kingdom", king: "HRM Noble Eshemitan Uku Oghara N'Ame, Orefe III", emblem: "/assets/slide2/7.jpeg", order: 6 },
  { id: "k-7", name: "Orodje of Okpe Kingdom", king: "HRM Gen. Felix Mujakperuo, (JP), CFR, Orhue I", emblem: "/assets/slide2/3.jpeg", order: 7 },
  { id: "k-8", name: "Ovie of Uvwie Kingdom", king: "HRM Emmanuel Ekemejewan Sideso, (JP), OON, Abe I", emblem: "/assets/slide2/7.jpeg", order: 8 },
  { id: "k-9", name: "Ovie of Ughelli Kingdom", king: "HRM Wilson Ojakovo, (JP), Oharisi III", emblem: "/assets/slide2/3.jpeg", order: 9 },
  { id: "k-10", name: "Ovie of Agbarha-Otor Kingdom", king: "HRM Richard Oghenevwogaga Ebelle, (JP), Okorefe I", emblem: "/assets/slide2/7.jpeg", order: 10 },
  { id: "k-11", name: "Ovie of Eghwu Kingdom", king: "HRM Jabin Onesa Mukoro, Okpo R'Ufuoma I", emblem: "/assets/slide2/3.jpeg", order: 11 },
  { id: "k-12", name: "Okpara-Uku of Orogun Kingdom", king: "HRM Matthew Iwemife Akpobi, Omoga II", emblem: "/assets/slide2/7.jpeg", order: 12 },
  { id: "k-13", name: "Ovie of Idjerhe Kingdom", king: "HRM Monday Obukowho Whiskey, Udurhie I", emblem: "/assets/slide2/3.jpeg", order: 13 },
  { id: "k-14", name: "Ovie of Evwreni Kingdom", king: "HRM Oghenekevwe Kumane, Eruvwedede III", emblem: "/assets/slide2/7.jpeg", order: 14 },
  { id: "k-15", name: "Ovie of Mosogar Kingdom", king: "HRM Sunday Odiete, Keagborekuzi I", emblem: "/assets/slide2/3.jpeg", order: 15 },
  { id: "k-16", name: "Ovie of Ozoro Kingdom", king: "HRM Anthony Oromoni, Orobome I", emblem: "/assets/slide2/7.jpeg", order: 16 },
  { id: "k-17", name: "Ovie of Arhavwarien Kingdom", king: "HRM Solomon Okukurenne, Aregbovwe I", emblem: "/assets/slide2/3.jpeg", order: 17 },
  { id: "k-18", name: "Ovie of Okparabe Kingdom", king: "HRM Shadrach Owhonjeke, Okparabe I", emblem: "/assets/slide2/7.jpeg", order: 18 },
  { id: "k-19", name: "Ovie of Ephron-Oto Kingdom", king: "HRM D. O. Efeduma, Okolo II", emblem: "/assets/slide2/3.jpeg", order: 19 },
  { id: "k-20", name: "Ovie of Udu Kingdom", king: "HRM E. B. O. Delekpe, Owhorhu I", emblem: "/assets/slide2/7.jpeg", order: 20 },
  { id: "k-21", name: "Ovie of Oruarivie-Abraka Kingdom", king: "HRM Akpomeyoma Majoroh, Ojeta II", emblem: "/assets/slide2/3.jpeg", order: 21 },
  { id: "k-22", name: "Ovie of Agbarha-Ame Kingdom", king: "HRM Orhifi Oghoghovwe, Orhifi I", emblem: "/assets/slide2/7.jpeg", order: 22 },
  { id: "k-23", name: "Okpako R'Orere of Okere-Urhobo Kingdom", king: "HRM Morris Oghenerioborue, Okere I", emblem: "/assets/slide2/3.jpeg", order: 23 },
  { id: "k-24", name: "Ovie of Jesse (Idjerhe Clan) Kingdom", king: "Traditional Council of Elders & Rulers", emblem: "/assets/slide2/7.jpeg", order: 24 },
];

const INITIAL_ARTICLES = [
  {
    id: "women-in-shelter-national",
    slug: "across-north-america-upua-chapters-unite-for-women-in-shelter-initiative",
    title: "Across North America: UPUA Chapters Unite for Women in Shelter Initiative",
    category: "Community",
    date: "2024-06-28",
    displayDate: "June 28, 2024",
    readTime: "4 min read",
    author: "UPUA Communications",
    image: "/assets/DMV-6.jpg",
    excerpt: "From Southern California and Chicagoland to Delaware Valley, Michigan, and the DMV, UPUA chapters mobilized nationwide to donate essential hygiene packages, clothing, supplies, and warmth to local women's shelters.",
    featured: true,
    tags: ["Community Outreach", "Women in Shelter", "Humanitarian", "North America Chapters"],
    content: [
      "In a coordinated nationwide display of humanitarian service, chapters of the Urhobo Progress Union America (UPUA) across sixteen metropolitan areas have conducted in-person donation drives at women's emergency shelters.",
      "The Women in Shelter Initiative was designed to support women and children escaping domestic hardship, displacement, and economic vulnerability. Chapter delegations delivered hundreds of custom hygiene packs containing personal care products, warm blankets, winter garments, and infant care necessities.",
      "National leadership praised the initiative, emphasizing that the Urhobo culture has always held community generosity and care for the vulnerable as sacred duties. Municipal officials in Detroit, Columbus, and Washington D.C. expressed sincere gratitude to UPUA for their sustained civic leadership.",
      "UPUA plans to expand the initiative to all active North American chapters, establishing permanent philanthropic partnerships with certified shelter organizations across the United States and Canada.",
    ],
  },
  {
    id: "convention-announcement-2026",
    slug: "dallas-fort-worth-confirmed-as-host-city-for-32nd-annual-upua-convention",
    title: "Dallas-Fort Worth Confirmed as Host City for 32nd Annual National Convention",
    category: "Convention",
    date: "2026-01-15",
    displayDate: "January 15, 2026",
    readTime: "3 min read",
    author: "National Secretariat",
    image: "/assets/Congress-1.jpg",
    featured: false,
    tags: ["National Convention", "Dallas", "Cultural Gala", "Governance"],
    content: [
      "The National Executive Committee of the Urhobo Progress Union America is thrilled to announce that the 32nd Annual National Convention and Cultural Gala will be staged in the heart of Texas at the prestigious Hilton Anatole Dallas over Labor Day Weekend 2026.",
      "Delegates from over twenty chapters across the United States and Canada, accompanied by traditional monarchs, dignitaries, and cultural performers from Nigeria, will converge for four days of intensive assembly deliberations, youth symposiums, and cultural banquets.",
      "Hotel reservation links and official delegate packages are now open through the UPUA portal. Early bird registration is strongly recommended as hotel room blocks are strictly limited.",
    ],
  },
  {
    id: "stem-ai-initiative-launch",
    slug: "empowering-next-gen-youth-through-stem-and-ai-bootcamps",
    title: "Empowering Next-Gen Youth Through STEM & Artificial Intelligence Bootcamps",
    category: "Programs",
    date: "2025-11-10",
    displayDate: "November 10, 2025",
    readTime: "5 min read",
    author: "UPUAYA Youth Directorate",
    image: "/update-stem.jpg",
    featured: false,
    tags: ["STEM", "AI", "Youth Development", "Education"],
    content: [
      "As part of UPUA's commitment to equipping youth for 21st-century technological frontiers, the UPUAYA Directorate of Innovation has launched the 2026 STEM and Artificial Intelligence training accelerator.",
      "The program pairs diaspora software leaders, AI engineers, and data scientists with high school and university students across both North America and Delta State, Nigeria.",
      "Curriculum modules encompass foundational Python programming, machine learning literacy, web development, and cloud computing certifications.",
    ],
  },
];

const INITIAL_EVENTS = [
  {
    id: "convention-2026",
    slug: "32nd-annual-upua-national-convention-2026",
    title: "32nd Annual UPUA National Convention & Cultural Gala",
    category: "Convention",
    date: "2026-09-04",
    fullDate: "September 4 – 7, 2026",
    time: "Labor Day Weekend · All-Day Sessions",
    monthShort: "SEP",
    day: "04",
    location: "Dallas-Fort Worth, Texas",
    venueName: "Hilton Anatole Luxury Hotel & Convention Center",
    address: "2201 N Stemmons Fwy, Dallas, TX 75207",
    flyer: "/events/convention-flyer.png",
    featured: true,
    summary: "The premier annual convention of Urhobo Progress Union America bringing together delegates, leaders, royal fathers, and youth from across North America for cultural celebration and strategic governance.",
    pricing: "Delegate Pass: $150 · Banquet Only: $120 · Youth (Under 21): $65",
    registrationUrl: "/store",
    hotelBookingUrl: "https://www.hilton.com",
    contactPerson: "Convention Planning Committee: Chief Samuel Ogaga & Chief Godwin Ikporo",
    description: "Welcome to the 32nd Annual National Convention of the Urhobo Progress Union America (UPUA), hosted this year in the dynamic metropolitan center of Dallas-Fort Worth, Texas! Join thousands of Urhobo sons, daughters, traditional rulers, and esteemed friends for four unforgettable days of brotherhood, cultural splendor, economic empowerment, and fellowship.",
  },
  {
    id: "youth-leadership-symposium",
    slug: "upuaya-youth-leadership-symposium-2026",
    title: "UPUAYA North America Youth Leadership & Tech Symposium",
    category: "Youth Wing",
    date: "2026-06-20",
    fullDate: "June 20, 2026",
    time: "11:00 AM – 4:00 PM EST",
    monthShort: "JUN",
    day: "20",
    location: "Virtual / Global Zoom Interactive",
    venueName: "UPUA Virtual Broadcast Studio",
    address: "Live Streamed Across All 16 Chapter Hubs",
    flyer: "/events/youth-symposium.png",
    featured: false,
    summary: "Interactive career acceleration, AI literacy, and cultural leadership summit organized by the UPUAYA National Youth Executive Committee.",
    pricing: "Free for Registered Youth Members (RSVP Required)",
    registrationUrl: "https://zoom.us",
    hotelBookingUrl: "",
    contactPerson: "Oghenekevwe Ajueyitsi (UPUAYA President)",
    description: "The Urhobo Progress Union America Youth Wing (UPUAYA) presents its 2026 Youth Leadership and Technological Advancement Symposium. Designed for students, young professionals, and creative leaders, this five-hour virtual event features high-level keynote presentations from Urhobo leaders across Silicon Valley, Wall Street, medicine, and academia.",
  },
  {
    id: "cultural-heritage-night",
    slug: "urhobo-cultural-heritage-night-gala-2026",
    title: "Annual Urhobo Cultural Heritage Night & Banquet",
    category: "Cultural Gala",
    date: "2026-11-28",
    fullDate: "November 28, 2026",
    time: "6:00 PM – Midnight CST",
    monthShort: "NOV",
    day: "28",
    location: "Houston, Texas",
    venueName: "The Grand Imperial Cultural Pavilion",
    address: "8300 Bissonnet St, Houston, TX 77074",
    flyer: "/events/gala-flyer.png",
    featured: false,
    summary: "An exquisite evening celebrating Urhobo culinary arts, traditional dance, royal regalia, poetry, and philanthropic honors.",
    pricing: "General Admission: $85 · Couples VIP Table: $300",
    registrationUrl: "/store",
    hotelBookingUrl: "",
    contactPerson: "Chief Godspower Oniovosa & UPA Houston Executive Council",
    description: "Join the Houston chapter and national delegates for the flagship Cultural Heritage Night, an unforgettable evening honoring centuries of Urhobo monarchical traditions, linguistic preservation, and community leadership.",
  },
];

type CMSTab =
  | "home"
  | "about"
  | "leadership"
  | "executives"
  | "youth"
  | "chapters"
  | "kingdoms"
  | "programs"
  | "events"
  | "blog"
  | "media"
  | "deploy";

export default function EditorPanel() {
  const [activeTab, setActiveTab] = useState<CMSTab>("home");
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Content states with instant fallbacks so writeups and photos are ALWAYS visible immediately
  const [homeData, setHomeData] = useState<any>(INITIAL_HOME);
  const [aboutData, setAboutData] = useState<any>(INITIAL_ABOUT);
  const [leadershipList, setLeadershipList] = useState<any[]>(INITIAL_LEADERSHIP);
  const [trusteesList, setTrusteesList] = useState<any[]>(INITIAL_TRUSTEES);
  const [executivesList, setExecutivesList] = useState<any[]>(INITIAL_EXECUTIVES);
  const [youthList, setYouthList] = useState<any[]>(INITIAL_YOUTH);
  const [chaptersList, setChaptersList] = useState<any[]>(INITIAL_CHAPTERS);
  const [kingdomsList, setKingdomsList] = useState<any[]>(INITIAL_KINGDOMS);
  const [programsData, setProgramsData] = useState<any>({ shelterChapters: [], programs: [] });
  const [eventsList, setEventsList] = useState<any[]>(INITIAL_EVENTS);
  const [articlesList, setArticlesList] = useState<any[]>(INITIAL_ARTICLES);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [deployStatus, setDeployStatus] = useState<any>(null);

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState("");

  // GitHub Personal Access Token management for Vercel/Cloud Run
  const [githubToken, setGithubToken] = useState("");
  const [isTestingToken, setIsTestingToken] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<"unknown" | "valid" | "invalid">("unknown");
  const [showTokenInput, setShowTokenInput] = useState(false);

  // Modal for Image Picker / Replacer
  const [imagePickerTarget, setImagePickerTarget] = useState<{
    currentUrl: string;
    onSelect: (newUrl: string) => void;
  } | null>(null);

  // Modal state for creating a new blog article
  const [showCreateArticleModal, setShowCreateArticleModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    category: "Community",
    author: "UPUA Communications",
    date: new Date().toISOString().split("T")[0],
    displayDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    image: "/assets/DMV-6.jpg",
    excerpt: "",
    content: "",
    readTime: "4 min read",
  });

  // Modal state for creating a new event
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    category: "Community Event",
    fullDate: "",
    time: "",
    venueName: "",
    location: "",
    flyer: "/events/convention-flyer.png",
    pricing: "General Admission: Free / RSVP Required",
    registrationUrl: "/portal",
    hotelBookingUrl: "",
    summary: "",
    description: "",
  });

  const showToast = useCallback((type: "success" | "error" | "info", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Parallel pre-fetching of all tab content on mount
  const loadAllContent = useCallback(async () => {
    try {
      const [
        homeRes,
        aboutRes,
        leadRes,
        trusteesRes,
        execRes,
        youthRes,
        chapRes,
        kingRes,
        progRes,
        eventRes,
        artRes,
        mediaRes,
      ] = await Promise.allSettled([
        fetch("/api/cms/content?type=page&name=home").then((r) => r.json()),
        fetch("/api/cms/content?type=page&name=about").then((r) => r.json()),
        fetch("/api/cms/content?type=collection&name=organization/leadership").then((r) => r.json()),
        fetch("/api/cms/content?type=collection&name=organization/trustees").then((r) => r.json()),
        fetch("/api/cms/content?type=collection&name=organization/executive-committee").then((r) => r.json()),
        fetch("/api/cms/content?type=collection&name=organization/youth-leadership").then((r) => r.json()),
        fetch("/api/cms/content?type=collection&name=organization/chapters").then((r) => r.json()),
        fetch("/api/cms/content?type=collection&name=organization/kingdoms").then((r) => r.json()),
        fetch("/api/cms/content?type=collection&name=programs/programs").then((r) => r.json()),
        fetch("/api/cms/content?type=collection&name=events/events").then((r) => r.json()),
        fetch("/api/cms/content?type=collection&name=blog/articles").then((r) => r.json()),
        fetch("/api/cms/media").then((r) => r.json()),
      ]);

      if (homeRes.status === "fulfilled" && homeRes.value?.data) setHomeData(homeRes.value.data);
      if (aboutRes.status === "fulfilled" && aboutRes.value?.data) setAboutData(aboutRes.value.data);
      if (leadRes.status === "fulfilled" && leadRes.value?.data?.length) setLeadershipList(leadRes.value.data);
      if (trusteesRes.status === "fulfilled" && trusteesRes.value?.data?.length) setTrusteesList(trusteesRes.value.data);
      if (execRes.status === "fulfilled" && execRes.value?.data?.length) setExecutivesList(execRes.value.data);
      if (youthRes.status === "fulfilled" && youthRes.value?.data?.length) setYouthList(youthRes.value.data);
      if (chapRes.status === "fulfilled" && chapRes.value?.data?.length) setChaptersList(chapRes.value.data);
      if (kingRes.status === "fulfilled" && kingRes.value?.data?.length) setKingdomsList(kingRes.value.data);
      if (progRes.status === "fulfilled" && progRes.value?.data?.programs) setProgramsData(progRes.value.data);
      if (eventRes.status === "fulfilled" && eventRes.value?.data?.length) setEventsList(eventRes.value.data);
      if (artRes.status === "fulfilled" && artRes.value?.data?.length) setArticlesList(artRes.value.data);
      if (mediaRes.status === "fulfilled" && mediaRes.value?.media?.length) setMediaList(mediaRes.value.media);
    } catch (e) {
      console.warn("CMS content prefetch warning:", e);
    }
  }, []);

  useEffect(() => {
    loadAllContent();
  }, [loadAllContent]);

  // Load saved GitHub token from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("upua_cms_github_token") || "";
      if (saved) {
        setGithubToken(saved);
        setTokenStatus("valid");
      }
    }
  }, []);

  function getActiveGitHubToken(): string {
    return githubToken || (typeof window !== "undefined" ? localStorage.getItem("upua_cms_github_token") || "" : "");
  }

  // Save content handler (supports local dev + Vercel GitHub commits)
  async function saveContent(type: "page" | "collection" | "global", name: string, data: any) {
    try {
      const token = getActiveGitHubToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["x-github-token"] = token;

      const res = await fetch("/api/cms/content", {
        method: "PUT",
        headers,
        body: JSON.stringify({ type, name, data }),
      });
      const json = await res.json();
      if (json.success) {
        const dest = json.savedVia === "github" ? " (committed to GitHub)" : "";
        showToast("success", `Saved changes for ${name}${dest}`);
        // Broadcast live-update event so all public page components refresh instantly
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("upua_cms_update", { detail: { type, name, data } })
          );
        }
      } else {
        if (json.code === "MISSING_GITHUB_TOKEN") {
          setActiveTab("deploy");
        }
        showToast("error", json.error || "Save failed");
      }
    } catch (err: any) {
      showToast("error", err.message || "Network error while saving");
    }
  }

  // Publish to GitHub master (triggers Vercel + Cloud Run)
  async function handlePublish() {
    setIsPublishing(true);
    try {
      const token = getActiveGitHubToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["x-github-token"] = token;

      // Bundle all current in-memory content across all tabs
      // Ensures commit succeeds reliably on Cloud Run, Vercel, and local dev
      const clientFiles = [
        { path: "content/pages/home.json", content: JSON.stringify(homeData, null, 2) },
        { path: "content/pages/about.json", content: JSON.stringify(aboutData, null, 2) },
        { path: "content/organization/leadership.json", content: JSON.stringify(leadershipList, null, 2) },
        { path: "content/organization/trustees.json", content: JSON.stringify(trusteesList, null, 2) },
        { path: "content/organization/executive-committee.json", content: JSON.stringify(executivesList, null, 2) },
        { path: "content/organization/youth-leadership.json", content: JSON.stringify(youthList, null, 2) },
        { path: "content/organization/chapters.json", content: JSON.stringify(chaptersList, null, 2) },
        { path: "content/organization/kingdoms.json", content: JSON.stringify(kingdomsList, null, 2) },
        { path: "content/programs/programs.json", content: JSON.stringify(programsData, null, 2) },
        { path: "content/events/events.json", content: JSON.stringify(eventsList, null, 2) },
        { path: "content/blog/articles.json", content: JSON.stringify(articlesList, null, 2) },
      ];

      const res = await fetch("/api/cms/publish", {
        method: "POST",
        headers,
        body: JSON.stringify({
          commitMessage: publishMessage.trim() || `CMS update by Website Editor on ${new Date().toLocaleDateString()}`,
          files: clientFiles,
        }),
      });
      const json = await res.json();
      if (json.success) {
        const shortSha = (json.commitSha || "").slice(0, 7) || "latest";
        showToast("success", `Published commit ${shortSha} to master! Deploying to Vercel and Cloud Run...`);
        setPublishMessage("");
      } else {
        showToast("error", json.error || "Publish failed");
      }
    } catch (err: any) {
      showToast("error", err.message || "Network error while publishing");
    } finally {
      setIsPublishing(false);
    }
  }

  // Direct file upload to CMS assets
  async function handleDirectUpload(file: File): Promise<string | null> {
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "general");
      const token = getActiveGitHubToken();
      const headers: Record<string, string> = {};
      if (token) headers["x-github-token"] = token;

      const res = await fetch("/api/cms/media", {
        method: "POST",
        headers,
        body: fd,
      });
      const json = await res.json();
      if (json.success) {
        showToast("success", `Image uploaded: ${json.url}`);
        // Refresh media library
        fetch("/api/cms/media")
          .then((r) => r.json())
          .then((m) => {
            if (m.media) setMediaList(m.media);
          });
        return json.url;
      } else {
        showToast("error", json.error || "Upload failed");
      }
    } catch (err: any) {
      showToast("error", err.message || "Failed to upload image");
    }
    return null;
  }

  // Replace a specific existing media file in place
  async function handleReplaceMediaFile(file: File, targetUrl: string) {
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("targetUrl", targetUrl);
      const token = getActiveGitHubToken();
      const headers: Record<string, string> = {};
      if (token) headers["x-github-token"] = token;

      const res = await fetch("/api/cms/media", {
        method: "POST",
        headers,
        body: fd,
      });
      const json = await res.json();
      if (json.success) {
        showToast("success", `Successfully replaced ${json.filename || "image"}!`);
        // Refresh media list and bust thumbnail cache
        const updatedList = mediaList.map((m) => {
          if (m.url === targetUrl) {
            return { ...m, sizeBytes: json.sizeBytes || m.sizeBytes, url: `${targetUrl.split("?")[0]}?v=${Date.now()}` };
          }
          return m;
        });
        setMediaList(updatedList);
      } else {
        showToast("error", json.error || "Image replacement failed");
      }
    } catch (err: any) {
      showToast("error", err.message || "Error replacing image file");
    }
  }

  // Create article submission
  function handleAddArticleSubmit() {
    if (!newArticle.title.trim()) {
      showToast("error", "Please provide a title for the article.");
      return;
    }
    const slug = newArticle.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const articleObj = {
      id: `art-${Date.now()}`,
      slug,
      title: newArticle.title.trim(),
      category: newArticle.category.trim(),
      date: newArticle.date,
      displayDate: newArticle.displayDate,
      readTime: newArticle.readTime,
      author: newArticle.author.trim(),
      image: newArticle.image,
      excerpt: newArticle.excerpt.trim(),
      featured: false,
      tags: [newArticle.category.trim(), "UPUA Update"],
      content: newArticle.content
        ? newArticle.content.split("\n\n").filter(Boolean)
        : [newArticle.excerpt.trim()],
    };

    const updated = [articleObj, ...articlesList];
    setArticlesList(updated);
    saveContent("collection", "blog/articles", updated);
    setShowCreateArticleModal(false);
    setNewArticle({
      title: "",
      category: "Community",
      author: "UPUA Communications",
      date: new Date().toISOString().split("T")[0],
      displayDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      image: "/assets/DMV-6.jpg",
      excerpt: "",
      content: "",
      readTime: "4 min read",
    });
    showToast("success", "New article created and saved!");
  }

  // Create event submission
  function handleAddEventSubmit() {
    if (!newEvent.title.trim()) {
      showToast("error", "Please provide an event title.");
      return;
    }
    const slug = newEvent.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const eventObj = {
      id: `event-${Date.now()}`,
      slug,
      title: newEvent.title.trim(),
      category: newEvent.category.trim(),
      fullDate: newEvent.fullDate.trim() || "TBA",
      time: newEvent.time.trim() || "All Day",
      location: newEvent.location.trim(),
      venueName: newEvent.venueName.trim(),
      address: newEvent.venueName.trim(),
      flyer: newEvent.flyer,
      featured: false,
      summary: newEvent.summary.trim(),
      pricing: newEvent.pricing.trim(),
      registrationUrl: newEvent.registrationUrl.trim() || "/portal",
      hotelBookingUrl: newEvent.hotelBookingUrl.trim(),
      description: newEvent.description.trim() || newEvent.summary.trim(),
    };

    const updated = [eventObj, ...eventsList];
    setEventsList(updated);
    saveContent("collection", "events/events", updated);
    setShowCreateEventModal(false);
    setNewEvent({
      title: "",
      category: "Community Event",
      fullDate: "",
      time: "",
      venueName: "",
      location: "",
      flyer: "/events/convention-flyer.png",
      pricing: "General Admission: Free / RSVP Required",
      registrationUrl: "/portal",
      hotelBookingUrl: "",
      summary: "",
      description: "",
    });
    showToast("success", "New event created and saved!");
  }

  // Universal Resilient Image Replacer Widget
  function ImageField({
    label,
    currentUrl,
    onChange,
  }: {
    label: string;
    currentUrl: string;
    onChange: (newUrl: string) => void;
  }) {
    return (
      <div style={{ marginBottom: "12px", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
          {label}
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#f8faf8",
            padding: "8px 10px",
            borderRadius: "8px",
            border: "1px solid #e1eae3",
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              position: "relative",
              borderRadius: "6px",
              overflow: "hidden",
              background: "#e5ece7",
              flexShrink: 0,
              border: "1px solid #d4dfd7",
            }}
          >
            {currentUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUrl}
                alt={label}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#888", fontSize: "0.65rem" }}>
                No image
              </div>
            )}
          </div>
          <div style={{ flex: "1 1 180px", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
            <input
              type="text"
              value={currentUrl || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/assets/..."
              style={{
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                padding: "6px 8px",
                fontSize: "0.78rem",
                borderRadius: "6px",
                border: "1px solid #d4dfd7",
                marginBottom: "5px",
              }}
            />
            <button
              type="button"
              onClick={() => setImagePickerTarget({ currentUrl, onSelect: onChange })}
              style={{
                background: "#0e3d26",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "5px 10px",
                fontSize: "0.72rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Camera size={12} /> Replace Image
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="cms-workspace-container"
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        padding: "8px 0 32px",
        overflowX: "hidden",
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0e3d26 0%, #175e3c 100%)",
          color: "#ffffff",
          borderRadius: "14px",
          padding: "20px 24px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          boxShadow: "0 6px 20px rgba(14, 61, 38, 0.12)",
        }}
      >
        <div style={{ flex: "1 1 300px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
            <span
              style={{
                background: "rgba(212, 175, 55, 0.2)",
                color: "#f7df72",
                border: "1px solid rgba(212, 175, 55, 0.4)",
                fontSize: "0.7rem",
                fontWeight: 800,
                padding: "2px 8px",
                borderRadius: "9999px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Live Visual CMS
            </span>
            <span style={{ color: "#c3ded0", fontSize: "0.78rem" }}>GitHub Master · Dual Vercel + Cloud Run</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", margin: "0 0 4px", fontWeight: 800 }}>
            Website Content &amp; Media Studio
          </h2>
          <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "0.85rem", margin: 0 }}>
            Visual editing for writeups, headings, leadership, chapters, kingdoms, and in-place media replacement.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", flexShrink: 0 }}>
          <Link
            href="/"
            target="_blank"
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "8px",
              padding: "8px 14px",
              fontSize: "0.8rem",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              textDecoration: "none",
            }}
          >
            <Globe size={14} /> View Live Website
          </Link>
          <button
            type="button"
            onClick={() => setActiveTab("deploy")}
            style={{
              background: "#d4af37",
              color: "#0e3d26",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "0.8rem",
              fontWeight: 800,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <Send size={14} /> Publish to GitHub
          </button>
        </div>
      </div>

      {/* GitHub Token Notice banner */}
      {!githubToken && (
        <div
          style={{
            background: "#fef9e7",
            border: "1px solid #f9e29f",
            borderRadius: "8px",
            padding: "8px 14px",
            marginBottom: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
            fontSize: "0.8rem",
            color: "#8a5800",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <AlertCircle size={15} />
            <span>
              <strong>Vercel Live Editor Notice:</strong> To save edits on the live site, configure your GitHub Personal Access Token in the <strong>Publish &amp; Deploy</strong> tab.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("deploy")}
            style={{
              background: "#8a5800",
              color: "#ffffff",
              border: "none",
              borderRadius: "5px",
              padding: "4px 10px",
              fontSize: "0.72rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Configure Token
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999999,
            background: toast.type === "success" ? "#0e3d26" : toast.type === "error" ? "#b91c1c" : "#1e40af",
            color: "#ffffff",
            padding: "10px 18px",
            borderRadius: "8px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.85rem",
            fontWeight: 600,
            maxWidth: "90vw",
          }}
        >
          {toast.type === "success" ? <CheckCircle2 size={16} /> : toast.type === "error" ? <AlertCircle size={16} /> : <Info size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navigation Tabs Bar — Scrollable without breaking parent width */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          paddingBottom: "10px",
          marginBottom: "20px",
          borderBottom: "1px solid #e1eae3",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
        }}
      >
        {[
          { id: "home", label: "Home Page", icon: Globe },
          { id: "about", label: "About Page", icon: BookOpen },
          { id: "leadership", label: "Leadership & BOT", icon: Shield },
          { id: "executives", label: "Executive Committee", icon: Users },
          { id: "youth", label: "Youth Wing (UPUAYA)", icon: Sparkles },
          { id: "chapters", label: "Chapters", icon: Building },
          { id: "kingdoms", label: "24 Royal Kingdoms", icon: Crown },
          { id: "programs", label: "Programs & Shelter", icon: Award },
          { id: "events", label: "Events & Convention", icon: Calendar },
          { id: "blog", label: "Blog & Press", icon: AlignLeft },
          { id: "media", label: "Media Manager", icon: ImageIcon },
          { id: "deploy", label: "Publish & Deploy", icon: Cloud },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as CMSTab)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                background: isActive ? "#0e3d26" : "#ffffff",
                color: isActive ? "#ffffff" : "#526359",
                border: isActive ? "1.5px solid #0e3d26" : "1.5px solid #e1eae3",
                fontSize: "0.8rem",
                fontWeight: isActive ? 800 : 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                boxSizing: "border-box",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. TAB: HOME PAGE WRITEUPS & HERO SECTION                                 */}
      {/* ========================================================================= */}
      {activeTab === "home" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
          {/* Hero Banner Section */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #e1eae3", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.1rem" }}>🌟</span>
                <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.1rem", fontWeight: 800 }}>Home Hero Section</h3>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("page", "home", homeData)}
                style={{ padding: "8px 16px", fontSize: "0.8rem" }}
              >
                <Save size={14} /> Save Home Page
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "16px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
              <div style={{ minWidth: 0, width: "100%" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Hero Eyebrow / Cultural Motto
                </label>
                <input
                  type="text"
                  value={homeData.hero?.badge || ""}
                  onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, badge: e.target.value } })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.82rem", marginBottom: "10px" }}
                />

                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Main Organization Heading
                </label>
                <input
                  type="text"
                  value={homeData.hero?.heading || ""}
                  onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, heading: e.target.value } })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.9rem", fontWeight: 800, color: "#0e3d26", marginBottom: "10px" }}
                />

                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Subheading
                </label>
                <input
                  type="text"
                  value={homeData.hero?.subheading || ""}
                  onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, subheading: e.target.value } })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.82rem", marginBottom: "10px" }}
                />

                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Hero Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={homeData.hero?.description || ""}
                  onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, description: e.target.value } })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.82rem", marginBottom: "10px" }}
                />
              </div>

              <div style={{ minWidth: 0, width: "100%" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Primary CTA (Button Text &amp; Link)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 130px), 1fr))", gap: "8px", marginBottom: "10px" }}>
                  <input
                    type="text"
                    value={homeData.hero?.ctaPrimaryLabel || ""}
                    onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, ctaPrimaryLabel: e.target.value } })}
                    placeholder="Button Text"
                    style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                  />
                  <input
                    type="text"
                    value={homeData.hero?.ctaPrimaryUrl || ""}
                    onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, ctaPrimaryUrl: e.target.value } })}
                    placeholder="URL Link"
                    style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                  />
                </div>

                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Secondary CTA (Button Text &amp; Link)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 130px), 1fr))", gap: "8px", marginBottom: "14px" }}>
                  <input
                    type="text"
                    value={homeData.hero?.ctaSecondaryLabel || ""}
                    onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, ctaSecondaryLabel: e.target.value } })}
                    placeholder="Button Text"
                    style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                  />
                  <input
                    type="text"
                    value={homeData.hero?.ctaSecondaryUrl || ""}
                    onChange={(e) => setHomeData({ ...homeData, hero: { ...homeData.hero, ctaSecondaryUrl: e.target.value } })}
                    placeholder="URL Link"
                    style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                  />
                </div>

                {/* Hero Rotating Slides */}
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "6px" }}>
                  Hero Background Images (Rotating Slides)
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {(homeData.hero?.carouselImages || []).map((imgUrl: string, idx: number) => (
                    <ImageField
                      key={idx}
                      label={`Hero Slide #${idx + 1}`}
                      currentUrl={imgUrl}
                      onChange={(newUrl) => {
                        const updated = [...(homeData.hero?.carouselImages || [])];
                        updated[idx] = newUrl;
                        setHomeData({ ...homeData, hero: { ...homeData.hero, carouselImages: updated } });
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Infinite Marquee Writeup */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #e1eae3", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <span style={{ fontSize: "1.1rem" }}>🎗️</span>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.1rem", fontWeight: 800 }}>Cultural Marquee Banner</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "12px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Marquee Title
                </label>
                <input
                  type="text"
                  value={homeData.marquee?.title || ""}
                  onChange={(e) => setHomeData({ ...homeData, marquee: { ...homeData.marquee, title: e.target.value } })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.82rem", fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Marquee Subtitle
                </label>
                <input
                  type="text"
                  value={homeData.marquee?.subtitle || ""}
                  onChange={(e) => setHomeData({ ...homeData, marquee: { ...homeData.marquee, subtitle: e.target.value } })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.82rem" }}
                />
              </div>
            </div>
          </div>

          {/* Mission & Why UPUA Exists */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #e1eae3", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <span style={{ fontSize: "1.1rem" }}>🌍</span>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.1rem", fontWeight: 800 }}>Why UPUA Exists Section</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>Eyebrow Tag</label>
                <input
                  type="text"
                  value={homeData.mission?.eyebrow || ""}
                  onChange={(e) => setHomeData({ ...homeData, mission: { ...homeData.mission, eyebrow: e.target.value } })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.82rem" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>Heading</label>
                <input
                  type="text"
                  value={homeData.mission?.heading || ""}
                  onChange={(e) => setHomeData({ ...homeData, mission: { ...homeData.mission, heading: e.target.value } })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.9rem", fontWeight: 800, color: "#0e3d26" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>Story Description</label>
                <textarea
                  rows={3}
                  value={homeData.mission?.description || ""}
                  onChange={(e) => setHomeData({ ...homeData, mission: { ...homeData.mission, description: e.target.value } })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.82rem" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB: ABOUT PAGE                                                        */}
      {/* ========================================================================= */}
      {activeTab === "about" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #e1eae3", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.1rem" }}>📖</span>
                <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.1rem", fontWeight: 800 }}>About Page &amp; Accreditation</h3>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("page", "about", aboutData)}
                style={{ padding: "8px 16px", fontSize: "0.8rem" }}
              >
                <Save size={14} /> Save About Page
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "16px", marginBottom: "16px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
              <div style={{ minWidth: 0, width: "100%" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>Hero Heading</label>
                <input
                  type="text"
                  value={aboutData.hero?.heading || ""}
                  onChange={(e) => setAboutData({ ...aboutData, hero: { ...aboutData.hero, heading: e.target.value } })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.9rem", fontWeight: 800, color: "#0e3d26", marginBottom: "10px" }}
                />

                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>Hero Subheading</label>
                <textarea
                  rows={2}
                  value={aboutData.hero?.subheading || ""}
                  onChange={(e) => setAboutData({ ...aboutData, hero: { ...aboutData.hero, subheading: e.target.value } })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.82rem", marginBottom: "10px" }}
                />

                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>501(c)(3) Accreditation Statement</label>
                <textarea
                  rows={3}
                  value={aboutData.history?.accreditation || ""}
                  onChange={(e) => setAboutData({ ...aboutData, history: { ...aboutData.history, accreditation: e.target.value } })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.82rem" }}
                />
              </div>

              <div style={{ minWidth: 0, width: "100%" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>Mission Statement</label>
                <textarea
                  rows={4}
                  value={aboutData.missionVision?.mission || ""}
                  onChange={(e) => setAboutData({ ...aboutData, missionVision: { ...aboutData.missionVision, mission: e.target.value } })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.82rem", marginBottom: "10px" }}
                />

                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>Vision Statement</label>
                <textarea
                  rows={4}
                  value={aboutData.missionVision?.vision || ""}
                  onChange={(e) => setAboutData({ ...aboutData, missionVision: { ...aboutData.missionVision, vision: e.target.value } })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.82rem" }}
                />
              </div>
            </div>

            {/* National Anthem Lyrics */}
            <div style={{ borderTop: "1px solid #e1eae3", paddingTop: "14px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, color: "#0e3d26", marginBottom: "8px" }}>
                The Urhobo National Anthem Lyrics &amp; English Translation
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "14px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#137459", display: "block", marginBottom: "4px" }}>Urhobo (Original)</span>
                  <textarea
                    rows={8}
                    value={aboutData.nationalAnthem?.urhoboLyrics?.join("\n") || ""}
                    onChange={(e) =>
                      setAboutData({
                        ...aboutData,
                        nationalAnthem: { ...aboutData.nationalAnthem, urhoboLyrics: e.target.value.split("\n") },
                      })
                    }
                    style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem", fontFamily: "monospace" }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#137459", display: "block", marginBottom: "4px" }}>English Translation</span>
                  <textarea
                    rows={8}
                    value={aboutData.nationalAnthem?.englishTranslation?.join("\n") || ""}
                    onChange={(e) =>
                      setAboutData({
                        ...aboutData,
                        nationalAnthem: { ...aboutData.nationalAnthem, englishTranslation: e.target.value.split("\n") },
                      })
                    }
                    style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem", fontFamily: "monospace" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB: LEADERSHIP & BOARD OF TRUSTEES (BOT)                              */}
      {/* ========================================================================= */}
      {activeTab === "leadership" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
          {/* Top Leaders */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #e1eae3", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.1rem", fontWeight: 800 }}>👑 National President &amp; BOT Chairman</h3>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("collection", "organization/leadership", leadershipList)}
                style={{ padding: "8px 16px", fontSize: "0.8rem" }}
              >
                <Save size={14} /> Save Top Leaders
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "16px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
              {leadershipList.map((leader, idx) => (
                <div key={leader.id || idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "14px", background: "#fbfcfb", minWidth: 0, maxWidth: "100%", boxSizing: "border-box", overflow: "hidden" }}>
                  <ImageField
                    label="Portrait Photograph"
                    currentUrl={leader.image}
                    onChange={(newUrl) => {
                      const updated = [...leadershipList];
                      updated[idx].image = newUrl;
                      setLeadershipList(updated);
                    }}
                  />

                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>
                    Full Name &amp; Title
                  </label>
                  <input
                    type="text"
                    value={leader.name}
                    onChange={(e) => {
                      const updated = [...leadershipList];
                      updated[idx].name = e.target.value;
                      setLeadershipList(updated);
                    }}
                    style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0e3d26", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "6px", padding: "6px 8px", marginBottom: "6px" }}
                  />

                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>
                    Executive Position
                  </label>
                  <input
                    type="text"
                    value={leader.title}
                    onChange={(e) => {
                      const updated = [...leadershipList];
                      updated[idx].title = e.target.value;
                      setLeadershipList(updated);
                    }}
                    style={{ fontSize: "0.8rem", color: "#137459", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "6px", padding: "6px 8px", marginBottom: "6px" }}
                  />

                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>
                    Tagline / Credentials
                  </label>
                  <input
                    type="text"
                    value={leader.tagline}
                    onChange={(e) => {
                      const updated = [...leadershipList];
                      updated[idx].tagline = e.target.value;
                      setLeadershipList(updated);
                    }}
                    style={{ fontSize: "0.78rem", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "6px", padding: "6px 8px", marginBottom: "6px" }}
                  />

                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>
                    Biography &amp; Address
                  </label>
                  <textarea
                    rows={4}
                    value={leader.bio}
                    onChange={(e) => {
                      const updated = [...leadershipList];
                      updated[idx].bio = e.target.value;
                      setLeadershipList(updated);
                    }}
                    style={{ fontSize: "0.8rem", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "6px", padding: "6px 8px", resize: "vertical" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Board of Trustees Grid */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #e1eae3", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.1rem", fontWeight: 800 }}>🛡️ Board of Trustees (BOT)</h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#526359" }}>{trusteesList.length} accredited trustees across North America with photos and Replace buttons</p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => {
                    const newTrustee = {
                      slug: `trustee-${Date.now()}`,
                      name: "New Trustee Name",
                      title: "Trustee",
                      chapter: "Chapter Name",
                      localPath: "/assets/president.png",
                    };
                    setTrusteesList([...trusteesList, newTrustee]);
                    showToast("info", "Added new trustee card at bottom");
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 12px",
                    borderRadius: "6px",
                    border: "1px solid #0e3d26",
                    background: "#f0fdf4",
                    color: "#0e3d26",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <Plus size={13} /> Add Trustee
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => saveContent("collection", "organization/trustees", trusteesList)}
                  style={{ padding: "7px 14px", fontSize: "0.8rem" }}
                >
                  <Save size={13} /> Save All Trustees
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "14px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
              {trusteesList.map((trustee, idx) => (
                <div key={trustee.slug || idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "12px", background: "#fbfcfb", position: "relative", minWidth: 0, maxWidth: "100%", boxSizing: "border-box", overflow: "hidden" }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove ${trustee.name} from BOT list?`)) {
                        const updated = trusteesList.filter((_, i) => i !== idx);
                        setTrusteesList(updated);
                      }
                    }}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "transparent",
                      border: "none",
                      color: "#dc2626",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                    title="Delete Trustee"
                  >
                    <Trash2 size={14} />
                  </button>

                  <ImageField
                    label="Trustee Photo"
                    currentUrl={trustee.localPath || trustee.imgUrl}
                    onChange={(newUrl) => {
                      const updated = [...trusteesList];
                      updated[idx].localPath = newUrl;
                      setTrusteesList(updated);
                    }}
                  />
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Trustee Name</label>
                  <input
                    type="text"
                    value={trustee.name}
                    onChange={(e) => {
                      const updated = [...trusteesList];
                      updated[idx].name = e.target.value;
                      setTrusteesList(updated);
                    }}
                    style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0e3d26", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "5px" }}
                  />
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>BOT Title</label>
                  <input
                    type="text"
                    value={trustee.title}
                    onChange={(e) => {
                      const updated = [...trusteesList];
                      updated[idx].title = e.target.value;
                      setTrusteesList(updated);
                    }}
                    style={{ fontSize: "0.78rem", color: "#137459", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "5px" }}
                  />
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#526359", marginBottom: "2px" }}>Chapter Affiliation</label>
                  <input
                    type="text"
                    value={trustee.chapter}
                    onChange={(e) => {
                      const updated = [...trusteesList];
                      updated[idx].chapter = e.target.value;
                      setTrusteesList(updated);
                    }}
                    style={{ fontSize: "0.75rem", color: "#526359", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB: EXECUTIVE COMMITTEE                                              */}
      {/* ========================================================================= */}
      {activeTab === "executives" && (
        <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #e1eae3", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.1rem", fontWeight: 800 }}>🏛️ National Executive Committee (EC)</h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#526359" }}>{executivesList.length} elected national officers with portraits and Replace Image buttons</p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => {
                  const newExec = {
                    id: `ec-${Date.now()}`,
                    name: "Officer Full Name",
                    role: "Office / Position",
                    department: "Executive",
                    image: "/assets/president.png",
                    order: executivesList.length + 1,
                  };
                  setExecutivesList([...executivesList, newExec]);
                  showToast("info", "Added new officer card");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 12px",
                  borderRadius: "6px",
                  border: "1px solid #0e3d26",
                  background: "#f0fdf4",
                  color: "#0e3d26",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Plus size={13} /> Add Officer
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("collection", "organization/executive-committee", executivesList)}
                style={{ padding: "7px 14px", fontSize: "0.8rem" }}
              >
                <Save size={13} /> Save Executive Committee
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "14px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
            {executivesList.map((officer, idx) => (
              <div key={officer.id || idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "12px", background: "#fbfcfb", position: "relative", minWidth: 0, maxWidth: "100%", boxSizing: "border-box", overflow: "hidden" }}>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove ${officer.name}?`)) {
                      setExecutivesList(executivesList.filter((_, i) => i !== idx));
                    }
                  }}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "transparent",
                    border: "none",
                    color: "#dc2626",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                  title="Delete Officer"
                >
                  <Trash2 size={14} />
                </button>

                <ImageField
                  label="Officer Portrait"
                  currentUrl={officer.image}
                  onChange={(newUrl) => {
                    const updated = [...executivesList];
                    updated[idx].image = newUrl;
                    setExecutivesList(updated);
                  }}
                />
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Full Name</label>
                <input
                  type="text"
                  value={officer.name}
                  onChange={(e) => {
                    const updated = [...executivesList];
                    updated[idx].name = e.target.value;
                    setExecutivesList(updated);
                  }}
                  style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0e3d26", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "5px" }}
                />
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Office / Role</label>
                <input
                  type="text"
                  value={officer.role}
                  onChange={(e) => {
                    const updated = [...executivesList];
                    updated[idx].role = e.target.value;
                    setExecutivesList(updated);
                  }}
                  style={{ fontSize: "0.78rem", color: "#137459", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "5px" }}
                />
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#526359", marginBottom: "2px" }}>Department</label>
                <input
                  type="text"
                  value={officer.department || ""}
                  onChange={(e) => {
                    const updated = [...executivesList];
                    updated[idx].department = e.target.value;
                    setExecutivesList(updated);
                  }}
                  style={{ fontSize: "0.75rem", color: "#526359", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB: YOUTH LEADERSHIP                                                 */}
      {/* ========================================================================= */}
      {activeTab === "youth" && (
        <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #e1eae3", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.1rem", fontWeight: 800 }}>🌟 UPUAYA Youth Wing Executive Leaders</h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#526359" }}>{youthList.length} executive leaders across North America with photos and Replace buttons</p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => {
                  const newYouth = {
                    id: `upuaya-${Date.now()}`,
                    name: "Youth Officer Name",
                    role: "Youth Position",
                    chapter: "Chapter Name",
                    image: "/assets/upuaya/kevwe.jpg",
                    order: youthList.length + 1,
                  };
                  setYouthList([...youthList, newYouth]);
                  showToast("info", "Added new youth officer card");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 12px",
                  borderRadius: "6px",
                  border: "1px solid #0e3d26",
                  background: "#f0fdf4",
                  color: "#0e3d26",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Plus size={13} /> Add Youth Officer
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("collection", "organization/youth-leadership", youthList)}
                style={{ padding: "7px 14px", fontSize: "0.8rem" }}
              >
                <Save size={13} /> Save Youth Executives
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "14px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
            {youthList.map((leader, idx) => (
              <div key={leader.id || idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "12px", background: "#fbfcfb", position: "relative", minWidth: 0, maxWidth: "100%", boxSizing: "border-box", overflow: "hidden" }}>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove ${leader.name}?`)) {
                      setYouthList(youthList.filter((_, i) => i !== idx));
                    }
                  }}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "transparent",
                    border: "none",
                    color: "#dc2626",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                  title="Delete Youth Leader"
                >
                  <Trash2 size={14} />
                </button>

                <ImageField
                  label="Youth Leader Photo"
                  currentUrl={leader.image}
                  onChange={(newUrl) => {
                    const updated = [...youthList];
                    updated[idx].image = newUrl;
                    setYouthList(updated);
                  }}
                />
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Full Name</label>
                <input
                  type="text"
                  value={leader.name}
                  onChange={(e) => {
                    const updated = [...youthList];
                    updated[idx].name = e.target.value;
                    setYouthList(updated);
                  }}
                  style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0e3d26", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "5px" }}
                />
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Position / Portfolio</label>
                <input
                  type="text"
                  value={leader.role}
                  onChange={(e) => {
                    const updated = [...youthList];
                    updated[idx].role = e.target.value;
                    setYouthList(updated);
                  }}
                  style={{ fontSize: "0.78rem", color: "#137459", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "5px" }}
                />
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#526359", marginBottom: "2px" }}>Chapter Affiliation</label>
                <input
                  type="text"
                  value={leader.chapter}
                  onChange={(e) => {
                    const updated = [...youthList];
                    updated[idx].chapter = e.target.value;
                    setYouthList(updated);
                  }}
                  style={{ fontSize: "0.75rem", color: "#526359", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB: CHAPTERS DIRECTORY                                               */}
      {/* ========================================================================= */}
      {activeTab === "chapters" && (
        <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #e1eae3", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.1rem", fontWeight: 800 }}>📍 North American Chapters Directory</h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#526359" }}>{chaptersList.length} accredited metro chapters with photos, location, and Replace buttons</p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => {
                  const newChap = {
                    id: `c-${Date.now()}`,
                    name: "New UPUA Chapter Name",
                    abbreviation: "UPU",
                    president: "Chapter President Name",
                    region: "North America",
                    location: "City, State",
                    website: "",
                    image: "/assets/DMV-6.jpg",
                    order: chaptersList.length + 1,
                  };
                  setChaptersList([...chaptersList, newChap]);
                  showToast("info", "Added new chapter card");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 12px",
                  borderRadius: "6px",
                  border: "1px solid #0e3d26",
                  background: "#f0fdf4",
                  color: "#0e3d26",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Plus size={13} /> Add Chapter
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("collection", "organization/chapters", chaptersList)}
                style={{ padding: "7px 14px", fontSize: "0.8rem" }}
              >
                <Save size={13} /> Save Chapters
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "14px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
            {chaptersList.map((chapter, idx) => (
              <div key={chapter.id || idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "14px", background: "#fbfcfb", position: "relative", minWidth: 0, maxWidth: "100%", boxSizing: "border-box", overflow: "hidden" }}>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove chapter ${chapter.name}?`)) {
                      setChaptersList(chaptersList.filter((_, i) => i !== idx));
                    }
                  }}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "transparent",
                    border: "none",
                    color: "#dc2626",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                  title="Delete Chapter"
                >
                  <Trash2 size={14} />
                </button>

                <ImageField
                  label="Chapter Banner / Photo"
                  currentUrl={chapter.image || "/assets/DMV-6.jpg"}
                  onChange={(newUrl) => {
                    const updated = [...chaptersList];
                    updated[idx].image = newUrl;
                    setChaptersList(updated);
                  }}
                />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#137459", textTransform: "uppercase" }}>{chapter.region || "Metro Region"}</span>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#888" }}>#{idx + 1}</span>
                </div>

                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Chapter Full Name</label>
                <input
                  type="text"
                  value={chapter.name}
                  onChange={(e) => {
                    const updated = [...chaptersList];
                    updated[idx].name = e.target.value;
                    setChaptersList(updated);
                  }}
                  style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0e3d26", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "5px" }}
                />

                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#526359", marginBottom: "2px" }}>Chapter President</label>
                <input
                  type="text"
                  value={chapter.president}
                  onChange={(e) => {
                    const updated = [...chaptersList];
                    updated[idx].president = e.target.value;
                    setChaptersList(updated);
                  }}
                  style={{ fontSize: "0.78rem", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "5px" }}
                />

                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#526359", marginBottom: "2px" }}>City &amp; Metro Location</label>
                <input
                  type="text"
                  value={chapter.location || ""}
                  onChange={(e) => {
                    const updated = [...chaptersList];
                    updated[idx].location = e.target.value;
                    setChaptersList(updated);
                  }}
                  placeholder="e.g. Washington DC, MD, VA"
                  style={{ fontSize: "0.75rem", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "5px" }}
                />

                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#526359", marginBottom: "2px" }}>Official Website URL</label>
                <input
                  type="text"
                  value={chapter.website || ""}
                  placeholder="https://..."
                  onChange={(e) => {
                    const updated = [...chaptersList];
                    updated[idx].website = e.target.value;
                    setChaptersList(updated);
                  }}
                  style={{ fontSize: "0.75rem", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB: 24 ROYAL KINGDOMS                                                */}
      {/* ========================================================================= */}
      {activeTab === "kingdoms" && (
        <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #e1eae3", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.1rem", fontWeight: 800 }}>👑 The 24 Urhobo Royal Kingdoms</h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#526359" }}>Honoring traditional heritage, ancient dynasties, and Royal Monarchs</p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => {
                  const newKing = {
                    id: `k-${Date.now()}`,
                    name: "New Kingdom Name",
                    king: "HRM Traditional Title & Name",
                    emblem: "/assets/slide2/3.jpeg",
                    order: kingdomsList.length + 1,
                  };
                  setKingdomsList([...kingdomsList, newKing]);
                  showToast("info", "Added new royal kingdom card");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 12px",
                  borderRadius: "6px",
                  border: "1px solid #0e3d26",
                  background: "#f0fdf4",
                  color: "#0e3d26",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Plus size={13} /> Add Royal Kingdom
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("collection", "organization/kingdoms", kingdomsList)}
                style={{ padding: "7px 14px", fontSize: "0.8rem" }}
              >
                <Save size={13} /> Save Royal Kingdoms
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "14px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
            {kingdomsList.map((k, idx) => (
              <div key={k.id || idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "12px", background: "#fbfcfb", position: "relative", minWidth: 0, maxWidth: "100%", boxSizing: "border-box", overflow: "hidden" }}>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove kingdom ${k.name}?`)) {
                      setKingdomsList(kingdomsList.filter((_, i) => i !== idx));
                    }
                  }}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "transparent",
                    border: "none",
                    color: "#dc2626",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                  title="Delete Kingdom"
                >
                  <Trash2 size={14} />
                </button>

                <ImageField
                  label="Royal Crest / Monarch Photo"
                  currentUrl={k.emblem || "/assets/slide2/3.jpeg"}
                  onChange={(newUrl) => {
                    const updated = [...kingdomsList];
                    updated[idx].emblem = newUrl;
                    setKingdomsList(updated);
                  }}
                />

                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#137459" }}>Kingdom #{idx + 1}</span>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", margin: "2px 0" }}>Kingdom Title</label>
                <input
                  type="text"
                  value={k.name}
                  onChange={(e) => {
                    const updated = [...kingdomsList];
                    updated[idx].name = e.target.value;
                    setKingdomsList(updated);
                  }}
                  style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0e3d26", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "5px" }}
                />

                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#526359", margin: "2px 0" }}>Reigning Monarch &amp; Royal Honours</label>
                <textarea
                  rows={2}
                  value={k.king}
                  onChange={(e) => {
                    const updated = [...kingdomsList];
                    updated[idx].king = e.target.value;
                    setKingdomsList(updated);
                  }}
                  style={{ fontSize: "0.78rem", color: "#526359", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. TAB: PROGRAMS & SHELTER INITIATIVE                                    */}
      {/* ========================================================================= */}
      {activeTab === "programs" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
          {/* Women in Shelter Initiative Chapter Delegations */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #e1eae3", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.1rem", fontWeight: 800 }}>🎗️ Women in Shelter Initiative Delegations</h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#526359" }}>Chapter donation outreach photographs and host cities</p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("collection", "programs/programs", programsData)}
                style={{ padding: "8px 16px", fontSize: "0.8rem" }}
              >
                <Save size={14} /> Save Programs
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))", gap: "12px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
              {(programsData.shelterChapters || []).map((sc: any, idx: number) => (
                <div key={idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "10px", background: "#fbfcfb", minWidth: 0, maxWidth: "100%", boxSizing: "border-box", overflow: "hidden" }}>
                  <ImageField
                    label="Outreach Photo"
                    currentUrl={sc.image}
                    onChange={(newUrl) => {
                      const updated = { ...programsData };
                      updated.shelterChapters[idx].image = newUrl;
                      setProgramsData(updated);
                    }}
                  />
                  <input
                    type="text"
                    value={sc.chapter}
                    onChange={(e) => {
                      const updated = { ...programsData };
                      updated.shelterChapters[idx].chapter = e.target.value;
                      setProgramsData(updated);
                    }}
                    style={{ fontWeight: 800, fontSize: "0.82rem", color: "#0e3d26", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "4px" }}
                  />
                  <input
                    type="text"
                    value={sc.location}
                    onChange={(e) => {
                      const updated = { ...programsData };
                      updated.shelterChapters[idx].location = e.target.value;
                      setProgramsData(updated);
                    }}
                    style={{ fontSize: "0.75rem", color: "#526359", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Signature Initiatives */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #e1eae3", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
            <h3 style={{ margin: "0 0 14px", color: "#0e3d26", fontSize: "1.1rem", fontWeight: 800 }}>Signature Civic Programs &amp; Full Writeups</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
              {(programsData.programs || []).map((prog: any, idx: number) => (
                <div key={prog.id || idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "16px", background: "#fbfcfb", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "14px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
                    <div style={{ minWidth: 0, width: "100%" }}>
                      <ImageField
                        label="Program Featured Image"
                        currentUrl={prog.featuredImage}
                        onChange={(newUrl) => {
                          const updated = { ...programsData };
                          updated.programs[idx].featuredImage = newUrl;
                          setProgramsData(updated);
                        }}
                      />
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Program Title</label>
                      <input
                        type="text"
                        value={prog.title}
                        onChange={(e) => {
                          const updated = { ...programsData };
                          updated.programs[idx].title = e.target.value;
                          setProgramsData(updated);
                        }}
                        style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0e3d26", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "6px" }}
                      />
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Category</label>
                      <input
                        type="text"
                        value={prog.category}
                        onChange={(e) => {
                          const updated = { ...programsData };
                          updated.programs[idx].category = e.target.value;
                          setProgramsData(updated);
                        }}
                        style={{ fontSize: "0.78rem", color: "#137459", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                      />
                    </div>
                    <div style={{ minWidth: 0, width: "100%" }}>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Summary / Impact</label>
                      <textarea
                        rows={3}
                        value={prog.summary}
                        onChange={(e) => {
                          const updated = { ...programsData };
                          updated.programs[idx].summary = e.target.value;
                          setProgramsData(updated);
                        }}
                        style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", fontSize: "0.78rem", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "6px" }}
                      />
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Detailed Narrative</label>
                      <textarea
                        rows={4}
                        value={prog.fullWriteup?.join("\n\n") || ""}
                        onChange={(e) => {
                          const updated = { ...programsData };
                          updated.programs[idx].fullWriteup = e.target.value.split("\n\n").filter(Boolean);
                          setProgramsData(updated);
                        }}
                        style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", fontSize: "0.78rem", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. TAB: EVENTS & CONVENTION                                              */}
      {/* ========================================================================= */}
      {activeTab === "events" && (
        <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #e1eae3", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.1rem", fontWeight: 800 }}>📅 Events &amp; Convention Manager</h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#526359" }}>{eventsList.length} events, conventions, and convocations with full edit functions</p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setShowCreateEventModal(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 12px",
                  borderRadius: "6px",
                  border: "1px solid #0e3d26",
                  background: "#f0fdf4",
                  color: "#0e3d26",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Plus size={13} /> Add New Event
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("collection", "events/events", eventsList)}
                style={{ padding: "7px 14px", fontSize: "0.8rem" }}
              >
                <Save size={13} /> Save Events
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
            {eventsList.map((event, idx) => (
              <div key={event.id || idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "16px", background: "#fbfcfb", position: "relative", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete event "${event.title}"?`)) {
                      setEventsList(eventsList.filter((_, i) => i !== idx));
                    }
                  }}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "transparent",
                    border: "none",
                    color: "#dc2626",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                  title="Delete Event"
                >
                  <Trash2 size={15} />
                </button>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "14px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
                  <div style={{ minWidth: 0, width: "100%" }}>
                    <ImageField
                      label="Event Flyer / Poster Image"
                      currentUrl={event.flyer}
                      onChange={(newUrl) => {
                        const updated = [...eventsList];
                        updated[idx].flyer = newUrl;
                        setEventsList(updated);
                      }}
                    />
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Event Title</label>
                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) => {
                        const updated = [...eventsList];
                        updated[idx].title = e.target.value;
                        setEventsList(updated);
                      }}
                      style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0e3d26", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "6px" }}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))", gap: "8px", marginBottom: "6px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Category</label>
                        <input
                          type="text"
                          value={event.category}
                          onChange={(e) => {
                            const updated = [...eventsList];
                            updated[idx].category = e.target.value;
                            setEventsList(updated);
                          }}
                          style={{ fontSize: "0.78rem", color: "#137459", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Full Date String</label>
                        <input
                          type="text"
                          value={event.fullDate}
                          onChange={(e) => {
                            const updated = [...eventsList];
                            updated[idx].fullDate = e.target.value;
                            setEventsList(updated);
                          }}
                          style={{ fontSize: "0.78rem", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                        />
                      </div>
                    </div>

                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Venue &amp; Location</label>
                    <input
                      type="text"
                      value={event.venueName}
                      onChange={(e) => {
                        const updated = [...eventsList];
                        updated[idx].venueName = e.target.value;
                        setEventsList(updated);
                      }}
                      style={{ fontSize: "0.78rem", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "4px" }}
                    />
                    <input
                      type="text"
                      value={event.location}
                      onChange={(e) => {
                        const updated = [...eventsList];
                        updated[idx].location = e.target.value;
                        setEventsList(updated);
                      }}
                      style={{ fontSize: "0.75rem", color: "#526359", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                    />
                  </div>

                  <div style={{ minWidth: 0, width: "100%" }}>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Pricing / Ticket Options</label>
                    <input
                      type="text"
                      value={event.pricing}
                      onChange={(e) => {
                        const updated = [...eventsList];
                        updated[idx].pricing = e.target.value;
                        setEventsList(updated);
                      }}
                      style={{ fontSize: "0.78rem", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "6px" }}
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))", gap: "8px", marginBottom: "6px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Registration Link</label>
                        <input
                          type="text"
                          value={event.registrationUrl}
                          onChange={(e) => {
                            const updated = [...eventsList];
                            updated[idx].registrationUrl = e.target.value;
                            setEventsList(updated);
                          }}
                          style={{ fontSize: "0.75rem", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Hotel Booking Link</label>
                        <input
                          type="text"
                          value={event.hotelBookingUrl || ""}
                          onChange={(e) => {
                            const updated = [...eventsList];
                            updated[idx].hotelBookingUrl = e.target.value;
                            setEventsList(updated);
                          }}
                          style={{ fontSize: "0.75rem", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                        />
                      </div>
                    </div>

                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Event Summary</label>
                    <textarea
                      rows={2}
                      value={event.summary}
                      onChange={(e) => {
                        const updated = [...eventsList];
                        updated[idx].summary = e.target.value;
                        setEventsList(updated);
                      }}
                      style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", fontSize: "0.78rem", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "6px" }}
                    />

                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Full Description</label>
                    <textarea
                      rows={3}
                      value={event.description}
                      onChange={(e) => {
                        const updated = [...eventsList];
                        updated[idx].description = e.target.value;
                        setEventsList(updated);
                      }}
                      style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", fontSize: "0.78rem", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. TAB: BLOG & PRESS ARTICLES (WITH ARTICLE CREATION)                   */}
      {/* ========================================================================= */}
      {activeTab === "blog" && (
        <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #e1eae3", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.1rem", fontWeight: 800 }}>📰 Blog &amp; Press Articles</h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#526359" }}>{articlesList.length} articles published · Create new stories with image, title, description, and body</p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setShowCreateArticleModal(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 12px",
                  borderRadius: "6px",
                  border: "1px solid #0e3d26",
                  background: "#f0fdf4",
                  color: "#0e3d26",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Plus size={13} /> Create Blog Article
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveContent("collection", "blog/articles", articlesList)}
                style={{ padding: "7px 14px", fontSize: "0.8rem" }}
              >
                <Save size={13} /> Save Articles
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
            {articlesList.map((article, idx) => (
              <div key={article.id || idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "16px", background: "#fbfcfb", position: "relative", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete article "${article.title}"?`)) {
                      setArticlesList(articlesList.filter((_, i) => i !== idx));
                    }
                  }}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "transparent",
                    border: "none",
                    color: "#dc2626",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                  title="Delete Article"
                >
                  <Trash2 size={15} />
                </button>

                <ImageField
                  label="Article Lead Photograph"
                  currentUrl={article.image}
                  onChange={(newUrl) => {
                    const updated = [...articlesList];
                    updated[idx].image = newUrl;
                    setArticlesList(updated);
                  }}
                />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "10px", marginBottom: "6px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Article Title</label>
                    <input
                      type="text"
                      value={article.title}
                      onChange={(e) => {
                        const updated = [...articlesList];
                        updated[idx].title = e.target.value;
                        setArticlesList(updated);
                      }}
                      style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0e3d26", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Category</label>
                    <input
                      type="text"
                      value={article.category}
                      onChange={(e) => {
                        const updated = [...articlesList];
                        updated[idx].category = e.target.value;
                        setArticlesList(updated);
                      }}
                      style={{ fontSize: "0.78rem", color: "#137459", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "10px", marginBottom: "6px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#526359", marginBottom: "2px" }}>Date String</label>
                    <input
                      type="text"
                      value={article.displayDate || article.date}
                      onChange={(e) => {
                        const updated = [...articlesList];
                        updated[idx].displayDate = e.target.value;
                        setArticlesList(updated);
                      }}
                      style={{ fontSize: "0.78rem", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#526359", marginBottom: "2px" }}>Author</label>
                    <input
                      type="text"
                      value={article.author}
                      onChange={(e) => {
                        const updated = [...articlesList];
                        updated[idx].author = e.target.value;
                        setArticlesList(updated);
                      }}
                      style={{ fontSize: "0.78rem", width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                    />
                  </div>
                </div>

                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Lead Description / Excerpt</label>
                <textarea
                  rows={2}
                  value={article.excerpt}
                  onChange={(e) => {
                    const updated = [...articlesList];
                    updated[idx].excerpt = e.target.value;
                    setArticlesList(updated);
                  }}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", fontSize: "0.8rem", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px", marginBottom: "6px" }}
                />

                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", marginBottom: "2px" }}>Article Body Content (Full Paragraphs)</label>
                <textarea
                  rows={5}
                  value={article.content?.join("\n\n") || ""}
                  onChange={(e) => {
                    const updated = [...articlesList];
                    updated[idx].content = e.target.value.split("\n\n").filter(Boolean);
                    setArticlesList(updated);
                  }}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", fontSize: "0.78rem", border: "1px solid #d4dfd7", borderRadius: "4px", padding: "5px 7px" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. TAB: MEDIA ASSET MANAGER (WITH IN-PLACE REPLACE BUTTON ON EVERY CARD) */}
      {/* ========================================================================= */}
      {activeTab === "media" && (
        <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #e1eae3", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.1rem", fontWeight: 800 }}>🖼️ Media Asset Manager</h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#526359" }}>
                Stored in repository public assets directory · Click &quot;Replace Image&quot; on any card to update that file in place
              </p>
            </div>

            <label
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              <Upload size={13} /> Upload New Image
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) await handleDirectUpload(file);
                }}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 180px), 1fr))", gap: "14px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
            {mediaList.map((m, idx) => (
              <div key={idx} style={{ border: "1px solid #e1eae3", borderRadius: "10px", padding: "10px", background: "#fbfcfb", textAlign: "center", display: "flex", flexDirection: "column", minWidth: 0, maxWidth: "100%", boxSizing: "border-box", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "120px", position: "relative", borderRadius: "6px", overflow: "hidden", marginBottom: "6px", background: "#eee", border: "1px solid #e5ece7" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.url}
                    alt={m.filename}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0e3d26", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} title={m.filename}>
                  {m.filename}
                </div>
                <div style={{ fontSize: "0.65rem", color: "#888", margin: "2px 0 6px" }}>
                  {(m.sizeBytes / 1024).toFixed(1)} KB · {m.folder}
                </div>

                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "5px" }}>
                  {/* Dedicated Replace Image Button for this specific card */}
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      background: "#0e3d26",
                      color: "#ffffff",
                      borderRadius: "6px",
                      padding: "5px 8px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      width: "100%",
                      boxSizing: "border-box",
                      transition: "background 0.15s ease",
                    }}
                  >
                    <Camera size={12} /> Replace Image
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          await handleReplaceMediaFile(file, m.url);
                        }
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(m.url);
                      showToast("info", `Copied URL: ${m.url}`);
                    }}
                    style={{
                      background: "#eef5f1",
                      border: "1px solid #cce2d6",
                      color: "#137459",
                      borderRadius: "6px",
                      padding: "4px 6px",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    Copy Path
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. TAB: DEPLOYMENTS & PUBLISH                                           */}
      {/* ========================================================================= */}
      {activeTab === "deploy" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
          {/* GitHub Connection & Credentials Card */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1.5px solid #137333", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.3rem" }}>🔐</span>
                <div>
                  <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>GitHub Connection &amp; Commit Token</h3>
                  <p style={{ margin: "2px 0 0", color: "#526359", fontSize: "0.8rem" }}>
                    Repository: <strong>ugtf1/upua</strong> · Branch: <strong>master</strong>
                  </p>
                </div>
              </div>
              <span
                style={{
                  background: (githubToken || deployStatus?.repo?.hasToken) ? "#e6f4ea" : "#fef7e0",
                  color: (githubToken || deployStatus?.repo?.hasToken) ? "#137333" : "#b06000",
                  border: `1px solid ${(githubToken || deployStatus?.repo?.hasToken) ? "#ceead6" : "#fdd663"}`,
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {(githubToken || deployStatus?.repo?.hasToken) ? "✓ GitHub Connected" : "⚠️ GitHub Token Required for Vercel"}
              </span>
            </div>

            <p style={{ color: "#526359", fontSize: "0.85rem", margin: "0 0 14px", lineHeight: 1.5 }}>
              On Vercel, serverless file storage is read-only. Providing a GitHub Personal Access Token allows the CMS to write JSON content and upload images directly to your GitHub repository, immediately triggering automatic redeployment to Vercel and Google Cloud Run.
            </p>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                GitHub Personal Access Token (PAT)
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <input
                  type={showTokenInput ? "text" : "password"}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={githubToken}
                  onChange={(e) => {
                    setGithubToken(e.target.value);
                    if (typeof window !== "undefined") {
                      if (e.target.value.trim()) {
                        localStorage.setItem("upua_cms_github_token", e.target.value.trim());
                      } else {
                        localStorage.removeItem("upua_cms_github_token");
                      }
                    }
                  }}
                  style={{
                    flex: "1 1 280px",
                    maxWidth: "100%",
                    boxSizing: "border-box",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1.5px solid #d4dfd7",
                    fontSize: "0.85rem",
                    fontFamily: "monospace",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowTokenInput(!showTokenInput)}
                  style={{
                    background: "#f0f4f1",
                    border: "1px solid #d4dfd7",
                    color: "#0e3d26",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {showTokenInput ? "Hide" : "Show"}
                </button>
                <button
                  type="button"
                  disabled={!githubToken || isTestingToken}
                  onClick={async () => {
                    setIsTestingToken(true);
                    try {
                      const res = await fetch("/api/cms/deploy", {
                        headers: { "x-github-token": githubToken.trim() },
                      });
                      const json = await res.json();
                      if (json.repo?.hasToken) {
                        setTokenStatus("valid");
                        showToast("success", "GitHub Token verified! Repo access confirmed.");
                      } else {
                        setTokenStatus("invalid");
                        showToast("error", "Token failed to authenticate with GitHub repository.");
                      }
                    } catch {
                      showToast("error", "Failed to test GitHub connection.");
                    } finally {
                      setIsTestingToken(false);
                    }
                  }}
                  style={{
                    background: "#0e3d26",
                    color: "#ffffff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: (!githubToken || isTestingToken) ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {isTestingToken ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
                  Test Connection
                </button>
              </div>
              <p style={{ margin: "6px 0 0", fontSize: "0.72rem", color: "#666" }}>
                Need a token? <a href="https://github.com/settings/tokens/new?scopes=repo&description=UPUA+CMS+Editor" target="_blank" rel="noopener noreferrer" style={{ color: "#0e3d26", fontWeight: 700, textDecoration: "underline" }}>Click here to generate a GitHub Token with repo permissions</a>.
              </p>
            </div>
          </div>

          {/* One-Click Publish Card */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1.5px solid #d4af37", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "1.3rem" }}>🚀</span>
              <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.15rem", fontWeight: 800 }}>Publish Changes to Production</h3>
            </div>
            <p style={{ color: "#526359", fontSize: "0.85rem", margin: "0 0 14px" }}>
              Commits all modified JSON schemas and media assets directly to the GitHub repository on branch <strong>master</strong>.
              This immediately triggers parallel production deployments to <strong>Vercel</strong> and <strong>Google Cloud Run</strong>.
            </p>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                Commit Message
              </label>
              <input
                type="text"
                placeholder="e.g. Update leadership bios, add convention flyer, publish blog article"
                value={publishMessage}
                onChange={(e) => setPublishMessage(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1.5px solid #d4dfd7",
                  fontSize: "0.85rem",
                }}
              />
            </div>

            <button
              type="button"
              disabled={isPublishing}
              onClick={handlePublish}
              style={{
                background: isPublishing ? "#888" : "#0e3d26",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "0.88rem",
                fontWeight: 800,
                cursor: isPublishing ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 15px rgba(14, 61, 38, 0.2)",
              }}
            >
              {isPublishing ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Committing to GitHub master...
                </>
              ) : (
                <>
                  <Send size={15} /> Publish All Changes Now
                </>
              )}
            </button>
          </div>

          {/* Deployment Monitors */}
          <div className="panel-card" style={{ background: "#ffffff", borderRadius: "12px", padding: "20px", border: "1px solid #e1eae3", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#0e3d26", fontSize: "1.05rem", fontWeight: 800 }}>Continuous Deployment Status</h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "#526359" }}>Real-time monitoring of Vercel and Google Cloud Run</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const token = getActiveGitHubToken();
                  const headers: Record<string, string> = {};
                  if (token) headers["x-github-token"] = token;
                  fetch("/api/cms/deploy", { headers })
                    .then((r) => r.json())
                    .then((json) => {
                      if (json.status) setDeployStatus(json.status);
                      showToast("info", "Deployment status refreshed");
                    });
                }}
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #cce2d6",
                  color: "#0e3d26",
                  borderRadius: "6px",
                  padding: "5px 10px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <RefreshCw size={12} /> Refresh Status
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "14px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
              {/* GitHub Latest Commit */}
              <div style={{ border: "1px solid #e1eae3", borderRadius: "8px", padding: "14px", background: "#fbfcfb", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <Globe size={16} color="#0e3d26" />
                  <strong style={{ fontSize: "0.88rem", color: "#0e3d26" }}>GitHub Repository</strong>
                </div>
                <div style={{ fontSize: "0.78rem", color: "#526359", margin: "4px 0" }}>
                  Branch: <code style={{ background: "#eef5f1", padding: "2px 5px", borderRadius: "4px" }}>master</code>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#666" }}>
                  Commit: <code>{deployStatus?.latestCommit?.sha?.slice(0, 7) || "origin/master"}</code>
                </div>
              </div>

              {/* Vercel Status */}
              <div style={{ border: "1px solid #e1eae3", borderRadius: "8px", padding: "14px", background: "#fbfcfb", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "1rem" }}>▲</span>
                  <strong style={{ fontSize: "0.88rem", color: "#0e3d26" }}>Vercel Production</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", margin: "4px 0" }}>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: deployStatus?.vercel?.status === "completed" ? "#10b981" : "#10b981",
                    }}
                  />
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "capitalize", color: "#0e3d26" }}>
                    {deployStatus?.vercel?.status || "Live & Ready"}
                  </span>
                </div>
                <a
                  href="https://upua.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.75rem", color: "#137459", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  upua.vercel.app <ExternalLink size={11} />
                </a>
              </div>

              {/* Google Cloud Run Status */}
              <div style={{ border: "1px solid #e1eae3", borderRadius: "8px", padding: "14px", background: "#fbfcfb", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <Cloud size={16} color="#1a73e8" />
                  <strong style={{ fontSize: "0.88rem", color: "#0e3d26" }}>Google Cloud Run</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", margin: "4px 0" }}>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: deployStatus?.cloudRun?.status === "completed" ? "#10b981" : "#f59e0b",
                    }}
                  />
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "capitalize", color: "#0e3d26" }}>
                    {deployStatus?.cloudRun?.status || "Active (deploy-gcloud.yml)"}
                  </span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "#526359" }}>Service: upua · Region: us-east1</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: IMAGE PICKER & REPLACER                                           */}
      {/* ========================================================================= */}
      {imagePickerTarget && (
        <div className="upua-modal-backdrop" style={{ zIndex: 999999, padding: "12px", boxSizing: "border-box" }} onClick={() => setImagePickerTarget(null)}>
          <div className="upua-modal-box" style={{ width: "94vw", maxWidth: "660px", maxHeight: "90vh", display: "flex", flexDirection: "column", boxSizing: "border-box" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Camera size={18} color="#0e3d26" />
                <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1.15rem", color: "#0e3d26" }}>
                  Replace / Select Image
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setImagePickerTarget(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#666" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Action 1: Direct File Upload */}
            <div style={{ background: "#f8faf8", padding: "14px", borderRadius: "8px", border: "1.5px dashed #137459", textAlign: "center", marginBottom: "14px", boxSizing: "border-box" }}>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#0e3d26",
                  color: "#ffffff",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Upload size={14} /> Choose File from Computer
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const newUrl = await handleDirectUpload(file);
                      if (newUrl) {
                        imagePickerTarget.onSelect(newUrl);
                        setImagePickerTarget(null);
                      }
                    }
                  }}
                  style={{ display: "none" }}
                />
              </label>
              <p style={{ margin: "5px 0 0", fontSize: "0.72rem", color: "#526359" }}>
                JPG, PNG, WEBP, or SVG. Auto-saved to public assets and staged for GitHub.
              </p>
            </div>

            {/* Action 2: Choose from Media Library */}
            <div style={{ flex: 1, overflowY: "auto", minHeight: "200px", maxHeight: "340px", boxSizing: "border-box" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "#0e3d26", marginBottom: "6px" }}>
                Or Pick an Existing Image from Media Library:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 100px), 1fr))", gap: "8px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
                {mediaList.map((m, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      imagePickerTarget.onSelect(m.url);
                      setImagePickerTarget(null);
                      showToast("success", `Selected ${m.filename}`);
                    }}
                    style={{
                      background: imagePickerTarget.currentUrl === m.url ? "#e6f4ea" : "#ffffff",
                      border: imagePickerTarget.currentUrl === m.url ? "2px solid #137333" : "1px solid #e1eae3",
                      borderRadius: "6px",
                      padding: "5px",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s ease",
                      boxSizing: "border-box",
                      minWidth: 0,
                    }}
                  >
                    <div style={{ width: "100%", height: "64px", position: "relative", borderRadius: "4px", overflow: "hidden", marginBottom: "4px", background: "#eee", border: "1px solid #e5ece7" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.url}
                        alt={m.filename}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "#0e3d26", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} title={m.filename}>
                      {m.filename}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW BLOG ARTICLE                                            */}
      {/* ========================================================================= */}
      {showCreateArticleModal && (
        <div className="upua-modal-backdrop" style={{ zIndex: 999999, padding: "12px", boxSizing: "border-box" }} onClick={() => setShowCreateArticleModal(false)}>
          <div className="upua-modal-box" style={{ width: "94vw", maxWidth: "680px", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e1eae3", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.2rem" }}>✍️</span>
                <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1.2rem", color: "#0e3d26", fontWeight: 800 }}>
                  Create New Blog Article
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateArticleModal(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#666" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, color: "#0e3d26", marginBottom: "4px" }}>
                  Article Headline / Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPUA Announces Nationwide Youth Scholarship Awards"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1.5px solid #d4dfd7", borderRadius: "6px", fontSize: "0.9rem", fontWeight: 700 }}
                />
              </div>

              <ImageField
                label="Article Lead Photograph *"
                currentUrl={newArticle.image}
                onChange={(newUrl) => setNewArticle({ ...newArticle, image: newUrl })}
              />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "10px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="Community, Convention, Programs..."
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                    style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                    Author
                  </label>
                  <input
                    type="text"
                    value={newArticle.author}
                    onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                    style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                  Display Date
                </label>
                <input
                  type="text"
                  value={newArticle.displayDate}
                  onChange={(e) => setNewArticle({ ...newArticle, displayDate: e.target.value })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, color: "#0e3d26", marginBottom: "4px" }}>
                  Lead Description / Excerpt *
                </label>
                <textarea
                  rows={2}
                  placeholder="A concise summary of the article appearing on blog cards and previews..."
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, color: "#0e3d26", marginBottom: "4px" }}>
                  Article Body Content (Full Paragraphs) *
                </label>
                <textarea
                  rows={5}
                  placeholder="Write full article body paragraphs here. Separate distinct paragraphs with an empty line..."
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px", borderTop: "1px solid #e1eae3", paddingTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateArticleModal(false)}
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #d4dfd7", background: "#fbfcfb", color: "#526359", fontWeight: 600, cursor: "pointer", fontSize: "0.82rem" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddArticleSubmit}
                  className="btn-primary"
                  style={{ padding: "8px 18px", borderRadius: "6px", fontWeight: 800, fontSize: "0.85rem" }}
                >
                  Publish Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW EVENT                                                   */}
      {/* ========================================================================= */}
      {showCreateEventModal && (
        <div className="upua-modal-backdrop" style={{ zIndex: 999999, padding: "12px", boxSizing: "border-box" }} onClick={() => setShowCreateEventModal(false)}>
          <div className="upua-modal-box" style={{ width: "94vw", maxWidth: "680px", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e1eae3", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={20} color="#0e3d26" />
                <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1.2rem", color: "#0e3d26", fontWeight: 800 }}>
                  Add New Event / Convention
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateEventModal(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#666" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, color: "#0e3d26", marginBottom: "4px" }}>
                  Event Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPUA Annual National Convention & Cultural Gala"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 10px", border: "1.5px solid #d4dfd7", borderRadius: "6px", fontSize: "0.9rem", fontWeight: 700 }}
                />
              </div>

              <ImageField
                label="Event Flyer / Poster Image"
                currentUrl={newEvent.flyer}
                onChange={(newUrl) => setNewEvent({ ...newEvent, flyer: newUrl })}
              />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "10px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="Convention, Cultural Gala..."
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                    Full Date String
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. September 4 – 7, 2026"
                    value={newEvent.fullDate}
                    onChange={(e) => setNewEvent({ ...newEvent, fullDate: e.target.value })}
                    style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "10px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                    Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM – 6:00 PM EST"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                    Pricing / Pass
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $150 / Delegate"
                    value={newEvent.pricing}
                    onChange={(e) => setNewEvent({ ...newEvent, pricing: e.target.value })}
                    style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "10px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                    Venue Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hilton Anatole Hotel"
                    value={newEvent.venueName}
                    onChange={(e) => setNewEvent({ ...newEvent, venueName: e.target.value })}
                    style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                    City &amp; State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dallas-Fort Worth, Texas"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem", padding: "7px 10px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "10px", width: "100%", maxWidth: "100%", minWidth: 0 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                    Registration / Ticket URL
                  </label>
                  <input
                    type="text"
                    placeholder="/store or ticketing link"
                    value={newEvent.registrationUrl}
                    onChange={(e) => setNewEvent({ ...newEvent, registrationUrl: e.target.value })}
                    style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#0e3d26", marginBottom: "4px" }}>
                    Hotel Booking Link
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newEvent.hotelBookingUrl}
                    onChange={(e) => setNewEvent({ ...newEvent, hotelBookingUrl: e.target.value })}
                    style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, color: "#0e3d26", marginBottom: "4px" }}>
                  Event Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="Short summary highlighting the convention or convocation..."
                  value={newEvent.summary}
                  onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
                  style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #d4dfd7", borderRadius: "6px", fontSize: "0.8rem" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px", borderTop: "1px solid #e1eae3", paddingTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateEventModal(false)}
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #d4dfd7", background: "#fbfcfb", color: "#526359", fontWeight: 600, cursor: "pointer", fontSize: "0.82rem" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddEventSubmit}
                  className="btn-primary"
                  style={{ padding: "8px 18px", borderRadius: "6px", fontWeight: 800, fontSize: "0.85rem" }}
                >
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
