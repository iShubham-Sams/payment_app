import NavBarRenderEle from "../ui/Home/NavBarRenderEle";
import Navbar from "../ui/share/Navbar";

const HomePage = () => {
  return (
    <div>
      <Navbar render={<NavBarRenderEle />} />
      <div className="bg-blue-200 m-[5rem] rounded-xl  p-[2rem] h-[50vh] relative">
        <span className="w-[30%] sm:w-[50%] grid gap-4">
          <p className="font-extrabold text-6xl">Fast, safe, social payments</p>
          <span className="font-medium text-lg">
            Pay, get paid, grow a business, and more. Join the tens of millions
            of people on Payment app.
          </span>
        </span>
      </div>
      <div className="h-[25rem] w-[30rem] absolute bottom-0 right-10">
        <img src="/home-hero.webp" />
      </div>
    </div>
  );
};

export default HomePage;
