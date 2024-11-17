import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [makes, setMakes] = useState([]);
  const [selectedMakeId, setSelectedMakeId] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const response = await fetch(
          "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json"
        );
        const data = await response.json();
        setMakes(data.Results);
      } catch (error) {
        console.error("Error fetching vehicle makes:", error);
      }
    };

    fetchMakes();
  }, []);
  useEffect(() => {
    setIsButtonEnabled(selectedMakeId !== "" && selectedYear !== "");
  }, [selectedMakeId, selectedYear]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2015 + 1 }, (_, i) => 2015 + i);


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Filter Vehicles</h1>

        {/* Vehicle Makes Selector */}
        <div className="mb-4">
          <label htmlFor="make" className="block text-gray-700 mb-2">
            Select Vehicle Make
          </label>
          <select
            id="make"
            value={selectedMakeId}
            onChange={(e) => setSelectedMakeId(e.target.value)}
            className="w-full border-gray-300 rounded-md p-2 text-black"
          >
            <option value="" disabled >
              Choose a make
            </option>
            {makes.map((make) => (
              <option className={`w-full p-2 rounded-md text-black`} key={make.MakeId} value={make.MakeId}>
                {make.MakeName}
              </option>
            ))}
          </select>
        </div>

        {/* Model Year Selector */}
        <div className="mb-4">
          <label htmlFor="year" className="block text-gray-700 mb-2">
            Select Model Year
          </label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full border-gray-300 rounded-md p-2 text-black"
          >
            <option value="" disabled >
              Choose a year
            </option>
            {years.map((year) => (
              <option className={`w-full p-2 rounded-md text-black`} key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Next Button */}
        <div className="mt-6">
          <Link
            href={
              isButtonEnabled
                ? `/result/${selectedMakeId}/${selectedYear}`
                : "#"
            }
          >
            <button
              disabled={!isButtonEnabled}
              className={`w-full py-3 rounded-md text-white text-lg font-medium ${isButtonEnabled
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              Next
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
