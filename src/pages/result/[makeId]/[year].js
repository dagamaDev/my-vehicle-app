import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ResultPage() {
    const router = useRouter();
    const { makeId, year } = router.query;

    const [models, setModels] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!makeId || !year) return; // Prevent fetch until query params are available

        const fetchModels = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
                );
                const data = await response.json();

                if (data.Results && data.Results.length > 0) {
                    setModels(data.Results);
                } else {
                    setError("No models found for the selected make and year.");
                }
            } catch (err) {
                setError("Failed to fetch vehicle models. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchModels();
    }, [makeId, year]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Vehicle Models for {makeId} ({year})
            </h1>

            {/* Show loading spinner */}
            {isLoading && (
                <div className="text-blue-500 text-center mb-4">
                    Loading...
                </div>
            )}

            {/* Show error message */}
            {error && !isLoading && (
                <div className="text-red-500 text-center mb-4">{error}</div>
            )}

            {/* Display list of vehicle models */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {!isLoading &&
                    models.map((model) => (
                        <div
                            key={model.Model_ID}
                            className="bg-white p-4 shadow rounded-md border border-gray-200"
                        >
                            <h2 className="text-lg font-semibold text-gray-700">
                                {model.Model_Name}
                            </h2>
                        </div>
                    ))}
            </div>

            {/* Back Button */}
            <button
                onClick={() => window.history.back()}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Back
            </button>
        </div>
    );
}

export async function generateStaticParams() {
    const makesResponse = await fetch(
        "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json"
    );
    const makesData = await makesResponse.json();
    const makes = makesData.Results;

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2015 + 1 }, (_, i) => 2015 + i);

    const paths = makes.flatMap((make) =>
        years.map((year) => ({
            makeId: make.MakeId.toString(),
            year: year.toString(),
        }))
    );

    return paths;
}
