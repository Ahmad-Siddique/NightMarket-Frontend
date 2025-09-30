import Image from "next/image";
import HeroSection from "../hero";
import DribbbleFilterBar from "../Filters";
import Testimonial from "../testimonial";
import FAQ from "../FAQ";
import LastSection from "../LastSection";
import AllShots from "../shots/allshots/AllShots";
import ShotsSection from "./ShotSection";


export default function HomePage({shots}) {
  console.log("HOME PAGE",shots)
  return (
    <>
      <HeroSection />
      {/* <div className="mt-48">
        <DribbbleFilterBar />
      </div> */}
      {/* <Test /> */}
      <div className="mt-24">
        <ShotsSection shots={shots}/>
      </div>
      {/* <Testimonial />
      <FAQ /> */}
      {/* <LastSection /> */}
    </>
  );
}
