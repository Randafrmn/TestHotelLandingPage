import { Hero } from "./components/hero";
import { About } from "./components/about";
import { Rooms } from "./components/rooms";
import { Amenities } from "./components/amenities";
import { Reserve } from "./components/reserve";
import { Footer } from "./components/footer";
import { Navbar } from "./components/navbar";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar transparent />
      <Hero />
      <About />
      <Rooms />
      <Amenities />
      <Reserve />
      <Footer />
      <Toaster />
    </div>
  );
}
