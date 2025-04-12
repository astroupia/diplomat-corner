import MaxWidthWrapper from "@/components/max-width-wrapper";

export default function Loading() {
  return (
    <section className="flex flex-col min-h-screen bg-gray-50 animate-pulse">
      <MaxWidthWrapper>
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>

          {/* Filters Skeleton */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-300 rounded-lg w-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* House Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="h-48 bg-gray-300 w-full"></div>{" "}
                {/* Image Placeholder */}
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>{" "}
                  {/* Title */}
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-300 rounded w-1/4"></div>{" "}
                    {/* Price */}
                    <div className="h-5 bg-gray-300 rounded w-1/6"></div>{" "}
                    {/* Type */}
                  </div>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>{" "}
                    {/* Beds */}
                    <div className="h-4 bg-gray-300 rounded w-16"></div>{" "}
                    {/* Baths */}
                    <div className="h-4 bg-gray-300 rounded w-20"></div>{" "}
                    {/* Size */}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                    <div className="h-6 bg-gray-300 rounded-full w-24"></div>
                    <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
