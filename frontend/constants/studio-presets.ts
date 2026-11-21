import { EditorialColor, StudioGradient, SampleImage } from "@/types/studio";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const EDITORIAL_COLORS: EditorialColor[] = [
  { name: "Pure White", value: "#FFFFFF" },
  { name: "Warm Editorial", value: "#F4F1EA" },
  { name: "Studio Grey", value: "#E5E5E5" },
  { name: "Soft Sage", value: "#DCE2BD" },
  { name: "Muted Clay", value: "#D4A373" },
  { name: "Dusty Slate", value: "#CBD5E1" },
  { name: "Deep Forest", value: "#1B2A22" },
  { name: "Carbon Black", value: "#121212" },
];

export const STUDIO_GRADIENTS: StudioGradient[] = [
  {
    name: "Soft Daylight",
    css: "linear-gradient(135deg, #FBFBFB 0%, #E2E4E6 100%)",
    colors: ["#FBFBFB", "#E2E4E6"],
  },
  {
    name: "Warm Linen",
    css: "linear-gradient(135deg, #F6F2EC 0%, #DFD5C6 100%)",
    colors: ["#F6F2EC", "#DFD5C6"],
  },
  {
    name: "Nordic Mist",
    css: "linear-gradient(135deg, #E6ECEF 0%, #B8C6CE 100%)",
    colors: ["#E6ECEF", "#B8C6CE"],
  },
  {
    name: "Olive Studio",
    css: "linear-gradient(135deg, #343A32 0%, #171A16 100%)",
    colors: ["#343A32", "#171A16"],
  },
  {
    name: "Warm Espresso",
    css: "linear-gradient(135deg, #2D241E 0%, #14100D 100%)",
    colors: ["#2D241E", "#14100D"],
  },
  {
    name: "Obsidian",
    css: "linear-gradient(135deg, #262626 0%, #0A0A0A 100%)",
    colors: ["#262626", "#0A0A0A"],
  },
];

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    title: "Portre",
    subtitle: "İnce saç telleri ve kenar geçişi",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80",
  },
  {
    title: "E-Ticaret Ürün",
    subtitle: "Keskin dış hatlar ve katalog çekimi",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80",
  },
  {
    title: "Organik Doku",
    subtitle: "Kürk ve karmaşık arka plan ayrımı",
    url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1000&auto=format&fit=crop&q=80",
  },
];

