import Hero from "./Components/Hero";
import Categories from "./Components/Categories";
import LatestPosts from "./Components/LatestPosts";
import Subscribe from "./Components/Subscribe";

export default function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <LatestPosts />
      <Subscribe />
    </div>
  );
}
