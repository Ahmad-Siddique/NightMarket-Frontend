import React, { Suspense } from "react";

import ShotsFilter from "../ShotsFilter";
import LastSection from "../../LastSection";
import ShotsDesign from "../ShotsDesign";

const AllShots = ({shots}) => {
  console.log("Night Market data",shots)
  return (
    <div>
      <Suspense fallback={<div>Loading filters...</div>}>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 mt-6 text-center">
        All Night Markets
      </h1>
        {/* <ShotsFilter /> */}

        {/* Check if shots array is empty */}
        {shots && shots.length > 0 ? (
          <>
            <ShotsDesign shots={shots} />
            
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[200px] w-full px-4 sm:px-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-600 mb-4">
                No Night Markets Found
              </h2>
            
            </div>
          </div>
        )}
        <div className="h-32"></div>
        {/* <LastSection /> */}
      </Suspense>
    </div>
  );
};

export default AllShots;
